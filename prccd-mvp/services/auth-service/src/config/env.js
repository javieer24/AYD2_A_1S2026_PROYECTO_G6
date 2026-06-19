require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'prccd_db',
    user: process.env.DB_USER || 'prccd_user',
    password: process.env.DB_PASSWORD || 'prccd_pass',
  },
};
