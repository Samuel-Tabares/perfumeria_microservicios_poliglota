const express = require('express');
const router = express.Router();

// GET - Obtener todas las promociones
router.get('/', (req, res) => {
  res.json({ message: 'Lista de promociones funcionando!' });
});

// GET - Obtener una promoción por ID
router.get('/:id', (req, res) => {
  res.json({ message: `Promoción ${req.params.id} encontrada` });
});

// GET - Promociones activas
router.get('/activas', (req, res) => {
  res.json({ message: 'Promociones activas' });
});

// POST - Crear una nueva promoción
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Promoción creada correctamente' });
});

module.exports = router;