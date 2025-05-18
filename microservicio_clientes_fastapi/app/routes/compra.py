from fastapi import APIRouter, Depends, HTTPException, Response, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.models.models import Compra, Cliente
from app.schemas.schemas import CompraCreate, CompraUpdate, CompraInDB

router = APIRouter()

@router.get("/", response_model=List[CompraInDB])
async def get_compras(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Obtener la lista de compras
    """
    compras = db.query(Compra).offset(skip).limit(limit).all()
    return compras

@router.post("/", response_model=CompraInDB, status_code=status.HTTP_201_CREATED)
async def create_compra(
    compra: CompraCreate, 
    db: Session = Depends(get_db)
):
    """
    Crear una nueva compra
    """
    # Verificar que el cliente exista
    cliente = db.query(Cliente).filter(Cliente.id == compra.cliente_id).first()
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cliente con ID {compra.cliente_id} no existe"
        )
    
    # Crear la nueva compra
    db_compra = Compra(**compra.dict())
    db.add(db_compra)
    db.commit()
    db.refresh(db_compra)
    return db_compra

@router.get("/{compra_id}", response_model=CompraInDB)
async def get_compra(
    compra_id: int, 
    db: Session = Depends(get_db)
):
    """
    Obtener una compra por ID
    """
    compra = db.query(Compra).filter(Compra.id == compra_id).first()
    if not compra:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Compra con ID {compra_id} no encontrada"
        )
    return compra

@router.put("/{compra_id}", response_model=CompraInDB)
async def update_compra(
    compra_id: int, 
    compra_update: CompraUpdate, 
    db: Session = Depends(get_db)
):
    """
    Actualizar una compra existente
    """
    db_compra = db.query(Compra).filter(Compra.id == compra_id).first()
    if not db_compra:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Compra con ID {compra_id} no encontrada"
        )
    
    # Actualizar solo los campos proporcionados
    update_data = compra_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_compra, key, value)
    
    db.commit()
    db.refresh(db_compra)
    return db_compra

@router.delete("/{compra_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_compra(
    compra_id: int, 
    db: Session = Depends(get_db)
):
    """
    Eliminar una compra
    """
    db_compra = db.query(Compra).filter(Compra.id == compra_id).first()
    if not db_compra:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Compra con ID {compra_id} no encontrada"
        )
    
    db.delete(db_compra)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/{compra_id}/completar", response_model=CompraInDB)
async def completar_compra(
    compra_id: int, 
    db: Session = Depends(get_db)
):
    """
    Marcar una compra como completada
    """
    db_compra = db.query(Compra).filter(Compra.id == compra_id).first()
    if not db_compra:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Compra con ID {compra_id} no encontrada"
        )
    
    db_compra.completada = True
    db.commit()
    db.refresh(db_compra)
    return db_compra