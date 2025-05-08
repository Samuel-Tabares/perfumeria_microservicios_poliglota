const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Determinar si estamos en Docker o en desarrollo local
const isDocker = process.env.NODE_ENV === 'docker';

// Configuración de los servicios
const services = [
  {
    name: 'Microservicio de Clientes',
    language: 'Python/Django',
    url: isDocker 
      ? process.env.CLIENTES_SERVICE_URL 
      : process.env.LOCAL_CLIENTES_SERVICE_URL || 'http://localhost:8001',
    healthEndpoint: '/health/',
    apiBase: '/api/clientes/'
  },
  {
    name: 'Microservicio de Proveedores',
    language: 'Java/Spring Boot',
    url: isDocker 
      ? process.env.PROVEEDORES_SERVICE_URL 
      : process.env.LOCAL_PROVEEDORES_SERVICE_URL || 'http://localhost:8002',
    healthEndpoint: '/health',
    apiBase: '/api/proveedores/'
  },
  {
    name: 'Microservicio de Productos',
    language: 'Node.js/Express',
    url: isDocker 
      ? process.env.PRODUCTOS_SERVICE_URL 
      : process.env.LOCAL_PRODUCTOS_SERVICE_URL || 'http://localhost:8003',
    healthEndpoint: '/health',
    apiBase: '/api/productos/'
  }
];

/**
 * Verifica el estado de salud de todos los servicios
 */
const checkServicesHealth = async () => {
  const results = [];
  
  for (const service of services) {
    try {
      const response = await axios.get(`${service.url}${service.healthEndpoint}`, {
        timeout: 2000, // 2 segundos de timeout
      });
      
      results.push({
        ...service,
        status: (response.data && response.data.status === 'ok') ? 'UP' : 'DOWN',
        api: `http://localhost:8000${service.apiBase}`
      });
    } catch (error) {
      console.error(`Error comprobando servicio ${service.name}: ${error.message}`);
      results.push({
        ...service,
        status: 'DOWN',
        api: `http://localhost:8000${service.apiBase}`,
        error: error.message
      });
    }
  }
  
  return results;
};

module.exports = {
  checkServicesHealth,
  services
};