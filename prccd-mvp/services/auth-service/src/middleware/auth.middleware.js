const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'prccd_secret_2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

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
