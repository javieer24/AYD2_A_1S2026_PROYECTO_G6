// Módulo: Almacenamiento seguro de evidencia antifraude (MinIO + cifrado AES-256-GCM)
// Tarea: F2-14
//
// El objeto se cifra en la aplicación antes de subirlo a MinIO (AES-256-GCM,
// llave derivada de MINIO_ENCRYPTION_KEY) — independiente de si el bucket
// soporta SSE. El formato del objeto almacenado es:
//   [iv (12 bytes)][authTag (16 bytes)][ciphertext]
// Los metadatos (no el contenido) se guardan en Postgres, tabla
// evidencia_antifraude, con retención de 5 años (RF-03, R-06).
const crypto = require('crypto');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const { minioClient, ensureBucket, intentarFijarRetencion } = require('../config/minio');
const env = require('../config/env');

const RETENCION_ANIOS = 5;
const TIPOS_VALIDOS = ['CAPTURA_PANTALLA', 'VIDEO', 'LOG_TECLEO', 'OTRO'];

function getEncryptionKey() {
  return crypto.createHash('sha256').update(env.minio.encryptionKey).digest();
}

function cifrar(buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]);
}

function descifrar(objeto) {
  const iv = objeto.subarray(0, 12);
  const authTag = objeto.subarray(12, 28);
  const ciphertext = objeto.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', getEncryptionKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

async function subirEvidencia({ sesion_id, id_candidato, tipo, buffer, nombreOriginal }) {
  if (!TIPOS_VALIDOS.includes(tipo)) {
    throw Object.assign(new Error(`tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}`), { status: 400 });
  }

  await ensureBucket();

  const hash_archivo = crypto.createHash('sha256').update(buffer).digest('hex');
  const objectName = `${sesion_id}/${Date.now()}_${nombreOriginal.replace(/[^a-zA-Z0-9._-]/g, '_')}.enc`;
  const objetoCifrado = cifrar(buffer);

  await minioClient.putObject(env.minio.bucket, objectName, objetoCifrado);

  const retencion_hasta = new Date();
  retencion_hasta.setFullYear(retencion_hasta.getFullYear() + RETENCION_ANIOS);
  await intentarFijarRetencion(objectName, retencion_hasta);

  const [registro] = await sequelize.query(
    `INSERT INTO evidencia_antifraude
       (sesion_id, id_candidato, tipo, url_storage, bucket, size_bytes, hash_archivo, cifrado, retencion_hasta)
     VALUES (:sesion_id, :id_candidato, :tipo, :url_storage, :bucket, :size_bytes, :hash_archivo, true, :retencion_hasta)
     RETURNING id, timestamp_captura, retencion_hasta`,
    {
      replacements: {
        sesion_id, id_candidato, tipo,
        url_storage: objectName,
        bucket: env.minio.bucket,
        size_bytes: buffer.length,
        hash_archivo,
        retencion_hasta,
      },
      type: QueryTypes.INSERT,
    }
  );

  return {
    id: registro[0].id,
    tipo,
    size_bytes: buffer.length,
    hash_archivo,
    timestamp_captura: registro[0].timestamp_captura,
    retencion_hasta: registro[0].retencion_hasta,
  };
}

async function listarEvidencia(sesion_id) {
  return sequelize.query(
    `SELECT id, tipo, size_bytes, hash_archivo, cifrado, timestamp_captura, retencion_hasta
     FROM evidencia_antifraude WHERE sesion_id = :sesion_id ORDER BY timestamp_captura ASC`,
    { replacements: { sesion_id }, type: QueryTypes.SELECT }
  );
}

async function descargarEvidencia(id) {
  const [registro] = await sequelize.query(
    `SELECT * FROM evidencia_antifraude WHERE id = :id`,
    { replacements: { id }, type: QueryTypes.SELECT }
  );
  if (!registro) return null;

  const stream = await minioClient.getObject(registro.bucket, registro.url_storage);
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const objetoCifrado = Buffer.concat(chunks);

  const contenido = registro.cifrado ? descifrar(objetoCifrado) : objetoCifrado;
  const hashVerificado = crypto.createHash('sha256').update(contenido).digest('hex') === registro.hash_archivo;

  return { contenido, registro, integro: hashVerificado };
}

module.exports = { subirEvidencia, listarEvidencia, descargarEvidencia, TIPOS_VALIDOS };
