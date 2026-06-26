// calcularDictamen es una función pura — no necesita DB ni MongoDB.
const { calcularDictamen } = require('../src/services/examen.service');

// ─── Test 4: Motor adaptativo sube de nivel ───────────────────────────────────

describe('Motor adaptativo — calcularDictamen', () => {
  test('devuelve Aprobado cuando el candidato responde todo Avanzado correctamente', () => {
    const historial = Array.from({ length: 10 }, (_, i) => ({
      pregunta_id: i + 1,
      nivel: 'Avanzado',
      respuesta: 'A',
      correcto: true,
    }));

    const resultado = calcularDictamen(historial);

    expect(resultado.dictamen).toBe('Aprobado');
    expect(parseFloat(resultado.porcentaje)).toBe(100);
    expect(resultado.puntaje).toBe(resultado.maxPuntaje);
  });

// ─── Test 5: Motor adaptativo baja de nivel ──────────────────────────────────

  test('devuelve Reprobado cuando el candidato falla todo en nivel Básico', () => {
    const historial = Array.from({ length: 10 }, (_, i) => ({
      pregunta_id: i + 1,
      nivel: 'Básico',
      respuesta: 'B',
      correcto: false,
    }));

    const resultado = calcularDictamen(historial);

    expect(resultado.dictamen).toBe('Reprobado');
    expect(parseFloat(resultado.porcentaje)).toBe(0);
    expect(resultado.puntaje).toBe(0);
  });
});
