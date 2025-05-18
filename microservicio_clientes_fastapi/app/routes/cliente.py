from fastapi import APIRouter, Depends, HTTPException, Response, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.models.models import Cliente
from app.schemas.schemas import ClienteCreate, ClienteUpdate, ClienteSimple, ClienteWithCompras

router = APIRouter()

@router.get("/", response_model=List[ClienteSimple])
async def get_clientes(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Obtener la lista de clientes
    """
    clientes = db.query(Cliente).offset(skip).limit(limit).all()
    return clientes

@router.post("/", response_model=ClienteWithCompras, status_code=status.HTTP_201_CREATED)
async def create_cliente(
    cliente: ClienteCreate, 
    db: Session = Depends(get_db)
):
    """
    Crear un nuevo cliente
    """
    # Verificar si ya existe un cliente con el mismo email
    db_cliente = db.query(Cliente).filter(Cliente.email == cliente.email).first()
    if db_cliente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un cliente con el email '{cliente.email}'"
        )
    
    # Crear el nuevo cliente
    db_cliente = Cliente(**cliente.dict())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

@router.get("/{cliente_id}", response_model=ClienteWithCompras)
async def get_cliente(
    cliente_id: int, 
    db: Session = Depends(get_db)
):
    """
    Obtener un cliente por ID
    """
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente con ID {cliente_id} no encontrado"
        )
    return cliente

@router.put("/{cliente_id}", response_model=ClienteWithCompras)
async def update_cliente(
    cliente_id: int, 
    cliente_update: ClienteUpdate, 
    db: Session = Depends(get_db)
):
    """
    Actualizar un cliente existente
    """
    db_cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not db_cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente con ID {cliente_id} no encontrado"
        )
    
    # Actualizar solo los campos proporcionados
    update_data = cliente_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_cliente, key, value)
    
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

@router.delete("/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cliente(
    cliente_id: int, 
    db: Session = Depends(get_db)
):
    """
    Eliminar un cliente
    """
    db_cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not db_cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente con ID {cliente_id} no encontrado"
        )
    
    db.delete(db_cliente)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/activos/", response_model=List[ClienteSimple])
async def get_clientes_activos(db: Session = Depends(get_db)):
    """
    Obtener solo clientes activos
    """
    clientes_activos = db.query(Cliente).filter(Cliente.activo == True).all()
    return clientes_activos