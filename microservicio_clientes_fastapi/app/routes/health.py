from fastapi import APIRouter
from datetime import datetime
from app.schemas.schemas import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Endpoint para verificar la salud del servicio
    """
    return {
        "status": "ok",
        "service": "clientes-service",
        "timestamp": datetime.now()
    }