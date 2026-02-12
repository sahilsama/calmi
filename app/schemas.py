from pydantic import BaseModel


class SessionCreate(BaseModel):
    name: str
    identity: str
    age_range: str
    relationship_status: str
    support_type: str
    communication_type: str


class SessionResponse(BaseModel):
    session_id: str


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str

