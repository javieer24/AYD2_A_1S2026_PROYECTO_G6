// Módulo: Rutas REST — Banco de Preguntas (motor adaptativo)
// Banco de preguntas en MongoDB (decisión de arquitectura de Fase 1: esquema
// documental flexible, sin joins relacionales durante el examen activo).
const router = require('express').Router();
const { getPreguntasCollection } = require('../config/mongo');

const NIVELES_VALIDOS = ['Básico', 'Medio', 'Avanzado'];

function esStaff(req) {
  return req.usuario && ['ADMIN', 'EVALUADOR'].includes(req.usuario.rol);
}

// GET /api/examen/preguntas?nivel=Medio — listar (oculta respuesta_correcta)
router.get('/', async (req, res, next) => {
  try {
    const { nivel } = req.query;
    const filtro = nivel ? { nivel } : {};
    const preguntas = await getPreguntasCollection()
      .find(filtro, { projection: { _id: 0, respuesta_correcta: 0 } })
      .sort({ numero: 1 })
      .toArray();
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
    const { numero, nivel, categoria, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, metadatos } = req.body;
    if (!nivel || !NIVELES_VALIDOS.includes(nivel)) {
      return res.status(400).json({ status: 'error', message: `nivel debe ser uno de: ${NIVELES_VALIDOS.join(', ')}` });
    }
    if (!pregunta || !opcion_a || !opcion_b || !opcion_c || !opcion_d || !respuesta_correcta) {
      return res.status(400).json({ status: 'error', message: 'pregunta, opcion_a..d y respuesta_correcta son requeridos' });
    }
    if (!['A', 'B', 'C', 'D'].includes(respuesta_correcta.toUpperCase())) {
      return res.status(400).json({ status: 'error', message: 'respuesta_correcta debe ser A, B, C o D' });
    }

    const coleccion = getPreguntasCollection();
    const [ultima] = await coleccion.find().sort({ id: -1 }).limit(1).toArray();
    const nuevoId = ultima ? ultima.id + 1 : 1;

    const documento = {
      id: nuevoId,
      numero: numero || nuevoId,
      nivel,
      categoria: categoria || null,
      pregunta,
      opcion_a, opcion_b, opcion_c, opcion_d,
      respuesta_correcta: respuesta_correcta.toUpperCase(),
      // Campo flexible: el modelo documental permite agregar atributos
      // heterogeneos (ej. parametros IRT, tipo de pregunta) sin migracion.
      metadatos: metadatos || {},
    };
    await coleccion.insertOne(documento);

    res.status(201).json({ status: 'ok', pregunta: { id: nuevoId, numero: documento.numero, nivel } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
