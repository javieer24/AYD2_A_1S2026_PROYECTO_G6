require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3009,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'prccd_secret_2026',
  examenServiceUrl: process.env.EXAMEN_SERVICE_URL || 'http://examen-service:3003',
};
