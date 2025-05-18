const { spawn, exec } = require('child_process');
const path = require('path');
require('dotenv').config();

// Store running processes
const processes = {
    java: null,
    python: null,
    node: null
};

// Service configurations
const services = {
    java: {
        name: 'Proveedores (Java)',
        directory: path.join(__dirname, '..', 'microservicio_proveedores_springboot'),
        command: 'mvn',
        args: ['spring-boot:run'],
        url: process.env.JAVA_SERVICE_URL || 'http://localhost:8002',
        port: 8002,
        status: 'stopped'
    },
    python: {
        name: 'Clientes (Python)',
        directory: path.join(__dirname, '..', 'microservicio_clientes_fastapi'),
        command: 'uvicorn',
        args: ['app.main:app', '--host', '0.0.0.0', '--port', '8001'],
        url: process.env.PYTHON_SERVICE_URL || 'http://localhost:8001',
        port: 8001,
        status: 'stopped'
    },
    node: {
        name: 'Productos (Node.js)',
        directory: path.join(__dirname, '..', 'microservicio_productos_express'),
        command: 'npm',
        args: ['start'],
        url: process.env.NODE_SERVICE_URL || 'http://localhost:8003',
        port: 8003,
        status: 'stopped'
    }
};

// Check if a service is running by port
function checkServiceByPort(port) {
    return new Promise((resolve) => {
        exec(`lsof -i :${port} -t`, (error, stdout) => {
            if (error || !stdout.trim()) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

// Initialize service states by checking running processes
async function initializeServiceStates() {
    console.log('Verificando servicios en ejecución...');
    
    for (const [key, service] of Object.entries(services)) {
        const isRunning = await checkServiceByPort(service.port);
        if (isRunning) {
            console.log(`✓ ${service.name} detectado en puerto ${service.port}`);
            services[key].status = 'running';
            // No asignamos un PID porque no controlamos este proceso
            processes[key] = { external: true };
        } else {
            console.log(`✗ ${service.name} no está ejecutándose en puerto ${service.port}`);
            services[key].status = 'stopped';
        }
    }
}

// Start a microservice
function startService(serviceKey) {
    return new Promise(async (resolve) => {
        // Check if already running
        const isRunning = await checkServiceByPort(services[serviceKey].port);
        if (isRunning) {
            services[serviceKey].status = 'running';
            processes[serviceKey] = { external: true };
            resolve({ success: true, message: `${services[serviceKey].name} ya está ejecutándose` });
            return;
        }

        if (processes[serviceKey] && !processes[serviceKey].external) {
            resolve({ success: false, message: `${services[serviceKey].name} is already running` });
            return;
        }

        try {
            let command = services[serviceKey].command;
            let args = services[serviceKey].args;

            // Special handling for Python service
            if (serviceKey === 'python') {
                command = 'sh';
                args = ['-c', `cd ${services[serviceKey].directory} && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8001`];
            }

            const process = spawn(command, args, {
                cwd: services[serviceKey].directory,
                shell: true,
                detached: false
            });

            processes[serviceKey] = process;
            services[serviceKey].status = 'running';

            process.stdout.on('data', (data) => {
                console.log(`[${services[serviceKey].name}] ${data}`);
            });

            process.stderr.on('data', (data) => {
                console.error(`[${services[serviceKey].name}] Error: ${data}`);
            });

            process.on('close', (code) => {
                console.log(`[${services[serviceKey].name}] process exited with code ${code}`);
                processes[serviceKey] = null;
                services[serviceKey].status = 'stopped';
            });

            resolve({ success: true, message: `${services[serviceKey].name} started successfully` });
        } catch (error) {
            console.error(`Error starting ${services[serviceKey].name}:`, error);
            resolve({ success: false, message: `Error starting ${services[serviceKey].name}: ${error.message}` });
        }
    });
}

// Stop a microservice
function stopService(serviceKey) {
    return new Promise(async (resolve) => {
        try {
            // If it's an external process, kill by port
            if (processes[serviceKey]?.external || !processes[serviceKey]) {
                exec(`lsof -ti:${services[serviceKey].port} | xargs kill -9`, (error) => {
                    if (error) {
                        console.error(`Error stopping ${services[serviceKey].name}:`, error);
                        resolve({ success: false, message: `Error stopping ${services[serviceKey].name}` });
                    } else {
                        processes[serviceKey] = null;
                        services[serviceKey].status = 'stopped';
                        resolve({ success: true, message: `${services[serviceKey].name} stopped successfully` });
                    }
                });
            } else {
                // If we control the process, kill it normally
                processes[serviceKey].kill('SIGTERM');
                processes[serviceKey] = null;
                services[serviceKey].status = 'stopped';
                resolve({ success: true, message: `${services[serviceKey].name} stopped successfully` });
            }
        } catch (error) {
            console.error(`Error stopping ${services[serviceKey].name}:`, error);
            resolve({ success: false, message: `Error stopping ${services[serviceKey].name}: ${error.message}` });
        }
    });
}

// Get status of all services
function getServicesStatus() {
    return {
        java: {
            ...services.java,
            isRunning: services.java.status === 'running'
        },
        python: {
            ...services.python,
            isRunning: services.python.status === 'running'
        },
        node: {
            ...services.node,
            isRunning: services.node.status === 'running'
        }
    };
}

// Start all services
async function startAllServices() {
    const results = {};
    
    for (const serviceKey of Object.keys(services)) {
        results[serviceKey] = await startService(serviceKey);
    }
    
    return results;
}

// Stop all services
async function stopAllServices() {
    const results = {};
    
    for (const serviceKey of Object.keys(services)) {
        results[serviceKey] = await stopService(serviceKey);
    }
    
    return results;
}

module.exports = {
    startService,
    stopService,
    getServicesStatus,
    startAllServices,
    stopAllServices,
    initializeServiceStates
};