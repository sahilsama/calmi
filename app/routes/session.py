from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession

from .. import models, persona_builder, schemas
from ..database import get_db

router = APIRouter(prefix="/session", tags=["Session"])


@router.post("/create", response_model=schemas.SessionResponse)
def create_session(data: schemas.SessionCreate, db: DBSession = Depends(get_db)):
    system_prompt = persona_builder.build_therapist_persona(data.dict())

    new_session = models.Session(
        name=data.name,
        identity=data.identity,
        age_range=data.age_range,
        relationship_status=data.relationship_status,
        support_type=data.support_type,
        communication_type=data.communication_type,
        system_prompt=system_prompt,
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return {"session_id": new_session.id}

