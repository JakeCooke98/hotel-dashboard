import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.room import RoomCreate, RoomType, RoomStatus

client = TestClient(app)

def test_create_room():
    room_data = {
        "room_number": "101",
        "room_type": RoomType.STANDARD,
        "status": RoomStatus.AVAILABLE,
        "price_per_night": 100.0,
        "description": "A comfortable standard room"
    }
    response = client.post("/api/rooms", json=room_data)
    assert response.status_code == 200
    assert response.json()["room_number"] == "101"

def test_get_all_rooms():
    response = client.get("/api/rooms")
    assert response.status_code == 200
    assert isinstance(response.json(), list) 