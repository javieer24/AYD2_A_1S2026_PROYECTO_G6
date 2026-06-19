-- Migración: 006_create_certificados_pki
-- Responsable: Javier Andrés Monjes Solórzano — 202100081
-- Tarea: F2-17 / F2-18
--
-- Tabla separada de "certificados" (005, F2-27): esta guarda la emisión con
-- firma RSA-PSS de la Autoridad Certificadora local y el log inmutable
-- encadenado (hash_anterior/hash_bloque). No existía migración para este
-- esquema antes de la migración a microservicios (certificado.service.js +
-- pki.service.js quedaron huérfanos sin tabla propia); se crea aquí.

CREATE TABLE IF NOT EXISTS certificados_pki (
  id                SERIAL      PRIMARY KEY,
  id_certificado    VARCHAR(150) NOT NULL UNIQUE,
  sesion_examen_id  INTEGER     NOT NULL REFERENCES sesiones_examen(id),
  id_candidato      VARCHAR(100) NOT NULL,
  documento         JSONB       NOT NULL,
  hash_documento    TEXT        NOT NULL,
  firma             TEXT        NOT NULL,
  llave_publica     TEXT        NOT NULL,
  numero_bloque     INTEGER     NOT NULL,
  hash_anterior     TEXT,
  hash_bloque       TEXT        NOT NULL,
  estado            VARCHAR(20) NOT NULL DEFAULT 'EMITIDO'
    CHECK (estado IN ('EMITIDO', 'REVOCADO')),
  created_at        TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificados_pki_sesion
  ON certificados_pki (sesion_examen_id);

CREATE INDEX IF NOT EXISTS idx_certificados_pki_candidato
  ON certificados_pki (id_candidato);
