-- Migración: 008_add_email_candidatos
-- Responsable: Javier Andrés Monjes Solórzano — 202100081
-- Tarea: F3-08
-- Agrega columna email a candidatos para que notificaciones-service pueda
-- enviar el correo de certificado emitido sin cruzar tablas.

ALTER TABLE candidatos
  ADD COLUMN IF NOT EXISTS email VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_candidatos_email
  ON candidatos (email);
