const express = require('express');
const router = express.Router();

// GET - Obtener todas las categorías
router.get('/', (req, res) => {
  res.json({ message: 'Lista de categorías funcionando!' });
});

// GET - Obtener una categoría por ID
router.get('/:id', (req, res) => {
  res.json({ message: `Categoría ${req.params.id} encontrada` });
});

// POST - Crear una nueva categoría
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Categoría creada correctamente' });
});

module.exports = router;
