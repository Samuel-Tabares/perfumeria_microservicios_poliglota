const express = require('express');
const router = express.Router();

// Importar rutas específicas
const categoriaRoutes = require('./categoriaRoutes');
const productoRoutes = require('./productoRoutes');
const promocionRoutes = require('./promocionRoutes');

// Configurar rutas
router.use('/categorias', categoriaRoutes);
router.use('/productos', productoRoutes);
router.use('/promociones', promocionRoutes);

module.exports = router;