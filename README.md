# Sistema de Perfumería - Arquitectura de Microservicios

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue)](https://python.org/)
[![Java](https://img.shields.io/badge/Java-17%2B-orange)](https://openjdk.org/)

Sistema integral para la gestión de una perfumería, implementado como una arquitectura completa de microservicios con API Gateway centralizado y interfaces de usuario individuales.

## 🌟 Características principales

- **Arquitectura de microservicios**: Cada componente es independiente y escalable
- **API Gateway centralizado**: Control unificado de todos los servicios
- **Interfaces de usuario web**: Cada microservicio tiene su propia interfaz amigable
- **Multi-tecnología**: Demuestra integración entre Java, Python y Node.js
- **Gestión completa**: CRUD completo para proveedores, clientes y productos
- **Inicio automático**: Scripts para inicializar todo el sistema con un comando

## 🏗️ Arquitectura del sistema

```
┌─────────────────────────┐    ┌─────────────────────────┐
│    API Gateway          │    │        Usuario          │
│   (Node.js:8000)       │◄───┤      (Navegador)        │
└─────────┬───────────────┘    └─────────────────────────┘
          │
    ┌─────▼─────┬─────────────┬─────────────┐
    │           │             │             │
┌───▼───┐   ┌───▼───┐     ┌───▼───┐     ┌───▼───┐
│Client │   │Provee │     │Produc │     │ Static│
│Python │   │Java   │     │Node.js│     │ Files │
│:8001  │   │:8002  │     │:8003  │     │       │
└─┬─────┘   └─┬─────┘     └─┬─────┘     └───────┘
  │           │             │
┌─▼─────┐   ┌─▼─────┐     ┌─▼─────┐
│SQLite │   │ H2    │     │SQLite │
│  DB   │   │  DB   │     │  DB   │
└───────┘   └───────┘     └───────┘
```

## 🚀 Tecnologías utilizadas

| Componente | Tecnología | Puerto | Base de datos |
|-----------|-----------|---------|---------------|
| **API Gateway** | Node.js + Express | 8000 | - |
| **Microservicio de Clientes** | Python + FastAPI | 8001 | SQLite |
| **Microservicio de Proveedores** | Java + Spring Boot | 8002 | H2 Database |
| **Microservicio de Productos** | Node.js + Express | 8003 | SQLite |

### Librerías y herramientas adicionales

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Bootstrap
- **Documentación**: Swagger/OpenAPI en cada microservicio
- **Migraciones**: Alembic (Python), JPA/Hibernate (Java), Sequelize (Node.js)
- **Contenedorización**: Docker y Docker Compose
- **Gestión de dependencias**: Maven (Java), pip (Python), npm (Node.js)

## 📋 Requisitos del sistema

- **Node.js** v14.0 o superior
- **Python** 3.9 o superior 
- **Java Development Kit (JDK)** 17 o superior
- **Maven** 3.8 o superior
- **Git** (para clonar el repositorio)
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)

### Verificar instalaciones

```bash
# Verificar Node.js
node --version

# Verificar Python
python3 --version

# Verificar Java
java --version

# Verificar Maven
mvn --version
```

## ⚡ Inicio rápido

### Opción 1: Instalación automática (Recomendada)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Samuel-Tabares/sistema-perfumeria.git
cd sistema-perfumeria

# 2. Ejecutar el script de inicio
chmod +x start.sh
./start.sh
```

**¡Eso es todo!** 🎉 El script iniciará automáticamente:
- Todos los microservicios (puertos 8001, 8002, 8003)
- El API Gateway (puerto 8000)
- Todos aparecerán como **ACTIVOS** en el dashboard

### Acceso inmediato

Una vez ejecutado el script, accede directamente a:
- **Panel Principal**: [http://localhost:8000](http://localhost:8000) - Control de todo el sistema
- **Clientes**: [http://localhost:8001](http://localhost:8001) - Gestión de clientes
- **Proveedores**: [http://localhost:8002](http://localhost:8002) - Gestión de proveedores  
- **Productos**: [http://localhost:8003](http://localhost:8003) - Gestión de productos

### Opción 2: Instalación manual

```bash
# 1. Clonar el repositorio
git clone https://github.com/Samuel-Tabares/sistema-perfumeria.git
cd sistema-perfumeria

# 2. Iniciar cada microservicio manualmente

# Microservicio de Clientes (Python)
cd microservicio_clientes_fastapi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8001 &
cd ..

# Microservicio de Proveedores (Java)
cd microservicio_proveedores_springboot
mvn spring-boot:run &
cd ..

# Microservicio de Productos (Node.js)
cd microservicio_productos_express
npm install
npm start &
cd ..

# API Gateway (se iniciará último para detectar los servicios activos)
cd api-gateway-perfumeria
npm install
npm start &
cd ..
```

## 🚀 Inicio automático con un comando

```bash
# Solo necesitas ejecutar:
./start.sh

# Y obtendrás:
✅ Todos los microservicios iniciados automáticamente
✅ API Gateway funcionando y detectando los servicios
✅ Dashboard mostrando todos los servicios como ACTIVOS
✅ Acceso inmediato a todas las interfaces
```

## 🛑 Detener el sistema

### Opción 1: Desde el Dashboard (Recomendada)
1. Ve a [http://localhost:8000](http://localhost:8000)
2. Haz clic en **"Detener Todos los Servicios"**
3. Confirma la acción
4. El sistema se cerrará completamente

### Opción 2: Desde Terminal
Presiona `Ctrl+C` en la terminal donde ejecutaste `./start.sh`

### Opción 3: Script Manual
```bash
# Ejecutar script de detención
./stop.sh
```

## 🖥️ Uso del sistema

### 🎛️ Panel de Control (API Gateway)

El **Panel Principal** en [http://localhost:8000](http://localhost:8000) ofrece:

#### Controles Globales
- **Iniciar Todos**: Inicia automáticamente todos los microservicios
- **Detener Todos**: Cierra completamente el sistema (equivale a Ctrl+C)
- **Actualizar Estado**: Verifica el estado actual de todos los servicios

#### Información de Servicios
Cada tarjeta de microservicio muestra:
- **Estado**: Activo (verde) o Inactivo (rojo)
- **Tecnología utilizada**: Java, Python o Node.js
- **Puerto de ejecución**: 8001, 8002 o 8003
- **Botón "Ir a la interfaz"**: Acceso directo al microservicio (solo si está activo)

#### Características Especiales
- **Detección automática**: El dashboard detecta servicios que ya están en ejecución
- **Actualización en tiempo real**: El estado se actualiza automáticamente cada 30 segundos
- **Estado del sistema**: Indicador que muestra si todos los servicios están funcionando

### 🚀 Gestión de Servicios

1. **Inicio automático**: Al ejecutar `./start.sh`, todos los servicios se inician y aparecen activos
2. **Control centralizado**: Usa el panel para iniciar o detener todos los servicios
3. **Acceso directo**: Haz clic en "Ir a la interfaz" para acceder a cada microservicio
4. **Apagado completo**: El botón "Detener Todos" cierra todo el sistema de forma segura

### APIs y documentación

| Servicio | API Docs | Health Check |
|----------|----------|--------------|
| **Clientes** | [http://localhost:8001/docs](http://localhost:8001/docs) | [http://localhost:8001/health](http://localhost:8001/health) |
| **Proveedores** | [http://localhost:8002/swagger-ui](http://localhost:8002/swagger-ui) | [http://localhost:8002/health](http://localhost:8002/health) |
| **Productos** | [http://localhost:8003/api-docs](http://localhost:8003/api-docs) | [http://localhost:8003/health](http://localhost:8003/health) |

## 🎯 Funcionalidades

### 🎛️ API Gateway (Puerto 8000)
- Panel de control centralizado y simplificado
- Inicio/parada global de todos los microservicios con un solo clic
- Detección automática de servicios ya en ejecución
- Monitorización del estado de cada servicio en tiempo real
- Navegación directa a cada interfaz de microservicio
- Sistema de apagado completo (equivalente a Ctrl+C)

### 👥 Microservicio de Clientes (Puerto 8001)
- ✅ Registro y gestión de clientes
- ✅ Historial de compras por cliente
- ✅ Gestión de compras individuales
- ✅ Marcar compras como completadas
- ✅ Clientes activos/inactivos

### 🏢 Microservicio de Proveedores (Puerto 8002)
- ✅ Gestión de proveedores
- ✅ Catálogo de suministros por proveedor
- ✅ Control de precios y tiempos de entrega
- ✅ Proveedores activos/inactivos
- ✅ Relación proveedor-suministros

### 📦 Microservicio de Productos (Puerto 8003)
- ✅ Catálogo de productos
- ✅ Gestión de categorías
- ✅ Control de inventario
- ✅ Productos activos/inactivos
- ✅ Organización por categorías

## 📁 Estructura del proyecto

```
sistema-perfumeria/
├── 📁 api-gateway-perfumeria/           # API Gateway (Node.js)
│   ├── public/                          # Archivos estáticos (CSS, JS)
│   ├── views/                           # Plantillas EJS
│   ├── microservices.js                 # Gestión de microservicios
│   ├── server.js                        # Servidor principal
│   └── package.json                     # Dependencias Node.js
├── 📁 microservicio_clientes_fastapi/   # Microservicio de Clientes (Python)
│   ├── app/                             # Código fuente Python
│   ├── alembic/                         # Migraciones de BD
│   ├── static/                          # Interfaz web
│   ├── requirements.txt                 # Dependencias Python
│   └── README.md                        # Documentación específica
├── 📁 microservicio_proveedores_springboot/ # Microservicio de Proveedores (Java)
│   ├── src/                             # Código fuente Java
│   ├── src/main/resources/static/       # Interfaz web
│   ├── pom.xml                          # Configuración Maven
│   └── README.md                        # Documentación específica
├── 📁 microservicio_productos_express/  # Microservicio de Productos (Node.js)
│   ├── src/                             # Código fuente Node.js
│   ├── public/                          # Interfaz web
│   ├── package.json                     # Dependencias Node.js
│   └── README.md                        # Documentación específica
├── 📄 start.sh                          # Script de inicio para macOS/Linux
├── 📄 start.bat                         # Script de inicio para Windows
├── 📄 stop.sh                           # Script de parada para macOS/Linux
├── 📄 stop.bat                          # Script de parada para Windows
├── 📄 docker-compose.yml                # Configuración Docker
└── 📄 README.md                         # Este archivo
```

## 🔧 Configuración avanzada

### Orden de inicio recomendado

Para el funcionamiento óptimo del sistema:

1. **Primero**: Microservicios (en cualquier orden)
   - Python (puerto 8001)
   - Java (puerto 8002)  
   - Node.js (puerto 8003)

2. **Después**: API Gateway (puerto 8000)
   - Detectará automáticamente los servicios ya en ejecución
   - Los mostrará como activos en el dashboard

### Detección automática de servicios

El API Gateway verifica automáticamente:
- Qué puertos están en uso (8001, 8002, 8003)
- Si hay servicios ejecutándose en esos puertos
- Actualiza el estado de cada servicio en el dashboard

### Scripts de automatización

#### start.sh
- Instala dependencias automáticamente
- Inicia todos los servicios en el orden correcto
- Verifica que cada servicio esté listo antes de continuar
- Muestra estado detallado de cada paso

#### Detener el sistema
Hay varias formas de detener el sistema:

1. **Desde el dashboard**: Botón "Detener Todos" (recomendado)
2. **Desde terminal**: Ctrl+C en la terminal donde ejecutaste `./start.sh`
3. **Script manual**: `./stop.sh` (detiene por puertos)

### Variables de entorno

Cada microservicio puede configurarse mediante variables de entorno:

#### API Gateway (.env)
```env
PORT=8000
JAVA_SERVICE_URL=http://localhost:8002
PYTHON_SERVICE_URL=http://localhost:8001
NODE_SERVICE_URL=http://localhost:8003
```

#### Microservicio Python (.env)
```env
DATABASE_URL=sqlite:///./clientes.db
SECRET_KEY=your-secret-key
DEBUG=True
SERVICE_PORT=8001
```

#### Microservicio Java (application.properties)
```properties
server.port=8002
spring.datasource.url=jdbc:h2:file:./proveedores_db
spring.jpa.hibernate.ddl-auto=update
```

### Puertos personalizados

Para cambiar los puertos predeterminados:

1. Modifica los archivos de configuración de cada microservicio
2. Actualiza el archivo `.env` del API Gateway
3. Reinicia los servicios

## 🛠️ Desarrollo

### Estructura de desarrollo

Cada microservicio es independiente y puede desarrollarse por separado:

```bash
# Trabajar solo en el microservicio de clientes
cd microservicio_clientes_fastapi
source venv/bin/activate
uvicorn app.main:app --reload --port 8001

# Trabajar solo en el microservicio de proveedores
cd microservicio_proveedores_springboot
mvn spring-boot:run

# Trabajar solo en el microservicio de productos
cd microservicio_productos_express
npm run dev
```

### Añadir nuevas funcionalidades

1. **Nuevos endpoints**: Añadir en los archivos de rutas correspondientes
2. **Nuevos modelos**: Crear migraciones de base de datos
3. **Nueva UI**: Modificar los archivos HTML, CSS y JS en cada interfaz
4. **Nuevos microservicios**: Seguir el patrón existente y registrar en el API Gateway

## 🧪 Testing

```bash
# Tests del API Gateway
cd api-gateway-perfumeria
npm test

# Tests del microservicio Python
cd microservicio_clientes_fastapi
python -m pytest

# Tests del microservicio Java
cd microservicio_proveedores_springboot
mvn test

# Tests del microservicio Node.js
cd microservicio_productos_express
npm test
```

## 🐳 Despliegue

### Despliegue local con Docker

```bash
# Construir todas las imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d

# Ver logs de todos los servicios
docker-compose logs -f

# Detener todos los servicios
docker-compose down
```

### Despliegue en producción

Para produción, considera:

1. **Base de datos**: Migrar de SQLite/H2 a PostgreSQL o MySQL
2. **Contenedorización**: Usar Docker para cada microservicio
3. **Load Balancer**: Nginx o similar para el API Gateway
4. **Monitorización**: Implementar logging centralizado
5. **Seguridad**: Añadir autenticación y HTTPS

## 🔍 Solución de problemas

### Problemas comunes

**Puerto ya en uso**
```bash
# Ver qué proceso usa el puerto
lsof -i :8000

# Terminar proceso por puerto
kill -9 $(lsof -t -i:8000)
```

**Error de dependencias Python**
```bash
# Recrear entorno virtual
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Error de Maven (Java)**
```bash
# Limpiar y recompilar
mvn clean install
mvn spring-boot:run
```

**Error de npm (Node.js)**
```bash
# Limpiar cache e instalar
npm cache clean --force
rm -rf node_modules
npm install
```

### Logs y depuración

Cada microservicio genera logs que puedes consultar:

- **API Gateway**: Consola donde se ejecuta `npm start`
- **Python**: Logs de uvicorn y FastAPI
- **Java**: Logs de Spring Boot en consola
- **Node.js**: Logs de Express en consola

## 📚 Documentación adicional

- [Documentación del API Gateway](./api-gateway-perfumeria/README.md)
- [Documentación de Clientes](./microservicio_clientes_fastapi/README.md)
- [Documentación de Proveedores](./microservicio_proveedores_springboot/README.md)
- [Documentación de Productos](./microservicio_productos_express/README.md)

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama para nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de código

- **Python**: Seguir PEP 8
- **Java**: Seguir Google Java Style Guide
- **JavaScript**: Seguir StandardJS
- **Commits**: Usar Conventional Commits

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👤 Autor

**Samuel Tabares**
- Email: stabares_26@cue.edu.co
- GitHub: [@Samuel-Tabares](https://github.com/Samuel-Tabares)

## 🙏 Agradecimientos

- Universidad CUE por el apoyo en este proyecto académico
- Comunidades de Spring Boot, FastAPI y Express.js
- Todos los contribuidores y testers del proyecto

---

⭐ Si este proyecto te ha sido útil, ¡considera darle una estrella en GitHub!

📧 Para soporte o preguntas, no dudes en contactar a stabares_26@cue.edu.co