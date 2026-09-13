import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import PROJECT_NAME, PROJECT_VERSION, API_V1_PREFIX, ALLOWED_ORIGINS, UPLOADS_DIR, PROCESSED_DIR, SAMPLES_DIR
from app.core.database import Base, engine, SessionLocal
from app.services.demo_seeder import seed_database

# Routers
from app.routers.auth import router as auth_router
from app.routers.documents import router as documents_router
from app.routers.ocr import router as ocr_router
from app.routers.validation import router as validation_router
from app.routers.records import router as records_router
from app.routers.officer import router as officer_router
from app.routers.audit import router as audit_router
from app.routers.admin import router as admin_router
from app.routers.assistant import router as assistant_router

app = FastAPI(
    title="LandSure AI – Intelligent Land Record Digitization & Validation System",
    description="GovTech Cadastral AI platform for digitizing, validating, and auditing 7/12, Khatauni, and RoR land records.",
    version=PROJECT_VERSION
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static file directories for document and processed previews
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
app.mount("/processed", StaticFiles(directory=str(PROCESSED_DIR)), name="processed")
app.mount("/samples", StaticFiles(directory=str(SAMPLES_DIR)), name="samples")

# Include Routers
app.include_router(auth_router, prefix=API_V1_PREFIX)
app.include_router(documents_router, prefix=API_V1_PREFIX)
app.include_router(ocr_router, prefix=API_V1_PREFIX)
app.include_router(validation_router, prefix=API_V1_PREFIX)
app.include_router(records_router, prefix=API_V1_PREFIX)
app.include_router(officer_router, prefix=API_V1_PREFIX)
app.include_router(audit_router, prefix=API_V1_PREFIX)
app.include_router(admin_router, prefix=API_V1_PREFIX)
app.include_router(assistant_router, prefix=API_V1_PREFIX)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "system": PROJECT_NAME,
        "version": PROJECT_VERSION,
        "status": "ONLINE",
        "description": "Government Land Record Digitization & AI Validation Engine",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": PROJECT_NAME}
