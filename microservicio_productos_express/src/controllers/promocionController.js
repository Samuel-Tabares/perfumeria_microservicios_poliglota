const { validationResult } = require('express-validator');
const { Promocion, Producto } = require('../models');
const { Op } = require('sequelize');

/**
 * Obtener todas las promociones
 */
exports.getAllPromociones = async (req, res, next) => {
  try {
    const promociones = await Promocion.findAll({
      include: [{ model: Producto, as: 'producto' }]
    });
    res.status(200).json(promociones);
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una nueva promoción
 */
exports.createPromocion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verificar que el producto existe
    const producto = await Producto.findByPk(req.body.productoId);
    if (!producto) {
      return res.status(400).json({ message: 'El producto especificado no existe' });
    }

    // Verificar que fechaFin es posterior a fechaInicio
    if (new Date(req.body.fechaFin) <= new Date(req.body.fechaInicio)) {
      return res.status(400).json({
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }

    const nuevaPromocion = await Promocion.create(req.body);
    
    // Recargar la promoción con su producto
    const promocionConProducto = await Promocion.findByPk(nuevaPromocion.id, {
      include: [{ model: Producto, as: 'producto' }]
    });

    res.status(201).json(promocionConProducto);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una promoción por ID
 */
exports.getPromocionById = async (req, res, next) => {
  try {
    const promocion = await Promocion.findByPk(req.params.id, {
      include: [{ model: Producto, as: 'producto' }]
    });

    if (!promocion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }

    res.status(200).json(promocion);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una promoción
 */
exports.updatePromocion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const promocion = await Promocion.findByPk(req.params.id);

    if (!promocion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }

    // Verificar el producto si se proporciona
    if (req.body.productoId) {
      const producto = await Producto.findByPk(req.body.productoId);
      if (!producto) {
        return res.status(400).json({ message: 'El producto especificado no existe' });
      }
    }

    // Verificar fechas si se proporcionan ambas
    const fechaInicio = req.body.fechaInicio || promocion.fechaInicio;
    const fechaFin = req.body.fechaFin || promocion.fechaFin;
    
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      return res.status(400).json({
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }

    await promocion.update(req.body);
    
    // Recargar la promoción con su producto
    const promocionActualizada = await Promocion.findByPk(req.params.id, {
      include: [{ model: Producto, as: 'producto' }]
    });

    res.status(200).json(promocionActualizada);
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una promoción
 */
exports.deletePromocion = async (req, res, next) => {
  try {
    const promocion = await Promocion.findByPk(req.params.id);

    if (!promocion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }

    await promocion.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener promociones activas
 */
exports.getPromocionesActivas = async (req, res, next) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const promociones = await Promocion.findAll({
      where: {
        activa: true,
        fechaInicio: { [Op.lte]: hoy },
        fechaFin: { [Op.gte]: hoy }
      },
      include: [{ model: Producto, as: 'producto' }]
    });

    res.status(200).json(promociones);
  } catch (error) {
    next(error);
  }
};