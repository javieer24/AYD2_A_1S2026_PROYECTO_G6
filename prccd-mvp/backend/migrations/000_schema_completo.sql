-- Candidatos (resultado de ingesta universitaria)
CREATE TABLE IF NOT EXISTS candidatos (
  id              SERIAL PRIMARY KEY,
  id_candidato    VARCHAR(50) UNIQUE NOT NULL,
  nombre_completo VARCHAR(200) NOT NULL,
  universidad_origen VARCHAR(20) NOT NULL CHECK (universidad_origen IN ('USAC','UCR','UES')),
  carrera         VARCHAR(150) NOT NULL,
  genero          CHAR(1) CHECK (genero IN ('M','F','O')),
  pais            VARCHAR(50),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Cursos aprobados por candidato
CREATE TABLE IF NOT EXISTS cursos_aprobados (
  id           SERIAL PRIMARY KEY,
  id_candidato VARCHAR(50) REFERENCES candidatos(id_candidato),
  codigo_curso VARCHAR(20) NOT NULL,
  nombre_curso VARCHAR(150),
  nota_final   DECIMAL(5,2) NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Banco de preguntas
CREATE TABLE IF NOT EXISTS preguntas (
  id                 SERIAL PRIMARY KEY,
  numero             INTEGER NOT NULL,
  nivel              VARCHAR(20) NOT NULL CHECK (nivel IN ('Básico','Medio','Avanzado')),
  categoria          VARCHAR(50),
  pregunta           TEXT NOT NULL,
  opcion_a           TEXT NOT NULL,
  opcion_b           TEXT NOT NULL,
  opcion_c           TEXT NOT NULL,
  opcion_d           TEXT NOT NULL,
  respuesta_correcta CHAR(1) NOT NULL CHECK (respuesta_correcta IN ('A','B','C','D'))
);

-- Sesiones de examen
CREATE TABLE IF NOT EXISTS sesiones_examen (
  id              SERIAL PRIMARY KEY,
  id_candidato    VARCHAR(50) REFERENCES candidatos(id_candidato),
  nivel_actual    VARCHAR(20) NOT NULL,
  preguntas_ids   INTEGER[] DEFAULT '{}',
  historial       JSONB DEFAULT '[]',
  numero_pregunta INTEGER DEFAULT 1,
  completado      BOOLEAN DEFAULT FALSE,
  dictamen        VARCHAR(20),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Certificados emitidos
CREATE TABLE IF NOT EXISTS certificados (
  id              SERIAL PRIMARY KEY,
  id_candidato    VARCHAR(50) REFERENCES candidatos(id_candidato),
  sesion_id       INTEGER REFERENCES sesiones_examen(id),
  hash_certificado VARCHAR(256) NOT NULL,
  firma_digital   TEXT,
  fecha_emision   TIMESTAMP DEFAULT NOW(),
  verificable     BOOLEAN DEFAULT TRUE
);

-- Auditoría y telemetría antifraude
CREATE TABLE IF NOT EXISTS auditoria (
  id           SERIAL PRIMARY KEY,
  sesion_id    INTEGER REFERENCES sesiones_examen(id),
  tipo_evento  VARCHAR(50) NOT NULL,
  payload      JSONB,
  fecha        TIMESTAMP DEFAULT NOW(),
  retencion_hasta TIMESTAMP DEFAULT (NOW() + INTERVAL '5 years')
);