from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class MutationHistoryOut(BaseModel):
    id: int
    mutation_number: str
    mutation_date: str
    mutation_type: str
    transferor_name: Optional[str] = None
    transferee_name: str
    area_transferred: Optional[float] = None
    remarks: Optional[str] = None
    status: str

    class Config:
        orm_mode = True

class LandRecordOut(BaseModel):
    id: int
    survey_number: str
    subdivision_number: Optional[str] = "1"
    plot_number: Optional[str] = None
    owner_name: str
    father_or_husband_name: Optional[str] = None
    village: str
    taluka: str
    district: str
    state: str
    total_area_hectares: float
    uncultivated_area: float
    assessment_rupees: float
    land_type: str
    tenure_type: str
    mutation_number: Optional[str] = None
    last_mutation_date: Optional[str] = None
    encumbrances: Optional[str] = None
    status: str
    health_score: int
    mutations: List[MutationHistoryOut] = []

    class Config:
        orm_mode = True

class LandRecordSearchQuery(BaseModel):
    owner_name: Optional[str] = None
    survey_number: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    mutation_number: Optional[str] = None
