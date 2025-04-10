from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api import rooms

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hotel Dashboard API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add any other origins you need
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(rooms.router, prefix="/api/v1", tags=["rooms"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Hotel Dashboard API"}
