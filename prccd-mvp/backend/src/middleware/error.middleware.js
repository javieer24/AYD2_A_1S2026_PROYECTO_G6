// Módulo: Middleware de manejo de errores global
// Responsable: Javier Andrés Monjes Solórzano — 202100081
// Rama: feature/ingesta-usac
// Tarea: F2-01

function errorMiddleware(err, req, res, next) {
  console.error('[ERROR]', err.message);

  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
  });
}

module.exports = errorMiddleware;
