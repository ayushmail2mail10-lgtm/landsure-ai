from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from rapidfuzz import fuzz
from app.core.database import get_db
from app.models.land_record import LandRecord, MutationHistory
from app.schemas.record import LandRecordOut

router = APIRouter(prefix="/records", tags=["Land Records"])

@router.get("", response_model=List[LandRecordOut])
def get_all_records(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(LandRecord).offset(skip).limit(limit).all()

@router.get("/search", response_model=List[LandRecordOut])
def search_records(
    owner_name: Optional[str] = Query(None),
    survey_number: Optional[str] = Query(None),
    village: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    mutation_number: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(LandRecord)
    if survey_number:
        query = query.filter(LandRecord.survey_number.ilike(f"%{survey_number}%"))
    if village:
        query = query.filter(LandRecord.village.ilike(f"%{village}%"))
    if district:
        query = query.filter(LandRecord.district.ilike(f"%{district}%"))
    if mutation_number:
        query = query.filter(LandRecord.mutation_number.ilike(f"%{mutation_number}%"))
    
    records = query.all()
    if owner_name and records:
        # Sort/filter by fuzzy owner name matching
        def match_score(r):
            return fuzz.token_sort_ratio(owner_name.lower(), r.owner_name.lower())
        filtered = [r for r in records if match_score(r) >= 50]
        filtered.sort(key=match_score, reverse=True)
        return filtered

    return records

@router.get("/{id}", response_model=LandRecordOut)
def get_record_by_id(id: int, db: Session = Depends(get_db)):
    record = db.query(LandRecord).filter(LandRecord.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Cadastral land record not found.")
    return record
