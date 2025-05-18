document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const startAllBtn = document.getElementById('startAllBtn');
    const stopAllBtn = document.getElementById('stopAllBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const consoleLog = document.getElementById('console-log');
    
    // Start buttons
    document.querySelectorAll('.btn-start').forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.dataset.service;
            startService(service);
        });
    });
    
    // Stop buttons
    document.querySelectorAll('.btn-stop').forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.dataset.service;
            stopService(service);
        });
    });
    
    // Go to service buttons
document.querySelectorAll('.btn-goto').forEach(btn => {
    btn.addEventListener('click', function() {
        const service = this.dataset.service;
        let url;
        
        switch(service) {
            case 'java':
                // Redirigir directamente al puerto 8002 (microservicio Java)
                url = 'http://localhost:8002';
                break;
            case 'python':
                // Redirigir directamente al puerto 8001 (microservicio Python)
                url = 'http://localhost:8001';
                break;
            case 'node':
                // Redirigir directamente al puerto 8003 (microservicio Node.js)
                url = 'http://localhost:8003';
                break;
        }
        
        if (url) {
            window.open(url, '_blank');
        }
    });
});
    
    // Start all services
    startAllBtn.addEventListener('click', function() {
        this.disabled = true;
        logMessage('Iniciando todos los servicios...');
        
        fetch('/api/services/start-all', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(service => {
                logMessage(`[${service.toUpperCase()}] ${data[service].message}`);
            });
            
            refreshStatus();
        })
        .catch(error => {
            logMessage(`Error: ${error.message}`, true);
        })
        .finally(() => {
            this.disabled = false;
        });
    });
    
    // Stop all services
    stopAllBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de detener todos los servicios?')) {
            this.disabled = true;
            logMessage('Deteniendo todos los servicios...');
            
            fetch('/api/services/stop-all', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                Object.keys(data).forEach(service => {
                    logMessage(`[${service.toUpperCase()}] ${data[service].message}`);
                });
                
                refreshStatus();
            })
            .catch(error => {
                logMessage(`Error: ${error.message}`, true);
            })
            .finally(() => {
                this.disabled = false;
            });
        }
    });
    
    // Refresh status
    refreshBtn.addEventListener('click', function() {
        refreshStatus();
    });
    
    // Helper functions
    function startService(service) {
        const btn = document.querySelector(`.btn-start[data-service="${service}"]`);
        btn.disabled = true;
        
        logMessage(`Iniciando servicio ${service}...`);
        
        fetch(`/api/services/${service}/start`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            logMessage(data.message);
            refreshStatus();
        })
        .catch(error => {
            logMessage(`Error: ${error.message}`, true);
            btn.disabled = false;
        });
    }
    
    function stopService(service) {
        if (confirm(`¿Estás seguro de detener el servicio ${service}?`)) {
            const btn = document.querySelector(`.btn-stop[data-service="${service}"]`);
            btn.disabled = true;
            
            logMessage(`Deteniendo servicio ${service}...`);
            
            fetch(`/api/services/${service}/stop`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                logMessage(data.message);
                refreshStatus();
            })
            .catch(error => {
                logMessage(`Error: ${error.message}`, true);
                btn.disabled = false;
            });
        }
    }
    
    function refreshStatus() {
        fetch('/api/services/status')
            .then(response => response.json())
            .then(data => {
                updateUI(data);
            })
            .catch(error => {
                logMessage(`Error al actualizar estado: ${error.message}`, true);
            });
    }
    
    function updateUI(services) {
    // Update service status badges and buttons
    Object.keys(services).forEach(key => {
        const service = services[key];
        
        // Seleccionamos los elementos de manera más directa y segura
        const statusBadge = document.querySelector(`.status-badge[data-service="${key}"]`);
        const startBtn = document.querySelector(`.btn-start[data-service="${key}"]`);
        const stopBtn = document.querySelector(`.btn-stop[data-service="${key}"]`);
        const gotoBtn = document.querySelector(`.btn-goto[data-service="${key}"]`);
        
        // Actualizamos solo si los elementos existen
        if (statusBadge) {
            statusBadge.textContent = service.isRunning ? 'Activo' : 'Inactivo';
            statusBadge.className = `badge badge-pill status-badge ${service.isRunning ? 'bg-success' : 'bg-danger'}`;
        }
        
        if (startBtn) startBtn.disabled = service.isRunning;
        if (stopBtn) stopBtn.disabled = !service.isRunning;
        if (gotoBtn) gotoBtn.disabled = !service.isRunning;
    });
    
    logMessage('Estado actualizado.');
}
    
    function logMessage(message, isError = false) {
        const timestamp = new Date().toLocaleTimeString();
        const logType = isError ? 'ERROR' : 'INFO';
        const formattedMessage = `[${timestamp}] [${logType}] ${message}`;
        
        consoleLog.textContent = `${formattedMessage}\n${consoleLog.textContent}`;
    }
    
    // Initial refresh
    refreshStatus();
});