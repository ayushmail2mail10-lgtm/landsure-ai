import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.document import Document
from app.models.validation import ValidationResult
from app.schemas.validation import ValidationResultOut
from app.services.validation_engine import run_validation_pipeline

router = APIRouter(prefix="/validation", tags=["AI Validation Engine"])

class ValidationRunRequest(BaseModel):
    document_id: int

@router.post("/run", response_model=ValidationResultOut)
def run_validation(req: ValidationRunRequest, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == req.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    structured_data = json.loads(doc.structured_data) if doc.structured_data else {}
    if not structured_data:
        raise HTTPException(status_code=400, detail="No structured data found for document. Please run OCR first.")

    val_result = run_validation_pipeline(db, doc.id, structured_data, doc.ocr_confidence or 90.0)
    return val_result

@router.get("/results/{doc_id}", response_model=ValidationResultOut)
def get_validation_results(doc_id: int, db: Session = Depends(get_db)):
    val_res = db.query(ValidationResult).filter(ValidationResult.document_id == doc_id).first()
    if not val_res:
        raise HTTPException(status_code=404, detail="Validation results not found for this document.")
    return val_res
