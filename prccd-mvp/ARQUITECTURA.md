# Arquitectura del backend PRCCD/SICA — Microservicios

> Rama: `feature/migracion-microservicios`. Migración de un monolito modular
> (un solo proceso Express) a microservicios reales (un proceso/contenedor
> por dominio de negocio), alineado con la decisión de arquitectura de Fase 1
> (`PRCCD_Fase1_G6.md`: "microservicios con orientación a eventos").

## Por qué se hizo este cambio

Lo construido en Fase 2 (`prccd-mvp/backend/`, ahora legado) era un monolito
modular: una sola app Express montaba las rutas de los 7 dominios de negocio
en un solo proceso. Esto no correspondía a la arquitectura de microservicios
definida en Fase 1, justificada por disponibilidad 99.9% (EaC-02), integración
heterogénea con USAC/UCR/UES (EaC-04) y contenedorización on-premise (R-03).

## Servicios

| Servicio | Puerto | Dominio | Tablas que toca |
|---|---|---|---|
| `auth-service` | 3001 | Autenticación staff + login federado de candidatos | `candidatos` (lectura) |
| `ingesta-service` | 3002 | Adaptadores USAC (CSV) / UCR (JSON) / UES (XML) | `candidatos` (escritura) |
| `examen-service` | 3003 | Motor adaptativo + banco de preguntas | `sesiones_examen` (Postgres), `preguntas` (**MongoDB**, colección `prccd_docs.preguntas`) |
| `certificado-service` | 3004 | Emisión simple (F2-27) + PKI/log inmutable (F2-17/18) | `certificados`, `certificados_pki` |
| `telemetria-service` | 3005 | Antifraude del examen + evidencia (F2-13/F2-14) | `auditoria`, `sesiones_examen` (lectura), `evidencia_antifraude` (Postgres) + objetos cifrados en **MinIO** (bucket `evidencias`) |
| `auditoria-service` | 3006 | Bitácora general, retención 5 años | `auditoria` |
| `dashboard-service` | 3007 | BI agregado y anonimizado | `candidatos`, `sesiones_examen`, `certificados` (lectura) |

Infraestructura compartida (no son microservicios de negocio): `postgres`,
`mongodb`, `minio`, `nginx` (gateway).

## Decisión: base de datos compartida (no "database per service")

Los 7 servicios se conectan al **mismo** Postgres (`prccd_db`). No se separó
la base de datos por servicio en esta iteración: dado el plazo de entrega,
mover `certificado-service`/`telemetria-service`/`dashboard-service` a
llamadas HTTP entre servicios (en vez de leer tablas de otros dominios
directo) es trabajo de una fase posterior. Lo que sí se logró — y es lo que
pedían los drivers EaC-02/R-03 — es que cada dominio se despliega, reinicia y
escala como un proceso/contenedor independiente.

Las migraciones SQL viven ahora en `prccd-mvp/migrations/` (antes
`backend/migrations/`) y se montan en Postgres vía
`docker-entrypoint-initdb.d`. Como el volumen `postgres_data` ya tenía datos
de corridas previas del monolito, los scripts de init no se re-ejecutan
automáticamente — si se necesita aplicar una migración nueva contra una BD
existente, hay que correrla a mano:
```bash
docker exec -i prccd_postgres psql -U prccd_user -d prccd_db < migrations/00X_archivo.sql
```

## Hallazgo importante: dos implementaciones de certificados

Al separar `certificado-service` se encontró que existían dos
implementaciones de certificados sin relación entre sí, ambas ya construidas
por distintos integrantes:

- **F2-27 (Oswaldo Choc)** — `/api/certificate/issue` y `/verify`: hash+firma
  simple con `crypto`, tabla `certificados` (migración `005`).
- **F2-17/F2-18 (Javier Monjes)** — `/api/certificate/emitir`,
  `/verificar/:id`, `/cadena/verificar`: firma RSA-PSS real vía Autoridad
  Certificadora local (`pki.service.js`) + log inmutable encadenado
  (hash-chain). Esta implementación había quedado huérfana (sin ruta que la
  llamara y sin migración para su esquema) — probablemente sobrescrita al
  fusionar con la tarea #19. Se le creó la migración que le faltaba
  (`006_create_certificados_pki.sql`, tabla `certificados_pki`).

Se decidió **exponer ambas en paralelo** en `certificado-service` (ver
`API_ENDPOINTS.md`) en vez de descartar una. Pendiente para después de la
entrega: decidir con el equipo cuál es la oficial de cara al frontend, o
unificarlas.

## MongoDB — banco de preguntas

Siguiendo la decisión de Fase 1 (esquema documental flexible, sin joins
relacionales durante el examen activo), el banco de preguntas ya no vive en
la tabla Postgres `preguntas` sino en MongoDB (`prccd_docs.preguntas`,
conexión vía `MONGO_URI` en `examen-service`). El campo entero `id` se
conserva igual que el `SERIAL` original de Postgres para no romper
`sesiones_examen.preguntas_ids` (`INTEGER[]`, que sigue en Postgres). Cada
documento tiene un campo `metadatos: {}` libre para extender el esquema sin
migraciones (ej. parámetros IRT a futuro).

Para sembrar el banco desde el Excel de origen:
```bash
docker compose exec examen-service node scripts/seedPreguntas.js
```
La tabla Postgres `preguntas` queda como tabla legada (no se borra, pero
`examen-service` ya no la consulta).

## MinIO — evidencia antifraude

`telemetria-service` ahora implementa F2-14: los archivos de evidencia
(capturas, video, logs de tecleo) se cifran en la aplicación con AES-256-GCM
antes de subirse a MinIO (bucket `evidencias`, creado con Object Lock/WORM
habilitado) — el cifrado no depende de que el servidor MinIO tenga SSE
configurado. Cada objeto subido recibe retención `GOVERNANCE` de 5 años vía
`putObjectRetention`; los metadatos (incluido el hash SHA-256 del archivo
original, para verificar integridad al descargar) se guardan en la tabla
Postgres `evidencia_antifraude` (migración `007`). No existe endpoint de
borrado — es intencional, coherente con WORM.

## Gateway (Nginx)

Un upstream por servicio, ruteo por prefijo de path. Ver
`prccd-mvp/nginx/nginx.conf`. Todo el tráfico entra por `http://localhost`
(puerto 80); los puertos 3001-3007 también están expuestos directo para
debugging pero el frontend debe usar siempre el gateway.

## `prccd-mvp/backend/` (legado)

Se mantiene temporalmente sin borrar (decisión del usuario, 2026-06-19) como
referencia, pero **ya no está conectada a `docker-compose.yml`** — todo el
código vivo está en `prccd-mvp/services/*`. Se puede borrar manualmente desde
GitKraken cuando el equipo confirme que ya no la necesita.

## Cómo levantar el stack

```bash
cd prccd-mvp
docker compose up -d --build
```

Verificar que todo esté arriba:
```bash
docker compose ps
curl http://localhost/health/auth
curl http://localhost/health/examen
# ...una por cada servicio (ver API_ENDPOINTS.md)
```

## Pendientes conocidos (fuera de alcance de esta rama)

- Separar base de datos relacional por servicio (Postgres sigue compartida).
- Reemplazar lecturas cruzadas de tablas (certificado/telemetria/dashboard)
  por llamadas HTTP entre servicios o un bus de eventos (Kafka, mencionado en
  Fase 1 pero no integrado todavía).
- Decidir cuál implementación de certificados es la oficial.
- Borrar `prccd-mvp/backend/` cuando el equipo lo confirme.
- Parámetros IRT reales en el banco de preguntas de MongoDB (hoy el campo
  `metadatos` existe pero va vacío; no se calibró ningún modelo IRT en este MVP).
- Captura real de evidencia desde el frontend (pantallazos/video/keylog) —
  esta rama solo construyó el endpoint backend de subida/descarga; falta que
  el frontend dispare la captura y haga el POST.
