// Módulo: Emisión y verificación de certificados digitales (firma PKI + log inmutable)
// Tarea: F2-17 / F2-18
//
// Usa la tabla "certificados_pki" (migración 006_create_certificados_pki.sql),
// separada de la tabla "certificados" de F2-27 (POST /issue, GET /verify) que
// usa un esquema distinto (hash simple sin cadena de bloques). Ambas
// implementaciones conviven en este servicio bajo rutas distintas.

const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const pki = require('./pki.service');
const { publish } = require('../config/kafka.producer');
const { TOPICS } = require('../config/kafka.topics');

async function emitirCertificado(sesion_id) {
  const [sesion] = await sequelize.query(
    `SELECT * FROM sesiones_examen WHERE id = :sesion_id`,
    { replacements: { sesion_id }, type: QueryTypes.SELECT }
  );
  if (!sesion) throw Object.assign(new Error('Sesión de examen no encontrada'), { status: 404 });
  if (!sesion.completado) {
    throw Object.assign(new Error('El examen aún no ha finalizado'), { status: 409 });
  }
  if (sesion.dictamen !== 'Aprobado') {
    throw Object.assign(
      new Error('El candidato no aprobó el examen; no procede la emisión de certificado'),
      { status: 409 }
    );
  }

  const [existente] = await sequelize.query(
    `SELECT * FROM certificados_pki WHERE sesion_examen_id = :sesion_id`,
    { replacements: { sesion_id }, type: QueryTypes.SELECT }
  );
  if (existente) return formatearCertificado(existente);

  const [candidato] = await sequelize.query(
    `SELECT * FROM candidatos WHERE id_candidato = :id_candidato`,
    { replacements: { id_candidato: sesion.id_candidato }, type: QueryTypes.SELECT }
  );

  const id_certificado = `CERT-${sesion.id_candidato}-${Date.now()}`;
  const fecha_emision = new Date().toISOString();

  const documento = {
    id_certificado,
    id_candidato: sesion.id_candidato,
    nombre_completo: candidato ? candidato.nombre_completo : null,
    universidad_origen: candidato ? candidato.universidad_origen : null,
    carrera: candidato ? candidato.carrera : null,
    sesion_examen_id: sesion.id,
    dictamen: sesion.dictamen,
    fecha_emision,
  };

  const hash_documento = pki.hashDocumento(documento);
  const firma = pki.firmarHash(hash_documento);
  const { publicKey } = pki.getCAKeyPair();

  const [ultimo] = await sequelize.query(
    `SELECT numero_bloque, hash_bloque FROM certificados_pki ORDER BY numero_bloque DESC LIMIT 1`,
    { type: QueryTypes.SELECT }
  );
  const numero_bloque = ultimo ? ultimo.numero_bloque + 1 : 1;
  const hash_anterior = ultimo ? ultimo.hash_bloque : null;
  const hash_bloque = pki.hashBloque({
    hashDocumento: hash_documento,
    hashAnterior: hash_anterior,
    numeroBloque: numero_bloque,
    timestamp: fecha_emision,
  });

  const resultado = await sequelize.query(
    `INSERT INTO certificados_pki
       (id_certificado, sesion_examen_id, id_candidato, documento, hash_documento, firma, llave_publica, numero_bloque, hash_anterior, hash_bloque)
     VALUES (:id_certificado, :sesion_id, :id_candidato, :documento::jsonb, :hash_documento, :firma, :llave_publica, :numero_bloque, :hash_anterior, :hash_bloque)
     RETURNING *`,
    {
      replacements: {
        id_certificado,
        sesion_id: sesion.id,
        id_candidato: sesion.id_candidato,
        documento: JSON.stringify(documento),
        hash_documento,
        firma,
        llave_publica: publicKey,
        numero_bloque,
        hash_anterior,
        hash_bloque,
      },
      type: QueryTypes.RAW,
    }
  );

  const cert = formatearCertificado(resultado[0][0]);

  publish(TOPICS.CERTIFICADO_EMITIDO, {
    id_certificado: cert.id_certificado,
    id_candidato: cert.id_candidato,
    hash_documento: cert.hash_documento,
    sesion_examen_id: cert.sesion_examen_id || sesion.id,
  });

  return cert;
}

async function verificarCertificado(identificador) {
  const [cert] = await sequelize.query(
    `SELECT * FROM certificados_pki WHERE id_certificado = :id OR hash_documento = :id OR hash_bloque = :id LIMIT 1`,
    { replacements: { id: identificador }, type: QueryTypes.SELECT }
  );
  if (!cert) return { valido: false, motivo: 'Certificado no encontrado' };

  const firmaValida = pki.verificarFirma(cert.hash_documento, cert.firma);
  const hashRecalculado = pki.hashBloque({
    hashDocumento: cert.hash_documento,
    hashAnterior: cert.hash_anterior,
    numeroBloque: cert.numero_bloque,
    timestamp: cert.documento.fecha_emision,
  });
  const bloqueIntegro = hashRecalculado === cert.hash_bloque;

  return {
    valido: firmaValida && bloqueIntegro && cert.estado === 'EMITIDO',
    estado: cert.estado,
    firmaValida,
    bloqueIntegro,
    certificado: formatearCertificado(cert),
  };
}

// Recorre todo el log inmutable y confirma que ningún bloque fue alterado
// ni desencadenado (F2-18: log inmutable de certificados).
async function verificarCadena() {
  const bloques = await sequelize.query(
    `SELECT * FROM certificados_pki ORDER BY numero_bloque ASC`,
    { type: QueryTypes.SELECT }
  );

  let hashAnteriorEsperado = null;
  for (const bloque of bloques) {
    if (bloque.hash_anterior !== hashAnteriorEsperado) {
      return {
        integra: false,
        motivo: `Cadena rota en el bloque ${bloque.numero_bloque}: hash_anterior no coincide con el bloque previo`,
      };
    }
    const hashRecalculado = pki.hashBloque({
      hashDocumento: bloque.hash_documento,
      hashAnterior: bloque.hash_anterior,
      numeroBloque: bloque.numero_bloque,
      timestamp: bloque.documento.fecha_emision,
    });
    if (hashRecalculado !== bloque.hash_bloque) {
      return { integra: false, motivo: `El bloque ${bloque.numero_bloque} fue alterado: hash no coincide` };
    }
    hashAnteriorEsperado = bloque.hash_bloque;
  }

  return { integra: true, totalBloques: bloques.length };
}

function formatearCertificado(row) {
  return {
    id_certificado: row.id_certificado,
    id_candidato: row.id_candidato,
    documento: row.documento,
    hash_documento: row.hash_documento,
    firma: row.firma,
    numero_bloque: row.numero_bloque,
    hash_anterior: row.hash_anterior,
    hash_bloque: row.hash_bloque,
    estado: row.estado,
    created_at: row.created_at,
  };
}

module.exports = { emitirCertificado, verificarCertificado, verificarCadena };
