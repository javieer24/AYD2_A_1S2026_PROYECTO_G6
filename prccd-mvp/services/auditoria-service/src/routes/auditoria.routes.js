// Módulo: Rutas REST — Auditoría
const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

// GET /api/audit/trail?sesion_id=1
router.get('/trail', async (req, res, next) => {
  try {
    const { sesion_id } = req.query;
    if (!sesion_id) {
      return res.status(400).json({ status: 'error', message: 'sesion_id es requerido' });
    }
    const registros = await sequelize.query(
      `SELECT id, sesion_id, id_candidato, tipo_evento, metadatos, fecha_retencion, creado_en
       FROM auditoria WHERE sesion_id = :sesion_id ORDER BY creado_en ASC`,
      { replacements: { sesion_id }, type: QueryTypes.SELECT }
    );
    return res.status(200).json({ status: 'ok', sesion_id, total: registros.length, registros });
  } catch (err) {
    next(err);
  }
});

// POST /api/audit/trail
router.post('/trail', async (req, res, next) => {
  try {
    const { sesion_id, id_candidato, tipo_evento, metadatos } = req.body;
    if (!sesion_id || !id_candidato || !tipo_evento) {
      return res.status(400).json({ status: 'error', message: 'sesion_id, id_candidato y tipo_evento son requeridos' });
    }
    const fecha_retencion = new Date();
    fecha_retencion.setFullYear(fecha_retencion.getFullYear() + 5);
    const [registro] = await sequelize.query(
      `INSERT INTO auditoria (sesion_id, id_candidato, tipo_evento, metadatos, fecha_retencion)
       VALUES (:sesion_id, :id_candidato, :tipo_evento, :metadatos, :fecha_retencion)
       RETURNING id, creado_en`,
      {
        replacements: { sesion_id, id_candidato, tipo_evento, metadatos: JSON.stringify(metadatos || {}), fecha_retencion },
        type: QueryTypes.INSERT
      }
    );
    return res.status(201).json({ status: 'ok', message: 'Evento registrado', id: registro[0].id, fecha_retencion });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
