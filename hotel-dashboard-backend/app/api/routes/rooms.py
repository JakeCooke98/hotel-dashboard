
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.room import Room, RoomCreate
from app.services.room_service import RoomService
from app.services.pdf_service import PDFService

router = APIRouter()
pdf_service = PDFService()

@router.get("/rooms", response_model=List[Room])
async def get_all_rooms(db: Session = Depends(get_db)):
    service = RoomService(db)
    return service.get_all_rooms()

@router.post("/rooms", response_model=Room)
async def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    service = RoomService(db)
    return service.create_room(room)

@router.get("/rooms/{room_id}", response_model=Room)
async def get_room(room_id: str, db: Session = Depends(get_db)):
    service = RoomService(db)
    room = service.get_room(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.put("/rooms/{room_id}", response_model=Room)
async def update_room(room_id: str, room: RoomCreate, db: Session = Depends(get_db)):
    service = RoomService(db)
    updated_room = service.update_room(room_id, room)
    if not updated_room:
        raise HTTPException(status_code=404, detail="Room not found")
    return updated_room

@router.delete("/rooms/{room_id}", status_code=204)
async def delete_room(room_id: str, db: Session = Depends(get_db)):
    service = RoomService(db)
    deleted = service.delete_room(room_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Room not found")
    return Response(status_code=204)

@router.get("/rooms/{room_id}/pdf")
async def generate_room_pdf(room_id: str, db: Session = Depends(get_db)):
    """Generate a PDF report for a specific room"""
    service = RoomService(db)
    room = service.get_room(room_id)
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Generate PDF using our PDF service
    pdf_content = pdf_service.generate_room_pdf(room)
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=room-{room_id}-details.pdf"
        }
    )
