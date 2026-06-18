// Módulo: Rutas del motor de examen adaptativo
// Responsable: Jencer Hamilton Hernandez Alonzo — 202002141
// Rama: feature/motor-examen-adaptativo
// Tarea: F2-02

const router = require('express').Router();
const { iniciarExamen, responderPregunta } = require('../services/examen.service');

// POST /api/examen/iniciar
// Body: { "id_candidato": "USAC-2024-001" }
router.post('/iniciar', async (req, res, next) => {
  try {
    const { id_candidato } = req.body;
    if (!id_candidato) {
      return res.status(400).json({ error: 'id_candidato es requerido' });
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
    const resultado = await responderPregunta(sesion_id, pregunta_id, respuesta);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

// GET /api/examen/preguntas?nivel=Medio

router.get('/preguntas', async (req, res, next) => {
  try {
    const { sequelize } = require('../config/database');
    const { QueryTypes } = require('sequelize');
    const { nivel } = req.query;

    let query = 'SELECT id, numero, nivel, categoria, pregunta FROM preguntas';
    const replacements = {};

    if (nivel) {
      query += ' WHERE nivel = :nivel';
      replacements.nivel = nivel;
    }

    query += ' ORDER BY nivel, numero';

    const preguntas = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    res.json({
      total: preguntas.length,
      preguntas
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/examen/sesion/:id  — ver estado de una sesión
router.get('/sesion/:id', async (req, res, next) => {
  try {
    const { sequelize } = require('../config/database');
    const { QueryTypes } = require('sequelize');
    const [sesion] = await sequelize.query(
      'SELECT id, id_candidato, numero_pregunta, completado, dictamen, created_at FROM sesiones_examen WHERE id = :id',
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
    );
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.json(sesion);
  } catch (err) {
    next(err);
  }
});

module.exports = router;