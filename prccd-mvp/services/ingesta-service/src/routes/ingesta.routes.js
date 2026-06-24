// Módulo: Rutas REST — Ingesta de Expedientes
const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validate.middleware');
const { procesarExpediente } = require('../services/ingesta.service');

const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

const router = express.Router();

// GET /api/ingesta/candidatos/stats — interno, consumido por dashboard-service (rol SERVICE)
router.get('/candidatos/stats', async (req, res, next) => {
  try {
    const [totales] = await sequelize.query(
      `SELECT
         COUNT(*)::int                                              AS total_candidatos,
         COUNT(*) FILTER (WHERE estado = 'ACTIVO')::int            AS activos,
         COUNT(*) FILTER (WHERE estado != 'ACTIVO')::int           AS inactivos
       FROM candidatos`,
      { type: QueryTypes.SELECT }
    );

    const porUniversidad = await sequelize.query(
      `SELECT universidad_origen AS universidad, COUNT(*)::int AS total
       FROM candidatos
       GROUP BY universidad_origen
       ORDER BY universidad_origen`,
      { type: QueryTypes.SELECT }
    );

    return res.json({
      status: 'ok',
      stats: {
        total_candidatos: totales.total_candidatos,
        activos:          totales.activos,
        inactivos:        totales.inactivos,
        por_universidad:  porUniversidad,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Multer almacena el archivo en memoria para pasarlo al adaptador como Buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['text/csv', 'application/json', 'application/xml', 'text/xml', 'text/plain'];
    // Algunos clientes no envían el mimetype correcto; también verificamos extensión
    const ext = file.originalname.split('.').pop().toLowerCase();
    const allowedExt = ['csv', 'json', 'xml'];
    if (allowed.includes(file.mimetype) || allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(Object.assign(new Error('Tipo de archivo no permitido'), { status: 422 }));
    }
  },
});

/**
 * POST /api/ingest
 * Body (multipart/form-data):
 *   archivo: File
 *   universidad: "USAC" | "UCR" | "UES"
 */
router.post(
  '/',
  upload.single('archivo'),
  [
    body('universidad')
      .notEmpty().withMessage('El campo "universidad" es obligatorio')
      .isIn(['USAC', 'UCR', 'UES']).withMessage('universidad debe ser USAC, UCR o UES'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'El campo "archivo" es obligatorio' });
      }

      const { universidad } = req.body;

      const resumen = await procesarExpediente(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        universidad
      );

      return res.status(200).json({ status: 'ok', ...resumen });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
