from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine
import pytest

# Create a global client instance - simplest approach
client = TestClient(app)

@pytest.fixture(scope="function")
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_room(test_db):
    response = client.post(
        "/api/v1/rooms",
        json={
            "name": "Test Room",
            "description": "Test Description",
            "facilities": 5,
            "facility_list": ["WiFi", "TV"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Room"
    assert data["description"] == "Test Description"
    assert data["facilities"] == 5

def test_get_rooms(test_db):
    response = client.get("/api/v1/rooms")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_room(test_db):
    # First create a room
    create_response = client.post(
        "/api/v1/rooms",
        json={
            "name": "Test Room",
            "description": "Test Description",
            "facilities": 5
        }
    )
    room_id = create_response.json()["id"]
    
    # Then get it
    response = client.get(f"/api/v1/rooms/{room_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Test Room"
