// Módulo: Rutas REST — Dashboard BI
const express = require('express');
const router = express.Router();
const { createServiceClient } = require('../config/serviceClient');

const INGESTA_URL      = process.env.INGESTA_SERVICE_URL      || 'http://ingesta-service:3002';
const EXAMEN_URL       = process.env.EXAMEN_SERVICE_URL       || 'http://examen-service:3003';
const CERTIFICADO_URL  = process.env.CERTIFICADO_SERVICE_URL  || 'http://certificado-service:3004';

// GET /api/dashboard/stats
router.get('/stats', async (req, res, next) => {
  try {
    const client = createServiceClient();

    const [ingestaRes, examenRes, certRes] = await Promise.allSettled([
      client.get(`${INGESTA_URL}/api/ingesta/candidatos/stats`),
      client.get(`${EXAMEN_URL}/api/examen/stats`),
      client.get(`${CERTIFICADO_URL}/api/certificate/stats/interno`),
    ]);

    const candidatosStats = ingestaRes.status === 'fulfilled'
      ? ingestaRes.value.data.stats
      : { error: 'ingesta-service no disponible' };

    const examenStats = examenRes.status === 'fulfilled'
      ? examenRes.value.data.stats
      : { error: 'examen-service no disponible' };

    const certStats = certRes.status === 'fulfilled'
      ? certRes.value.data.stats
      : { error: 'certificado-service no disponible' };

    return res.status(200).json({
      status: 'ok',
      nota: 'Datos agregados y anonimizados — sin datos personales identificables',
      metricas: {
        candidatos: candidatosStats,
        examenes: examenStats,
        certificados: certStats,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
