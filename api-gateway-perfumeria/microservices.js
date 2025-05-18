const { spawn } = require('child_process');
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
        command: process.env.JAVA_CMD.split(' ')[0],
        args: process.env.JAVA_CMD.split(' ').slice(1),
        url: process.env.JAVA_SERVICE_URL,
        status: 'stopped'
    },
    python: {
        name: 'Clientes (Python)',
        directory: path.join(__dirname, '..', 'microservicio_clientes_fastapi'),
        command: 'venv/bin/uvicorn', // Usar uvicorn del entorno virtual
        args: ['app.main:app', '--host', '0.0.0.0', '--port', '8001'],
        url: process.env.PYTHON_SERVICE_URL,
        status: 'stopped'
    },
    node: {
        name: 'Productos (Node.js)',
        directory: path.join(__dirname, '..', 'microservicio_productos_express'),
        command: process.env.NODE_CMD.split(' ')[0],
        args: process.env.NODE_CMD.split(' ').slice(1),
        url: process.env.NODE_SERVICE_URL,
        status: 'stopped'
    }
};

// Start a microservice
function startService(serviceKey) {
    if (processes[serviceKey]) {
        return { success: false, message: `${services[serviceKey].name} is already running` };
    }

    try {
        const process = spawn(services[serviceKey].command, services[serviceKey].args, {
            cwd: services[serviceKey].directory,
            shell: true
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

        return { success: true, message: `${services[serviceKey].name} started successfully` };
    } catch (error) {
        console.error(`Error starting ${services[serviceKey].name}:`, error);
        return { success: false, message: `Error starting ${services[serviceKey].name}: ${error.message}` };
    }
}

// Stop a microservice
function stopService(serviceKey) {
    if (!processes[serviceKey]) {
        return { success: false, message: `${services[serviceKey].name} is not running` };
    }

    try {
        // On Windows, use taskkill to kill the process tree
        if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', processes[serviceKey].pid, '/f', '/t']);
        } else {
            processes[serviceKey].kill('SIGTERM');
        }

        processes[serviceKey] = null;
        services[serviceKey].status = 'stopped';
        return { success: true, message: `${services[serviceKey].name} stopped successfully` };
    } catch (error) {
        console.error(`Error stopping ${services[serviceKey].name}:`, error);
        return { success: false, message: `Error stopping ${services[serviceKey].name}: ${error.message}` };
    }
}

// Get status of all services
function getServicesStatus() {
    return {
        java: {
            ...services.java,
            isRunning: processes.java !== null
        },
        python: {
            ...services.python,
            isRunning: processes.python !== null
        },
        node: {
            ...services.node,
            isRunning: processes.node !== null
        }
    };
}

// Start all services
function startAllServices() {
    const results = {
        java: startService('java'),
        python: startService('python'),
        node: startService('node')
    };
    return results;
}

// Stop all services
function stopAllServices() {
    const results = {
        java: stopService('java'),
        python: stopService('python'),
        node: stopService('node')
    };
    return results;
}

module.exports = {
    startService,
    stopService,
    getServicesStatus,
    startAllServices,
    stopAllServices
};