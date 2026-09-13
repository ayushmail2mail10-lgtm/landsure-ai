from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogOut

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get("", response_model=List[AuditLogOut])
def get_all_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.id.desc()).offset(skip).limit(limit).all()

@router.get("/document/{doc_id}", response_model=List[AuditLogOut])
def get_document_audit_logs(doc_id: int, db: Session = Depends(get_db)):
    return db.query(AuditLog).filter(
        AuditLog.target_type == "DOCUMENT",
        AuditLog.target_id == str(doc_id)
    ).order_by(AuditLog.id.desc()).all()

@router.get("/record/{record_id}", response_model=List[AuditLogOut])
def get_record_audit_logs(record_id: int, db: Session = Depends(get_db)):
    return db.query(AuditLog).filter(
        AuditLog.target_type == "LAND_RECORD",
        AuditLog.target_id == str(record_id)
    ).order_by(AuditLog.id.desc()).all()

@router.get("/{recordId}", response_model=List[AuditLogOut])
def get_audit_by_record_or_target_id(recordId: str, db: Session = Depends(get_db)):
    return db.query(AuditLog).filter(
        AuditLog.target_id == str(recordId)
    ).order_by(AuditLog.id.desc()).all()
