// Módulo: Servicio de Ingesta de Expedientes
// Responsable: Javier Andrés Monjes Solórzano — 202100081
// Rama: feature/ingesta-usac
// Tarea: F2-01, F2-02, F2-03

const { processUSAC } = require('../adapters/usac.adapter');
const { processUCR } = require('../adapters/ucr.adapter');
const { processUES } = require('../adapters/ues.adapter');
const Candidato = require('../models/candidato.model');

const UNIVERSIDADES_VALIDAS = ['USAC', 'UCR', 'UES'];

function detectarFormato(mimetype, originalname) {
  if (mimetype === 'text/csv' || originalname.endsWith('.csv')) return 'csv';
  if (mimetype === 'application/json' || originalname.endsWith('.json')) return 'json';
  if (
    mimetype === 'application/xml' ||
    mimetype === 'text/xml' ||
    originalname.endsWith('.xml')
  )
    return 'xml';
  return null;
}

async function invocarAdaptador(universidad, formato, fileBuffer) {
  const uni = universidad.toUpperCase();

  if (uni === 'USAC') {
    if (formato !== 'csv') throw Object.assign(new Error('USAC solo acepta archivos CSV'), { status: 422 });
    return processUSAC(fileBuffer);
  }

  if (uni === 'UCR') {
    if (formato !== 'json') throw Object.assign(new Error('UCR solo acepta archivos JSON'), { status: 422 });
    let rawData;
    try {
      rawData = JSON.parse(fileBuffer.toString('utf8'));
    } catch {
      throw Object.assign(new Error('El archivo JSON de UCR no es válido'), { status: 422 });
    }
    return processUCR(rawData);
  }

  if (uni === 'UES') {
    if (formato !== 'xml') throw Object.assign(new Error('UES solo acepta archivos XML'), { status: 422 });
    return processUES(fileBuffer);
  }

  throw Object.assign(new Error(`Universidad no reconocida: ${universidad}`), { status: 400 });
}

async function persistirCandidatos(registros) {
  const insertados = [];
  const erroresPersistencia = [];

  for (const reg of registros) {
    try {
      await Candidato.upsert(reg);
      insertados.push(reg.id_candidato);
    } catch (err) {
      erroresPersistencia.push({ id_candidato: reg.id_candidato, mensaje: err.message });
    }
  }

  return { insertados, erroresPersistencia };
}

async function procesarExpediente(fileBuffer, originalname, mimetype, universidad) {
  if (!UNIVERSIDADES_VALIDAS.includes(universidad.toUpperCase())) {
    throw Object.assign(new Error(`Universidad inválida: ${universidad}. Valores aceptados: USAC, UCR, UES`), { status: 400 });
  }

  const formato = detectarFormato(mimetype, originalname);
  if (!formato) {
    throw Object.assign(new Error('Formato de archivo no soportado. Use CSV, JSON o XML'), { status: 422 });
  }

  const adapterResult = await invocarAdaptador(universidad, formato, fileBuffer);

  const { insertados, erroresPersistencia } = await persistirCandidatos(adapterResult.data);

  const todosErrores = [...adapterResult.errors, ...erroresPersistencia];

  return {
    procesados: adapterResult.data.length + adapterResult.errors.length,
    exitosos: insertados.length,
    errores: todosErrores,
  };
}

<<<<<<< HEAD
module.exports = { procesarExpediente };
=======
module.exports = { procesarExpediente };
>>>>>>> feature/ingesta
