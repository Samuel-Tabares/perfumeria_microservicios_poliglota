from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base

class Cliente(Base):
    """
    Modelo de Cliente para la base de datos
    """
    __tablename__ = "clientes"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    telefono = Column(String(15), nullable=True)
    direccion = Column(Text, nullable=True)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    activo = Column(Boolean, default=True)
    
    # Relación con Compra
    compras = relationship("Compra", back_populates="cliente", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Cliente {self.nombre} {self.apellido}>"

class Compra(Base):
    """
    Modelo de Compra para la base de datos
    """
    __tablename__ = "compras"
    
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id", ondelete="CASCADE"), nullable=False)
    fecha_compra = Column(DateTime(timezone=True), server_default=func.now())
    total = Column(Numeric(10, 2), nullable=False)
    completada = Column(Boolean, default=False)
    
    # Relación con Cliente
    cliente = relationship("Cliente", back_populates="compras")
    
    def __repr__(self):
        return f"<Compra {self.id} de Cliente {self.cliente_id}>"