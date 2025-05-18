#!/bin/bash
# Script para iniciar el sistema completo de perfumería

echo "=== Iniciando Sistema de Perfumería ==="

# Función para verificar si un puerto está libre
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "Puerto $port ya está en uso"
        return 1
    else
        echo "Puerto $port disponible"
        return 0
    fi
}

# Verificar puertos necesarios
echo "Verificando puertos disponibles..."
check_port 8001 || echo "Advertencia: Puerto 8001 en uso"
check_port 8002 || echo "Advertencia: Puerto 8002 en uso"
check_port 8003 || echo "Advertencia: Puerto 8003 en uso"
check_port 8000 || echo "Advertencia: Puerto 8000 en uso"

# Iniciar microservicio de Clientes (Python)
echo "=== Iniciando Microservicio de Clientes (Python) en puerto 8001 ==="
cd microservicio_clientes_fastapi

# Verificar si Python3 está disponible
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "Error: Python no está instalado o no está en el PATH"
    cd ..
    exit 1
fi

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    $PYTHON_CMD -m venv venv
fi

# Activar entorno virtual
echo "Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias usando pip dentro del entorno virtual
if [ -f "requirements.txt" ]; then
    echo "Instalando dependencias de Python..."
    pip install -r requirements.txt
fi

# Ejecutar migraciones
echo "Ejecutando migraciones..."
alembic upgrade head 2>/dev/null || echo "Migraciones completadas o no necesarias"

echo "Iniciando servidor Python..."
uvicorn app.main:app --host 0.0.0.0 --port 8001 &
PYTHON_PID=$!
cd ..

# Iniciar microservicio de Proveedores (Java)
echo "=== Iniciando Microservicio de Proveedores (Java) en puerto 8002 ==="
cd microservicio_proveedores_springboot
echo "Iniciando servidor Java..."
mvn spring-boot:run &
JAVA_PID=$!
cd ..

# Iniciar microservicio de Productos (Node.js)
echo "=== Iniciando Microservicio de Productos (Node.js) en puerto 8003 ==="
cd microservicio_productos_express
if [ -f "package.json" ]; then
    echo "Instalando dependencias de Node.js..."
    npm install
fi
echo "Iniciando servidor Node.js..."
npm start &
NODE_PID=$!
cd ..

# Esperar un poco para que los microservicios se inicialicen
echo "=== Esperando que los microservicios se inicialicen... ==="
sleep 15

# Iniciar API Gateway
echo "=== Iniciando API Gateway en puerto 8000 ==="
cd api-gateway-perfumeria
if [ -f "package.json" ]; then
    echo "Instalando dependencias del API Gateway..."
    npm install
fi
echo "Iniciando API Gateway..."
npm start &
GATEWAY_PID=$!
cd ..

echo ""
echo "=== SISTEMA INICIALIZADO CORRECTAMENTE ==="
echo "Servicios disponibles:"
echo "- API Gateway (Panel de control): http://localhost:8000"
echo "- Microservicio de Clientes:     http://localhost:8001"
echo "- Microservicio de Proveedores:  http://localhost:8002"
echo "- Microservicio de Productos:    http://localhost:8003"
echo ""
echo "Para detener todos los servicios, presiona Ctrl+C"

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "Deteniendo todos los servicios..."
    
    # Desactivar entorno virtual de Python si está activo
    if [ ! -z "$VIRTUAL_ENV" ]; then
        deactivate
    fi
    
    kill $PYTHON_PID $JAVA_PID $NODE_PID $GATEWAY_PID 2>/dev/null
    echo "Servicios detenidos. ¡Hasta luego!"
    exit 0
}

# Configurar limpieza al salir
trap cleanup SIGINT SIGTERM

# Mantener el script ejecutándose
wait