require('dotenv').config();
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'prccd_db',
  user: process.env.DB_USER || 'prccd_user',
  password: process.env.DB_PASSWORD || 'prccd_pass',
});

async function seedMongo() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/prccd_docs';
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('preguntas');

    const { rows } = await pool.query('SELECT * FROM preguntas');
    
    if (rows.length === 0) {
      console.log('⚠ No hay preguntas en PostgreSQL. Asegúrate de ejecutar seed.js primero.');
      return;
    }

    await collection.deleteMany({});
    const result = await collection.insertMany(rows);
    
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ nivel: 1 });
    
    console.log(`✔ ${result.insertedCount} preguntas migradas a MongoDB correctamente`);
  } catch (err) {
    console.error('Error en seed-mongo:', err.message);
    throw err;
  } finally {
    await pool.end();
    await client.close();
  }
}

setTimeout(() => {
  seedMongo().catch(() => process.exit(1));
}, 5000);