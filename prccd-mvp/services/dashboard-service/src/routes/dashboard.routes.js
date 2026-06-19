// Módulo: Rutas REST — Dashboard BI
const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

// GET /api/dashboard/stats
router.get('/stats', async (req, res, next) => {
  try {
    const { pais, carrera, genero } = req.query;

    // Total candidatos por universidad — anonimizado
    const porUniversidad = await sequelize.query(
      `SELECT universidad_origen, COUNT(*) as total
       FROM candidatos
       GROUP BY universidad_origen`,
      { type: QueryTypes.SELECT }
    );

    // Total por carrera — anonimizado
    const porCarrera = await sequelize.query(
      `SELECT carrera, COUNT(*) as total
       FROM candidatos
       ${carrera ? 'WHERE carrera = :carrera' : ''}
       GROUP BY carrera
       ORDER BY total DESC`,
      { replacements: { carrera }, type: QueryTypes.SELECT }
    );

    // Estadisticas de examenes
    const estadisticasExamen = await sequelize.query(
      `SELECT
         COUNT(*) as total_sesiones,
         COUNT(CASE WHEN UPPER(dictamen) = 'APROBADO' THEN 1 END) as aprobados,
         COUNT(CASE WHEN UPPER(dictamen) = 'REPROBADO' THEN 1 END) as reprobados,
         COUNT(CASE WHEN completado = false THEN 1 END) as en_progreso
       FROM sesiones_examen`,
      { type: QueryTypes.SELECT }
    );

    // Total certificados emitidos
    const certificados = await sequelize.query(
      `SELECT COUNT(*) as total_emitidos,
              COUNT(CASE WHEN estado = 'VIGENTE' THEN 1 END) as vigentes
       FROM certificados`,
      { type: QueryTypes.SELECT }
    );

    return res.status(200).json({
      status: 'ok',
      nota: 'Datos agregados y anonimizados — sin datos personales identificables',
      metricas: {
        candidatos_por_universidad: porUniversidad,
        candidatos_por_carrera: porCarrera,
        examenes: estadisticasExamen[0],
        certificados: certificados[0]
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
