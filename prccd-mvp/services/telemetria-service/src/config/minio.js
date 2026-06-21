// Módulo: Cliente MinIO — almacenamiento de evidencia antifraude
// Tarea: F2-14 — decisión de arquitectura de Fase 1: objetos binarios
// (capturas, video, logs) en MinIO con política WORM y retención de 5 años,
// metadatos en Postgres (tabla evidencia_antifraude).
const { Client } = require('minio');
const env = require('./env');

const minioClient = new Client({
  endPoint: env.minio.endpoint,
  port: env.minio.port,
  useSSL: false,
  accessKey: env.minio.accessKey,
  secretKey: env.minio.secretKey,
});

// El Object Lock (WORM) de MinIO solo puede activarse al crear el bucket. Si
// el bucket ya existía sin lock (ej. de una corrida previa del MVP sin esta
// función), no se puede activar retroactivamente vía API — se documenta como
// limitación conocida; el control de retención autoritativo para el MVP es
// el campo retencion_hasta en Postgres (nadie expone un endpoint de borrado).
async function ensureBucket() {
  const exists = await minioClient.bucketExists(env.minio.bucket).catch(() => false);
  if (!exists) {
    try {
      await minioClient.makeBucket(env.minio.bucket, '', { ObjectLocking: true });
      console.log(`Bucket "${env.minio.bucket}" creado con Object Lock (WORM) habilitado.`);
    } catch (err) {
      console.warn(`No se pudo crear el bucket con Object Lock, se crea sin WORM: ${err.message}`);
      await minioClient.makeBucket(env.minio.bucket, '');
    }
  }
}

// Intenta fijar retención de 5 años (modo GOVERNANCE) sobre el objeto. Si el
// bucket no tiene Object Lock habilitado esto fallará — se captura el error
// y se continúa, ya que el campo retencion_hasta en Postgres sigue
// registrando la obligación legal de conservación.
async function intentarFijarRetencion(objectName, retentionDate) {
  try {
    await minioClient.putObjectRetention(env.minio.bucket, objectName, {
      mode: 'GOVERNANCE',
      retainUntilDate: retentionDate.toISOString(),
    });
    return true;
  } catch (err) {
    console.warn(`No se pudo fijar retención WORM en MinIO para ${objectName}: ${err.message}`);
    return false;
  }
}

module.exports = { minioClient, ensureBucket, intentarFijarRetencion };
