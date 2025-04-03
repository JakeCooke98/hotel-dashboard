# main.py
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
from typing import List
from io import BytesIO
from reportlab.pdfgen import canvas

app = FastAPI()

# Define the Room model with Pydantic
class Room(BaseModel):
    id: int
    name: str
    description: str
    price: float

# In-memory store for rooms
rooms: List[Room] = []

# CRUD Endpoints

@app.get("/rooms", response_model=List[Room])
def get_rooms():
    """
    Retrieve all rooms.
    """
    return rooms

@app.post("/rooms", response_model=Room)
def create_room(room: Room):
    """
    Create a new room.
    """
    rooms.append(room)
    return room

@app.put("/rooms/{room_id}", response_model=Room)
def update_room(room_id: int, updated_room: Room):
    """
    Update an existing room by its ID.
    """
    for idx, room in enumerate(rooms):
        if room.id == room_id:
            rooms[idx] = updated_room
            return updated_room
    raise HTTPException(status_code=404, detail="Room not found")

@app.delete("/rooms/{room_id}")
def delete_room(room_id: int):
    """
    Delete a room by its ID.
    """
    global rooms
    rooms = [room for room in rooms if room.id != room_id]
    return {"message": "Room deleted"}

# PDF Generation Endpoint

@app.get("/rooms/{room_id}/pdf")
def generate_room_pdf(room_id: int):
    """
    Generate a PDF with the room details.
    """
    room = next((room for room in rooms if room.id == room_id), None)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # Create a PDF in memory using ReportLab
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    p.drawString(100, 800, f"Room Details for {room.name}")
    p.drawString(100, 780, f"Description: {room.description}")
    p.drawString(100, 760, f"Price: ${room.price}")
    p.showPage()
    p.save()

    buffer.seek(0)
    return Response(
        buffer.read(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=room_{room_id}.pdf"}
    )
