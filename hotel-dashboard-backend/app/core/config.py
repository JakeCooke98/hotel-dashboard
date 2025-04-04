
import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hugo Hotel API"
    API_V1_STR: str = "/api"
    
    # Database settings
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:password@localhost:5432/hugohotel"
    )
    
    class Config:
        case_sensitive = True

settings = Settings()
