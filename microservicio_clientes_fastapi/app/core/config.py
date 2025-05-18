from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

class Settings(BaseSettings):
    """
    Configuraciones de la aplicación cargadas desde variables de entorno
    """
    # Información de la aplicación
    APP_NAME: str = "Microservicio de Clientes"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "default-insecure-key")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    
    # Puerto del servicio
    SERVICE_PORT: int = int(os.getenv("SERVICE_PORT", 8001))
    
    # Base de datos
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./clientes.db")
    
    # Configuración adicional
    API_PREFIX: str = "/api"
    
    class Config:
        env_file = ".env"

# Instancia única de configuración
settings = Settings()