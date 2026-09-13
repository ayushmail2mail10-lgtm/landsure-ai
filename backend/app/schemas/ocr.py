from typing import Optional, Dict, Any
from pydantic import BaseModel

class ExtractedLandData(BaseModel):
    owner_name: Optional[str] = None
    fathers_name: Optional[str] = None
    survey_number: Optional[str] = None
    plot_number: Optional[str] = None
    village: Optional[str] = None
    taluka: Optional[str] = None
    district: Optional[str] = None
    land_area: Optional[str] = None
    land_type: Optional[str] = None
    mutation_number: Optional[str] = None
    record_date: Optional[str] = None
    confidence_per_field: Dict[str, float] = {}

class OCRProcessResponse(BaseModel):
    document_id: int
    raw_text: str
    structured_data: ExtractedLandData
    ocr_confidence: float
    processed_image_url: str
    original_image_url: str
