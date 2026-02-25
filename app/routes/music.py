import json
import re
from typing import List

from fastapi import APIRouter

from .. import ollama_service, persona_builder, schemas

router = APIRouter(prefix="/music", tags=["Music"])


MUSIC_USER_PROMPT = """
You are an emotionally aware music therapist.

Using the USER CONTEXT, recommend exactly 6 songs.

Return ONLY valid JSON.
Do not include markdown.
Do not include backticks.
Do not include explanations.

The response must be a single JSON object in this exact format:

{"items":[
{"id":"1","title":"...","artist":"...","mood":"calm","reason":"..."},
{"id":"2","title":"...","artist":"...","mood":"...","reason":"..."},
{"id":"3","title":"...","artist":"...","mood":"...","reason":"..."},
{"id":"4","title":"...","artist":"...","mood":"...","reason":"..."},
{"id":"5","title":"...","artist":"...","mood":"...","reason":"..."},
{"id":"6","title":"...","artist":"...","mood":"...","reason":"..."}
]}
"""


def _normalize_profile(profile: dict) -> dict:
    return {
        "name": profile.get("name", ""),
        "identity": profile.get("identity", ""),
        "age_range": profile.get("ageRange", profile.get("age_range", "")),
        "relationship_status": profile.get(
            "relationshipStatus", profile.get("relationship_status", "")
        ),
        "support_type": profile.get("supportType", profile.get("support_type", "")),
        "communication_type": profile.get(
            "communicationPreference", profile.get("communication_type", "")
        ),
    }


def _parse_json_from_reply(reply: str) -> List[dict]:
    reply = reply.strip()

    try:
        data = json.loads(reply)
        if isinstance(data, dict) and "items" in data:
            return data["items"] if isinstance(data["items"], list) else []
        if isinstance(data, list):
            return data
        return []
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{[\s\S]*\"items\"[\s\S]*\}", reply)
    if match:
        try:
            data = json.loads(match.group(0))
            if isinstance(data.get("items"), list):
                return data["items"]
        except json.JSONDecodeError:
            pass

    return []


@router.post("/recommend")
async def recommend(data: schemas.MusicRequest) -> dict:
    profile = data.profile or {}
    normalized = _normalize_profile(profile)

    try:
        system_prompt = persona_builder.build_therapist_persona(normalized)

        # 🔥 Inject real emotional context
        user_prompt = f"""
USER CONTEXT:
{normalized}

PRIMARY NEED: {normalized.get("support_type")}

{MUSIC_USER_PROMPT}
"""

        reply = ollama_service.generate_reply(
            system_prompt,
            [],
            user_prompt,
            json_mode=True   # ⭐ THIS IS THE KEY
        )

        print("🎵 RAW MUSIC MODEL OUTPUT:\n", reply)  # remove later

        items = _parse_json_from_reply(reply)

        out = []
        for i, item in enumerate(items[:6], start=1):
            if not isinstance(item, dict):
                continue

            out.append({
                "id": str(item.get("id", i)),
                "title": str(item.get("title", "")).strip() or "Unknown",
                "artist": str(item.get("artist", "")).strip() or "Unknown",
                "mood": str(item.get("mood", "")).strip() or "calm",
                "reason": str(item.get("reason", "")).strip() or "Recommended for you.",
            })

        return {"items": out}

    except Exception as e:
        print(f"Music recommend error: {e}")
        return {"items": []}