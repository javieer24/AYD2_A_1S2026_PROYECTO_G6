const router = require('express').Router();
const multer = require('multer');
const { transcribir, transcribirYResponder } = require('../services/voz.service');

const FORMATOS_VALIDOS = [
  'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/mpga',
  'audio/m4a', 'audio/wav', 'audio/webm', 'audio/ogg',
  'video/mp4', 'video/mpeg',
];
const MAX_BYTES = 25 * 1024 * 1024; // límite de Whisper API: 25 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
  fileFilter(_req, file, cb) {
    if (FORMATOS_VALIDOS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Formato de audio no soportado: ${file.mimetype}`));
    }
  },
});

// POST /api/voz/transcribir
// multipart/form-data con campo "audio" (archivo de audio)
// Responde: { texto, duracion, idioma }
router.post('/transcribir', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Se requiere un archivo de audio en el campo "audio"' });
    }

    const resultado = await transcribir(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    res.json({ status: 'ok', ...resultado });
  } catch (err) {
    next(err);
  }
});

// POST /api/voz/responder
// multipart/form-data: campo "audio" + campos de texto "sesion_id" y "pregunta_id"
// Transcribe el audio, extrae la opción (A/B/C/D) y la envía a examen-service.
// Responde: { texto_transcrito, respuesta_enviada, resultado_examen }
router.post('/responder', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Se requiere un archivo de audio en el campo "audio"' });
    }

    const { sesion_id, pregunta_id } = req.body;
    if (!sesion_id || !pregunta_id) {
      return res.status(400).json({ status: 'error', message: 'sesion_id y pregunta_id son requeridos' });
    }

    const resultado = await transcribirYResponder(
      req.file.buffer,
      sesion_id,
      pregunta_id,
      req.headers['authorization']
    );

    res.json({ status: 'ok', ...resultado });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
