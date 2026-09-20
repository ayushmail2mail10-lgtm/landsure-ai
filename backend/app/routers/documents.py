import os
import json
import hashlib
import shutil
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.core.config import UPLOADS_DIR, PROCESSED_DIR
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.document import Document
from app.models.validation import ValidationResult
from app.schemas.document import DocumentOut, DocumentDetail, IntegrityCheckOut
from app.services.preprocessing import preprocess_document_image
from app.services.ocr_engine import run_ocr_and_extract
from app.services.validation_engine import run_validation_pipeline
from app.services.audit_service import record_audit_log

router = APIRouter(prefix="/documents", tags=["Documents"])

ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf"
]

MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB


@router.post("/upload", response_model=DocumentDetail)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if (
        file.content_type not in ALLOWED_MIME_TYPES
        and not file.filename.lower().endswith(
            (".png", ".jpg", ".jpeg", ".pdf")
        )
    ):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload PDF, JPG, or PNG."
        )

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds limit of 15 MB."
        )

    file_hash = hashlib.sha256(contents).hexdigest()

    doc_count = db.query(Document).count()
    doc_num = f"DOC-2026-{1000 + doc_count + 1}"

    safe_filename = f"{doc_num}_{file.filename}"
    file_path = os.path.join(UPLOADS_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    proc_filename = f"proc_{safe_filename}"
    proc_path = os.path.join(PROCESSED_DIR, proc_filename)

    try:
        preprocess_document_image(
            file_path,
            proc_path
        )
    except Exception:
        proc_path = file_path

    try:
        raw_text, structured, conf = run_ocr_and_extract(
            proc_path
        )
    except Exception as e:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)

            if (
                proc_path != file_path
                and os.path.exists(proc_path)
            ):
                os.remove(proc_path)

        except Exception:
            pass

        raise HTTPException(
            status_code=400,
            detail=f"Unable to process the uploaded document: {str(e)}"
        )

    doc = Document(
        document_number=doc_num,
        file_name=file.filename,
        file_path=file_path,
        original_file_size=len(contents),
        mime_type=file.content_type or "image/png",
        sha256_hash=file_hash,
        is_tampered=False,
        uploaded_by_id=current_user.id,
        status="validated",
        processed_image_path=proc_path,
        raw_ocr_text=raw_text,
        ocr_confidence=conf,
        structured_data=json.dumps(structured)
    )

    db.add(doc)
    db.flush()

    val_result = run_validation_pipeline(
        db,
        doc.id,
        structured,
        conf
    )

    record_audit_log(
        db=db,
        user_id=current_user.id,
        username=current_user.full_name,
        user_role=current_user.role,
        action="DOCUMENT_UPLOAD_AND_VALIDATE",
        target_type="DOCUMENT",
        target_id=str(doc.id),
        previous_value=None,
        new_value=(
            f"Uploaded {file.filename}. "
            f"OCR Conf: {conf}%, "
            f"Val Score: {val_result.overall_validation_score}%, "
            f"Fraud Score: {val_result.fraud_risk_score}"
        )
    )

    db.commit()
    db.refresh(doc)

    parsed_structured = (
        json.loads(doc.structured_data)
        if doc.structured_data
        else {}
    )

    return {
        "id": doc.id,
        "document_number": doc.document_number,
        "file_name": doc.file_name,
        "file_path": doc.file_path,
        "original_file_size": doc.original_file_size,
        "mime_type": doc.mime_type,
        "sha256_hash": doc.sha256_hash,
        "is_tampered": doc.is_tampered,
        "uploaded_by_id": doc.uploaded_by_id,
        "upload_timestamp": doc.upload_timestamp,
        "status": doc.status,
        "processed_image_path": doc.processed_image_path,
        "raw_ocr_text": doc.raw_ocr_text,
        "ocr_confidence": doc.ocr_confidence,
        "structured_data": parsed_structured,
        "officer_remarks": doc.officer_remarks,
        "review_timestamp": doc.review_timestamp,
        "validation_result": val_result
    }


@router.get("", response_model=List[DocumentDetail])
def list_documents(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Document)

    if current_user.role == "citizen":
        query = query.filter(
            Document.uploaded_by_id == current_user.id
        )

    if status_filter:
        query = query.filter(
            Document.status == status_filter
        )

    docs = query.order_by(
        Document.id.desc()
    ).all()

    results = []

    for doc in docs:

        val_res = db.query(
            ValidationResult
        ).filter(
            ValidationResult.document_id == doc.id
        ).first()

        parsed = (
            json.loads(doc.structured_data)
            if doc.structured_data
            else {}
        )

        results.append({
            "id": doc.id,
            "document_number": doc.document_number,
            "file_name": doc.file_name,
            "file_path": doc.file_path,
            "original_file_size": doc.original_file_size,
            "mime_type": doc.mime_type,
            "sha256_hash": doc.sha256_hash,
            "is_tampered": doc.is_tampered,
            "uploaded_by_id": doc.uploaded_by_id,
            "upload_timestamp": doc.upload_timestamp,
            "status": doc.status,
            "processed_image_path": doc.processed_image_path,
            "ocr_confidence": doc.ocr_confidence,
            "officer_remarks": doc.officer_remarks,
            "review_timestamp": doc.review_timestamp,
            "raw_ocr_text": doc.raw_ocr_text,
            "structured_data": parsed,
            "validation_result": val_res
        })

    return results


@router.get(
    "/{id}",
    response_model=DocumentDetail
)
def get_document_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(
        Document
    ).filter(
        Document.id == id
    ).first()

    if not doc:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    val_res = db.query(
        ValidationResult
    ).filter(
        ValidationResult.document_id == doc.id
    ).first()

    parsed_structured = (
        json.loads(doc.structured_data)
        if doc.structured_data
        else {}
    )

    return {
        "id": doc.id,
        "document_number": doc.document_number,
        "file_name": doc.file_name,
        "file_path": doc.file_path,
        "original_file_size": doc.original_file_size,
        "mime_type": doc.mime_type,
        "sha256_hash": doc.sha256_hash,
        "is_tampered": doc.is_tampered,
        "uploaded_by_id": doc.uploaded_by_id,
        "upload_timestamp": doc.upload_timestamp,
        "status": doc.status,
        "processed_image_path": doc.processed_image_path,
        "raw_ocr_text": doc.raw_ocr_text,
        "ocr_confidence": doc.ocr_confidence,
        "structured_data": parsed_structured,
        "officer_remarks": doc.officer_remarks,
        "review_timestamp": doc.review_timestamp,
        "validation_result": val_res
    }


@router.get(
    "/{id}/verify-integrity",
    response_model=IntegrityCheckOut
)
def verify_document_integrity(
    id: int,
    db: Session = Depends(get_db)
):
    doc = db.query(
        Document
    ).filter(
        Document.id == id
    ).first()

    if not doc:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    if not os.path.exists(doc.file_path):
        return {
            "document_id": doc.id,
            "document_number": doc.document_number,
            "stored_hash": doc.sha256_hash,
            "current_hash": "FILE_MISSING",
            "is_valid": False,
            "status_message": (
                "⚠ Physical file is missing from secure storage."
            )
        }

    with open(doc.file_path, "rb") as f:
        current_hash = hashlib.sha256(
            f.read()
        ).hexdigest()

    is_valid = (
        current_hash == doc.sha256_hash
    )

    if not is_valid and not doc.is_tampered:
        doc.is_tampered = True
        db.commit()

    return {
        "document_id": doc.id,
        "document_number": doc.document_number,
        "stored_hash": doc.sha256_hash,
        "current_hash": current_hash,
        "is_valid": is_valid,
        "status_message": (
            "✓ Document Integrity Verified "
            "(SHA-256 matches cryptographic seal)"
            if is_valid
            else
            "⚠ Document Modified / Tampered "
            "(SHA-256 hash mismatch detected)"
        )
    }