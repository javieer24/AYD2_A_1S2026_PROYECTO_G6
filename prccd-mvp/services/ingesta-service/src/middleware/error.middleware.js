// Módulo: Middleware de manejo de errores global
function errorMiddleware(err, req, res, next) {
  console.error('[ERROR]', err.message);

  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
  });
}

module.exports = errorMiddleware;
