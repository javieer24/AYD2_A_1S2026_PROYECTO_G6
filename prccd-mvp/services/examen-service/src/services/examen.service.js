// Módulo: Lógica del motor adaptativo
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

const NIVEL_ACIERTO = { 'Básico': 'Medio', 'Medio': 'Avanzado', 'Avanzado': 'Avanzado' };
const NIVEL_FALLO   = { 'Básico': 'Básico', 'Medio': 'Básico',  'Avanzado': 'Medio' };
const TOTAL_PREGUNTAS = 10;
const PESOS = { 'Básico': 1, 'Medio': 2, 'Avanzado': 3 };

async function getPregunta(nivel, excluirIds = []) {
  let query, replacements;

  if (excluirIds.length === 0) {
    query = `SELECT * FROM preguntas WHERE nivel = :nivel ORDER BY RANDOM() LIMIT 1`;
    replacements = { nivel };
  } else {
    query = `SELECT * FROM preguntas WHERE nivel = :nivel AND id NOT IN (:excluir) ORDER BY RANDOM() LIMIT 1`;
    replacements = { nivel, excluir: excluirIds };
  }

  const rows = await sequelize.query(query, {
    replacements,
    type: QueryTypes.SELECT
  });

  return rows[0] || null;
}

async function iniciarExamen(id_candidato) {
  const pregunta = await getPregunta('Medio', []);
  if (!pregunta) throw new Error('No hay preguntas de nivel Medio disponibles');

  const resultado = await sequelize.query(
    `INSERT INTO sesiones_examen
       (id_candidato, nivel_actual, preguntas_ids, historial, numero_pregunta)
     VALUES (:id_candidato, 'Medio', ARRAY[:id]::integer[], '[]'::jsonb, 1)
     RETURNING *`,
    {
      replacements: { id_candidato, id: pregunta.id },
      type: QueryTypes.RAW
    }
  );

  const sesion = resultado[0][0];

  return {
    sesion_id: sesion.id,
    pregunta: ocultarRespuesta(pregunta),
    numero: 1,
    total: TOTAL_PREGUNTAS
  };
}

async function responderPregunta(sesion_id, pregunta_id, respuesta) {
  // Cargar sesión
  const [sesion] = await sequelize.query(
    `SELECT * FROM sesiones_examen WHERE id = :sesion_id`,
    { replacements: { sesion_id }, type: QueryTypes.SELECT }
  );
  if (!sesion) throw new Error('Sesión no encontrada');
  if (sesion.completado) throw new Error('El examen ya fue completado');

  // Cargar pregunta actual
  const [preguntaActual] = await sequelize.query(
    `SELECT * FROM preguntas WHERE id = :id`,
    { replacements: { id: pregunta_id }, type: QueryTypes.SELECT }
  );
  if (!preguntaActual) throw new Error('Pregunta no encontrada');

  // Evaluar respuesta
  const correcto = preguntaActual.respuesta_correcta === respuesta.toUpperCase();

  // Actualizar historial
  const historial = [
    ...sesion.historial,
    {
      pregunta_id,
      nivel: sesion.nivel_actual,
      respuesta: respuesta.toUpperCase(),
      correcto
    }
  ];

  // Si es la última pregunta → calcular dictamen
  if (sesion.numero_pregunta >= TOTAL_PREGUNTAS) {
    const dictamen = calcularDictamen(historial);

    await sequelize.query(
      `UPDATE sesiones_examen
       SET historial = :historial::jsonb,
           completado = true,
           dictamen = :dictamen
       WHERE id = :sesion_id`,
      {
        replacements: {
          historial: JSON.stringify(historial),
          dictamen: dictamen.dictamen,
          sesion_id
        },
        type: QueryTypes.UPDATE
      }
    );

    return { terminado: true, correcto, dictamen };
  }

  // Calcular siguiente nivel y pregunta
  const nivelSiguiente = correcto
    ? NIVEL_ACIERTO[sesion.nivel_actual]
    : NIVEL_FALLO[sesion.nivel_actual];

  const siguientePregunta = await getPregunta(nivelSiguiente, sesion.preguntas_ids);
  if (!siguientePregunta) throw new Error(`No hay más preguntas de nivel ${nivelSiguiente}`);

  await sequelize.query(
    `UPDATE sesiones_examen
     SET nivel_actual = :nivel,
         preguntas_ids = array_append(preguntas_ids, :pid),
         historial = :historial::jsonb,
         numero_pregunta = numero_pregunta + 1
     WHERE id = :sesion_id`,
    {
      replacements: {
        nivel: nivelSiguiente,
        pid: siguientePregunta.id,
        historial: JSON.stringify(historial),
        sesion_id
      },
      type: QueryTypes.UPDATE
    }
  );

  return {
    terminado: false,
    correcto,
    pregunta: ocultarRespuesta(siguientePregunta),
    numero: sesion.numero_pregunta + 1,
    total: TOTAL_PREGUNTAS
  };
}

function calcularDictamen(historial) {
  let puntaje = 0, maxPuntaje = 0;
  for (const item of historial) {
    const peso = PESOS[item.nivel] || 1;
    maxPuntaje += peso;
    if (item.correcto) puntaje += peso;
  }
  const porcentaje = (puntaje / maxPuntaje) * 100;
  return {
    puntaje,
    maxPuntaje,
    porcentaje: porcentaje.toFixed(2),
    dictamen: porcentaje >= 60 ? 'Aprobado' : 'Reprobado'
  };
}

// Nunca enviar la respuesta correcta al frontend
function ocultarRespuesta(pregunta) {
  const { respuesta_correcta, ...rest } = pregunta;
  return rest;
}

module.exports = { iniciarExamen, responderPregunta };
