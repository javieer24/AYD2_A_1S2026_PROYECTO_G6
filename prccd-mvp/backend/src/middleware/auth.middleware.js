// Módulo: Middleware de autenticación JWT
// Responsable: Javier Andrés Monjes Solórzano — 202100081
// Rama: feature/ingesta-usac
// Tarea: F2-01

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'prccd_secret_2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Acceso denegado: token requerido' });
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
  }
}

module.exports = authMiddleware;
