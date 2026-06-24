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

// GET /api/examen/stats — interno, consumido por dashboard-service (rol SERVICE)
router.get('/stats', async (req, res, next) => {
  try {
    const [totales] = await sequelize.query(
      `SELECT
         COUNT(*)::int                                                    AS total_sesiones,
         COUNT(*) FILTER (WHERE completado = true)::int                  AS completadas,
         COUNT(*) FILTER (WHERE completado = false)::int                 AS en_progreso,
         COUNT(*) FILTER (WHERE dictamen = 'Aprobado')::int              AS aprobados,
         COUNT(*) FILTER (WHERE dictamen = 'Reprobado')::int             AS reprobados,
         COUNT(*) FILTER (WHERE dictamen = 'Suspendido')::int            AS suspendidos
       FROM sesiones_examen`,
      { type: QueryTypes.SELECT }
    );

    const porNivel = await sequelize.query(
      `SELECT nivel_actual AS nivel, COUNT(*)::int AS total
       FROM sesiones_examen
       WHERE completado = false
       GROUP BY nivel_actual
       ORDER BY nivel_actual`,
      { type: QueryTypes.SELECT }
    );

    const total = totales.completadas || 1;
    const porcentaje_aprobacion = ((totales.aprobados / total) * 100).toFixed(1);

    return res.json({
      status: 'ok',
      stats: {
        total_sesiones:       totales.total_sesiones,
        completadas:          totales.completadas,
        en_progreso:          totales.en_progreso,
        aprobados:            totales.aprobados,
        reprobados:           totales.reprobados,
        suspendidos:          totales.suspendidos,
        porcentaje_aprobacion: parseFloat(porcentaje_aprobacion),
        en_progreso_por_nivel: porNivel,
      },
    });
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
