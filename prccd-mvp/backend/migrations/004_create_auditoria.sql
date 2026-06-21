-- Migración: 004_create_auditoria
-- Responsable: Oswaldo Antonio Choc Cuteres — 201901844
-- Tarea: F2-27

CREATE TABLE IF NOT EXISTS auditoria (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sesion_id       INTEGER     NOT NULL REFERENCES sesiones_examen(id),
  id_candidato    VARCHAR(100) NOT NULL,
  tipo_evento     VARCHAR(50) NOT NULL,
  metadatos       JSONB       NOT NULL DEFAULT '{}',
  fecha_retencion TIMESTAMP   NOT NULL,
  creado_en       TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_sesion
  ON auditoria (sesion_id);

CREATE INDEX IF NOT EXISTS idx_auditoria_candidato
  ON auditoria (id_candidato);