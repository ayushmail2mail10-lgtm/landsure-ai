from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class AuditLogOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    username: str
    user_role: str
    action: str
    target_type: str
    target_id: str
    previous_value: Optional[str] = None
    new_value: Optional[str] = None
    ip_address: Optional[str] = None
    timestamp: Optional[datetime] = None

    class Config:
        orm_mode = True
