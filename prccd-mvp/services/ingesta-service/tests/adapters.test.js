const { processUSAC } = require('../src/adapters/usac.adapter');
const { processUCR }  = require('../src/adapters/ucr.adapter');
const { processUES }  = require('../src/adapters/ues.adapter');

// ─── Test 1: Adaptador CSV — USAC ────────────────────────────────────────────

describe('Adaptador USAC (CSV)', () => {
  test('convierte CSV válido al modelo canónico', async () => {
    const csv = [
      'student_id,full_name,institution,program,courses',
      'USAC-2024-001,Juan Pérez,USAC,Ingeniería en Sistemas,MAT101:90;FIS101:85',
    ].join('\n');

    const { success, data, errors } = await processUSAC(Buffer.from(csv));

    expect(success).toBe(true);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id_candidato: 'USAC-2024-001',
      nombre_completo: 'Juan Pérez',
      universidad_origen: 'USAC',
      carrera: 'Ingeniería en Sistemas',
    });
    expect(data[0].cursos_aprobados).toHaveLength(2);
    expect(data[0].cursos_aprobados[0]).toEqual({ codigo: 'MAT101', nota_final: 90 });
    expect(errors).toHaveLength(0);
  });

  test('reporta error cuando faltan campos obligatorios', async () => {
    const csv = [
      'student_id,full_name,institution,program,courses',
      ',Juan Pérez,USAC,Ingeniería,MAT101:90',
    ].join('\n');

    const { data, errors } = await processUSAC(Buffer.from(csv));

    expect(data).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].mensaje).toMatch(/student_id/);
  });
});

// ─── Test 2: Adaptador JSON — UCR ────────────────────────────────────────────

describe('Adaptador UCR (JSON)', () => {
  test('convierte JSON válido al modelo canónico', async () => {
    const raw = [
      {
        matricula: 'UCR-2024-042',
        nombreEstudiante: 'María López',
        universidadProcedencia: 'UCR',
        programaAcademico: 'Ciencias de la Computación',
        materiasAprobadas: [
          { codigoCurso: 'CI-1101', calificacion: 88 },
          { codigoCurso: 'MA-1001', calificacion: 92 },
        ],
      },
    ];

    const { success, data, errors } = await processUCR(raw);

    expect(success).toBe(true);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id_candidato: 'UCR-2024-042',
      nombre_completo: 'María López',
      universidad_origen: 'UCR',
      carrera: 'Ciencias de la Computación',
    });
    expect(data[0].cursos_aprobados).toHaveLength(2);
    expect(data[0].cursos_aprobados[1]).toEqual({ codigo: 'MA-1001', nota_final: 92 });
    expect(errors).toHaveLength(0);
  });

  test('reporta error cuando materiasAprobadas no es arreglo', async () => {
    const raw = [
      {
        matricula: 'UCR-001',
        nombreEstudiante: 'Pedro García',
        universidadProcedencia: 'UCR',
        programaAcademico: 'Sistemas',
        materiasAprobadas: 'no-es-array',
      },
    ];

    const { data, errors } = await processUCR(raw);

    expect(data).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });
});

// ─── Test 3: Adaptador XML — UES ─────────────────────────────────────────────

describe('Adaptador UES (XML)', () => {
  test('convierte XML válido al modelo canónico', async () => {
    const xml = `
      <expediente>
        <id>UES-2024-007</id>
        <nombre>Carlos Ramos</nombre>
        <universidad>UES</universidad>
        <carrera>Ingeniería Industrial</carrera>
        <cursos>
          <curso><codigo>IND-101</codigo><nota>95</nota></curso>
          <curso><codigo>MAT-201</codigo><nota>78</nota></curso>
        </cursos>
      </expediente>
    `.trim();

    const { success, data, errors } = await processUES(Buffer.from(xml));

    expect(success).toBe(true);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      id_candidato: 'UES-2024-007',
      nombre_completo: 'Carlos Ramos',
      universidad_origen: 'UES',
      carrera: 'Ingeniería Industrial',
    });
    expect(data[0].cursos_aprobados).toHaveLength(2);
    expect(data[0].cursos_aprobados[0]).toEqual({ codigo: 'IND-101', nota_final: 95 });
    expect(errors).toHaveLength(0);
  });
});
