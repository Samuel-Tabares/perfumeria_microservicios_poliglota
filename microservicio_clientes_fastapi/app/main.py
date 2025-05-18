from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse


from app.routes import cliente, compra, health
from app.core.config import settings
from app.database.database import engine, Base

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Inicializar la aplicación FastAPI
app = FastAPI(
    title="Microservicio de Clientes",
    description="API para gestionar clientes y sus compras",
    version="1.0.0",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, limitar a dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(cliente.router, prefix="/api/clientes", tags=["clientes"])
app.include_router(compra.router, prefix="/api/compras", tags=["compras"])
app.include_router(health.router, tags=["health"])

# Montar archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", tags=["root"])
async def root():
    """
    Endpoint raíz que redirige al index.html
    """
    return RedirectResponse(url="/static/index.html")