from typing import Optional

CRISIS_KEYWORDS = [
    "suicide",
    "kill myself",
    "end my life",
    "self harm",
    "hurt myself",
    "harm others",
    "cut myself",
    "want to die",
]

CRISIS_RESPONSE = (
    "I hear how much pain you're in right now, and I want you to know you aren't alone. "
    "Because I'm a conversational companion and not a crisis service, I'm limited in how I can help "
    "with these specific feelings. Please reach out to a professional or a local crisis hotline "
    "immediately. You matter, and there is support available for you."
)


def check_safety(message: str) -> Optional[str]:
    msg_lower = message.lower()
    for keyword in CRISIS_KEYWORDS:
        if keyword in msg_lower:
            return CRISIS_RESPONSE
    return None

