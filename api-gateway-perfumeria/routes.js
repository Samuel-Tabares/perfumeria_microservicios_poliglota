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
router.post('/api/services/:service/start', (req, res) => {
    const { service } = req.params;
    
    if (!['java', 'python', 'node'].includes(service)) {
        return res.status(400).json({ success: false, message: 'Invalid service' });
    }
    
    const result = startService(service);
    res.json(result);
});

router.post('/api/services/:service/stop', (req, res) => {
    const { service } = req.params;
    
    if (!['java', 'python', 'node'].includes(service)) {
        return res.status(400).json({ success: false, message: 'Invalid service' });
    }
    
    const result = stopService(service);
    res.json(result);
});

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

module.exports = router;