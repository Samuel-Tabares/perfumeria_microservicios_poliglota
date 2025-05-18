const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Producto, Categoria, Promocion } = require('../models');

/**
 * Obtener todos los productos
 */
exports.getAllProductos = async (req, res, next) => {
  try {
    const productos = await Producto.findAll({
      include: [
        { model: Categoria, as: 'categoria' }
      ]
    });
    
    const productosFormateados = productos.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      codigo: producto.codigo,
      precio: producto.precio,
      stock: producto.stock,
      categoria_nombre: producto.categoria ? producto.categoria.nombre : null,
      activo: producto.activo
    }));
    
    res.status(200).json(productosFormateados);
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo producto
 */
exports.createProducto = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verificar si la categoría existe
    const categoria = await Categoria.findByPk(req.body.categoriaId);
    if (!categoria) {
      return res.status(400).json({ message: 'La categoría especificada no existe' });
    }

    // Verificar si ya existe un producto con el mismo código
    const productoExistente = await Producto.findOne({
      where: { codigo: req.body.codigo }
    });

    if (productoExistente) {
      return res.status(400).json({ message: 'Ya existe un producto con ese código' });
    }

    const nuevoProducto = await Producto.create(req.body);
    
    // Recargar el producto con su categoría
    const productoConCategoria = await Producto.findByPk(nuevoProducto.id, {
      include: [{ model: Categoria, as: 'categoria' }]
    });

    res.status(201).json(productoConCategoria);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un producto por ID
 */
exports.getProductoById = async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Promocion, as: 'promociones' }
      ]
    });

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un producto
 */
exports.updateProducto = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar la categoría si se proporciona
    if (req.body.categoriaId) {
      const categoria = await Categoria.findByPk(req.body.categoriaId);
      if (!categoria) {
        return res.status(400).json({ message: 'La categoría especificada no existe' });
      }
    }

    // Verificar unicidad del código si se está actualizando
    if (req.body.codigo && req.body.codigo !== producto.codigo) {
      const productoExistente = await Producto.findOne({
        where: { 
          codigo: req.body.codigo,
          id: { [Op.ne]: req.params.id }
        }
      });

      if (productoExistente) {
        return res.status(400).json({ message: 'Ya existe un producto con ese código' });
      }
    }

    await producto.update(req.body);
    
    // Recargar el producto con su categoría
    const productoActualizado = await Producto.findByPk(req.params.id, {
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Promocion, as: 'promociones' }
      ]
    });

    res.status(200).json(productoActualizado);
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un producto
 */
exports.deleteProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await producto.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener promociones de un producto
 */
exports.getPromocionesByProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const promociones = await Promocion.findAll({
      where: {
        productoId: req.params.id,
        activa: true
      }
    });

    res.status(200).json(promociones);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener productos en stock
 */
exports.getProductosEnStock = async (req, res, next) => {
  try {
    const productos = await Producto.findAll({
      where: {
        activo: true,
        stock: { [Op.gt]: 0 }
      },
      include: [{ model: Categoria, as: 'categoria' }]
    });

    const productosFormateados = productos.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      codigo: producto.codigo,
      precio: producto.precio,
      stock: producto.stock,
      categoria_nombre: producto.categoria ? producto.categoria.nombre : null,
      activo: producto.activo
    }));

    res.status(200).json(productosFormateados);
  } catch (error) {
    next(error);
  }
};

/**
 * Buscar productos por nombre o descripción
 */
exports.buscarProductos = async (req, res, next) => {
  try {
    const termino = req.query.q;

    if (!termino) {
      return res.status(400).json({
        message: "Debe proporcionar un término de búsqueda con el parámetro 'q'"
      });
    }

    const productos = await Producto.findAll({
      where: {
        activo: true,
        [Op.or]: [
          { nombre: { [Op.like]: `%${termino}%` } },
          { descripcion: { [Op.like]: `%${termino}%` } }
        ]
      },
      include: [{ model: Categoria, as: 'categoria' }]
    });

    const productosFormateados = productos.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      codigo: producto.codigo,
      precio: producto.precio,
      stock: producto.stock,
      categoria_nombre: producto.categoria ? producto.categoria.nombre : null,
      activo: producto.activo
    }));

    res.status(200).json(productosFormateados);
  } catch (error) {
    next(error);
  }
};