// Módulo: Rutas de Autenticación (mock para prototipo MVP)
// Responsable: Javier Andrés Monjes Solórzano — 202100081
// Rama: feature/ingesta-usac
// Tarea: F2-01

const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validate.middleware');
const Candidato = require('../models/candidato.model');

const router = express.Router();

// Usuarios hardcodeados para el prototipo — en producción esto vendría de Keycloak
const USUARIOS = [
  { username: 'admin',    password: 'admin123',    nombre: 'Administrador SICA',           rol: 'ADMIN' },
  { username: 'oswaldo',  password: 'oswaldo123',  nombre: 'Oswaldo (Evaluador)',           rol: 'EVALUADOR' },
  { username: 'javier',   password: 'javier123',   nombre: 'Javier Monjes (Desarrollador)', rol: 'ADMIN' },
  { username: 'usac',     password: 'usac2026',    nombre: 'Coordinador USAC',              rol: 'COORDINADOR', universidad: 'USAC' },
  { username: 'ucr',      password: 'ucr2026',     nombre: 'Coordinador UCR',               rol: 'COORDINADOR', universidad: 'UCR' },
  { username: 'ues',      password: 'ues2026',     nombre: 'Coordinador UES',               rol: 'COORDINADOR', universidad: 'UES' },
];

const JWT_SECRET = process.env.JWT_SECRET || 'prccd_secret_2026';
const JWT_EXPIRY = '8h';

/**
 * POST /api/auth/login
 * Body: { username, password }
 */
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('El campo username es obligatorio'),
    body('password').notEmpty().withMessage('El campo password es obligatorio'),
  ],
  validateRequest,
  (req, res) => {
    const { username, password } = req.body;
    const usuario = USUARIOS.find((u) => u.username === username && u.password === password);

    if (!usuario) {
      return res.status(401).json({ status: 'error', message: 'Credenciales incorrectas' });
    }

    const payload = {
      username: usuario.username,
      nombre: usuario.nombre,
      rol: usuario.rol,
      universidad: usuario.universidad || null,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    return res.status(200).json({
      status: 'ok',
      token,
      usuario: payload,
    });
  }
);

/**
 * POST /api/auth/confirmar-identidad
 * Login federado de candidatos (USAC/UCR/UES) — F2-28.
 * Prototipo: no existe registro ni creación de cuenta. La confirmación de
 * identidad se hace contra los datos académicos ya ingeridos por los
 * adaptadores (id_candidato + nombre_completo + universidad_origen), que es
 * lo que en producción devolvería el LDAP/SAML/OAuth2 de cada universidad.
 * Body: { id_candidato, nombre_completo, universidad_origen }
 */
router.post(
  '/confirmar-identidad',
  [
    body('id_candidato').notEmpty().withMessage('El campo id_candidato es obligatorio'),
    body('nombre_completo').notEmpty().withMessage('El campo nombre_completo es obligatorio'),
    body('universidad_origen').notEmpty().withMessage('El campo universidad_origen es obligatorio'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { id_candidato, nombre_completo, universidad_origen } = req.body;

      const candidato = await Candidato.findOne({ where: { id_candidato } });

      const confirmado = candidato
        && candidato.estado === 'ACTIVO'
        && candidato.nombre_completo.trim().toLowerCase() === String(nombre_completo).trim().toLowerCase()
        && candidato.universidad_origen.trim().toUpperCase() === String(universidad_origen).trim().toUpperCase();

      if (!confirmado) {
        return res.status(401).json({ status: 'error', message: 'No se pudo confirmar la identidad del candidato' });
      }

      const payload = {
        id_candidato: candidato.id_candidato,
        nombre: candidato.nombre_completo,
        rol: 'ESTUDIANTE',
        universidad: candidato.universidad_origen,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

      return res.status(200).json({ status: 'ok', token, usuario: payload });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/auth/me
 * Devuelve el perfil del usuario autenticado (para que el frontend lo use al recargar)
 */
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ status: 'error', message: 'Token requerido' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ status: 'ok', usuario: payload });
  } catch {
    res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
  }
});

module.exports = router;