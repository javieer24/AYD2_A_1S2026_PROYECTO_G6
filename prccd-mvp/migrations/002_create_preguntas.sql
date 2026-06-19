-- 202002141: tabla banco de preguntas para motor adaptativo
CREATE TABLE IF NOT EXISTS preguntas (
  id                 SERIAL PRIMARY KEY,
  numero             INTEGER NOT NULL,
  nivel              VARCHAR(20) NOT NULL CHECK (nivel IN ('Básico', 'Medio', 'Avanzado')),
  categoria          VARCHAR(50),
  pregunta           TEXT NOT NULL,
  opcion_a           TEXT NOT NULL,
  opcion_b           TEXT NOT NULL,
  opcion_c           TEXT NOT NULL,
  opcion_d           TEXT NOT NULL,
  respuesta_correcta CHAR(1) NOT NULL CHECK (respuesta_correcta IN ('A','B','C','D'))
);