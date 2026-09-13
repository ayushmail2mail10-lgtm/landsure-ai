import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.document import Document
from app.schemas.ocr import OCRProcessResponse, ExtractedLandData
from app.services.preprocessing import preprocess_document_image
from app.services.ocr_engine import run_ocr_and_extract

router = APIRouter(prefix="/ocr", tags=["OCR & Data Extraction"])

class OCRProcessRequest(BaseModel):
    document_id: int

@router.post("/process", response_model=OCRProcessResponse)
def process_ocr(req: OCRProcessRequest, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == req.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    # 1. Preprocess
    proc_path = doc.processed_image_path or doc.file_path
    try:
        preprocess_document_image(doc.file_path, proc_path)
        doc.processed_image_path = proc_path
    except Exception:
        pass

    # 2. Run OCR & Extraction
    raw_text, structured, confidence = run_ocr_and_extract(proc_path)

    # 3. Update Document
    doc.raw_ocr_text = raw_text
    doc.ocr_confidence = confidence
    doc.structured_data = json.dumps(structured)
    doc.status = "validated" if doc.status == "uploaded" else doc.status
    db.commit()
    db.refresh(doc)

    return {
        "document_id": doc.id,
        "raw_text": raw_text,
        "structured_data": structured,
        "ocr_confidence": confidence,
        "processed_image_url": f"/processed/{doc.processed_image_path.replace('\\\\', '/').split('/')[-1]}" if doc.processed_image_path else "",
        "original_image_url": f"/uploads/{doc.file_path.replace('\\\\', '/').split('/')[-1]}" if doc.file_path else ""
    }
