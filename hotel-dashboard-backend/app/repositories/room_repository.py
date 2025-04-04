
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.models.room import RoomDB
from app.models.room import Room, RoomCreate

class RoomRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Room]:
        rooms = self.db.query(RoomDB).all()
        return [Room(**room.to_dict()) for room in rooms]

    def get_by_id(self, room_id: str) -> Optional[Room]:
        room = self.db.query(RoomDB).filter(RoomDB.id == room_id).first()
        if room:
            return Room(**room.to_dict())
        return None

    def create(self, room_data: RoomCreate) -> Room:
        today = datetime.now().strftime("%d/%m/%y")
        
        new_room = RoomDB(
            name=room_data.name,
            description=room_data.description,
            facilities=room_data.facilities,
            facilityList=room_data.facilityList,
            image=room_data.image,
            created=today,
            updated=None
        )
        
        self.db.add(new_room)
        self.db.commit()
        self.db.refresh(new_room)
        
        return Room(**new_room.to_dict())

    def update(self, room_id: str, room_data: RoomCreate) -> Optional[Room]:
        room = self.db.query(RoomDB).filter(RoomDB.id == room_id).first()
        if not room:
            return None
            
        today = datetime.now().strftime("%d/%m/%y")
        
        # Update room attributes
        room.name = room_data.name
        room.description = room_data.description
        room.facilities = room_data.facilities
        room.facilityList = room_data.facilityList
        room.image = room_data.image
        room.updated = today
        
        self.db.commit()
        self.db.refresh(room)
        
        return Room(**room.to_dict())

    def delete(self, room_id: str) -> bool:
        room = self.db.query(RoomDB).filter(RoomDB.id == room_id).first()
        if not room:
            return False
            
        self.db.delete(room)
        self.db.commit()
        
        return True
