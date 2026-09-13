import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
PROCESSED_DIR = DATA_DIR / "processed"
SAMPLES_DIR = DATA_DIR / "samples"

for d in [DATA_DIR, UPLOADS_DIR, PROCESSED_DIR, SAMPLES_DIR]:
    d.mkdir(parents=True, exist_ok=True)

PROJECT_NAME = "LandSure AI"
PROJECT_VERSION = "2.0.0"
API_V1_PREFIX = "/api"

SECRET_KEY = os.getenv("LANDSURE_SECRET_KEY", "landsure-ai-super-secret-key-sih-2026-govtech")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/landsure.db")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"
]
