const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);

// Proxy middleware
app.use('/java', createProxyMiddleware({ 
    target: process.env.JAVA_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/java': ''},
}));

app.use('/python', createProxyMiddleware({ 
    target: process.env.PYTHON_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/python': ''},
}));

app.use('/node', createProxyMiddleware({ 
    target: process.env.NODE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/node': ''},
}));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log(`Dashboard: http://localhost:${PORT}`);
    console.log('Available services:');
    console.log(`- Java (Proveedores): http://localhost:${PORT}/java`);
    console.log(`- Python (Clientes): http://localhost:${PORT}/python`);
    console.log(`- Node.js (Productos): http://localhost:${PORT}/node`);
});