from fastapi.testclient import TestClient
from app.main import app

# Create a global client instance
client = TestClient(app)

def test_read_root():
    """Test the root endpoint of the API."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Hotel Dashboard API"} 