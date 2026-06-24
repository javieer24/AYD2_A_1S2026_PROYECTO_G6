require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT) || 3008,
  nodeEnv: process.env.NODE_ENV || 'development',

  kafka: {
    broker: process.env.KAFKA_BROKER || 'kafka:9092',
  },

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'SICA PRCCD <noreply@sica.gt>',
  },

  // URL pública del sistema (para links en emails)
  appUrl: process.env.APP_URL || 'http://localhost:80',

  // Emails de coordinadores por universidad
  universidades: {
    USAC: process.env.USAC_EMAIL || 'coordinador@usac.edu.gt',
    UCR:  process.env.UCR_EMAIL  || 'coordinador@ucr.ac.cr',
    UES:  process.env.UES_EMAIL  || 'coordinador@ues.edu.sv',
  },

  // Auditores SICA — lista separada por comas
  auditoresEmails: (process.env.AUDITORES_SICA_EMAILS || 'auditor@sica.gt')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean),

  services: {
    authUrl: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  },

  jwtSecret: process.env.JWT_SECRET || 'prccd_secret_2026',
};
