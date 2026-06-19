// Módulo: Middleware de validación de requests
const { validationResult } = require('express-validator');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Datos de entrada inválidos',
      errores: errors.array(),
    });
  }
  next();
}

module.exports = validateRequest;
