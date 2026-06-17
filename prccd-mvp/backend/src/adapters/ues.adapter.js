// Módulo: Adaptador XML — Universidad de El Salvador (UES)
// Responsable: Javier Andrés Monjes Solórzano — 202100081
// Rama: feature/ingesta-usac
// Tarea: F2-03

// Estructura XML UES:
// <expediente>
//   <id>string</id>
//   <nombre>string</nombre>
//   <universidad>UES</universidad>
//   <carrera>string</carrera>
//   <cursos>
//     <curso><codigo>string</codigo><nota>number</nota></curso>
//   </cursos>
// </expediente>
// También soporta: <expedientes><expediente>...</expediente></expedientes>

const xml2js = require('xml2js');

const parser = new xml2js.Parser({ explicitArray: false });

function extractText(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object' && value._) return String(value._).trim();
  return String(value).trim();
}

function mapCourses(cursosRaw, recordIndex) {
  const cursos = [];
  const errors = [];

  if (!cursosRaw || !cursosRaw.curso) {
    return { cursos, errors };
  }

  // xml2js con explicitArray:false devuelve objeto si hay 1, array si hay >1
  const cursoList = Array.isArray(cursosRaw.curso) ? cursosRaw.curso : [cursosRaw.curso];

  for (const curso of cursoList) {
    const codigo = extractText(curso.codigo);
    const notaStr = extractText(curso.nota);
    const nota = parseFloat(notaStr);

    if (!codigo) {
      errors.push({ fila: recordIndex, mensaje: 'codigo de curso vacío' });
      continue;
    }
    if (isNaN(nota) || nota < 0 || nota > 100) {
      errors.push({ fila: recordIndex, mensaje: `nota fuera de rango en curso "${codigo}": "${notaStr}"` });
      continue;
    }
    cursos.push({ codigo, nota_final: nota });
  }

  return { cursos, errors };
}

function toCanonical(expediente, index) {
  const id = extractText(expediente.id);
  const nombre = extractText(expediente.nombre);
  const universidad = extractText(expediente.universidad);
  const carrera = extractText(expediente.carrera);

  const missing = [];
  if (!id) missing.push('id');
  if (!nombre) missing.push('nombre');
  if (!universidad) missing.push('universidad');
  if (!carrera) missing.push('carrera');

  if (missing.length > 0) {
    return { record: null, errors: [{ fila: index, mensaje: `Campos obligatorios faltantes: ${missing.join(', ')}` }] };
  }

  const { cursos, errors: courseErrors } = mapCourses(expediente.cursos, index);

  const record = {
    id_candidato: id,
    nombre_completo: nombre,
    universidad_origen: universidad.toUpperCase(),
    carrera,
    cursos_aprobados: cursos,
  };

  return { record, errors: courseErrors };
}

async function processUES(xmlBuffer) {
  let parsed;
  try {
    parsed = await parser.parseStringPromise(xmlBuffer.toString('utf8'));
  } catch (err) {
    throw new Error(`Error al parsear XML UES: ${err.message}`);
  }

  let expedientes = [];

  if (parsed.expedientes && parsed.expedientes.expediente) {
    // Wrapper <expedientes>
    const raw = parsed.expedientes.expediente;
    expedientes = Array.isArray(raw) ? raw : [raw];
  } else if (parsed.expediente) {
    // Expediente individual raíz
    expedientes = [parsed.expediente];
  } else {
    throw new Error('Formato XML UES inválido: no se encontró <expediente> ni <expedientes>');
  }

  const data = [];
  const allErrors = [];

  for (let i = 0; i < expedientes.length; i++) {
    const { record, errors } = toCanonical(expedientes[i], i + 1);
    if (record) data.push(record);
    allErrors.push(...errors);
  }

  return { success: true, data, errors: allErrors };
}

<<<<<<< HEAD
module.exports = { processUES };
=======
module.exports = { processUES };
>>>>>>> feature/ingesta
