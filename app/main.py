from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import chat, session

# Initialize Database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Calmi Therapy Backend")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(session.router)
app.include_router(chat.router)


@app.get("/")
def health_check():
    return {"status": "Calmi backend is running"}

