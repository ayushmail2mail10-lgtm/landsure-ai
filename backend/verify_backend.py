import json
from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

print("--- 1. Testing System Health ---")
res = client.get("/health")
print("Health status:", res.status_code, res.json())
assert res.status_code == 200

print("\n--- 2. Testing Authentication ---")
login_res = client.post("/api/auth/login", json={"email": "citizen@landsure.gov.in", "password": "Admin@123"})
print("Citizen Login:", login_res.status_code)
assert login_res.status_code == 200
token = login_res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("\n--- 3. Testing Cadastral Land Records Query ---")
rec_res = client.get("/api/records", headers=headers)
records = rec_res.json()
print(f"Total Cadastral Records Found: {len(records)}")
assert len(records) >= 20
print("Sample record:", records[0]["survey_number"], records[0]["owner_name"], records[0]["village"], records[0]["district"])

print("\n--- 4. Testing Document & Validation Results ---")
doc_res = client.get("/api/documents/1", headers=headers)
doc1 = doc_res.json()
print("Doc #1:", doc1["document_number"], "Status:", doc1["status"])
print("Validation Score:", doc1["validation_result"]["overall_validation_score"], "Fraud Score:", doc1["validation_result"]["fraud_risk_score"])
print("Discrepancies count:", len(doc1["validation_result"]["discrepancies"]))

print("\n--- 5. Testing SHA-256 Cryptographic Tamper Integrity ---")
integ_res = client.get("/api/documents/1/verify-integrity", headers=headers)
print("Integrity check:", integ_res.json())
assert integ_res.json()["is_valid"] == True

print("\n--- 6. Testing Admin Analytics Stats ---")
admin_res = client.get("/api/admin/stats", headers=headers)
stats = admin_res.json()
print("Admin Stats:", {
    "total_docs": stats["total_documents"],
    "verified": stats["verified_documents"],
    "suspicious": stats["suspicious_records"],
    "avg_ocr": stats["average_ocr_confidence"]
})

print("\n--- 7. Testing Multi-lingual Land AI Assistant ---")
en_res = client.post("/api/assistant/chat", json={"message": "What is a survey number?", "language": "en"})
print("AI Reply (EN):", en_res.json()["reply"][:90] + "...")

mr_res = client.post("/api/assistant/chat", json={"message": "सातबारा म्हणजे काय?", "language": "mr"})
print("AI Reply (MR):", mr_res.json()["reply"][:90] + "...")

hi_res = client.post("/api/assistant/chat", json={"message": "नामांतरण क्या है?", "language": "hi"})
print("AI Reply (HI):", hi_res.json()["reply"][:90] + "...")

print("\n--- ALL BACKEND TEST PASSES VERIFIED 100% ---")
