jest.mock('../src/config/database', () => ({
  sequelize: { query: jest.fn() }
}));

jest.mock('../src/config/mongo', () => ({
  getPreguntasCollection: jest.fn()
}));

jest.mock('../src/config/kafka.producer', () => ({
  publish: jest.fn()
}));

const { calcularDictamen } = require('../src/services/examen.service');

describe('calcularDictamen', () => {
  test('aprueba cuando el puntaje ponderado alcanza el 60 por ciento', () => {
    const historial = [
      { nivel: 'Medio', correcto: true },
      { nivel: 'Avanzado', correcto: true },
      { nivel: 'Medio', correcto: false },
    ];

    const resultado = calcularDictamen(historial);

    expect(resultado).toEqual({
      puntaje: 5,
      maxPuntaje: 7,
      porcentaje: '71.43',
      dictamen: 'Aprobado'
    });
  });

  test('reprueba cuando el puntaje ponderado queda debajo del 60 por ciento', () => {
    const historial = [
      { nivel: 'Medio', correcto: true },
      { nivel: 'Avanzado', correcto: false },
      { nivel: 'Medio', correcto: false },
    ];

    const resultado = calcularDictamen(historial);

    expect(resultado).toEqual({
      puntaje: 2,
      maxPuntaje: 7,
      porcentaje: '28.57',
      dictamen: 'Reprobado'
    });
  });
});
