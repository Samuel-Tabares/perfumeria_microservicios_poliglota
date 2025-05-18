const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Crear la aplicación Express
const app = express();

// Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "localhost:*"],
        fontSrc: ["'self'", "cdn.jsdelivr.net"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  })
); // Seguridad
app.use(morgan('dev')); // Logging
app.use(cors()); // CORS
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded

// Servir archivos estáticos desde /public
app.use(express.static('public'));

// Ruta raíz que sirve la interfaz web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rutas
app.use('/api', routes);

// Endpoint de salud
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'productos-service',
    timestamp: new Date()
  });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;