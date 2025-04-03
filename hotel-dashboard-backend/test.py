# test.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_and_get_room():
    room_data = {"id": 1, "name": "Deluxe Suite", "description": "A luxurious room", "price": 250.0}
    
    # Create a room
    response = client.post("/rooms", json=room_data)
    assert response.status_code == 200
    assert response.json() == room_data
    
    # Get all rooms and check if the new room is in the list
    response = client.get("/rooms")
    assert response.status_code == 200
    assert room_data in response.json()

def test_pdf_generation():
    # Ensure room exists for PDF generation
    room_data = {"id": 2, "name": "Economy Room", "description": "Budget friendly", "price": 80.0}
    client.post("/rooms", json=room_data)
    
    response = client.get("/rooms/2/pdf")
    assert response.status_code == 200
    # Check if the response is a PDF
    assert response.headers["content-type"] == "application/pdf"
