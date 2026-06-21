-- Migración: 007_create_evidencia_antifraude
-- Tarea: F2-14 (almacenamiento seguro de evidencia en MinIO, retención 5 años)
--
-- Metadatos de la evidencia antifraude (capturas, video, logs) cuyo archivo
-- físico se guarda cifrado en MinIO con política WORM. Esquema tomado de
-- PRCCD_Fase1_G6.md (entidad EvidenciaAntifraude).

CREATE TABLE IF NOT EXISTS evidencia_antifraude (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sesion_id         INTEGER     NOT NULL REFERENCES sesiones_examen(id),
  id_candidato      VARCHAR(100) NOT NULL,
  tipo              VARCHAR(30) NOT NULL
    CHECK (tipo IN ('CAPTURA_PANTALLA', 'VIDEO', 'LOG_TECLEO', 'OTRO')),
  url_storage       TEXT        NOT NULL,
  bucket            VARCHAR(100) NOT NULL,
  size_bytes        BIGINT      NOT NULL,
  hash_archivo       TEXT        NOT NULL,
  cifrado           BOOLEAN     NOT NULL DEFAULT true,
  timestamp_captura TIMESTAMP   NOT NULL DEFAULT NOW(),
  retencion_hasta   TIMESTAMP   NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_evidencia_sesion
  ON evidencia_antifraude (sesion_id);

CREATE INDEX IF NOT EXISTS idx_evidencia_candidato
  ON evidencia_antifraude (id_candidato);
