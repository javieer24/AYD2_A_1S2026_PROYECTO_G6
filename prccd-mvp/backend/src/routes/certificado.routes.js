// Módulo: Rutas REST — Certificados
const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const crypto = require('crypto');

// POST /api/certificate/issue
router.post('/issue', async (req, res, next) => {
  try {
    const { id_candidato, sesion_id, datos_certificado } = req.body;
    if (!id_candidato || !sesion_id) {
      return res.status(400).json({ status: 'error', message: 'id_candidato y sesion_id son requeridos' });
    }

    const contenido = JSON.stringify({ id_candidato, sesion_id, datos_certificado, emitido_en: new Date().toISOString() });
    const hash_certificado = crypto.createHash('sha256').update(contenido).digest('hex');
    const firma_digital = crypto.createHash('sha512').update(contenido + process.env.JWT_SECRET).digest('hex');

    const [certificado] = await sequelize.query(
      `INSERT INTO certificados (id_candidato, sesion_id, hash_certificado, firma_digital, datos_certificado)
       VALUES (:id_candidato, :sesion_id, :hash_certificado, :firma_digital, :datos_certificado)
       RETURNING id, hash_certificado, emitido_en`,
      {
        replacements: {
          id_candidato, sesion_id,
          hash_certificado, firma_digital,
          datos_certificado: JSON.stringify(datos_certificado || {})
        },
        type: QueryTypes.INSERT
      }
    );

    return res.status(201).json({
      status: 'ok',
      message: 'Certificado emitido',
      certificado: {
        id: certificado[0].id,
        hash: certificado[0].hash_certificado,
        emitido_en: certificado[0].emitido_en
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/certificate/verify?hash=abc123
router.get('/verify', async (req, res, next) => {
  try {
    const { hash } = req.query;
    if (!hash) {
      return res.status(400).json({ status: 'error', message: 'El parametro hash es requerido' });
    }

    const [certificado] = await sequelize.query(
      `SELECT id, id_candidato, sesion_id, hash_certificado, estado, emitido_en, datos_certificado
       FROM certificados WHERE hash_certificado = :hash`,
      { replacements: { hash }, type: QueryTypes.SELECT }
    );

    if (!certificado) {
      return res.status(404).json({ status: 'error', message: 'Certificado no encontrado' });
    }

    return res.status(200).json({
      status: 'ok',
      valido: certificado.estado === 'VIGENTE',
      certificado
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;