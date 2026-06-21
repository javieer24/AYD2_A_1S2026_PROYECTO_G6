require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const env = require('./src/config/env');

async function main() {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`Dashboard service corriendo en http://localhost:${env.port}`);
      console.log(`Health check: http://localhost:${env.port}/health`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
}

main();
