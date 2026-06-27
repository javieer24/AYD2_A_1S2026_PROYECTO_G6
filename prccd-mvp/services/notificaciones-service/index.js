require('dotenv').config();
const app = require('./src/app');
const env = require('./src/config/env');
const { startConsumer } = require('./src/consumers/kafka.consumer');

async function main() {
  try {
    app.listen(env.port, () => {
      console.log(`Notificaciones service corriendo en http://localhost:${env.port}`);
      console.log(`Health check: http://localhost:${env.port}/health`);
    });

    await startConsumer();
  } catch (err) {
    console.error('No se pudo iniciar notificaciones-service:', err.message);
    process.exit(1);
  }
}

main();
