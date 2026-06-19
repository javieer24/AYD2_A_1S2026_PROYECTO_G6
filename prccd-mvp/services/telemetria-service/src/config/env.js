require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3005,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'prccd_db',
    user: process.env.DB_USER || 'prccd_user',
    password: process.env.DB_PASSWORD || 'prccd_pass',
  },

  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    bucket: process.env.MINIO_BUCKET || 'evidencias',
    encryptionKey: process.env.MINIO_ENCRYPTION_KEY || 'prccd_evidencia_key_2026_dev',
  },
};
