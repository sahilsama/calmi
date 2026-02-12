from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession

from .. import models, ollama_service, safety, schemas
from ..database import get_db

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/send", response_model=schemas.ChatResponse)
def send_message(data: schemas.ChatRequest, db: DBSession = Depends(get_db)):
    # 1. Safety Check
    safety_msg = safety.check_safety(data.message)
    if safety_msg:
        return {"reply": safety_msg}

    # 2. Get Session
    session = (
        db.query(models.Session).filter(models.Session.id == data.session_id).first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 3. Get History (Last 15 messages)
    history = (
        db.query(models.Message)
        .filter(models.Message.session_id == data.session_id)
        .order_by(models.Message.created_at.desc())
        .limit(15)
        .all()
    )
    history.reverse()

    # 4. Generate Ollama Response
    reply = ollama_service.generate_reply(session.system_prompt, history, data.message)

    # 5. Persist Messages
    user_msg = models.Message(session_id=session.id, role="user", content=data.message)
    assistant_msg = models.Message(
        session_id=session.id, role="assistant", content=reply
    )

    db.add(user_msg)
    db.add(assistant_msg)
    db.commit()

    return {"reply": reply}

