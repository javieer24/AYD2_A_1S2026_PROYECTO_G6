-- Migración: 001_create_candidatos
-- Responsable: Javier Andrés Monjes Solórzano — 202100081
-- Rama: feature/ingesta-usac
-- Tarea: F2-01

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS candidatos (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  id_candidato     VARCHAR(100) UNIQUE NOT NULL,
  nombre_completo  VARCHAR(255) NOT NULL,
  universidad_origen VARCHAR(10) NOT NULL
    CHECK (universidad_origen IN ('USAC', 'UCR', 'UES')),
  carrera          VARCHAR(255) NOT NULL,
  cursos_aprobados JSONB       NOT NULL DEFAULT '[]',
  fecha_ingesta    TIMESTAMP   NOT NULL DEFAULT NOW(),
  estado           VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
);

CREATE INDEX IF NOT EXISTS idx_candidatos_universidad
  ON candidatos (universidad_origen);

CREATE INDEX IF NOT EXISTS idx_candidatos_carrera
  ON candidatos (carrera);