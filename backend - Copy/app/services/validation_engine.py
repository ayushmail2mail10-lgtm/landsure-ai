import re
from rapidfuzz import fuzz
from sqlalchemy.orm import Session
from app.models.land_record import LandRecord, MutationHistory
from app.models.document import Document
from app.models.validation import ValidationResult, Discrepancy
from app.services.fraud_scorer import calculate_fraud_risk_score, generate_ai_explanation

def run_validation_pipeline(db: Session, document_id: int, extracted_data: dict, ocr_confidence: float) -> ValidationResult:
    survey_no = (extracted_data.get("survey_number") or "").strip()
    village = (extracted_data.get("village") or "").strip()
    district = (extracted_data.get("district") or "").strip()
    owner_name = (extracted_data.get("owner_name") or "").strip()

    # Step 1: Query cadastral records
    query = db.query(LandRecord)
    matched_record = None

    if survey_no:
        matched_record = query.filter(LandRecord.survey_number.ilike(f"%{survey_no}%")).first()

    if not matched_record and village:
        matched_record = query.filter(LandRecord.village.ilike(f"%{village}%")).first()

    if not matched_record:
        matched_record = db.query(LandRecord).first()

    discrepancies = []
    scores = []

    # 1. Survey Number Validation
    if matched_record:
        db_survey = matched_record.survey_number
        if survey_no.lower() == db_survey.lower():
            scores.append(100)
        else:
            scores.append(35)
            discrepancies.append({
                "field_name": "Survey Number",
                "document_value": survey_no,
                "database_value": db_survey,
                "risk_level": "HIGH",
                "severity": 3,
                "discrepancy_type": "SURVEY_MISMATCH",
                "suggested_action": "Verify physical cadastral map and revenue boundary survey."
            })
    else:
        scores.append(0)
        discrepancies.append({
            "field_name": "Survey Number",
            "document_value": survey_no,
            "database_value": "NOT FOUND",
            "risk_level": "HIGH",
            "severity": 3,
            "discrepancy_type": "UNREGISTERED_SURVEY",
            "suggested_action": "Check revenue sub-division records for unmapped parcels."
        })

    # 2. Owner Name Validation with RapidFuzz
    if matched_record and owner_name:
        db_owner = matched_record.owner_name
        ratio = fuzz.token_sort_ratio(owner_name.lower(), db_owner.lower())
        partial_ratio = fuzz.partial_ratio(owner_name.lower(), db_owner.lower())
        name_score = max(ratio, partial_ratio)
        scores.append(name_score)

        if name_score >= 90:
            pass # Genuine match
        elif name_score >= 70:
            discrepancies.append({
                "field_name": "Owner Name",
                "document_value": owner_name,
                "database_value": db_owner,
                "risk_level": "MEDIUM",
                "severity": 2,
                "discrepancy_type": "NAME_SPELLING_VARIATION",
                "suggested_action": f"Name match is {name_score}%. Corroborate Aadhaar/PAN alias documentation."
            })
        else:
            discrepancies.append({
                "field_name": "Owner Name",
                "document_value": owner_name,
                "database_value": db_owner,
                "risk_level": "HIGH",
                "severity": 3,
                "discrepancy_type": "OWNERSHIP_MISMATCH",
                "suggested_action": f"Critical mismatch ({name_score}% match). Check for unlawful title transfer or imposter."
            })

    # 3. Land Area Validation
    doc_area_str = extracted_data.get("land_area") or ""
    doc_area_val = None
    area_digits = re.findall(r"[-+]?(?:\d*\.\d+|\d+)", doc_area_str)
    if area_digits:
        try:
            doc_area_val = float(area_digits[0])
        except ValueError:
            pass

    if matched_record and doc_area_val is not None:
        db_area = matched_record.total_area_hectares
        diff = abs(doc_area_val - db_area)
        if diff <= 0.05:
            scores.append(100)
        elif diff <= 0.5:
            scores.append(75)
            discrepancies.append({
                "field_name": "Land Area",
                "document_value": f"{doc_area_val} Ha",
                "database_value": f"{db_area} Ha",
                "risk_level": "MEDIUM",
                "severity": 2,
                "discrepancy_type": "AREA_DEVIATION",
                "suggested_action": f"Area difference of {round(diff, 2)} Ha exceeds standard boundary tolerance."
            })
        else:
            scores.append(20)
            discrepancies.append({
                "field_name": "Land Area",
                "document_value": f"{doc_area_val} Ha",
                "database_value": f"{db_area} Ha",
                "risk_level": "HIGH",
                "severity": 3,
                "discrepancy_type": "AREA_INFLATION",
                "suggested_action": f"Severe land area mismatch: Document claims {doc_area_val} Ha vs Record {db_area} Ha."
            })

    # 4. Village & District Validation
    if matched_record and village:
        v_score = fuzz.token_sort_ratio(village.lower(), matched_record.village.lower())
        scores.append(v_score)
        if v_score < 75:
            discrepancies.append({
                "field_name": "Village Jurisdiction",
                "document_value": village,
                "database_value": matched_record.village,
                "risk_level": "MEDIUM",
                "severity": 2,
                "discrepancy_type": "JURISDICTION_MISMATCH",
                "suggested_action": "Check for recent revenue village reorganization or bifurcations."
            })

    # 5. Title Dispute & Legal Injunction Check
    if matched_record and matched_record.status == "DISPUTED":
        scores.append(10)
        discrepancies.append({
            "field_name": "Title Status",
            "document_value": "Presented as Clear",
            "database_value": "DISPUTED TITLE",
            "risk_level": "HIGH",
            "severity": 3,
            "discrepancy_type": "ACTIVE_LEGAL_DISPUTE",
            "suggested_action": "Court stay order or partition suit active on this parcel. Do not sanction without judicial clearance."
        })

    # 6. Duplicate Registration Check
    if matched_record:
        existing_active = db.query(Document).filter(
            Document.id != document_id,
            Document.status == "approved"
        ).all()
        for active_doc in existing_active:
            if active_doc.structured_data and matched_record.survey_number in active_doc.structured_data:
                scores.append(25)
                discrepancies.append({
                    "field_name": "Duplicate Title Claim",
                    "document_value": f"Survey {survey_no}",
                    "database_value": f"Certified under {active_doc.document_number}",
                    "risk_level": "HIGH",
                    "severity": 3,
                    "discrepancy_type": "DUPLICATE_CLAIM_DETECTED",
                    "suggested_action": f"Another certified document ({active_doc.document_number}) is active for this survey parcel. Investigate conflicting claims."
                })
                break

    # 7. Mutation Chain Consistency Check
    doc_mutation = extracted_data.get("mutation_number")
    if matched_record and doc_mutation:
        valid_mutations = [m.mutation_number.lower() for m in matched_record.mutations]
        clean_doc_m = str(doc_mutation).strip().lower()
        if valid_mutations and not any(clean_doc_m in vm or vm in clean_doc_m for vm in valid_mutations):
            scores.append(50)
            discrepancies.append({
                "field_name": "Mutation Number",
                "document_value": f"Mutation #{doc_mutation}",
                "database_value": f"Active: {matched_record.mutation_number or 'Unsanctioned'}",
                "risk_level": "MEDIUM",
                "severity": 2,
                "discrepancy_type": "UNREGISTERED_MUTATION",
                "suggested_action": f"Mutation #{doc_mutation} is not found in the historical chain of rights for Survey {matched_record.survey_number}."
            })

    overall_score = round(sum(scores) / max(len(scores), 1), 1)
    fraud_score, risk_level = calculate_fraud_risk_score(discrepancies, ocr_confidence, overall_score)
    ai_explanation = generate_ai_explanation(discrepancies, overall_score, fraud_score, matched_record)

    # Remove any existing validation result for this document
    existing = db.query(ValidationResult).filter(ValidationResult.document_id == document_id).first()
    if existing:
        db.delete(existing)
        db.flush()

    val_result = ValidationResult(
        document_id=document_id,
        matched_record_id=matched_record.id if matched_record else None,
        overall_validation_score=overall_score,
        fraud_risk_score=fraud_score,
        risk_level=risk_level,
        ai_explanation=ai_explanation
    )
    db.add(val_result)
    db.flush()

    for disc in discrepancies:
        d_obj = Discrepancy(
            validation_result_id=val_result.id,
            field_name=disc["field_name"],
            document_value=disc["document_value"],
            database_value=disc["database_value"],
            risk_level=disc["risk_level"],
            severity=disc["severity"],
            discrepancy_type=disc["discrepancy_type"],
            suggested_action=disc["suggested_action"]
        )
        db.add(d_obj)

    db.commit()
    db.refresh(val_result)
    return val_result
