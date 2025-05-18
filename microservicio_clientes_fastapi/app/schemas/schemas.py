from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

# Esquemas para Compra
class CompraBase(BaseModel):
    total: Decimal = Field(..., gt=0, description="Total de la compra")
    completada: bool = Field(False, description="Indica si la compra está completada")

class CompraCreate(CompraBase):
    cliente_id: int = Field(..., gt=0, description="ID del cliente que realizó la compra")

class CompraUpdate(BaseModel):
    total: Optional[Decimal] = Field(None, gt=0, description="Total de la compra")
    completada: Optional[bool] = Field(None, description="Indica si la compra está completada")

class CompraInDB(CompraBase):
    id: int
    cliente_id: int
    fecha_compra: datetime
    
    model_config = {"from_attributes": True}

# Esquemas para Cliente
class ClienteBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre del cliente")
    apellido: str = Field(..., min_length=2, max_length=100, description="Apellido del cliente")
    email: EmailStr = Field(..., description="Email del cliente")
    telefono: Optional[str] = Field(None, max_length=15, description="Teléfono del cliente")
    direccion: Optional[str] = Field(None, description="Dirección del cliente")
    activo: bool = Field(True, description="Indica si el cliente está activo")

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100)
    apellido: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    telefono: Optional[str] = Field(None, max_length=15)
    direccion: Optional[str] = None
    activo: Optional[bool] = None

class ClienteSimple(ClienteBase):
    id: int
    
    class Config:
        orm_mode = True

class ClienteInDB(ClienteSimple):
    fecha_registro: datetime
    
    class Config:
        orm_mode = True

class ClienteWithCompras(ClienteInDB):
    compras: List[CompraInDB] = []
    
    class Config:
        orm_mode = True

# Respuestas para la API
class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime = Field(default_factory=datetime.now)