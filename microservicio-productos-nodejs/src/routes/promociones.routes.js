const express = require('express');
const router = express.Router();

// GET - Obtener todas las promociones
router.get('/', (req, res) => {
  res.json({ 
    message: 'Lista de promociones funcionando',
    results: []
  });
});

// GET - Promociones activas - rutas específicas antes de parametrizadas
router.get('/activas', (req, res) => {
  res.json({ 
    message: 'Promociones activas',
    results: []
  });
});

// GET - Obtener una promoción por ID - debe ir después de rutas específicas
router.get('/:id', (req, res) => {
  res.json({ 
    message: `Promoción ${req.params.id} encontrada`,
    id: req.params.id 
  });
});

// POST - Crear una nueva promoción
router.post('/', (req, res) => {
  const nuevaPromocion = req.body || {};
  res.status(201).json({ 
    message: 'Promoción creada correctamente',
    promocion: nuevaPromocion
  });
});

module.exports = router;