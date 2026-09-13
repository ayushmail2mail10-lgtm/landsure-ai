from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel
from app.schemas.validation import ValidationResultOut

class DocumentBase(BaseModel):
    file_name: str
    original_file_size: int
    mime_type: str

class DocumentCreate(DocumentBase):
    pass

class DocumentOut(BaseModel):
    id: int
    document_number: str
    file_name: str
    file_path: str
    original_file_size: int
    mime_type: str
    sha256_hash: str
    is_tampered: bool
    uploaded_by_id: int
    upload_timestamp: Optional[datetime] = None
    status: str
    processed_image_path: Optional[str] = None
    ocr_confidence: float
    officer_remarks: Optional[str] = None
    review_timestamp: Optional[datetime] = None

    class Config:
        orm_mode = True

class DocumentDetail(DocumentOut):
    raw_ocr_text: Optional[str] = None
    structured_data: Optional[Any] = None
    validation_result: Optional[ValidationResultOut] = None

class IntegrityCheckOut(BaseModel):
    document_id: int
    document_number: str
    stored_hash: str
    current_hash: str
    is_valid: bool
    status_message: str
