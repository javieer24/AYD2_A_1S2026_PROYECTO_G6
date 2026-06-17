-- 202002141: tabla de sesiones para tracking del examen adaptativo
CREATE TABLE IF NOT EXISTS sesiones_examen (
  id              SERIAL PRIMARY KEY,
  id_candidato    VARCHAR(50) NOT NULL,
  nivel_actual    VARCHAR(20) NOT NULL,
  preguntas_ids   INTEGER[]  DEFAULT '{}',
  historial       JSONB      DEFAULT '[]',
  numero_pregunta INTEGER    DEFAULT 1,
  completado      BOOLEAN    DEFAULT FALSE,
  dictamen        VARCHAR(20),
  created_at      TIMESTAMP  DEFAULT NOW()
);