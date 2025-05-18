@echo off
echo === Iniciando Sistema de Perfumeria ===

REM Verificar si los directorios existen
if not exist "microservicio_clientes_fastapi" (
    echo Error: No se encontro el directorio microservicio_clientes_fastapi
    pause
    exit /b 1
)

if not exist "microservicio_proveedores_springboot" (
    echo Error: No se encontro el directorio microservicio_proveedores_springboot
    pause
    exit /b 1
)

if not exist "microservicio_productos_express" (
    echo Error: No se encontro el directorio microservicio_productos_express
    pause
    exit /b 1
)

if not exist "api-gateway-perfumeria" (
    echo Error: No se encontro el directorio api-gateway-perfumeria
    pause
    exit /b 1
)

REM Iniciar microservicio de Clientes (Python)
echo === Iniciando Microservicio de Clientes (Python) en puerto 8001 ===
cd microservicio_clientes_fastapi
start "Clientes-Python" cmd /k "python -m venv venv && venv\Scripts\activate && pip3 install -r requirements.txt && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8001"
cd ..

REM Esperar un poco
timeout /t 5 /nobreak

REM Iniciar microservicio de Proveedores (Java)
echo === Iniciando Microservicio de Proveedores (Java) en puerto 8002 ===
cd microservicio_proveedores_springboot
start "Proveedores-Java" cmd /k "mvn spring-boot:run"
cd ..

REM Esperar un poco
timeout /t 5 /nobreak

REM Iniciar microservicio de Productos (Node.js)
echo === Iniciando Microservicio de Productos (Node.js) en puerto 8003 ===
cd microservicio_productos_express
start "Productos-Node" cmd /k "npm install && npm start"
cd ..

REM Esperar un poco
timeout /t 5 /nobreak

REM Iniciar API Gateway
echo === Iniciando API Gateway en puerto 8000 ===
cd api-gateway-perfumeria
start "API-Gateway" cmd /k "npm install && npm start"
cd ..

echo.
echo === SISTEMA INICIALIZADO CORRECTAMENTE ===
echo Servicios disponibles:
echo - API Gateway (Panel de control): http://localhost:8000
echo - Microservicio de Clientes:     http://localhost:8001
echo - Microservicio de Proveedores:  http://localhost:8002
echo - Microservicio de Productos:    http://localhost:8003
echo.
echo Presiona cualquier tecla para continuar...

pause