from typing import List, Dict, Any
from pydantic import BaseModel

class AdminStatsOut(BaseModel):
    total_documents: int
    digitized_documents: int
    verified_documents: int
    pending_review: int
    suspicious_records: int
    rejected_documents: int
    total_land_records: int
    average_ocr_confidence: float
    average_validation_score: float
    upload_trends: List[Dict[str, Any]]
    status_distribution: List[Dict[str, Any]]
    risk_distribution: List[Dict[str, Any]]
    district_distribution: List[Dict[str, Any]]
    discrepancy_types: List[Dict[str, Any]]
    suspicious_by_region: List[Dict[str, Any]]

class ReviewActionRequest(BaseModel):
    remarks: str
