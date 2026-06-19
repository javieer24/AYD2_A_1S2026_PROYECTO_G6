# Manual de Endpoints — PRCCD/SICA (para el equipo de Frontend)

**Base URL (gateway, usar siempre esta):** `http://localhost`

Todos los endpoints están detrás de Nginx. No usar los puertos directos
(3001-3007) salvo para debugging del backend — el frontend siempre habla con
`http://localhost`.

## Autenticación

Casi todos los endpoints requieren un JWT en el header:
```
Authorization: Bearer <token>
```
El token se obtiene con `POST /api/auth/login` (staff) o
`POST /api/auth/confirmar-identidad` (candidatos/estudiantes). Expira en 8h.

Roles posibles dentro del token: `ADMIN`, `EVALUADOR`, `COORDINADOR` (con
`universidad`), `ESTUDIANTE` (con `id_candidato` y `universidad`).

---

## 1. Auth — `auth-service`

### `POST /api/auth/login` — público
Login de staff (usuarios hardcodeados para el MVP).
```json
// Body
{ "username": "admin", "password": "admin123" }
// 200 OK
{ "status": "ok", "token": "...", "usuario": { "username": "admin", "nombre": "...", "rol": "ADMIN", "universidad": null } }
```
Usuarios de prueba: `admin/admin123` (ADMIN), `oswaldo/oswaldo123` (EVALUADOR),
`javier/javier123` (ADMIN), `usac/usac2026`, `ucr/ucr2026`, `ues/ues2026`
(COORDINADOR por universidad).

### `POST /api/auth/confirmar-identidad` — público
Login federado de candidatos (simula LDAP/SAML/OAuth2 de cada universidad).
El candidato debe existir ya en `candidatos` (vía ingesta).
```json
// Body
{ "id_candidato": "USAC-2024-001", "nombre_completo": "Maria Lopez", "universidad_origen": "USAC" }
// 200 OK
{ "status": "ok", "token": "...", "usuario": { "id_candidato": "...", "nombre": "...", "rol": "ESTUDIANTE", "universidad": "USAC" } }
// 401 si no coincide nombre/universidad o el candidato no esta ACTIVO
```

### `GET /api/auth/me` — requiere token
Devuelve el payload del usuario autenticado (útil al recargar la página).

---

## 2. Ingesta — `ingesta-service`

### `POST /api/ingest` — requiere token
`multipart/form-data`: campo `archivo` (File) + campo `universidad`
(`USAC`|`UCR`|`UES`). USAC espera `.csv`, UCR `.json`, UES `.xml`.
```json
// 200 OK
{ "status": "ok", "procesados": 5, "exitosos": 4, "errores": [ { "fila": 3, "mensaje": "..." } ] }
```

---

## 3. Examen adaptativo y banco de preguntas — `examen-service`

### `POST /api/examen/iniciar` — requiere token
```json
// Body
{ "id_candidato": "USAC-2024-001" }
// 201
{ "sesion_id": 2, "pregunta": { "id": 30, "nivel": "Medio", "pregunta": "...", "opcion_a": "...", "opcion_b": "...", "opcion_c": "...", "opcion_d": "..." }, "numero": 1, "total": 10 }
```
Si el token es de un `ESTUDIANTE`, `id_candidato` debe coincidir con el del
token (si no, 403).

### `POST /api/examen/responder` — requiere token
```json
// Body
{ "sesion_id": 2, "pregunta_id": 30, "respuesta": "A" }
// Si no es la ultima pregunta:
{ "terminado": false, "correcto": true, "pregunta": { ... siguiente ... }, "numero": 2, "total": 10 }
// Si es la ultima:
{ "terminado": true, "correcto": true, "dictamen": { "puntaje": 29, "maxPuntaje": 29, "porcentaje": "100.00", "dictamen": "Aprobado" } }
```
`dictamen` puede ser `"Aprobado"` o `"Reprobado"` (ojo con el casing exacto).

### `GET /api/examen/sesion/:id` — requiere token
Estado de una sesión: `{ id, id_candidato, numero_pregunta, completado, dictamen, created_at }`.

### `GET /api/examen/preguntas?nivel=Medio` — requiere token
Lista el banco de preguntas (nunca incluye `respuesta_correcta`). `nivel` es
opcional (`Básico`|`Medio`|`Avanzado`).

### `POST /api/examen/preguntas` — requiere token de `ADMIN` o `EVALUADOR`
Agrega una pregunta al banco.
```json
{ "numero": 121, "nivel": "Medio", "categoria": "Redes", "pregunta": "...", "opcion_a": "...", "opcion_b": "...", "opcion_c": "...", "opcion_d": "...", "respuesta_correcta": "A" }
```

---

## 4. Certificados — `certificado-service`

**Hay dos implementaciones en paralelo** (ver `ARQUITECTURA.md` para el
contexto histórico). Hasta que el equipo decida cuál es la oficial, el
frontend puede usar cualquiera de las dos según lo que necesite mostrar.

### Implementación simple (F2-27)

`POST /api/certificate/issue` — requiere token
```json
{ "id_candidato": "USAC-2024-001", "sesion_id": 2, "datos_certificado": { "nota": "100" } }
// 201
{ "status": "ok", "certificado": { "id": "...", "hash": "...", "emitido_en": "..." } }
```

`GET /api/certificate/verify?hash=<hash>` — requiere token
```json
{ "status": "ok", "valido": true, "certificado": { "id_candidato": "...", "estado": "VIGENTE", "datos_certificado": {} } }
```

### Implementación PKI + log inmutable (F2-17/F2-18)

`POST /api/certificate/emitir` — requiere token. La sesión debe estar
`completado=true` y `dictamen='Aprobado'`.
```json
{ "sesion_id": 2 }
// 201
{ "status": "ok", "certificado": { "id_certificado": "CERT-...", "documento": {...}, "hash_documento": "...", "firma": "...", "numero_bloque": 1, "hash_bloque": "...", "estado": "EMITIDO" } }
```

`GET /api/certificate/verificar/:id` — requiere token. `:id` puede ser
`id_certificado`, `hash_documento` o `hash_bloque`.
```json
{ "status": "ok", "valido": true, "firmaValida": true, "bloqueIntegro": true, "certificado": {...} }
```

`GET /api/certificate/cadena/verificar` — requiere token. Verifica la
integridad de todo el log inmutable.
```json
{ "status": "ok", "integra": true, "totalBloques": 3 }
```

---

## 5. Telemetría antifraude — `telemetria-service`

### `POST /api/telemetria` — requiere token
El frontend dispara esto cuando detecta comportamiento sospechoso durante el
examen (cambio de pestaña, copiar/pegar, devtools abiertas, etc.).
```json
// Body
{ "sesion_id": 2, "tipo_evento": "CAMBIO_PESTANA", "metadatos": { "detalle": "opcional" } }
// 201
{ "status": "ok", "suspendido": false, "total": 2 }
```
`tipo_evento` debe ser uno de: `CAMBIO_PESTANA`, `PERDIDA_FOCO`,
`COPIAR_PEGAR`, `DEVTOOLS_DETECTADO`, `MULTIPLES_PESTANAS`. Al llegar a 5
eventos en una sesión, el examen se marca `completado=true,
dictamen='Suspendido'` automáticamente — el frontend debe revisar
`suspendido` en la respuesta y cortar el examen si es `true`.

### `GET /api/telemetria/:sesion_id` — requiere token
Lista los eventos de esa sesión (el candidato solo puede ver la suya).

---

## 6. Auditoría — `auditoria-service`

### `GET /api/audit/trail?sesion_id=2` — requiere token
### `POST /api/audit/trail` — requiere token
```json
{ "sesion_id": 2, "id_candidato": "USAC-2024-001", "tipo_evento": "...", "metadatos": {} }
```
Nota: en la práctica, el frontend normalmente usa `/api/telemetria` (que
internamente escribe en esta misma tabla con retención de 5 años) en vez de
escribir aquí directo.

---

## 7. Dashboard BI — `dashboard-service`

### `GET /api/dashboard/stats?carrera=<opcional>` — requiere token
```json
{
  "status": "ok",
  "nota": "Datos agregados y anonimizados — sin datos personales identificables",
  "metricas": {
    "candidatos_por_universidad": [ { "universidad_origen": "USAC", "total": "2" } ],
    "candidatos_por_carrera": [ { "carrera": "...", "total": "2" } ],
    "examenes": { "total_sesiones": "2", "aprobados": "1", "reprobados": "0", "en_progreso": "1" },
    "certificados": { "total_emitidos": "1", "vigentes": "1" }
  }
}
```

---

## Health checks (para confirmar que el backend está arriba)

```
GET /health/auth
GET /health/ingest
GET /health/examen
GET /health/certificate
GET /health/telemetria
GET /health/audit
GET /health/dashboard
```
Cada uno responde `{ "status": "ok", "service": "<nombre>-service", "timestamp": "..." }`.

## Códigos de error comunes

- `400` — body inválido o campos faltantes.
- `401` — token faltante, inválido o expirado; o credenciales incorrectas en login.
- `403` — el usuario autenticado no tiene permiso sobre ese recurso (ej. un
  estudiante intentando ver la sesión de otro candidato).
- `404` — recurso no encontrado (sesión, certificado, etc.).
- `409` — conflicto de estado (ej. emitir certificado de un examen no
  aprobado o no terminado).
- `422` — archivo/formato no soportado (ingesta).

Todas las respuestas de error siguen el formato `{ "status": "error", "message": "..." }`
(las rutas de examen heredadas usan `{ "error": "..." }` sin `status`, ojo con esa inconsistencia).
