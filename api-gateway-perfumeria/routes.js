const express = require('express');
const router = express.Router();
const { 
    startService, 
    stopService, 
    getServicesStatus, 
    startAllServices, 
    stopAllServices 
} = require('./microservices');

// Dashboard
router.get('/', (req, res) => {
    const services = getServicesStatus();
    res.render('index', { services });
});

// API endpoints for controlling services
router.get('/api/services/status', (req, res) => {
    const status = getServicesStatus();
    res.json(status);
});

router.post('/api/services/start-all', (req, res) => {
    const results = startAllServices();
    res.json(results);
});

router.post('/api/services/stop-all', (req, res) => {
    const results = stopAllServices();
    res.json(results);
});

// Nueva ruta para detener todo y salir
router.post('/api/services/stop-all-and-exit', (req, res) => {
    console.log('Deteniendo todos los servicios y cerrando el sistema...');
    
    // Detener todos los servicios
    stopAllServices();
    
    // Enviar respuesta exitosa
    res.json({ success: true, message: 'Sistema detenido exitosamente' });
    
    // Cerrar el proceso del API Gateway después de un delay
    setTimeout(() => {
        console.log('Cerrando API Gateway...');
        process.exit(0);
    }, 1000);
});

router.get('/api/services/check-and-update', async (req, res) => {
    try {
        // Re-initialize service states
        await require('./microservices').initializeServiceStates();
        const status = require('./microservices').getServicesStatus();
        res.json(status);
    } catch (error) {
        console.error('Error checking service states:', error);
        res.status(500).json({ error: 'Failed to check service states' });
    }
});

module.exports = router;