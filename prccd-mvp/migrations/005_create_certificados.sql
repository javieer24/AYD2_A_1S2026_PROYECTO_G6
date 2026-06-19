-- Migración: 005_create_certificados
-- Responsable: Oswaldo Antonio Choc Cuteres — 201901844
-- Tarea: F2-27

CREATE TABLE IF NOT EXISTS certificados (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  id_candidato    VARCHAR(100) NOT NULL,
  sesion_id       INTEGER     NOT NULL REFERENCES sesiones_examen(id),
  hash_certificado TEXT       NOT NULL UNIQUE,
  firma_digital   TEXT        NOT NULL,
  estado          VARCHAR(20) NOT NULL DEFAULT 'VIGENTE'
    CHECK (estado IN ('VIGENTE', 'REVOCADO')),
  emitido_en      TIMESTAMP   NOT NULL DEFAULT NOW(),
  datos_certificado JSONB     NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_certificados_candidato
  ON certificados (id_candidato);

CREATE INDEX IF NOT EXISTS idx_certificados_hash
  ON certificados (hash_certificado);