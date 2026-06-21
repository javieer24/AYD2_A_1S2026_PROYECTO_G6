// Módulo: Conexión a MongoDB — banco de preguntas
// Tarea: F2-02 (re-trabajo) — el banco de preguntas se almacena como
// documentos JSON (esquema flexible) en vez de filas relacionales, siguiendo
// la decisión de arquitectura de Fase 1 (MongoDB para preguntas y resultados
// de examen por su estructura variable).
const { MongoClient } = require('mongodb');
const env = require('./env');

let client;
let db;

async function connectMongo() {
  client = new MongoClient(env.mongo.uri);
  await client.connect();
  db = client.db();
  await db.collection('preguntas').createIndex({ id: 1 }, { unique: true });
  await db.collection('preguntas').createIndex({ nivel: 1 });
  console.log('MongoDB conectado correctamente.');
  return db;
}

function getPreguntasCollection() {
  if (!db) throw new Error('MongoDB no está conectado todavía');
  return db.collection('preguntas');
}

module.exports = { connectMongo, getPreguntasCollection };
