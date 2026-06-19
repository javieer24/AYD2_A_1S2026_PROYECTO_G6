// Módulo: Rutas de telemetría antifraude
// Responsable: Javier Andrés Monjes Solórzano — 202100081
// Rama: feature/infra-setup
// Tarea: F2-13

const router = require('express').Router();
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validate.middleware');
const {
  TIPOS_VALIDOS,
  obtenerSesion,
  registrarYEvaluar,
  listarEventos,
} = require('../services/telemetria.service');

function esEstudiante(req) {
  return req.usuario && req.usuario.rol === 'ESTUDIANTE';
}

// POST /api/telemetria
// Body: { "sesion_id": 1, "tipo_evento": "CAMBIO_PESTANA", "metadatos": {} }
// El frontend dispara esto ante eventos sospechosos durante el examen
// (cambio de pestaña, pérdida de foco, copiar/pegar, devtools abiertas, etc.)
router.post(
  '/',
  [
    body('sesion_id').notEmpty().isInt().withMessage('sesion_id debe ser un entero'),
    body('tipo_evento').isIn(TIPOS_VALIDOS).withMessage(`tipo_evento debe ser uno de: ${TIPOS_VALIDOS.join(', ')}`),
    body('metadatos').optional().isObject().withMessage('metadatos debe ser un objeto'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { sesion_id, tipo_evento, metadatos } = req.body;

      const sesion = await obtenerSesion(sesion_id);
      if (!sesion) return res.status(404).json({ status: 'error', message: 'Sesión no encontrada' });

      if (esEstudiante(req) && sesion.id_candidato !== req.usuario.id_candidato) {
        return res.status(403).json({ status: 'error', message: 'No puede reportar eventos de una sesión que no le pertenece' });
      }

      const resultado = await registrarYEvaluar(sesion_id, sesion.id_candidato, tipo_evento, metadatos);
      res.status(201).json({ status: 'ok', ...resultado });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/telemetria/:sesion_id — revisar bitácora de una sesión
// (el propio candidato puede ver la suya; staff puede ver cualquiera)
router.get(
  '/:sesion_id',
  [param('sesion_id').isInt().withMessage('sesion_id debe ser un entero')],
  validateRequest,
  async (req, res, next) => {
    try {
      const { sesion_id } = req.params;

      const sesion = await obtenerSesion(sesion_id);
      if (!sesion) return res.status(404).json({ status: 'error', message: 'Sesión no encontrada' });

      if (esEstudiante(req) && sesion.id_candidato !== req.usuario.id_candidato) {
        return res.status(403).json({ status: 'error', message: 'No puede consultar eventos de una sesión que no le pertenece' });
      }

      const eventos = await listarEventos(sesion_id);
      res.json({ status: 'ok', sesion_id: Number(sesion_id), eventos });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
