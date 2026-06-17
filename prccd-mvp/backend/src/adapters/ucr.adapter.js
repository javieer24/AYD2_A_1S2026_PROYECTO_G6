// Módulo: Adaptador JSON — Universidad de Costa Rica (UCR)
// Responsable: Javier Andrés Monjes Solórzano — 202100081
// Rama: feature/ingesta-usac
// Tarea: F2-02

// Estructura UCR:
// {
//   "matricula": "string",
//   "nombreEstudiante": "string",
//   "universidadProcedencia": "UCR",
//   "programaAcademico": "string",
//   "materiasAprobadas": [{ "codigoCurso": "string", "calificacion": number }]
// }

function validateUCRRecord(record, index) {
  const required = ['matricula', 'nombreEstudiante', 'universidadProcedencia', 'programaAcademico', 'materiasAprobadas'];
  const missing = required.filter((f) => record[f] === undefined || record[f] === null || record[f] === '');
  if (missing.length > 0) {
    return { valid: false, error: { fila: index, mensaje: `Campos obligatorios faltantes: ${missing.join(', ')}` } };
  }
  if (!Array.isArray(record.materiasAprobadas)) {
    return { valid: false, error: { fila: index, mensaje: 'materiasAprobadas debe ser un arreglo' } };
  }
  return { valid: true };
}

function mapCourses(materias, recordIndex) {
  const cursos = [];
  const errors = [];

  for (let i = 0; i < materias.length; i++) {
    const materia = materias[i];
    if (!materia.codigoCurso || String(materia.codigoCurso).trim() === '') {
      errors.push({ fila: recordIndex, mensaje: `Materia ${i + 1}: codigoCurso vacío` });
      continue;
    }
    const nota = Number(materia.calificacion);
    if (isNaN(nota) || nota < 0 || nota > 100) {
      errors.push({ fila: recordIndex, mensaje: `Materia "${materia.codigoCurso}": calificacion fuera de rango (${materia.calificacion})` });
      continue;
    }
    cursos.push({ codigo: String(materia.codigoCurso).trim(), nota_final: nota });
  }

  return { cursos, errors };
}

function toCanonical(record, index) {
  const validation = validateUCRRecord(record, index);
  if (!validation.valid) {
    return { record: null, errors: [validation.error] };
  }

  const { cursos, errors: courseErrors } = mapCourses(record.materiasAprobadas, index);

  const canonical = {
    id_candidato: String(record.matricula).trim(),
    nombre_completo: String(record.nombreEstudiante).trim(),
    universidad_origen: String(record.universidadProcedencia).trim().toUpperCase(),
    carrera: String(record.programaAcademico).trim(),
    cursos_aprobados: cursos,
  };

  return { record: canonical, errors: courseErrors };
}

async function processUCR(rawData) {
  const records = Array.isArray(rawData) ? rawData : [rawData];
  const data = [];
  const allErrors = [];

  for (let i = 0; i < records.length; i++) {
    const { record, errors } = toCanonical(records[i], i + 1);
    if (record) data.push(record);
    allErrors.push(...errors);
  }

  return { success: true, data, errors: allErrors };
}

module.exports = { processUCR };