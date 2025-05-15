const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

// Cargar variables de entorno
dotenv.config();

// Configurar logger
const logger = require('./middleware/logger.middleware');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 8000;

// Determinar si estamos en Docker o en desarrollo local
const isDocker = process.env.NODE_ENV === 'docker';

// URLs de los servicios según entorno
const CLIENTES_URL = isDocker 
  ? process.env.CLIENTES_SERVICE_URL 
  : process.env.LOCAL_CLIENTES_SERVICE_URL || 'http://localhost:8001';

const PROVEEDORES_URL = isDocker 
  ? process.env.PROVEEDORES_SERVICE_URL 
  : process.env.LOCAL_PROVEEDORES_SERVICE_URL || 'http://localhost:8002';

const PRODUCTOS_URL = isDocker 
  ? process.env.PRODUCTOS_SERVICE_URL 
  : process.env.LOCAL_PRODUCTOS_SERVICE_URL || 'http://localhost:8003';

// Middleware básico
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// Logging middleware
app.use(logger);

// Opciones de proxy comunes
const proxyOptions = {
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  logLevel: 'silent'
};


// Añadir esta redirección para la interfaz de clientes
app.use('/cliente-interface', createProxyMiddleware({
  ...proxyOptions,
  target: CLIENTES_URL,
  pathRewrite: {
    '^/cliente-interface': '/interface'
  }
}));
// Configuración de rutas de proxy para cada microservicio
app.use('/api/clientes', createProxyMiddleware({
  ...proxyOptions,
  target: CLIENTES_URL,
  pathRewrite: {
    // Cambia esto para que apunte correctamente a la API de clientes
    '^/api/clientes': '/api/clientes'  // Sin cambios en el path
  }
}));

app.use('/api/proveedores', createProxyMiddleware({
  ...proxyOptions,
  target: PROVEEDORES_URL,
  pathRewrite: {
    '^/api/proveedores': '/api/proveedores'  // Mantener la ruta para Spring Boot
  }
}));

app.use('/api/productos', createProxyMiddleware({
  ...proxyOptions,
  target: PRODUCTOS_URL,
  pathRewrite: {
    '^/api/productos': '/api/productos'  // Mantener la ruta para Express
  }
}));

// Dashboard y estado de servicios
app.get('/', async (req, res) => {
  const serviceDiscovery = require('./utils/service-discovery');
  const services = await serviceDiscovery.checkServicesHealth();
  
  // Crear el HTML para cada servicio
  const serviceCards = services.map(service => {
    return `
      <div class="service-card">
        <div class="service-header">
          <h2>${service.name}</h2>
          <span class="status ${service.status === 'UP' ? 'up' : 'down'}"></span>
        </div>
        <p class="language">Lenguaje: ${service.language}</p>
        <p>Estado: ${service.status}</p>
        <div class="endpoints">
          <div class="endpoint">URL: <a href="${service.url}" target="_blank">${service.url}</a></div>
          ${service.api ? `<div class="endpoint">API: <a href="${service.api}" target="_blank">${service.api}</a></div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  const dashboardHtml = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfumería - Dashboard de Microservicios</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
      h1 { color: #333; }
      .container { max-width: 1000px; margin: 0 auto; }
      .services { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px; }
      .service-card { 
        border: 1px solid #ddd; 
        border-radius: 8px; 
        padding: 20px; 
        width: 280px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .service-header { display: flex; justify-content: space-between; align-items: center; }
      .status { 
        display: inline-block; 
        width: 12px; 
        height: 12px; 
        border-radius: 50%; 
        margin-right: 5px; 
      }
      .status.up { background-color: #4CAF50; }
      .status.down { background-color: #F44336; }
      .endpoints { margin-top: 15px; }
      .endpoint { margin-bottom: 5px; }
      .language { color: #666; font-size: 0.9em; margin-top: 8px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Sistema de Microservicios para Perfumería</h1>
      <p>Esta es la consola de administración para el sistema de microservicios políglotas.</p>
      
      <div class="services">
        ${serviceCards}
      </div>
    </div>
  </body>
  </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(dashboardHtml);
});

// Health check del gateway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'api-gateway' });
});

// Endpoint específico para depuración de rutas
app.get('/debug/routes', (req, res) => {
  res.json({
    clientesUrl: CLIENTES_URL,
    proveedoresUrl: PROVEEDORES_URL,
    productosUrl: PRODUCTOS_URL,
    environment: process.env.NODE_ENV,
    isDocker
  });
});

// Manejo de ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado', path: req.originalUrl });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(`Error en el API Gateway: ${err.message}`);
  res.status(500).send(`
    <h1>Error del API Gateway</h1>
    <p>Se produjo un error al procesar su solicitud</p>
    <p>Detalles: ${err.message}</p>
    <p>Path: ${req.originalUrl}</p>
  `);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`API Gateway ejecutándose en puerto ${PORT}`);
  console.log('Rutas disponibles:');
  console.log(`- Clientes: ${CLIENTES_URL}`);
  console.log(`- Proveedores: ${PROVEEDORES_URL}`);
  console.log(`- Productos: ${PRODUCTOS_URL}`);
});