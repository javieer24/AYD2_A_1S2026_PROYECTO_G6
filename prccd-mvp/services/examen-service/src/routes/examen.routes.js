// Módulo: Rutas del motor de examen adaptativo
const router = require('express').Router();
const { iniciarExamen, responderPregunta } = require('../services/examen.service');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

// Un candidato autenticado (F2-28) solo puede operar sobre sus propias
// sesiones de examen; los roles de staff (ADMIN/EVALUADOR/COORDINADOR)
// conservan el comportamiento original de operar sobre cualquier candidato.
function esEstudiante(req) {
  return req.usuario && req.usuario.rol === 'ESTUDIANTE';
}

// POST /api/examen/iniciar
// Body: { "id_candidato": "USAC-2024-001" }
router.post('/iniciar', async (req, res, next) => {
  try {
    const { id_candidato } = req.body;
    if (!id_candidato) {
      return res.status(400).json({ error: 'id_candidato es requerido' });
    }
    if (esEstudiante(req) && req.usuario.id_candidato !== id_candidato) {
      return res.status(403).json({ error: 'No puede iniciar un examen a nombre de otro candidato' });
    }
    const resultado = await iniciarExamen(id_candidato);
    res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
});

// POST /api/examen/responder
// Body: { "sesion_id": 1, "pregunta_id": 3, "respuesta": "B" }
router.post('/responder', async (req, res, next) => {
  try {
    const { sesion_id, pregunta_id, respuesta } = req.body;
    if (!sesion_id || !pregunta_id || !respuesta) {
      return res.status(400).json({ error: 'sesion_id, pregunta_id y respuesta son requeridos' });
    }
    if (esEstudiante(req)) {
      const [sesion] = await sequelize.query(
        'SELECT id_candidato FROM sesiones_examen WHERE id = :sesion_id',
        { replacements: { sesion_id }, type: QueryTypes.SELECT }
      );
      if (!sesion || sesion.id_candidato !== req.usuario.id_candidato) {
        return res.status(403).json({ error: 'No puede responder un examen que no le pertenece' });
      }
    }
    const resultado = await responderPregunta(sesion_id, pregunta_id, respuesta);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

// GET /api/examen/sesion/:id  — ver estado de una sesión
router.get('/sesion/:id', async (req, res, next) => {
  try {
    const [sesion] = await sequelize.query(
      'SELECT id, id_candidato, numero_pregunta, completado, dictamen, created_at FROM sesiones_examen WHERE id = :id',
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
    );
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    if (esEstudiante(req) && sesion.id_candidato !== req.usuario.id_candidato) {
      return res.status(403).json({ error: 'No puede consultar una sesión que no le pertenece' });
    }
    res.json(sesion);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
