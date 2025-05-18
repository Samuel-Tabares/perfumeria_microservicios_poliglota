const { validationResult } = require('express-validator');
const { Categoria, Producto } = require('../models');

/**
 * Obtener todas las categorías
 */
exports.getAllCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una nueva categoría
 */
exports.createCategoria = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nuevaCategoria = await Categoria.create(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una categoría por ID
 */
exports.getCategoriaById = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id, {
      include: [{ model: Producto, as: 'productos' }]
    });

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.status(200).json(categoria);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una categoría
 */
exports.updateCategoria = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await categoria.update(req.body);
    res.status(200).json(categoria);
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una categoría
 */
exports.deleteCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    // Verificar si hay productos asociados
    const productosAsociados = await Producto.count({
      where: { categoriaId: req.params.id }
    });

    if (productosAsociados > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }

    await categoria.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener productos de una categoría
 */
exports.getProductosByCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    const productos = await Producto.findAll({
      where: {
        categoriaId: req.params.id,
        activo: true
      }
    });

    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};