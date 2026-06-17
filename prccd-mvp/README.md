# PRCCD — Plataforma Regional de Certificación de Competencias Digitales

**Proyecto:** AYD2_A_1S2026_PROYECTO_G6 — Análisis y Diseño 2
**Entidad:** SICA — Sistema de la Integración Centroamericana
**Entrega MVP:** 20-21 de junio de 2026

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + Express |
| Frontend | Vue 3 + Vite |
| BD Relacional | PostgreSQL 15 (Sequelize) |
| BD Documental | MongoDB 7 |
| Almacenamiento | MinIO |
| Autenticación | Keycloak |
| Bus de eventos | Apache Kafka |
| API Gateway | Nginx |
| Contenedores | Docker + Docker Compose |

## Después de cada `git pull` (IMPORTANTE)

`node_modules/` **no se versiona** (pesa demasiado y cada quien lo genera local). Esto significa que, cada vez que traigas cambios del repo, debes reinstalar dependencias si alguien tocó un `package.json`:

```bash
# Backend
cd prccd-mvp/backend
npm install

# Frontend
cd prccd-mvp/frontend
npm install
```

> Si usas Docker (ver abajo), no necesitas correr `npm install` a mano: el `Dockerfile` del backend lo hace solo en cada `docker-compose up --build`.

> Error típico si lo saltas: `Cannot find module 'xxx'` al levantar el servidor. Solución: correr `npm install` en la carpeta correspondiente.

## Levantar el entorno local

```bash
# Clonar el repo y moverse al directorio
cd prccd-mvp

# Copiar variables de entorno
cp backend/.env.example backend/.env

# Levantar todos los servicios
docker-compose up --build

# El backend estará disponible en:
# http://localhost:3000/health
```

## Probar el módulo de ingesta

### USAC — CSV

```bash
curl -X POST http://localhost:3000/api/ingest \
  -F "archivo=@backend/samples/usac_sample.csv" \
  -F "universidad=USAC"
```

### UCR — JSON

```bash
curl -X POST http://localhost:3000/api/ingest \
  -F "archivo=@backend/samples/ucr_sample.json" \
  -F "universidad=UCR"
```

### UES — XML

```bash
curl -X POST http://localhost:3000/api/ingest \
  -F "archivo=@backend/samples/ues_sample.xml" \
  -F "universidad=UES"
```

### Respuesta esperada (200)

```json
{
  "status": "ok",
  "procesados": 5,
  "exitosos": 5,
  "errores": []
}
```

## Estructura del proyecto

```
prccd-mvp/
├── backend/
│   ├── src/
│   │   ├── adapters/          — adaptadores CSV/JSON/XML por universidad
│   │   ├── services/          — lógica de negocio
│   │   ├── routes/            — endpoints REST
│   │   ├── middleware/        — validaciones y manejo de errores
│   │   ├── models/            — modelos Sequelize
│   │   └── config/            — BD y variables de entorno
│   ├── migrations/            — scripts SQL
│   ├── samples/               — archivos de prueba
│   └── index.js               — punto de entrada
├── frontend/                  — Vue 3 (otro integrante)
├── docker-compose.yml
├── nginx/
└── SCRUM.md                   — bitácora del sprint
```

## Equipo — Grupo 6

| Integrante | Carnet | Responsabilidad |
|-----------|--------|----------------|
| Javier Andrés Monjes Solórzano | 202100081 | Backend — Módulo de Ingesta |
| _(resto del equipo)_ | | |
