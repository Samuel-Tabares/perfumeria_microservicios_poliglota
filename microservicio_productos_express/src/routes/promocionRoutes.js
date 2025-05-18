const express = require('express');
const { body, param } = require('express-validator');
const promocionController = require('../controllers/promocionController');
const router = express.Router();

// Validaciones comunes
const validatePromocionId = param('id').isInt().withMessage('El ID debe ser un número entero');
const validatePromocion = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria'),
  body('descuentoPorcentaje')
    .notEmpty().withMessage('El porcentaje de descuento es obligatorio')
    .isFloat({ min: 0, max: 100 }).withMessage('El descuento debe estar entre 0% y 100%'),
  body('fechaInicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isDate().withMessage('La fecha de inicio debe ser una fecha válida'),
  body('fechaFin')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isDate().withMessage('La fecha de fin debe ser una fecha válida'),
  body('productoId')
    .notEmpty().withMessage('El producto es obligatorio')
    .isInt().withMessage('El ID de producto debe ser un número entero')
];

// Rutas para promociones
router.get('/', promocionController.getAllPromociones);
router.post('/', validatePromocion, promocionController.createPromocion);
router.get('/:id', validatePromocionId, promocionController.getPromocionById);
router.put('/:id', [validatePromocionId, ...validatePromocion], promocionController.updatePromocion);
router.delete('/:id', validatePromocionId, promocionController.deletePromocion);

// Rutas adicionales
router.get('/activas', promocionController.getPromocionesActivas);

module.exports = router;