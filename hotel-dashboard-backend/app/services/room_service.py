
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.room import Room, RoomCreate
from app.repositories.room_repository import RoomRepository

class RoomService:
    def __init__(self, db: Session):
        self.repository = RoomRepository(db)

    def get_all_rooms(self) -> List[Room]:
        return self.repository.get_all()

    def get_room(self, room_id: str) -> Optional[Room]:
        return self.repository.get_by_id(room_id)

    def create_room(self, room: RoomCreate) -> Room:
        return self.repository.create(room)

    def update_room(self, room_id: str, room: RoomCreate) -> Optional[Room]:
        return self.repository.update(room_id, room)

    def delete_room(self, room_id: str) -> bool:
        return self.repository.delete(room_id)
