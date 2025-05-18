# Microservicio de Proveedores - Sistema de Perfumería

Este microservicio forma parte de un sistema para la gestión de una perfumería, encargándose específicamente de la administración de proveedores y sus suministros.

## Descripción

Este componente permite gestionar toda la información relacionada con los proveedores de materias primas para la fabricación de perfumes, incluyendo:

- Gestión de proveedores (datos de contacto, ubicación, etc.)
- Catálogo de suministros ofrecidos por cada proveedor
- Tiempos de entrega y precios unitarios

El microservicio incluye tanto una API RESTful como una interfaz de usuario HTML/CSS/JavaScript que permite a usuarios no técnicos gestionar la información de manera fácil e intuitiva directamente desde el navegador.

## Tecnologías utilizadas

- **Java 17**
- **Spring Boot 3.2.4**
- **JPA / Hibernate** - Para la persistencia de datos
- **H2 Database** - Base de datos embebida para desarrollo
- **HTML/CSS/JavaScript** - Interfaz de usuario
- **Fetch API** - Comunicación con el backend desde el frontend
- **Maven** - Gestión de dependencias y construcción
- **Swagger/OpenAPI** - Documentación de la API
- **Docker** - Contenedorización (incluye Dockerfile)
- **Lombok** - Reducción de código boilerplate

## Estructura del proyecto

```
microservicio_proveedores_springboot/
├── src/main/java/com/perfumeria/proveedores/
│   ├── config/           # Configuraciones (CORS, etc.)
│   ├── controller/       # Controladores REST
│   ├── dto/              # Objetos de transferencia de datos
│   ├── exception/        # Manejo de excepciones
│   ├── model/            # Entidades JPA
│   ├── repository/       # Repositorios Spring Data JPA
│   ├── service/          # Lógica de negocio
│   └── ProveedoresApplication.java  # Punto de entrada
├── src/main/resources/
│   ├── static/           # Recursos web estáticos
│   │   ├── css/          # Hojas de estilo
│   │   ├── js/           # Scripts JavaScript
│   │   ├── index.html    # Página principal
│   │   ├── proveedores.html # Gestión de proveedores
│   │   └── suministros.html # Gestión de suministros
│   ├── application.properties      # Configuración principal
│   ├── application-dev.properties  # Configuración para desarrollo
│   ├── application-prod.properties # Configuración para producción
│   └── data.sql                    # Datos iniciales
├── src/test/             # Pruebas unitarias e integración
├── Dockerfile            # Configuración para Docker
├── .gitignore            # Archivos ignorados por Git
├── pom.xml               # Dependencias y configuración de Maven
└── README.md             # Este archivo
```

## API REST

El microservicio expone las siguientes APIs:

### Proveedores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/proveedores | Obtener todos los proveedores |
| GET    | /api/proveedores/{id} | Obtener un proveedor por ID |
| POST   | /api/proveedores | Crear un nuevo proveedor |
| PUT    | /api/proveedores/{id} | Actualizar un proveedor existente |
| DELETE | /api/proveedores/{id} | Eliminar un proveedor |
| GET    | /api/proveedores/activos | Obtener todos los proveedores activos |
| GET    | /api/proveedores/{id}/suministros | Obtener suministros de un proveedor |

### Suministros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/suministros | Obtener todos los suministros |
| GET    | /api/suministros/{id} | Obtener un suministro por ID |
| POST   | /api/suministros | Crear un nuevo suministro |
| PUT    | /api/suministros/{id} | Actualizar un suministro existente |
| DELETE | /api/suministros/{id} | Eliminar un suministro |
| GET    | /api/suministros/por-tiempo-entrega | Obtener suministros ordenados por tiempo de entrega |

## Requisitos

- Java JDK 17 o superior
- Maven 3.8+ (o usar el wrapper incluido)
- Docker (opcional, para contenedorización)

## Instalación y ejecución

### Usando Maven directamente

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd microservicio_proveedores_springboot

# Compilar el proyecto
./mvnw clean package

# Ejecutar la aplicación
./mvnw spring-boot:run
# o
mvn spring-boot:run
```

### Usando Docker

```bash
# Construir la imagen
docker build -t perfumeria/proveedores-service .

# Ejecutar el contenedor
docker run -p 8002:8002 perfumeria/proveedores-service
```

## Configuración

La aplicación puede configurarse a través de los archivos de propiedades en `src/main/resources/`:

- `application.properties`: Configuración general
- `application-dev.properties`: Configuración para desarrollo
- `application-prod.properties`: Configuración para producción

### Propiedades importantes

```properties
# Puerto del servidor
server.port=8002

# Configuración de la base de datos
spring.datasource.url=jdbc:h2:file:./proveedores_db
spring.datasource.username=sa
spring.datasource.password=password

# Configuración de JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Inicialización de datos
spring.sql.init.mode=never

# Consola H2 (solo para desarrollo)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

## Acceso a herramientas

- **Interfaz de Usuario**: http://localhost:8002/ (página principal)
- **Gestión de Proveedores**: http://localhost:8002/proveedores.html
- **Gestión de Suministros**: http://localhost:8002/suministros.html
- **API REST**: http://localhost:8002/api/proveedores y http://localhost:8002/api/suministros
- **Swagger/OpenAPI UI**: http://localhost:8002/swagger-ui
- **H2 Console**: http://localhost:8002/h2-console

## Modelo de datos

### Proveedor

```
id: Long (PK)
nombreEmpresa: String
contactoNombre: String
contactoEmail: String
telefono: String
direccion: String
fechaRegistro: LocalDateTime
activo: Boolean
suministros: List<Suministro>
```

### Suministro

```
id: Long (PK)
proveedor: Proveedor (FK)
productoNombre: String
productoCodigo: String
precioUnitario: BigDecimal
tiempoEntregaDias: Integer
```

## Estado del Desarrollo

El microservicio está completamente funcional y cuenta con:

- ✅ Operaciones CRUD para proveedores y suministros
- ✅ Validación de datos
- ✅ Manejo de excepciones personalizado
- ✅ Documentación API con Swagger
- ✅ Datos de ejemplo precargados
- ✅ Soporte para Docker
- ✅ Interfaz de usuario web para gestión sin conocimientos técnicos
- ✅ Persistencia de datos entre reinicios del servidor

## Interfaz de Usuario

El sistema incluye una interfaz de usuario web integrada que permite a usuarios sin conocimientos técnicos gestionar fácilmente los proveedores y suministros:

### Funcionalidades principales

- **Página de inicio**: Navegación rápida a las principales secciones del sistema
- **Gestión de proveedores**: 
  - Listado de todos los proveedores
  - Creación de nuevos proveedores
  - Edición de proveedores existentes
  - Eliminación de proveedores
- **Gestión de suministros**:
  - Listado de todos los suministros
  - Creación de nuevos suministros
  - Edición de suministros existentes
  - Eliminación de suministros

### Tecnologías Frontend

- HTML5 para la estructura
- CSS3 para el diseño y estilos
- JavaScript (Vanilla) para la interactividad
- Fetch API para la comunicación con el backend

### Acceso

Accede a través de las siguientes URLs una vez iniciado el servidor:

- **Inicio**: http://localhost:8002/
- **Proveedores**: http://localhost:8002/proveedores.html
- **Suministros**: http://localhost:8002/suministros.html

## Próximas mejoras

- [ ] Implementar autenticación y autorización
- [ ] Implementar un sistema de notificaciones
- [ ] Implementar estadísticas y reportes

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

---

Desarrollado por Samuel Tabares © 2025