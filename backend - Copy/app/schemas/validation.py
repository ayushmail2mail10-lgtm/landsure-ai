from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class DiscrepancyOut(BaseModel):
    id: int
    field_name: str
    document_value: Optional[str] = None
    database_value: Optional[str] = None
    risk_level: str # HIGH, MEDIUM, LOW
    severity: int
    discrepancy_type: str
    suggested_action: Optional[str] = None
    resolved: bool = False

    class Config:
        orm_mode = True

class ValidationResultOut(BaseModel):
    id: int
    document_id: int
    matched_record_id: Optional[int] = None
    overall_validation_score: float
    fraud_risk_score: float
    risk_level: str
    ai_explanation: Optional[str] = None
    discrepancies: List[DiscrepancyOut] = []
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
