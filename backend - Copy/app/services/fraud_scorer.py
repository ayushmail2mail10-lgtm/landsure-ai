from typing import List, Tuple

def calculate_fraud_risk_score(discrepancies: List[dict], ocr_confidence: float, validation_score: float) -> Tuple[float, str]:
    """
    Computes Fraud Risk Score (0 - 100):
    0-29: LOW Risk (Verified / Genuine)
    30-64: MEDIUM Risk (Discrepancy / Review Required)
    65-100: HIGH Risk (Suspicious / Potential Forgery)
    """
    base_fraud = 100.0 - validation_score

    high_count = sum(1 for d in discrepancies if d.get("risk_level") == "HIGH")
    med_count = sum(1 for d in discrepancies if d.get("risk_level") == "MEDIUM")

    severity_penalty = (high_count * 25.0) + (med_count * 10.0)
    ocr_penalty = 12.0 if ocr_confidence < 75.0 else 0.0

    raw_fraud = (base_fraud * 0.55) + (severity_penalty * 0.35) + ocr_penalty
    fraud_score = min(max(round(raw_fraud, 1), 0.0), 100.0)

    # High-severity fraud safeguards
    if any(d.get("discrepancy_type") in ["OWNERSHIP_MISMATCH", "ACTIVE_LEGAL_DISPUTE"] for d in discrepancies):
        fraud_score = max(fraud_score, 88.0)
    elif any(d.get("discrepancy_type") == "AREA_INFLATION" for d in discrepancies):
        fraud_score = max(fraud_score, 72.0)

    if fraud_score < 30.0:
        risk_level = "LOW"
    elif fraud_score < 65.0:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    return fraud_score, risk_level

def generate_ai_explanation(discrepancies: List[dict], validation_score: float, fraud_score: float, matched_record) -> str:
    """
    Generates plain-language AI explanation for citizens and revenue officers.
    """
    if not discrepancies:
        return "The uploaded document matches all cadastral records in the revenue registry with 100% integrity. Owner title, survey geometry, and mutation logs are completely consistent."

    reasons = []
    for d in discrepancies:
        f = d.get("field_name")
        doc_v = d.get("document_value")
        db_v = d.get("database_value")
        t = d.get("discrepancy_type")

        if t == "OWNERSHIP_MISMATCH":
            reasons.append(f"Owner name '{doc_v}' differs fundamentally from registered title holder '{db_v}' in the official land record.")
        elif t == "NAME_SPELLING_VARIATION":
            reasons.append(f"Owner name '{doc_v}' contains minor spelling variation from registered name '{db_v}'.")
        elif t == "AREA_INFLATION":
            reasons.append(f"Disclosed land area ({doc_v}) significantly exceeds the sanctioned cadastral area of {db_v}.")
        elif t == "AREA_DEVIATION":
            reasons.append(f"Minor land area variation detected between document ({doc_v}) and registry ({db_v}).")
        elif t == "SURVEY_MISMATCH":
            reasons.append(f"Survey identifier '{doc_v}' does not align with the primary parcel '{db_v}'.")
        elif t == "JURISDICTION_MISMATCH":
            reasons.append(f"Village location '{doc_v}' does not match the registered village '{db_v}'.")
        else:
            reasons.append(f"{f}: Document '{doc_v}' vs Registry '{db_v}'.")

    summary = " | ".join(reasons)
    if fraud_score >= 65:
        return f"CRITICAL FRAUD ALERT (Fraud Score: {fraud_score}/100): High probability of title impersonation or forged document. Key issues: {summary}"
    elif fraud_score >= 30:
        return f"REVIEW REQUIRED (Fraud Score: {fraud_score}/100): Discrepancies detected requiring officer manual inspection. Key issues: {summary}"
    else:
        return f"LOW RISK (Fraud Score: {fraud_score}/100): Minor formatting or spelling variations detected. Key issues: {summary}"

def calculate_record_health_score(discrepancies_count: int, mutation_count: int, has_dispute: bool = False) -> int:
    score = 100
    if has_dispute:
        score -= 40
    score -= (discrepancies_count * 15)
    if mutation_count > 0:
        score += min(mutation_count * 2, 10)
    return max(min(score, 100), 10)
