// Módulo: Conexión a PostgreSQL con Sequelize
// Responsable: Javier Andrés Monjes Solórzano — 202100081
// Rama: feature/ingesta-usac
// Tarea: F2-01

const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'postgres',
  logging: env.nodeEnv === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL conectado correctamente.');
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la BD.');
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error.message);
    throw error;
  }
}

module.exports = { sequelize, connectDB };
