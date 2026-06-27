'use strict';

function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;
  console.error(`[Error] ${status}:`, err.message);
  res.status(status).json({ status: 'error', message: err.message || 'Error interno del servidor' });
}

module.exports = errorMiddleware;
