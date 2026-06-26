require('dotenv').config();
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

async function seedMongo() {
  // PostgreSQL
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'prccd_db',
    user: process.env.DB_USER || 'prccd_user',
    password: process.env.DB_PASSWORD || 'prccd_pass',
  });

  // MongoDB
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/prccd_docs';
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();
  const collection = db.collection('preguntas');

  // Obtener de PostgreSQL
  const { rows } = await pool.query('SELECT * FROM preguntas');
  
  // Limpiar e insertar en MongoDB
  await collection.deleteMany({});
  await collection.insertMany(rows);
  await collection.createIndex({ id: 1 }, { unique: true });
  await collection.createIndex({ nivel: 1 });
  
  console.log(`✔ ${rows.length} preguntas migradas a MongoDB`);
  
  await pool.end();
  await client.close();
}

seedMongo().catch(err => { console.error(err); process.exit(1); });