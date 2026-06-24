require('dotenv').config();
const app = require('./src/app');
const env = require('./src/config/env');
const { precalentarModelo } = require('./src/services/voz.service');

async function main() {
  await precalentarModelo();
  app.listen(env.port, () => {
    console.log(`Voz service corriendo en http://localhost:${env.port}`);
    console.log(`Health check: http://localhost:${env.port}/health`);
  });
}

main().catch(err => {
  console.error('No se pudo iniciar voz-service:', err.message);
  process.exit(1);
});
