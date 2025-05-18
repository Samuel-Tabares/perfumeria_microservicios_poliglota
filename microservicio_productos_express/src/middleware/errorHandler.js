/**
 * Middleware para manejo centralizado de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Verificar si es un error de Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.errors.map(e => ({
        message: e.message,
        field: e.path
      }))
    });
  }

  // Error personalizado con código de estado
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Error del servidor por defecto
  return res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'production' ? 'Algo salió mal' : err.message
  });
};

module.exports = errorHandler;