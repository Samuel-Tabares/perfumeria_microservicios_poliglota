const express = require('express');
const router = express.Router();

// GET - Obtener todos los productos
router.get('/', (req, res) => {
  res.json({ message: 'Lista de productos funcionando!' });
});

// GET - Obtener un producto por ID
router.get('/:id', (req, res) => {
  res.json({ message: `Producto ${req.params.id} encontrado` });
});

// GET - Búsqueda de productos
router.get('/buscar', (req, res) => {
  const query = req.query.q || '';
  res.json({ message: `Búsqueda de productos con término: ${query}` });
});

// GET - Productos en stock
router.get('/en_stock', (req, res) => {
  res.json({ message: 'Productos en stock' });
});

// POST - Crear un nuevo producto
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Producto creado correctamente' });
});

module.exports = router;
