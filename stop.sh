#!/bin/bash
echo "Deteniendo todos los servicios del sistema de perfumería..."

# Función para matar procesos por puerto
kill_by_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "Deteniendo servicio en puerto $port (PID: $pid)"
        kill -9 $pid
    else
        echo "No hay servicios ejecutándose en puerto $port"
    fi
}

# Detener servicios por puerto
kill_by_port 8000  # API Gateway
kill_by_port 8001  # Python
kill_by_port 8002  # Java
kill_by_port 8003  # Node.js

echo "Todos los servicios han sido detenidos."