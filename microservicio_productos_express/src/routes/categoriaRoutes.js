const express = require('express');
const { body, param } = require('express-validator');
const categoriaController = require('../controllers/categoriaController');
const router = express.Router();

// Validaciones comunes
const validateCategoriaId = param('id').isInt().withMessage('El ID debe ser un número entero');
const validateCategoria = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
  body('descripcion')
    .optional()
];

// Rutas para categorías
router.get('/', categoriaController.getAllCategorias);
router.post('/', validateCategoria, categoriaController.createCategoria);
router.get('/:id', validateCategoriaId, categoriaController.getCategoriaById);
router.put('/:id', [validateCategoriaId, ...validateCategoria], categoriaController.updateCategoria);
router.delete('/:id', validateCategoriaId, categoriaController.deleteCategoria);

// Rutas adicionales
router.get('/:id/productos', validateCategoriaId, categoriaController.getProductosByCategoria);

module.exports = router;