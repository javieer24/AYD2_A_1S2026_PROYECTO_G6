// Módulo: Adaptador CSV — Universidad de San Carlos de Guatemala (USAC)
const { parse } = require('csv-parse');

// Columnas USAC → modelo canónico:
//   student_id  → id_candidato
//   full_name   → nombre_completo
//   institution → universidad_origen
//   program     → carrera
//   courses     → cursos_aprobados  (formato "COD1:NOTA1;COD2:NOTA2")

function parseCourses(coursesStr, rowIndex) {
  if (!coursesStr || coursesStr.trim() === '') {
    return { cursos: [], errors: [] };
  }

  const cursos = [];
  const errors = [];

  for (const entry of coursesStr.split(';')) {
    const trimmed = entry.trim();
    if (!trimmed) continue;

    const colonIdx = trimmed.lastIndexOf(':');
    if (colonIdx === -1) {
      errors.push({ fila: rowIndex, mensaje: `Formato de curso inválido: "${trimmed}"` });
      continue;
    }

    const codigo = trimmed.substring(0, colonIdx).trim();
    const nota = parseFloat(trimmed.substring(colonIdx + 1).trim());

    if (!codigo) {
      errors.push({ fila: rowIndex, mensaje: `Código vacío en: "${trimmed}"` });
      continue;
    }
    if (isNaN(nota) || nota < 0 || nota > 100) {
      errors.push({ fila: rowIndex, mensaje: `nota_final fuera de rango en curso "${codigo}": ${trimmed.substring(colonIdx + 1).trim()}` });
      continue;
    }

    cursos.push({ codigo, nota_final: nota });
  }

  return { cursos, errors };
}

function toCanonical(row, rowIndex) {
  const required = ['student_id', 'full_name', 'institution', 'program', 'courses'];
  const missing = required.filter((f) => !row[f] || String(row[f]).trim() === '');

  if (missing.length > 0) {
    return {
      record: null,
      errors: [{ fila: rowIndex, mensaje: `Campos obligatorios faltantes: ${missing.join(', ')}` }],
    };
  }

  const { cursos, errors: courseErrors } = parseCourses(row.courses, rowIndex);

  return {
    record: {
      id_candidato: String(row.student_id).trim(),
      nombre_completo: String(row.full_name).trim(),
      universidad_origen: String(row.institution).trim().toUpperCase(),
      carrera: String(row.program).trim(),
      cursos_aprobados: cursos,
    },
    errors: courseErrors,
  };
}

async function processUSAC(fileBuffer) {
  const data = [];
  const allErrors = [];
  let rowIndex = 1; // fila 1 = encabezados, empezamos contando desde fila 2

  const parser = parse(fileBuffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  try {
    for await (const row of parser) {
      rowIndex++;
      const { record, errors } = toCanonical(row, rowIndex);
      if (record) data.push(record);
      allErrors.push(...errors);
    }
  } catch (err) {
    throw new Error(`Error al parsear CSV USAC: ${err.message}`);
  }

  return { success: true, data, errors: allErrors };
}

module.exports = { processUSAC };
