const express = require('express');
const router = express.Router();

// GET - Obtener todos los productos
router.get('/', (req, res) => {
  res.json({ 
    message: 'Lista de productos funcionando',
    results: []
  });
});

// GET - Productos en stock - rutas específicas antes de parametrizadas
router.get('/en_stock', (req, res) => {
  res.json({ 
    message: 'Productos en stock',
    results: []
  });
});

// GET - Búsqueda de productos - rutas específicas antes de parametrizadas
router.get('/buscar', (req, res) => {
  const query = req.query.q || '';
  res.json({ 
    message: `Búsqueda de productos con término: ${query}`,
    query: query,
    results: []
  });
});

// GET - Obtener un producto por ID - IMPORTANTE: debe ir después de rutas específicas
router.get('/:id', (req, res) => {
  res.json({ 
    message: `Producto ${req.params.id} encontrado`,
    id: req.params.id
  });
});

// GET - Obtener promociones de un producto
router.get('/:id/promociones', (req, res) => {
  res.json({ 
    message: `Promociones del producto ${req.params.id}`,
    productId: req.params.id,
    results: []
  });
});

// POST - Crear un nuevo producto
router.post('/', (req, res) => {
  const nuevoProducto = req.body || {};
  res.status(201).json({ 
    message: 'Producto creado correctamente',
    producto: nuevoProducto 
  });
});

module.exports = router;