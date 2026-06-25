// Módulo: Rutas REST — Evidencia antifraude (MinIO)
const router = require('express').Router();
const multer = require('multer');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const { subirEvidencia, listarEvidencia, descargarEvidencia, TIPOS_VALIDOS } = require('../services/evidencia.service');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 250 * 1024 * 1024 }, // 250 MB — video evidencia antifraude (grabacion sesion completa)
});

function esEstudiante(req) {
  return req.usuario && req.usuario.rol === 'ESTUDIANTE';
}
function esStaff(req) {
  return req.usuario && ['ADMIN', 'EVALUADOR', 'COORDINADOR'].includes(req.usuario.rol);
}

async function obtenerSesion(sesion_id) {
  const [sesion] = await sequelize.query(
    'SELECT id, id_candidato FROM sesiones_examen WHERE id = :sesion_id',
    { replacements: { sesion_id }, type: QueryTypes.SELECT }
  );
  return sesion || null;
}

// POST /api/telemetria/evidencia — multipart/form-data: archivo + sesion_id + tipo
router.post('/', upload.single('archivo'), async (req, res, next) => {
  try {
    const { sesion_id, tipo } = req.body;
    if (!sesion_id || !tipo) {
      return res.status(400).json({ status: 'error', message: 'sesion_id y tipo son requeridos' });
    }
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'El campo "archivo" es obligatorio' });
    }

    const sesion = await obtenerSesion(sesion_id);
    if (!sesion) return res.status(404).json({ status: 'error', message: 'Sesión no encontrada' });
    if (esEstudiante(req) && sesion.id_candidato !== req.usuario.id_candidato) {
      return res.status(403).json({ status: 'error', message: 'No puede subir evidencia de una sesión que no le pertenece' });
    }

    const resultado = await subirEvidencia({
      sesion_id,
      id_candidato: sesion.id_candidato,
      tipo,
      buffer: req.file.buffer,
      nombreOriginal: req.file.originalname,
    });

    res.status(201).json({ status: 'ok', evidencia: resultado });
  } catch (err) {
    next(err);
  }
});

// GET /api/telemetria/evidencia/:sesion_id — listar metadatos (sin el archivo)
router.get('/:sesion_id', async (req, res, next) => {
  try {
    const { sesion_id } = req.params;
    const sesion = await obtenerSesion(sesion_id);
    if (!sesion) return res.status(404).json({ status: 'error', message: 'Sesión no encontrada' });
    if (esEstudiante(req) && sesion.id_candidato !== req.usuario.id_candidato) {
      return res.status(403).json({ status: 'error', message: 'No puede consultar evidencia de una sesión que no le pertenece' });
    }
    const evidencias = await listarEvidencia(sesion_id);
    res.json({ status: 'ok', sesion_id: Number(sesion_id), evidencias });
  } catch (err) {
    next(err);
  }
});

// GET /api/telemetria/evidencia/descargar/:id — solo staff, descarga el archivo descifrado
router.get('/descargar/:id', async (req, res, next) => {
  try {
    if (!esStaff(req)) {
      return res.status(403).json({ status: 'error', message: 'Solo personal autorizado puede descargar evidencia' });
    }
    const resultado = await descargarEvidencia(req.params.id);
    if (!resultado) return res.status(404).json({ status: 'error', message: 'Evidencia no encontrada' });
    if (!resultado.integro) {
      return res.status(409).json({ status: 'error', message: 'La evidencia no superó la verificación de integridad (hash no coincide)' });
    }
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="evidencia_${req.params.id}"`);
    res.send(resultado.contenido);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
