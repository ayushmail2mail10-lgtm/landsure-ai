from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    document_number = Column(String(100), unique=True, index=True, nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    original_file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    sha256_hash = Column(String(64), nullable=False, index=True)
    is_tampered = Column(Boolean, default=False)
    uploaded_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    upload_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Processing & OCR pipeline
    status = Column(String(50), default="uploaded") # uploaded, processing, validated, under_review, approved, rejected, correction_required
    processed_image_path = Column(String(500), nullable=True)
    raw_ocr_text = Column(Text, nullable=True)
    ocr_confidence = Column(Float, default=0.0)
    structured_data = Column(Text, nullable=True) # JSON string of extracted fields
    
    # Review & Approval
    officer_remarks = Column(Text, nullable=True)
    reviewed_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    review_timestamp = Column(DateTime(timezone=True), nullable=True)
