// Módulo: Rutas REST — Emisión y verificación de certificados PKI
// Responsable: Javier Andrés Monjes Solórzano — 202100081
// Rama: feature/pki-certificado
// Tarea: F2-17 / F2-18

const router = require('express').Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  emitirCertificado,
  verificarCertificado,
  verificarCadena,
} = require('../services/certificado.service');

// POST /api/certificado/emitir — requiere sesión autenticada
// Body: { "sesion_id": 1 }
router.post('/emitir', authMiddleware, async (req, res, next) => {
  try {
    const { sesion_id } = req.body;
    if (!sesion_id) {
      return res.status(400).json({ status: 'error', message: 'sesion_id es requerido' });
    }
    const certificado = await emitirCertificado(sesion_id);
    res.status(201).json({ status: 'ok', certificado });
  } catch (err) {
    next(err);
  }
});

// GET /api/certificado/verificar/:identificador — público (verificación externa, RF-10)
// identificador: id_certificado, hash_documento o hash_bloque
router.get('/verificar/:identificador', async (req, res, next) => {
  try {
    const resultado = await verificarCertificado(req.params.identificador);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

// GET /api/certificado/cadena/verificar — público, integridad del log inmutable completo
router.get('/cadena/verificar', async (req, res, next) => {
  try {
    const resultado = await verificarCadena();
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
