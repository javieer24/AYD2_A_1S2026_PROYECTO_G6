// Script: Carga del banco de preguntas en MongoDB
// El banco de preguntas vive en MongoDB (colección "preguntas", BD
// prccd_docs) — decisión de arquitectura de Fase 1. Este script reemplaza al
// seed original que insertaba en la tabla relacional "preguntas" de Postgres.
require('dotenv').config();
const { MongoClient } = require('mongodb');
const XLSX = require('xlsx');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/prccd_docs';

async function seed() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const coleccion = client.db().collection('preguntas');
    await coleccion.createIndex({ id: 1 }, { unique: true });

    const filePath = path.join(__dirname, '../data/Banco_Preguntas.xlsx');
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets['Banco Preguntas'];
    const rows = XLSX.utils.sheet_to_json(ws);

    console.log(`Cargando ${rows.length} preguntas en MongoDB...`);

    let cargadas = 0;
    for (const row of rows) {
      const id = Number(row['No.']);
      await coleccion.updateOne(
        { id },
        {
          $setOnInsert: {
            id,
            numero: id,
            nivel: row['Nivel'],
            categoria: row['Categoría'],
            pregunta: row['Pregunta'],
            opcion_a: row['Opción A'],
            opcion_b: row['Opción B'],
            opcion_c: row['Opción C'],
            opcion_d: row['Opción D'],
            respuesta_correcta: row['Respuesta Correcta'],
            metadatos: {},
          },
        },
        { upsert: true }
      );
      cargadas++;
    }

    console.log(`✔ Banco de preguntas cargado exitosamente (${cargadas} documentos)`);
  } catch (err) {
    console.error('Error al cargar preguntas:', err.message);
  } finally {
    await client.close();
  }
}

seed();
