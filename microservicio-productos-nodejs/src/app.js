const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Crear la app Express
const app = express();
const PORT = process.env.PORT || 8003;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const categoriasRoutes = require('./routes/categorias.routes');
const productosRoutes = require('./routes/productos.routes');
const promocionesRoutes = require('./routes/promociones.routes');

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/promociones', promocionesRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'productos-service' });
});

// Ruta raíz para API
app.get('/api', (req, res) => {
  res.json({
    message: 'API de Productos funcionando',
    endpoints: [
      '/api/categorias',
      '/api/productos',
      '/api/promociones'
    ]
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'Microservicio de Productos en Node.js' });
});

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Recurso no encontrado',
    path: req.originalUrl
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Microservicio de Productos ejecutándose en puerto ${PORT}`);
});

module.exports = app;