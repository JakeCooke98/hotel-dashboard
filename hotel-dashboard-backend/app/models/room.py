
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class RoomBase(BaseModel):
    name: str = Field(..., example="No. 3 Luxury Double Room")
    description: str = Field(..., example="Style and beauty with double bed, walk-in shower and daily servicing.")
    facilityList: List[str] = Field(default_factory=list)
    image: Optional[str] = None
    facilities: int = Field(..., example=3)
    created: str = Field(..., example="17/03/25")
    updated: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: str

    class Config:
        from_attributes = True
