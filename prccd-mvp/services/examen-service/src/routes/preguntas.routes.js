// Módulo: Rutas REST — Banco de Preguntas (motor adaptativo)
// No existía una API HTTP para el banco de preguntas (solo el script de carga
// scripts/seedPreguntas.js); se agrega un CRUD básico para que el staff
// (ADMIN/EVALUADOR) pueda administrar el banco sin acceso directo a la BD.
const router = require('express').Router();
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

const NIVELES_VALIDOS = ['Básico', 'Medio', 'Avanzado'];

function esStaff(req) {
  return req.usuario && ['ADMIN', 'EVALUADOR'].includes(req.usuario.rol);
}

// GET /api/examen/preguntas?nivel=Medio — listar (oculta respuesta_correcta)
router.get('/', async (req, res, next) => {
  try {
    const { nivel } = req.query;
    const preguntas = await sequelize.query(
      `SELECT id, numero, nivel, categoria, pregunta, opcion_a, opcion_b, opcion_c, opcion_d
       FROM preguntas
       ${nivel ? 'WHERE nivel = :nivel' : ''}
       ORDER BY numero ASC`,
      { replacements: { nivel }, type: QueryTypes.SELECT }
    );
    res.json({ status: 'ok', total: preguntas.length, preguntas });
  } catch (err) {
    next(err);
  }
});

// POST /api/examen/preguntas — agregar pregunta al banco (solo staff)
// Body: { numero, nivel, categoria, pregunta, opcion_a..d, respuesta_correcta }
router.post('/', async (req, res, next) => {
  try {
    if (!esStaff(req)) {
      return res.status(403).json({ status: 'error', message: 'Solo ADMIN o EVALUADOR pueden administrar el banco de preguntas' });
    }
    const { numero, nivel, categoria, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta } = req.body;
    if (!nivel || !NIVELES_VALIDOS.includes(nivel)) {
      return res.status(400).json({ status: 'error', message: `nivel debe ser uno de: ${NIVELES_VALIDOS.join(', ')}` });
    }
    if (!pregunta || !opcion_a || !opcion_b || !opcion_c || !opcion_d || !respuesta_correcta) {
      return res.status(400).json({ status: 'error', message: 'pregunta, opcion_a..d y respuesta_correcta son requeridos' });
    }
    if (!['A', 'B', 'C', 'D'].includes(respuesta_correcta.toUpperCase())) {
      return res.status(400).json({ status: 'error', message: 'respuesta_correcta debe ser A, B, C o D' });
    }

    const [nueva] = await sequelize.query(
      `INSERT INTO preguntas (numero, nivel, categoria, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta)
       VALUES (:numero, :nivel, :categoria, :pregunta, :opcion_a, :opcion_b, :opcion_c, :opcion_d, :respuesta_correcta)
       RETURNING id, numero, nivel`,
      {
        replacements: {
          numero, nivel, categoria, pregunta, opcion_a, opcion_b, opcion_c, opcion_d,
          respuesta_correcta: respuesta_correcta.toUpperCase(),
        },
        type: QueryTypes.INSERT,
      }
    );
    res.status(201).json({ status: 'ok', pregunta: nueva[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
