# LandSure AI – Intelligent Land Record Digitization & Validation System

**Smart India Hackathon (SIH) Grade Government Technology Platform**

LandSure AI is a next-generation GovTech web application built to digitize, extract, validate, and audit Indian land records such as Maharashtra 7/12 extracts, Uttar Pradesh Khatauni, and Karnataka Record of Rights (RoR).

---

## Key Features & Architecture

1. **Role-Based Portals**:
   - **Citizen**: Upload land records, track digitization timeline, search verified titles.
   - **Revenue Officer**: Verification queue, deep-dive discrepancy analysis, sanction/rejection with remarks.
   - **Administrator**: Comprehensive analytics, upload trends, fraud risk distribution, user registry.

2. **Computer Vision & Image Preprocessing (OpenCV)**:
   - Grayscale conversion, Bilateral spatial filtering, Adaptive CLAHE contrast enhancement, MinAreaRect deskewing, and Otsu dynamic binarization.
   - Interactive side-by-side and split-slider comparison in the UI.

3. **Multi-Lingual OCR & Land Parser**:
   - Extracts 11 critical fields: Owner Name, Father's Name, Survey/Gut Number, Plot Number, Village, Taluka, District, Land Area, Land Tenure, Mutation Number, Record Date.
   - Provides per-field and document-level confidence scores.

4. **AI RapidFuzz Validation Engine**:
   - Exact matching on survey numbers and mutation chains.
   - Fuzzy matching on owner names, father's names, and jurisdictions.
   - Automated discrepancy detection categorized into 🔴 High, 🟠 Medium, and 🟢 Low Risk.

5. **Fraud Risk Score & Gauge**:
   - Dynamic 0–100 circular gauge assessing fraud probability, title impersonation, and boundary inflation.
   - AI Plain-Language Explanation synthesized for officers and citizens.

6. **Document Cryptographic Integrity (SHA-256)**:
   - Generates SHA-256 digital seal on upload.
   - Real-time tamper detection alerting if documents are modified post-sanction.

7. **SIH Interactive Demo Cockpit**:
   - 4 pre-configured test scenarios ready for 1-click judge evaluation:
     - Scenario 1: 100% Genuine 7/12 (Pune)
     - Scenario 2: Name Spelling Typo (Wagholi)
     - Scenario 3: High-Risk Impersonator Forgery (Hinjawadi)
     - Scenario 4: Land Area Inflation Discrepancy (Baramati)

8. **Trilingual Land AI Assistant**:
   - Interactive assistant providing explanations in English, Hindi (हिन्दी), and Marathi (मराठी).

---

## Quick Start Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Citizen** | `citizen@landsure.gov.in` | `Admin@123` |
| **Revenue Officer** | `officer@landsure.gov.in` | `Admin@123` |
| **Administrator** | `admin@landsure.gov.in` | `Admin@123` |

*(Note: The login page also features 1-click quick login buttons for all three roles!)*

---

## Running the Application

### 1. Backend (FastAPI + SQLAlchemy)
```bash
cd backend
python run.py
```
- API Server: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

### 2. Frontend (React + Vite + Tailwind CSS)
```bash
cd frontend
npm run preview -- --port 5173 --host
```
- Web Application: `http://localhost:5173`
