const express = require('express');
const { body, param, query } = require('express-validator');
const productoController = require('../controllers/productoController');
const router = express.Router();

// Validaciones comunes
const validateProductoId = param('id').isInt().withMessage('El ID debe ser un número entero');
const validateProducto = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria'),
  body('codigo')
    .notEmpty().withMessage('El código es obligatorio')
    .isLength({ max: 50 }).withMessage('El código no puede exceder los 50 caracteres'),
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo o cero'),
  body('categoriaId')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isInt().withMessage('El ID de categoría debe ser un número entero')
];

// Rutas para productos
router.get('/', productoController.getAllProductos);
router.post('/', validateProducto, productoController.createProducto);
router.get('/:id', validateProductoId, productoController.getProductoById);
router.put('/:id', [validateProductoId, ...validateProducto], productoController.updateProducto);
router.delete('/:id', validateProductoId, productoController.deleteProducto);

// Rutas adicionales
router.get('/:id/promociones', validateProductoId, productoController.getPromocionesByProducto);
router.get('/en_stock', productoController.getProductosEnStock);
router.get('/buscar', productoController.buscarProductos);

module.exports = router;