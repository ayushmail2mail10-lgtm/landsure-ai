import json
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import require_roles, get_current_user
from app.models.user import User
from app.models.document import Document
from app.models.validation import ValidationResult
from app.schemas.document import DocumentOut, DocumentDetail
from app.schemas.admin import ReviewActionRequest
from app.services.audit_service import record_audit_log

router = APIRouter(prefix="/review", tags=["Officer Review"])

@router.get("/queue", response_model=List[DocumentDetail])
def get_review_queue(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["officer", "admin"]))
):
    docs = db.query(Document).order_by(Document.id.desc()).all()
    results = []
    for doc in docs:
        val_res = db.query(ValidationResult).filter(ValidationResult.document_id == doc.id).first()
        parsed = json.loads(doc.structured_data) if doc.structured_data else {}
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

@router.post("/approve/{doc_id}", response_model=DocumentOut)
def approve_document(
    doc_id: int,
    action_data: ReviewActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["officer", "admin"]))
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    old_status = doc.status
    doc.status = "approved"
    doc.officer_remarks = action_data.remarks
    doc.reviewed_by_id = current_user.id
    doc.review_timestamp = datetime.now(timezone.utc)

    record_audit_log(
        db=db,
        user_id=current_user.id,
        username=current_user.full_name,
        user_role=current_user.role,
        action="OFFICER_APPROVED",
        target_type="DOCUMENT",
        target_id=str(doc.id),
        previous_value=f"Status: {old_status}",
        new_value=f"Status: approved | Remarks: {action_data.remarks}"
    )

    db.commit()
    db.refresh(doc)
    return doc

@router.post("/reject/{doc_id}", response_model=DocumentOut)
def reject_document(
    doc_id: int,
    action_data: ReviewActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["officer", "admin"]))
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    old_status = doc.status
    doc.status = "rejected"
    doc.officer_remarks = action_data.remarks
    doc.reviewed_by_id = current_user.id
    doc.review_timestamp = datetime.now(timezone.utc)

    record_audit_log(
        db=db,
        user_id=current_user.id,
        username=current_user.full_name,
        user_role=current_user.role,
        action="OFFICER_REJECTED",
        target_type="DOCUMENT",
        target_id=str(doc.id),
        previous_value=f"Status: {old_status}",
        new_value=f"Status: rejected | Remarks: {action_data.remarks}"
    )

    db.commit()
    db.refresh(doc)
    return doc

@router.post("/request-correction/{doc_id}", response_model=DocumentOut)
def request_correction(
    doc_id: int,
    action_data: ReviewActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["officer", "admin"]))
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    old_status = doc.status
    doc.status = "correction_required"
    doc.officer_remarks = action_data.remarks
    doc.reviewed_by_id = current_user.id
    doc.review_timestamp = datetime.now(timezone.utc)

    record_audit_log(
        db=db,
        user_id=current_user.id,
        username=current_user.full_name,
        user_role=current_user.role,
        action="CORRECTION_REQUESTED",
        target_type="DOCUMENT",
        target_id=str(doc.id),
        previous_value=f"Status: {old_status}",
        new_value=f"Status: correction_required | Remarks: {action_data.remarks}"
    )

    db.commit()
    db.refresh(doc)
    return doc

class ReviewBodyRequest(BaseModel):
    document_id: int
    remarks: str

@router.post("/approve", response_model=DocumentOut)
def approve_document_body(
    payload: ReviewBodyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["officer", "admin"]))
):
    return approve_document(payload.document_id, ReviewActionRequest(remarks=payload.remarks), db, current_user)

@router.post("/reject", response_model=DocumentOut)
def reject_document_body(
    payload: ReviewBodyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["officer", "admin"]))
):
    return reject_document(payload.document_id, ReviewActionRequest(remarks=payload.remarks), db, current_user)
