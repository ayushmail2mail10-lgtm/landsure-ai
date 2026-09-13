from typing import Optional, List
from pydantic import BaseModel

class AssistantChatRequest(BaseModel):
    message: str
    context_document_id: Optional[int] = None
    language: str = "en" # en, hi, mr

class AssistantChatResponse(BaseModel):
    reply: str
    suggested_queries: List[str] = []
