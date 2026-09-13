import os
import json
import shutil
import hashlib
from sqlalchemy.orm import Session
from app.core.config import SAMPLES_DIR, UPLOADS_DIR, PROCESSED_DIR
from app.core.security import get_password_hash
from app.models.user import User
from app.models.land_record import LandRecord, MutationHistory
from app.models.document import Document
from app.models.validation import ValidationResult, Discrepancy
from app.models.audit import AuditLog
from app.utils.doc_generator import create_sample_png

def seed_database(db: Session):
    if db.query(User).count() > 0:
        print("Database already seeded.")
        return

    print("Seeding LandSure AI demo database...")

    # 1. Users
    users_data = [
        ("citizen@landsure.gov.in", "Rahul K. Sharma", "citizen", "Citizen Portal", "9876543210"),
        ("officer@landsure.gov.in", "Suresh Deshmukh (Tehsildar)", "officer", "Haveli Revenue Division", "9876543211"),
        ("admin@landsure.gov.in", "Pooja V. Joshi (Director)", "admin", "Directorate of Land Records", "9876543212")
    ]
    created_users = {}
    for email, name, role, dept, mob in users_data:
        u = User(
            email=email,
            full_name=name,
            role=role,
            department=dept,
            mobile_number=mob,
            hashed_password=get_password_hash("Admin@123"),
            is_active=True
        )
        db.add(u)
        db.flush()
        created_users[role] = u

    # 2. Land Records (20+ records)
    cadastral_records = [
        ("142/3B", "1", "P-14", "Rameshwar Shivram Patil", "Shivram Tukaram Patil", "Wagholi", "Haveli", "Pune", "Maharashtra", 2.45, 0.15, 18.50, "Jirayat Agricultural", "Occupant Class 1", "4892", "14/08/2023", "None / Nil", "VERIFIED", 98),
        ("89/1A", "2", "C-08", "Anand Narayan Kulkarni", "Narayan Kulkarni", "Hinjawadi", "Mulshi", "Pune", "Maharashtra", 1.20, 0.00, 45.00, "Non-Agricultural (Commercial)", "Occupant Class 1", "5120", "05/01/2024", "Axis Bank Hypothecation (25 Lakhs)", "VERIFIED", 92),
        ("205/2", "1", "PL-02", "Sunita Devendra Deshmukh", "Devendra Deshmukh", "Baramati", "Baramati", "Pune", "Maharashtra", 2.10, 0.20, 22.00, "Bagayat (Irrigated)", "Occupant Class 1", "3104", "19/11/2022", "Canara Bank Agri Loan", "VERIFIED", 95),
        ("78/4", "3", "A-12", "Eknath Jagannath Shinde", "Jagannath Shinde", "Bavdhan", "Mulshi", "Pune", "Maharashtra", 3.80, 0.40, 30.00, "Agricultural", "Occupant Class 1", "4219", "08/04/2021", "None / Nil", "VERIFIED", 96),
        ("312/1", "1", "R-05", "Prakash Balasaheb Thorat", "Balasaheb Thorat", "Loni Kalbhor", "Haveli", "Pune", "Maharashtra", 1.75, 0.10, 16.00, "Agricultural", "Occupant Class 1", "2980", "12/02/2020", "None / Nil", "VERIFIED", 94),
        ("56/2C", "1", "G-03", "Kishor Trimbak Gaikwad", "Trimbak Gaikwad", "Pimpalgaon", "Niphad", "Nashik", "Maharashtra", 4.10, 0.30, 35.00, "Grape Orchard (Bagayat)", "Occupant Class 1", "6710", "22/07/2022", "Nashik DCCB Hypothecation", "VERIFIED", 97),
        ("114/7", "2", "S-22", "Mangala Prabhakar Sonawane", "Prabhakar Sonawane", "Musilgaon", "Sinnar", "Nashik", "Maharashtra", 2.05, 0.05, 20.00, "Industrial NA", "Occupant Class 1", "7112", "11/03/2023", "None / Nil", "VERIFIED", 91),
        ("92/1", "1", "D-09", "Dattatraya Bhikaji Waje", "Bhikaji Waje", "Janori", "Dindori", "Nashik", "Maharashtra", 5.50, 0.50, 42.00, "Vineyard Agricultural", "Occupant Class 1", "5430", "18/09/2021", "State Bank of India Loan", "VERIFIED", 95),
        ("44/2", "1", "O-11", "Vandana Moreshwarrao Raut", "Moreshwarrao Raut", "Paradsinga", "Katol", "Nagpur", "Maharashtra", 3.25, 0.25, 28.00, "Orange Grove (Bagayat)", "Occupant Class 1", "3890", "29/10/2022", "None / Nil", "VERIFIED", 96),
        ("188/3A", "2", "K-04", "Chandrashekhar Vitthalrao Kale", "Vitthalrao Kale", "Kanhan", "Kamptee", "Nagpur", "Maharashtra", 1.90, 0.10, 24.00, "Agricultural", "Occupant Class 1", "4411", "15/06/2023", "None / Nil", "VERIFIED", 93),
        ("304/KH", "1", "UP-01", "Ram Sevak Yadav", "Harishchandra Yadav", "Kakori", "Sadar", "Lucknow", "Uttar Pradesh", 1.85, 0.00, 15.00, "Khatauni Agricultural", "Bhumi-Dhar", "8821", "10/01/2023", "Nil", "VERIFIED", 95),
        ("512/GA", "2", "UP-08", "Brijesh Kumar Mishra", "Shashi Bhushan Mishra", "Malihabad", "Malihabad", "Lucknow", "Uttar Pradesh", 3.60, 0.20, 32.00, "Mango Orchard (Bagh)", "Bhumi-Dhar", "9102", "04/05/2022", "UP Gramin Bank", "VERIFIED", 97),
        ("129/KA", "1", "UP-14", "Sunil Kumar Srivastava", "Amarnath Srivastava", "Gosainganj", "Mohanlalganj", "Lucknow", "Uttar Pradesh", 0.95, 0.00, 12.00, "Residential NA", "Bhumi-Dhar", "7640", "17/12/2023", "Nil", "VERIFIED", 94),
        ("62/1", "1", "KA-05", "Muniyappa Venkatappa", "Venkatappa", "Doddajala", "Yelahanka", "Bengaluru Urban", "Karnataka", 2.80, 0.20, 25.00, "Dry Land (RoR)", "Ancestral Title", "10234", "16/09/2023", "Karnataka Bank Loan", "VERIFIED", 96),
        ("108/3B", "2", "KA-12", "Chinnaswamy Gowda", "Nanje Gowda", "Hunsur", "Hunsur", "Mysuru", "Karnataka", 3.40, 0.30, 28.00, "Paddy Agricultural", "Title Holder", "8941", "25/08/2022", "Nil", "VERIFIED", 95),
        ("45/1A", "1", "KA-18", "Manjunatha Swamy", "Shivalingaiah", "Srirangapatna", "Srirangapatna", "Mandya", "Karnataka", 1.65, 0.15, 19.00, "Sugarcane Irrigated", "Occupant Class 1", "7315", "03/11/2021", "Nil", "VERIFIED", 97),
        ("999/DUP", "1", "D-01", "Gajendra Motiram Khot", "Motiram Khot", "Wagholi", "Haveli", "Pune", "Maharashtra", 2.45, 0.15, 18.50, "Agricultural", "Occupant Class 1", "4892", "14/08/2023", "Disputed Title Claim", "DISPUTED", 65),
        ("777/SUSP", "1", "S-99", "Unknown Impersonator", "Fake Father", "Hinjawadi", "Mulshi", "Pune", "Maharashtra", 1.20, 0.00, 45.00, "Commercial", "Occupant Class 1", "5120", "05/01/2024", "Civil Court Injunction Stay", "DISPUTED", 40),
        ("888/AREA", "2", "A-55", "Sunita Devendra Deshmukh", "Devendra Deshmukh", "Baramati", "Baramati", "Pune", "Maharashtra", 2.10, 0.20, 22.00, "Bagayat", "Occupant Class 1", "3104", "19/11/2022", "Nil", "VERIFIED", 88),
        ("555/MUT", "1", "M-77", "Raghunath Keshav Gokhale", "Keshav Gokhale", "Bavdhan", "Mulshi", "Pune", "Maharashtra", 3.10, 0.10, 26.00, "Agricultural", "Occupant Class 1", "9999", "01/01/2024", "Pending Mutation Approval", "PENDING_MUTATION", 75)
    ]

    for row in cadastral_records:
        rec = LandRecord(
            survey_number=row[0],
            subdivision_number=row[1],
            plot_number=row[2],
            owner_name=row[3],
            father_or_husband_name=row[4],
            village=row[5],
            taluka=row[6],
            district=row[7],
            state=row[8],
            total_area_hectares=row[9],
            uncultivated_area=row[10],
            assessment_rupees=row[11],
            land_type=row[12],
            tenure_type=row[13],
            mutation_number=row[14],
            last_mutation_date=row[15],
            encumbrances=row[16],
            status=row[17],
            health_score=row[18]
        )
        db.add(rec)
        db.flush()

        m1 = MutationHistory(
            land_record_id=rec.id,
            mutation_number=f"MUT-{rec.mutation_number or '1001'}",
            mutation_date=rec.last_mutation_date or "12/01/2023",
            mutation_type="Inheritance (वारस नोंद)",
            transferor_name=f"Late {rec.father_or_husband_name or 'Ancestral'}",
            transferee_name=rec.owner_name,
            area_transferred=rec.total_area_hectares,
            remarks="Sanctioned by Circle Officer after statutory 15 days notice without objection.",
            status="SANCTIONED"
        )
        db.add(m1)

    # 3. Generate and Analyze 4 Demo Documents
    sample_configs = [
        ("sample_genuine_pune.png", "Certified 7/12 Extract - Pune", "Wagholi Haveli", {
            "district": "Pune", "taluka": "Haveli", "village": "Wagholi",
            "survey_number": "142/3B", "plot_number": "P-14",
            "owner_name": "Rameshwar Shivram Patil", "fathers_name": "Shivram Tukaram Patil",
            "land_area": "2.45 Ha", "mutation_number": "4892", "record_date": "14/08/2023"
        }),
        ("sample_spelling_nashik.png", "Spelling Deviation 7/12 - Wagholi", "Wagholi Haveli", {
            "district": "Pune", "taluka": "Haveli", "village": "Wagholi",
            "survey_number": "142/3B", "plot_number": "P-14",
            "owner_name": "Ramesh S. Patil", "fathers_name": "Shivram Patil",
            "land_area": "2.45 Ha", "mutation_number": "4892", "record_date": "14/08/2023"
        }),
        ("sample_fraud_owner.png", "Suspicious Title Forgery - Hinjawadi", "Hinjawadi Mulshi", {
            "district": "Pune", "taluka": "Mulshi", "village": "Hinjawadi",
            "survey_number": "89/1A", "plot_number": "C-08",
            "owner_name": "Vikramaditya K. Singhania", "fathers_name": "Kailash Singhania",
            "land_area": "1.20 Ha", "mutation_number": "5120", "record_date": "05/01/2024"
        }),
        ("sample_area_mismatch.png", "Area Inflation Claim - Baramati", "Baramati Pune", {
            "district": "Pune", "taluka": "Baramati", "village": "Baramati",
            "survey_number": "205/2", "plot_number": "PL-02",
            "owner_name": "Sunita Devendra Deshmukh", "fathers_name": "Devendra Deshmukh",
            "land_area": "5.80 Ha", "mutation_number": "3104", "record_date": "19/11/2022"
        })
    ]

    from app.services.preprocessing import preprocess_document_image
    from app.services.validation_engine import run_validation_pipeline
    from app.services.ocr_engine import run_ocr_and_extract

    citizen = created_users["citizen"]

    for idx, (fn, title, sub, flds) in enumerate(sample_configs):
        s_path = os.path.join(SAMPLES_DIR, fn)
        u_path = os.path.join(UPLOADS_DIR, fn)
        p_path = os.path.join(PROCESSED_DIR, f"proc_{fn}")

        create_sample_png(s_path, title, sub, flds)
        shutil.copyfile(s_path, u_path)

        # Also copy svg if exists
        s_svg = s_path.replace(".png", ".svg")
        u_svg = u_path.replace(".png", ".svg")
        if os.path.exists(s_svg):
            shutil.copyfile(s_svg, u_svg)

        with open(u_path, "rb") as f:
            h = hashlib.sha256(f.read()).hexdigest()

        preprocess_document_image(u_path, p_path)
        raw_text, structured, conf = run_ocr_and_extract(p_path)

        # Statuses: approved for genuine, under_review for spelling, under_review for fraud, under_review for area
        doc_status = "approved" if idx == 0 else "under_review"

        doc = Document(
            document_number=f"DOC-2026-{1001 + idx}",
            file_name=fn,
            file_path=u_path,
            original_file_size=os.path.getsize(u_path),
            mime_type="image/png",
            sha256_hash=h,
            is_tampered=False,
            uploaded_by_id=citizen.id,
            status=doc_status,
            processed_image_path=p_path,
            raw_ocr_text=raw_text,
            ocr_confidence=conf,
            structured_data=json.dumps(structured),
            officer_remarks="Verified genuine record from sub-registrar registry." if idx == 0 else None,
            reviewed_by_id=created_users["officer"].id if idx == 0 else None
        )
        db.add(doc)
        db.flush()

        val_res = run_validation_pipeline(db, doc.id, structured, conf)

        audit = AuditLog(
            user_id=citizen.id,
            username=citizen.full_name,
            user_role=citizen.role,
            action="DOCUMENT_UPLOAD_AND_VALIDATE",
            target_type="DOCUMENT",
            target_id=str(doc.id),
            previous_value="None",
            new_value=f"Uploaded {fn}, Validation Score: {val_res.overall_validation_score}%, Fraud Score: {val_res.fraud_risk_score}",
            ip_address="127.0.0.1"
        )
        db.add(audit)

    db.commit()
    print("Demo database seeding complete!")
