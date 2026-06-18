-- 202100081: tabla de certificados emitidos con firma PKI y log inmutable (hash-chain)
CREATE TABLE IF NOT EXISTS certificados (
  id                SERIAL PRIMARY KEY,
  id_certificado    VARCHAR(50) UNIQUE NOT NULL,
  sesion_examen_id  INTEGER UNIQUE NOT NULL REFERENCES sesiones_examen(id),
  id_candidato      VARCHAR(50) NOT NULL,
  documento         JSONB NOT NULL,
  hash_documento    VARCHAR(64) NOT NULL,
  firma             TEXT NOT NULL,
  llave_publica     TEXT NOT NULL,
  numero_bloque     INTEGER UNIQUE NOT NULL,
  hash_anterior     VARCHAR(64),
  hash_bloque       VARCHAR(64) UNIQUE NOT NULL,
  estado            VARCHAR(20) DEFAULT 'EMITIDO',
  created_at        TIMESTAMP DEFAULT NOW()
);
