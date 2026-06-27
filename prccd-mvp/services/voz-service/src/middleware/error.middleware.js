function errorMiddleware(err, req, res, next) {
  console.error('[VOZ-SERVICE ERROR]', err.message);
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
  });
}

module.exports = errorMiddleware;
