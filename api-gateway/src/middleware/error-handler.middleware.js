const errorHandler = (err, req, res, next) => {
  console.error(`Error en API Gateway: ${err.message}`);
  
  // Determinar el código de estado
  const statusCode = err.statusCode || 500;
  
  // Responder con JSON
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
