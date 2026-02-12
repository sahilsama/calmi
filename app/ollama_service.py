import os

import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MODEL = os.getenv("OLLAMA_MODEL", "alibayram/medgemma:latest")


def generate_reply(system_prompt: str, history: list, new_message: str) -> str:
    # Build the conversation string
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

Assistant:"""

    payload = {
        "model": MODEL,
        "prompt": full_prompt,
        "stream": False,
        "options": {"temperature": 0.7, "num_predict": 250},
    }

    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate", json=payload, timeout=30
        )
        response.raise_for_status()
        return (
            response.json()
            .get(
                "response",
                "I'm sorry, I'm having trouble processing that right now.",
            )
            .strip()
        )
    except Exception as e:
        print(f"Ollama Error: {e}")
        return (
            "I'm here, but I'm having a little trouble connecting to my thoughts. "
            "Could you try saying that again?"
        )

