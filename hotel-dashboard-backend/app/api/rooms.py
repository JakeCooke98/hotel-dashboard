from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime
import json

from ..database import get_db
from ..models.room import Room
from ..schemas.room import RoomCreate, Room as RoomSchema, RoomUpdate
from ..services.pdf_service import generate_room_pdf

router = APIRouter()

@router.get("/rooms", response_model=List[RoomSchema])
def get_rooms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    rooms = db.query(Room).offset(skip).limit(limit).all()
    return [room.to_dict() for room in rooms]

@router.get("/rooms/{room_id}", response_model=RoomSchema)
def get_room(room_id: str, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room.to_dict()

@router.post("/rooms", response_model=RoomSchema)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    db_room = Room(
        id=str(uuid.uuid4()),
        name=room.name,
        description=room.description,
        facilities=room.facilities,
        image=room.image,
        facility_list=json.dumps(room.facility_list) if room.facility_list else None
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room.to_dict()

@router.put("/rooms/{room_id}", response_model=RoomSchema)
def update_room(room_id: str, room: RoomUpdate, db: Session = Depends(get_db)):
    db_room = db.query(Room).filter(Room.id == room_id).first()
    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Only update fields that are provided
    update_data = room.dict(exclude_unset=True)
    
    if "name" in update_data:
        db_room.name = update_data["name"]
    if "description" in update_data:
        db_room.description = update_data["description"]
    if "facilities" in update_data:
        db_room.facilities = update_data["facilities"]
    if "image" in update_data:
        db_room.image = update_data["image"]
    if "facility_list" in update_data:
        db_room.facility_list = json.dumps(update_data["facility_list"]) if update_data["facility_list"] else None
    
    db_room.updated = datetime.utcnow()
    
    db.commit()
    db.refresh(db_room)
    return db_room.to_dict()

@router.delete("/rooms/{room_id}")
def delete_room(room_id: str, db: Session = Depends(get_db)):
    db_room = db.query(Room).filter(Room.id == room_id).first()
    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    
    db.delete(db_room)
    db.commit()
    return {"message": "Room deleted successfully"}

@router.get("/rooms/{room_id}/pdf")
def get_room_pdf(room_id: str, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    
    pdf_buffer = generate_room_pdf(room.to_dict())
    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=room_{room_id}.pdf"}
    )
