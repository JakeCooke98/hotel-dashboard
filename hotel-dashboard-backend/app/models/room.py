from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..database import Base
import json

class Room(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    facilities = Column(Integer)
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), nullable=True)
    image = Column(String, nullable=True)
    facility_list = Column(String, nullable=True)  # Stored as JSON string

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "facilities": self.facilities,
            "created": self.created.isoformat() if self.created else None,
            "updated": self.updated.isoformat() if self.updated else None,
            "image": self.image,
            "facility_list": json.loads(self.facility_list) if self.facility_list else []
        }
