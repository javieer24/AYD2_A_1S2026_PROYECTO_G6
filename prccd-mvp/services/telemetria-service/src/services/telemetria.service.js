// Módulo: Telemetría antifraude del examen adaptativo
//
// Reutiliza la tabla "auditoria" (migración 004_create_auditoria.sql,
// Oswaldo Choc — F2-27) como bitácora inmutable de eventos. No se crea una
// tabla nueva para no duplicar el mecanismo de retención de 5 años que ya
// trae esa tabla.

const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const { publish } = require('../config/kafka.producer');
const { TOPICS } = require('../config/kafka.topics');
const { createServiceClient } = require('../config/serviceClient');

const EXAMEN_URL = process.env.EXAMEN_SERVICE_URL || 'http://examen-service:3003';

const TIPOS_VALIDOS = [
  'CAMBIO_PESTANA',
  'PERDIDA_FOCO',
  'COPIAR_PEGAR',
  'DEVTOOLS_DETECTADO',
  'MULTIPLES_PESTANAS',
];

const RETENCION_ANIOS = 5;
const UMBRAL_SUSPENSION = 5; // cantidad de eventos sospechosos antes de suspender el examen

async function obtenerSesion(sesion_id) {
  try {
    const client = createServiceClient();
    const { data } = await client.get(`${EXAMEN_URL}/api/examen/sesion/${sesion_id}`);
    return data || null;
  } catch {
    return null;
  }
}

async function registrarEvento(sesion_id, id_candidato, tipo_evento, metadatos = {}) {
  await sequelize.query(
    `INSERT INTO auditoria (sesion_id, id_candidato, tipo_evento, metadatos, fecha_retencion)
     VALUES (:sesion_id, :id_candidato, :tipo_evento, :metadatos::jsonb, NOW() + INTERVAL '${RETENCION_ANIOS} years')`,
    {
      replacements: {
        sesion_id,
        id_candidato,
        tipo_evento,
        metadatos: JSON.stringify(metadatos),
      },
      type: QueryTypes.INSERT,
    }
  );
}

async function contarEventos(sesion_id) {
  const [{ total }] = await sequelize.query(
    `SELECT COUNT(*)::int AS total FROM auditoria WHERE sesion_id = :sesion_id AND tipo_evento IN (:tipos)`,
    { replacements: { sesion_id, tipos: TIPOS_VALIDOS }, type: QueryTypes.SELECT }
  );
  return total;
}

async function suspenderSiCorresponde(sesion_id) {
  const total = await contarEventos(sesion_id);
  if (total < UMBRAL_SUSPENSION) return { suspendido: false, total };

  await sequelize.query(
    `UPDATE sesiones_examen
     SET completado = true, dictamen = 'Suspendido'
     WHERE id = :sesion_id AND completado = false`,
    { replacements: { sesion_id }, type: QueryTypes.UPDATE }
  );

  publish(TOPICS.FRAUDE_DETECTADO, { sesion_id, total_eventos: total });

  return { suspendido: true, total };
}

async function registrarYEvaluar(sesion_id, id_candidato, tipo_evento, metadatos) {
  await registrarEvento(sesion_id, id_candidato, tipo_evento, metadatos);
  return suspenderSiCorresponde(sesion_id);
}

async function listarEventos(sesion_id) {
  return sequelize.query(
    'SELECT id, tipo_evento, metadatos, creado_en FROM auditoria WHERE sesion_id = :sesion_id ORDER BY creado_en ASC',
    { replacements: { sesion_id }, type: QueryTypes.SELECT }
  );
}

module.exports = {
  TIPOS_VALIDOS,
  UMBRAL_SUSPENSION,
  obtenerSesion,
  registrarYEvaluar,
  listarEventos,
};
