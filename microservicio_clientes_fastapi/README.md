# Microservicio de Clientes - FastAPI

Microservicio para gestionar clientes y sus compras en un sistema de perfumería. Implementado con FastAPI, SQLAlchemy y SQLite.

## Tecnologías

- **Python 3.9+** - Lenguaje de programación
- **FastAPI** - Framework web moderno y de alto rendimiento
- **SQLite** - Base de datos ligera
- **SQLAlchemy** - ORM para interactuar con la base de datos
- **Alembic** - Herramienta de migración de base de datos
- **Pydantic** - Validación de datos y configuración
- **uvicorn** - Servidor ASGI para Python

## Características

- ✅ API RESTful para gestionar clientes y compras
- ✅ Interfaz de usuario web integrada
- ✅ Documentación automática (Swagger UI)
- ✅ Validación y serialización de datos
- ✅ Migraciones de base de datos
- ✅ Verificación de estado del servicio
- ✅ Contenedorización con Docker

## Estructura del proyecto

```
microservicio-clientes/
├── alembic/                  # Configuración y scripts de migración
│   ├── versions/             # Versiones de migración
│   ├── env.py                # Entorno de alembic
│   └── script.py.mako        # Plantilla de script
├── app/                      # Código fuente de la aplicación
│   ├── core/                 # Configuración central
│   │   └── config.py         # Configuración de la aplicación
│   ├── database/             # Configuración de base de datos
│   │   └── database.py       # Conexión a la base de datos
│   ├── models/               # Modelos de datos
│   │   └── models.py         # Definición de entidades
│   ├── routes/               # Controladores API
│   │   ├── cliente.py        # Endpoints de clientes
│   │   ├── compra.py         # Endpoints de compras
│   │   └── health.py         # Endpoint de salud
│   ├── schemas/              # Esquemas de validación
│   │   └── schemas.py        # Esquemas Pydantic
│   └── main.py               # Punto de entrada de la aplicación
├── static/                   # Archivos estáticos para la interfaz web
│   ├── css/                  # Estilos CSS
│   │   └── styles.css        # Archivo de estilos principal
│   ├── js/                   # Scripts JavaScript
│   │   ├── clientes.js       # Lógica para gestión de clientes
│   │   └── compras.js        # Lógica para gestión de compras
│   ├── index.html            # Página principal
│   ├── clientes.html         # Página de gestión de clientes
│   └── compras.html          # Página de gestión de compras
├── .env                      # Variables de entorno
├── alembic.ini               # Configuración de alembic
├── Dockerfile                # Configuración para Docker
├── requirements.txt          # Dependencias de Python
└── README.md                 # Este archivo
```

## Instalación y ejecución

### Configuración del entorno

1. **Clonar el repositorio e instalar dependencias**

```bash
# Clonar el repositorio
git clone https://github.com/Samuel-Tabares/microservicio-python.git
cd microservicio_clientes_fastapi

# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

2. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
SECRET_KEY=tu-clave-secreta-aqui
DEBUG=True
SERVICE_PORT=8001
DATABASE_URL=sqlite:///./clientes.db
```

### Inicialización de la base de datos

```bash
# Ejecutar migraciones para crear la estructura de la base de datos
alembic upgrade head
```

### Ejecutar el servicio

```bash
# Iniciar el servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### Usando Docker

```bash
# Construir la imagen
docker build -t perfumeria/clientes-service .

# Ejecutar el contenedor
docker run -p 8001:8001 perfumeria/clientes-service
```

## Acceso a la aplicación

Una vez iniciado el servidor, puedes acceder a los siguientes recursos:

- **Interfaz web**: http://localhost:8001/
- **API REST**: http://localhost:8001/api/clientes
- **Documentación API**: http://localhost:8001/docs
- **Verificación de salud**: http://localhost:8001/health

## API Endpoints

### Clientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/clientes | Listar todos los clientes |
| POST   | /api/clientes | Crear cliente |
| GET    | /api/clientes/{id} | Obtener cliente por ID |
| PUT    | /api/clientes/{id} | Actualizar cliente |
| DELETE | /api/clientes/{id} | Eliminar cliente |
| GET    | /api/clientes/activos | Listar clientes activos |

### Compras

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/compras | Listar todas las compras |
| POST   | /api/compras | Crear compra |
| GET    | /api/compras/{id} | Obtener compra por ID |
| PUT    | /api/compras/{id} | Actualizar compra |
| DELETE | /api/compras/{id} | Eliminar compra |
| POST   | /api/compras/{id}/completar | Marcar compra como completada |

## Modelo de datos

### Cliente

```python
id: Integer (PK)
nombre: String
apellido: String
email: String (unique)
telefono: String (optional)
direccion: Text (optional)
fecha_registro: DateTime
activo: Boolean
compras: List[Compra]
```

### Compra

```python
id: Integer (PK)
cliente_id: Integer (FK)
fecha_compra: DateTime
total: Decimal
completada: Boolean
cliente: Cliente
```

## Desarrollo

### Crear una nueva migración

Después de cambiar los modelos, genera una nueva migración con:

```bash
alembic revision --autogenerate -m "descripción del cambio"
```

### Ejecutar pruebas

```bash
# TODO: Agregar pruebas
```

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo [MIT License](https://opensource.org/licenses/MIT).

## Contacto

Samuel Tabares - stabares_26@cue.edu.co