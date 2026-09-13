from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ValidationResult(Base):
    __tablename__ = "validation_results"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False, index=True)
    matched_record_id = Column(Integer, ForeignKey("land_records.id"), nullable=True)
    overall_validation_score = Column(Float, default=0.0) # 0 to 100
    fraud_risk_score = Column(Float, default=0.0) # 0 to 100
    risk_level = Column(String(50), default="LOW") # LOW, MEDIUM, HIGH
    ai_explanation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    discrepancies = relationship("Discrepancy", back_populates="validation_result", cascade="all, delete-orphan")

class Discrepancy(Base):
    __tablename__ = "discrepancies"

    id = Column(Integer, primary_key=True, index=True)
    validation_result_id = Column(Integer, ForeignKey("validation_results.id"), nullable=False)
    field_name = Column(String(100), nullable=False) # owner_name, survey_number, land_area, etc.
    document_value = Column(String(255), nullable=True)
    database_value = Column(String(255), nullable=True)
    risk_level = Column(String(50), nullable=False) # HIGH, MEDIUM, LOW
    severity = Column(Integer, default=1) # 1 (Low) to 3 (Critical)
    discrepancy_type = Column(String(100), nullable=False) # NAME_MISMATCH, AREA_MISMATCH, DUPLICATE_CLAIM, UNREGISTERED_SURVEY, etc.
    suggested_action = Column(Text, nullable=True)
    resolved = Column(Boolean, default=False)

    validation_result = relationship("ValidationResult", back_populates="discrepancies")
