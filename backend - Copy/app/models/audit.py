from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    username = Column(String(255), nullable=False, default="System")
    user_role = Column(String(50), nullable=False, default="system")
    action = Column(String(100), nullable=False) # UPLOAD, OCR_PROCESSED, VALIDATION_RUN, APPROVED, REJECTED, CORRECTION_REQUESTED, RECORD_MODIFIED
    target_type = Column(String(50), nullable=False) # DOCUMENT, LAND_RECORD, USER
    target_id = Column(String(100), nullable=False)
    previous_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True, default="127.0.0.1")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
