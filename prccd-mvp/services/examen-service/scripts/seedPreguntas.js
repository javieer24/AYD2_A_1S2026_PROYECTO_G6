// Script: Carga del banco de preguntas
require('dotenv').config();
const { Pool } = require('pg');
const XLSX = require('xlsx');
const path = require('path');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'prccd_db',
  user:     process.env.DB_USER     || 'prccd_user',
  password: process.env.DB_PASSWORD || 'prccd_pass',
});

async function seed() {
  try {
    const filePath = path.join(__dirname, '../data/Banco_Preguntas.xlsx');
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets['Banco Preguntas'];
    const rows = XLSX.utils.sheet_to_json(ws);

    console.log(`Cargando ${rows.length} preguntas...`);

    for (const row of rows) {
      await pool.query(
        `INSERT INTO preguntas
           (numero, nivel, categoria, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT DO NOTHING`,
        [
          row['No.'],
          row['Nivel'],
          row['Categoría'],
          row['Pregunta'],
          row['Opción A'],
          row['Opción B'],
          row['Opción C'],
          row['Opción D'],
          row['Respuesta Correcta']
        ]
      );
    }

    console.log('✔ Banco de preguntas cargado exitosamente');
  } catch (err) {
    console.error('Error al cargar preguntas:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
