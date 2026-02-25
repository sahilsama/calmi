import os
import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MODEL = os.getenv("OLLAMA_MODEL", "alibayram/medgemma:latest")


def generate_reply(
    system_prompt: str,
    history: list,
    new_message: str,
    json_mode: bool = False,
) -> str:
    # Build conversation history
    conversation = ""
    for msg in history:
        role = "User" if msg.role == "user" else "Assistant"
        conversation += f"{role}: {msg.content}\n"

    full_prompt = f"""
System Prompt
-------------
{system_prompt}

Conversation History
-------------
{conversation}

New User Message
-------------
User: {new_message}

Assistant:
"""

    payload = {
        "model": MODEL,
        "prompt": full_prompt,
        "stream": False,
        "options": {
            "temperature": 0.3 if json_mode else 0.7,
            "num_predict": 400,
        },
    }

    # ✅ Enable JSON mode only when requested
    if json_mode:
        payload["format"] = "json"

    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json=payload,
            timeout=60,
        )
        response.raise_for_status()

        return response.json().get("response", "").strip()

    except Exception as e:
        print(f"Ollama Error: {e}")
        return ""