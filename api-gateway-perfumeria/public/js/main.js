document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const startAllBtn = document.getElementById('startAllBtn');
    const stopAllBtn = document.getElementById('stopAllBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const systemStatus = document.getElementById('systemStatus');
    
    // Go to service buttons
    document.querySelectorAll('.btn-goto').forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.dataset.service;
            let url;
            
            switch(service) {
                case 'java':
                    url = 'http://localhost:8002';
                    break;
                case 'python':
                    url = 'http://localhost:8001';
                    break;
                case 'node':
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
        if (confirm('¿Estás seguro de iniciar todos los servicios?')) {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando servicios...';
            
            fetch('/api/services/start-all', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Servicios iniciados:', data);
                setTimeout(() => {
                    refreshStatus();
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al iniciar los servicios: ' + error.message);
            })
            .finally(() => {
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-play"></i> Iniciar Todos los Servicios';
            });
        }
    });
    
    // Stop all services
    stopAllBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de detener todos los servicios? Esto cerrará completamente el sistema.')) {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deteniendo sistema...';
            
            fetch('/api/services/stop-all-and-exit', {
                method: 'POST'
            })
            .then(response => {
                if (response.ok) {
                    // Mostrar mensaje y cerrar ventana después de un delay
                    alert('Sistema detenido exitosamente. Esta ventana se cerrará automáticamente.');
                    setTimeout(() => {
                        window.close();
                    }, 2000);
                } else {
                    throw new Error('Error al detener el sistema');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al detener el sistema: ' + error.message);
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-stop"></i> Detener Todos los Servicios';
            });
        }
    });
    
    // Refresh status
    refreshBtn.addEventListener('click', function() {
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        
        refreshStatus().finally(() => {
            this.disabled = false;
            this.innerHTML = '<i class="fas fa-sync"></i> Actualizar Estado';
        });
    });
    
    // Helper functions
    function refreshStatus() {
        return fetch('/api/services/status')
            .then(response => response.json())
            .then(data => {
                updateUI(data);
            })
            .catch(error => {
                console.error('Error al actualizar estado:', error);
                alert('Error al actualizar el estado del sistema');
            });
    }
    
    function updateUI(services) {
        // Update service status badges and buttons
        Object.keys(services).forEach(key => {
            const service = services[key];
            
            // Update badge
            const statusBadge = document.querySelector(`.status-badge[data-service="${key}"]`);
            const gotoBtn = document.querySelector(`.btn-goto[data-service="${key}"]`);
            
            if (statusBadge) {
                statusBadge.textContent = service.isRunning ? 'Activo' : 'Inactivo';
                statusBadge.className = `badge badge-pill status-badge ${service.isRunning ? 'bg-success' : 'bg-danger'}`;
            }
            
            if (gotoBtn) {
                gotoBtn.disabled = !service.isRunning;
            }
        });
        
        // Update system status
        const allRunning = Object.values(services).every(service => service.isRunning);
        const noneRunning = Object.values(services).every(service => !service.isRunning);
        
        if (allRunning) {
            systemStatus.textContent = 'Todos los servicios están funcionando correctamente';
            systemStatus.parentElement.className = 'alert alert-success';
        } else if (noneRunning) {
            systemStatus.textContent = 'Todos los servicios están detenidos';
            systemStatus.parentElement.className = 'alert alert-warning';
        } else {
            systemStatus.textContent = 'Algunos servicios están detenidos';
            systemStatus.parentElement.className = 'alert alert-info';
        }
    }
    
    // Initial refresh con verificación
    refreshStatus();
    
    // También verificar estado al cargar la página
    fetch('/api/services/check-and-update')
        .then(response => response.json())
        .then(data => {
            updateUI(data);
            console.log('Estado inicial verificado:', data);
        })
        .catch(error => {
            console.error('Error en verificación inicial:', error);
        });
    
    // Auto-refresh every 30 seconds
    setInterval(refreshStatus, 30000);
});