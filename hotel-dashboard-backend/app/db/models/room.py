
from sqlalchemy import Column, String, Integer, Text, ARRAY
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.database import Base
import uuid

class RoomDB(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    facilities = Column(Integer, nullable=False, default=0)
    facilityList = Column(ARRAY(String), nullable=True)
    image = Column(String, nullable=True)
    created = Column(String, nullable=False)
    updated = Column(String, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "facilities": self.facilities,
            "facilityList": self.facilityList if self.facilityList else [],
            "image": self.image,
            "created": self.created,
            "updated": self.updated
        }
