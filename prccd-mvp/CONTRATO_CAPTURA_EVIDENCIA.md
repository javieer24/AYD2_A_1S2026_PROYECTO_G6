# Contrato de Captura de Evidencia Antifraude — PRCCD/SICA

**Responsable:** Javier Andrés Monjes Solórzano — 202100081  
**Tarea:** F3-48 / MinIO  
**Versión:** 1.0 — 2026-06-24

Este documento es la fuente de verdad para el equipo de frontend. Describe exactamente cómo capturar la pantalla del candidato durante el examen y subirla al backend (MinIO) en chunks.

---

## 1. Contexto

El backend ya tiene el endpoint funcional:

```
POST /api/telemetria/evidencia
Content-Type: multipart/form-data
Authorization: Bearer <JWT candidato>
```

El backend:
- Recibe el archivo en memoria (multer, límite **250 MB**)
- Lo cifra con AES-256-GCM antes de guardarlo en MinIO
- Calcula SHA-256 del contenido original para verificación de integridad
- Guarda metadatos en Postgres (`evidencia_antifraude`)
- Aplica Object Lock WORM (retención 5 años, GOVERNANCE)

El frontend **solo necesita** capturar la pantalla, grabarla como WebM/MP4, y hacer un POST multipart con el archivo resultante.

---

## 2. Captura de pantalla — `getDisplayMedia` + `MediaRecorder`

### 2.1 Solicitar permiso y abrir stream

```javascript
async function iniciarCaptura() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: 5, width: { max: 1280 }, height: { max: 720 } },
    audio: false,
  });
  return stream;
}
```

- `frameRate: 5` — suficiente para evidencia antifraude, reduce tamaño del archivo
- `audio: false` — no se necesita audio
- El navegador le pregunta al usuario qué pantalla compartir; en el examen esto ocurre automáticamente al iniciar la sesión

### 2.2 Grabar con `MediaRecorder`

```javascript
let chunks = [];
let mediaRecorder = null;

function iniciarGrabacion(stream) {
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm';

  mediaRecorder = new MediaRecorder(stream, { mimeType });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  // timeslice de 10s — genera chunks periódicos en sesiones largas
  mediaRecorder.start(10_000);
}

function detenerGrabacion() {
  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
      resolve(blob);
    };
    mediaRecorder.stop();
    chunks = [];
  });
}
```

---

## 3. Subir al backend — POST multipart/form-data

### 3.1 Al finalizar el examen

```javascript
async function subirEvidencia(blob, sesionId, jwtToken) {
  const formData = new FormData();
  formData.append('archivo', blob, `evidencia_sesion_${sesionId}.webm`);
  formData.append('sesion_id', sesionId);
  formData.append('tipo', 'GRABACION_PANTALLA');

  const response = await fetch('/api/telemetria/evidencia', {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwtToken}` },
    body: formData,
    // NO poner Content-Type manualmente — fetch lo setea con el boundary correcto
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al subir evidencia');
  }

  return response.json(); // { status: 'ok', evidencia: { id, sesion_id, hash, ... } }
}
```

### 3.2 Flujo completo integrado

```javascript
let capturaStream = null;

// Al iniciar sesión de examen
async function onIniciarExamen(sesionId, jwtToken) {
  capturaStream = await iniciarCaptura();
  iniciarGrabacion(capturaStream);
}

// Al terminar examen (última pregunta respondida)
async function onFinalizarExamen(sesionId, jwtToken) {
  const blob = await detenerGrabacion();

  // Detener todos los tracks para cerrar el indicador de "compartiendo pantalla"
  capturaStream.getTracks().forEach((track) => track.stop());

  await subirEvidencia(blob, sesionId, jwtToken);
}
```

---

## 4. Tipos de evidencia válidos

El campo `tipo` del FormData debe ser uno de estos valores (case-sensitive):

| Valor | Descripción |
|---|---|
| `GRABACION_PANTALLA` | Video de la pantalla completa durante el examen |
| `CAPTURA_EVENTO` | Imagen PNG/JPG de un evento sospechoso puntual |

---

## 5. Límites y restricciones

| Parámetro | Valor |
|---|---|
| Tamaño máximo por archivo | **250 MB** |
| Tipos MIME recomendados | `video/webm`, `video/mp4`, `image/png`, `image/jpeg` |
| Autenticación | JWT del candidato en header `Authorization: Bearer <token>` |
| Asociación | El `sesion_id` debe pertenecer al candidato autenticado (el backend valida esto y devuelve 403 si no coincide) |
| Endpoint vía gateway | `POST http://localhost/api/telemetria/evidencia` |
| Endpoint directo (dev) | `POST http://localhost:3005/api/telemetria/evidencia` |

---

## 6. Respuesta exitosa del backend

```json
{
  "status": "ok",
  "evidencia": {
    "id": 1,
    "sesion_id": "42",
    "id_candidato": "USAC-2024-001",
    "tipo": "GRABACION_PANTALLA",
    "nombre_objeto": "evidencias/42/GRABACION_PANTALLA_1719187200000.webm",
    "hash_integridad": "a3f1bc...",
    "cifrado": "AES-256-GCM",
    "retencion_hasta": "2031-06-24T00:00:00.000Z",
    "creado_en": "2026-06-24T10:00:00.000Z"
  }
}
```

---

## 7. Manejo de errores comunes

| HTTP | Causa | Solución |
|---|---|---|
| 400 | Falta `sesion_id`, `tipo` o `archivo` | Verificar que el FormData incluye los tres campos |
| 401 | Token ausente o expirado | Renovar JWT antes de subir |
| 403 | `sesion_id` no pertenece al candidato | El candidato solo puede subir evidencia de sus propias sesiones |
| 404 | `sesion_id` no existe | Verificar que el examen fue iniciado correctamente |
| 413 | Archivo supera 250 MB | Reducir resolución/framerate o dividir en segmentos |

---

## 8. Notas para la prueba de integración (Jencer — F3-45)

La prueba de integración de evidencia (`certificado emitido → Kafka → notificación`) requiere que haya al menos un registro en `evidencia_antifraude` para la sesión. Para generar evidencia sintética en tests sin captura real de pantalla:

```javascript
// En el test, crear un Blob sintético en lugar de getDisplayMedia
const fakeBlob = new Blob([new Uint8Array(1024)], { type: 'video/webm' });
await subirEvidencia(fakeBlob, sesionId, jwtToken);
```
