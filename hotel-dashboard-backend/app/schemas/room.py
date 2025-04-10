from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class RoomBase(BaseModel):
    name: str
    description: str
    facilities: int
    image: Optional[str] = None
    facility_list: Optional[List[str]] = None

class RoomCreate(RoomBase):
    pass

class RoomUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    facilities: Optional[int] = None
    image: Optional[str] = None
    facility_list: Optional[List[str]] = None

class Room(RoomBase):
    id: str
    created: datetime
    updated: Optional[datetime] = None

    class Config:
        from_attributes = True
