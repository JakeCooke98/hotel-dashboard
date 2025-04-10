from fastapi import FastAPI
from .database import engine, Base
from .api import rooms

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hotel Dashboard API")

# Include routers
app.include_router(rooms.router, prefix="/api/v1", tags=["rooms"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Hotel Dashboard API"}
