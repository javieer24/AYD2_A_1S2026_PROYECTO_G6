// src/services/examenService.js

// Mapa de nivel → siguiente según respuesta
const NIVEL_ACIERTO   = { 'Básico': 'Medio', 'Medio': 'Avanzado', 'Avanzado': 'Avanzado' };
const NIVEL_FALLO     = { 'Básico': 'Básico', 'Medio': 'Básico',  'Avanzado': 'Medio' };
const TOTAL_PREGUNTAS = 10;

// Obtener una pregunta aleatoria de un nivel, excluyendo las ya usadas
export async function getPregunta(db, nivel, excluirIds = []) {
  const { rows } = await db.query(
    `SELECT * FROM preguntas
     WHERE nivel = $1
       AND id != ALL($2::int[])
     ORDER BY RANDOM()
     LIMIT 1`,
    [nivel, excluirIds]
  );
  return rows[0] ?? null;
}

// Evaluar respuesta y determinar siguiente nivel
export function evaluarRespuesta(pregunta, respuestaUsuario) {
  const correcto = pregunta.respuesta_correcta === respuestaUsuario.toUpperCase();
  return correcto;
}

export function siguienteNivel(nivelActual, correcto) {
  return correcto ? NIVEL_ACIERTO[nivelActual] : NIVEL_FALLO[nivelActual];
}

// Calcular puntaje y dictamen al final
export function calcularDictamen(historial) {
  // Cada pregunta pesa diferente según nivel
  const PESOS = { 'Básico': 1, 'Medio': 2, 'Avanzado': 3 };
  let puntaje = 0, maxPuntaje = 0;

  for (const item of historial) {
    const peso = PESOS[item.nivel];
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