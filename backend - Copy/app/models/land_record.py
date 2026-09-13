from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class LandRecord(Base):
    __tablename__ = "land_records"

    id = Column(Integer, primary_key=True, index=True)
    survey_number = Column(String(100), index=True, nullable=False)
    subdivision_number = Column(String(50), nullable=True, default="1")
    plot_number = Column(String(50), nullable=True)
    owner_name = Column(String(255), index=True, nullable=False)
    father_or_husband_name = Column(String(255), nullable=True)
    village = Column(String(100), index=True, nullable=False)
    taluka = Column(String(100), index=True, nullable=False)
    district = Column(String(100), index=True, nullable=False)
    state = Column(String(100), nullable=False, default="Maharashtra")
    total_area_hectares = Column(Float, nullable=False)
    uncultivated_area = Column(Float, default=0.0)
    assessment_rupees = Column(Float, default=15.0)
    land_type = Column(String(100), default="Agricultural") # Agricultural, Non-Agricultural, Commercial, Residential, Forest
    tenure_type = Column(String(100), default="Occupant Class 1")
    mutation_number = Column(String(100), index=True, nullable=True)
    last_mutation_date = Column(String(50), nullable=True)
    encumbrances = Column(Text, nullable=True, default="None / Nil")
    status = Column(String(50), default="VERIFIED") # VERIFIED, DISPUTED, PENDING_MUTATION
    health_score = Column(Integer, default=95) # 0-100
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    mutations = relationship("MutationHistory", back_populates="land_record", cascade="all, delete-orphan")

class MutationHistory(Base):
    __tablename__ = "mutation_history"

    id = Column(Integer, primary_key=True, index=True)
    land_record_id = Column(Integer, ForeignKey("land_records.id"), nullable=False)
    mutation_number = Column(String(100), nullable=False)
    mutation_date = Column(String(50), nullable=False)
    mutation_type = Column(String(100), nullable=False) # Inheritance (Varas), Sale (Kharidi), Partition (Vandap), Gift (Bakshis)
    transferor_name = Column(String(255), nullable=True) # Seller / Previous owner
    transferee_name = Column(String(255), nullable=False) # Buyer / New owner
    area_transferred = Column(Float, nullable=True)
    remarks = Column(Text, nullable=True)
    status = Column(String(50), default="SANCTIONED") # SANCTIONED, REJECTED, PENDING

    land_record = relationship("LandRecord", back_populates="mutations")
