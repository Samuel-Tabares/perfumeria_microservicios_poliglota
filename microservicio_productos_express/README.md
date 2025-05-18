# Microservicio de Productos (Express/Node.js)

Este microservicio gestiona el catálogo de productos de una perfumería, permitiendo crear, leer, actualizar y eliminar (CRUD) productos, categorías y promociones. Incluye una interfaz web completa para administrar estos elementos.

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de datos**: SQLite con Sequelize ORM
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Seguridad**: Helmet

## Requisitos

- Node.js (v14 o superior)
- npm (v6 o superior)

## Instalación

1. Clona el repositorio o crea la estructura de carpetas

```bash
git clone https://github.com/Samuel-Tabares/microservicio-node.js.git
# O si ya lo tienes creado:
cd microservicio_productos_express
```

2. Instala las dependencias

```bash
npm install
```

3. Configura la base de datos (opcional, por defecto usa SQLite)

El archivo `.env` puede contener:

```
NODE_ENV=development
PORT=8003
DB_DIALECT=sqlite
DB_STORAGE=./productos.sqlite
```


## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor en modo producción:

```bash
npm start
```

El servidor estará disponible en: http://localhost:8003/

## Estructura del Proyecto

```
microservicio_productos_express/
│
├── public/                # Archivos estáticos (interfaz de usuario)
│   ├── css/              # Hojas de estilo
│   ├── js/               # JavaScript del cliente
│   └── index.html        # Página principal
│
├── scripts/              # Scripts de utilidad
│
├── src/                  # Código fuente del servidor
│   ├── app.js            # Configuración de Express
│   ├── index.js          # Punto de entrada
│   ├── config/           # Configuración de la aplicación
│   ├── controllers/      # Controladores de la API
│   ├── middleware/       # Middleware personalizado
│   ├── models/           # Modelos de base de datos
│   └── routes/           # Rutas de la API
│
├── .env                  # Variables de entorno
├── package.json          # Dependencias y scripts
└── README.md             # Documentación
```

## Endpoints de la API

### Productos

- `GET /api/productos`: Obtener todos los productos
- `GET /api/productos/:id`: Obtener un producto por ID
- `POST /api/productos`: Crear un nuevo producto
- `PUT /api/productos/:id`: Actualizar un producto existente
- `DELETE /api/productos/:id`: Eliminar un producto
- `GET /api/productos/en_stock`: Obtener productos con stock disponible
- `GET /api/productos/buscar?q=término`: Buscar productos por nombre o descripción

### Categorías

- `GET /api/categorias`: Obtener todas las categorías
- `GET /api/categorias/:id`: Obtener una categoría por ID
- `POST /api/categorias`: Crear una nueva categoría
- `PUT /api/categorias/:id`: Actualizar una categoría existente
- `DELETE /api/categorias/:id`: Eliminar una categoría
- `GET /api/categorias/:id/productos`: Obtener productos de una categoría

### Promociones

- `GET /api/promociones`: Obtener todas las promociones
- `GET /api/promociones/:id`: Obtener una promoción por ID
- `POST /api/promociones`: Crear una nueva promoción
- `PUT /api/promociones/:id`: Actualizar una promoción existente
- `DELETE /api/promociones/:id`: Eliminar una promoción
- `GET /api/promociones/activas`: Obtener promociones activas

## Interfaz de Usuario

El microservicio incluye una interfaz de usuario accesible desde la raíz del servidor (http://localhost:8003/). Esta interfaz permite:

1. Ver, crear, editar y eliminar productos
2. Ver, crear, editar y eliminar categorías
3. Ver, crear, editar y eliminar promociones
4. Filtrar productos por categoría
5. Buscar productos por nombre o descripción
6. Ver solo los productos en stock

## Solución de Problemas

### Error de CORS

Si experimentas problemas de CORS, asegúrate de que la configuración en `src/app.js` esté correctamente configurada:

```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Problemas con Content Security Policy

Si hay problemas cargando scripts o estilos, verifica la configuración de Helmet:

```javascript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        // Otras directivas...
      },
    },
  })
);
```

## Desarrollo

Para añadir nuevas funcionalidades:

1. Define nuevos modelos en `src/models/`
2. Crea controladores en `src/controllers/`
3. Añade rutas en `src/routes/`
4. Si se necesita, actualiza la interfaz en `public/`

## Licencia

[MIT](LICENSE)

Creado por: Samuel Tabares stabares_26@cue.edu.co , todos los derechos reservados