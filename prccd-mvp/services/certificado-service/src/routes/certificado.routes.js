// Módulo: Rutas REST — Certificados
//
// Este servicio expone DOS implementaciones de certificados que conviven en
// paralelo (decisión tomada al separar en microservicios, ya que ambas se
// habían construido por separado y ninguna reemplaza del todo a la otra):
//
//   1. /issue, /verify        — F2-27 (Oswaldo Choc): hash+firma simple con
//      crypto, tabla "certificados".
//   2. /emitir, /verificar/:id, /cadena/verificar — F2-17/F2-18 (Javier
//      Monjes): firma RSA-PSS real vía Autoridad Certificadora local + log
//      inmutable encadenado (hash-chain), tabla "certificados_pki".
const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const crypto = require('crypto');
const certificadoPki = require('../services/certificado.service');

// ───────────────────────── F2-27: emisión simple ─────────────────────────

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

// ───────────────────── F2-17/F2-18: emisión PKI + log inmutable ─────────────────────

// POST /api/certificate/emitir
// Body: { "sesion_id": 1 }
router.post('/emitir', async (req, res, next) => {
  try {
    const { sesion_id } = req.body;
    if (!sesion_id) {
      return res.status(400).json({ status: 'error', message: 'sesion_id es requerido' });
    }
    const certificado = await certificadoPki.emitirCertificado(sesion_id);
    res.status(201).json({ status: 'ok', certificado });
  } catch (err) {
    next(err);
  }
});

// GET /api/certificate/verificar/:id — público, verificación externa (RF-10)
router.get('/verificar/:id', async (req, res, next) => {
  try {
    const resultado = await certificadoPki.verificarCertificado(req.params.id);
    res.json({ status: 'ok', ...resultado });
  } catch (err) {
    next(err);
  }
});

// GET /api/certificate/cadena/verificar — público, integridad de todo el log inmutable
router.get('/cadena/verificar', async (req, res, next) => {
  try {
    const resultado = await certificadoPki.verificarCadena();
    res.json({ status: 'ok', ...resultado });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
