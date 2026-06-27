# Integración Frontend — Voz y Evidencia Antifraude

## Puertos de los servicios (local / Docker)

| Servicio           | Puerto |
|--------------------|--------|
| voz-service        | 3009   |
| telemetria-service | 3005   |
| auditoria-service  | 3006   |

Todos los endpoints requieren el header `Authorization: Bearer <token>` obtenido del auth-service.

---

## Flujo rápido — qué envía el frontend exactamente

### Grabación por Voz (candidato responde una pregunta)

```
POST http://localhost:3009/api/voz/responder
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

```
campo "audio"         → Blob del audio grabado  (webm, wav, mp3, ogg)
campo "sesion_id"     → "42"   (string, no número)
campo "pregunta_id"   → "7"    (string, no número)
```

```js
const formData = new FormData();
formData.append('audio', audioBlob, 'respuesta.webm');
formData.append('sesion_id', String(sesionId));
formData.append('pregunta_id', String(preguntaId));

const res = await fetch('http://localhost:3009/api/voz/responder', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
// { status:'ok', texto_transcrito:'B', respuesta_enviada:'B', resultado_examen:{...} }
```

> El candidato debe decir la letra primero: *"B"*, *"La B"*, *"Respuesta B"*.  
> Si dice *"La respuesta es la opción B"* → error 422 porque la primera letra es "L".

---

### Grabación de Pantalla (candidato sube el video)

```
POST http://localhost:3005/api/telemetria/evidencia
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

```
campo "archivo"    → Blob del video grabado  (webm, mp4)
campo "sesion_id"  → "42"   (string)
campo "tipo"       → "VIDEO"
```

```js
const formData = new FormData();
formData.append('archivo', videoBlob, 'grabacion.webm');
formData.append('sesion_id', String(sesionId));
formData.append('tipo', 'VIDEO');

const res = await fetch('http://localhost:3005/api/telemetria/evidencia', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
// { status:'ok', evidencia:{ id:'uuid', tipo:'VIDEO', ... } }
```

---

---

## 1. Grabación por Voz

### 1.1 Solo transcribir (para pruebas)

```
POST http://localhost:3009/api/voz/transcribir
Content-Type: multipart/form-data
```

| Campo     | Tipo    | Requerido | Descripción                         |
|-----------|---------|-----------|-------------------------------------|
| `audio`   | archivo | Sí        | Archivo de audio grabado            |

**Formatos aceptados:** `audio/webm`, `audio/wav`, `audio/mp3`, `audio/ogg`, `audio/m4a`, `audio/mp4`, `video/mp4`  
**Tamaño máximo:** 25 MB

**Respuesta exitosa (200):**
```json
{
  "status": "ok",
  "texto": "la respuesta es la b",
  "idioma": "es"
}
```

**Ejemplo con fetch:**
```js
const formData = new FormData();
formData.append('audio', audioBlob, 'respuesta.webm');

const res = await fetch('http://localhost:3009/api/voz/transcribir', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
const data = await res.json();
console.log(data.texto); // "la respuesta es la b"
```

---

### 1.2 Transcribir y enviar respuesta al examen (flujo real)

```
POST http://localhost:3009/api/voz/responder
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

| Campo        | Tipo    | Requerido | Descripción                              |
|--------------|---------|-----------|------------------------------------------|
| `audio`      | archivo | Sí        | Archivo de audio grabado                 |
| `sesion_id`  | texto   | Sí        | ID de la sesión del examen               |
| `pregunta_id`| texto   | Sí        | ID de la pregunta actual                 |

**Respuesta exitosa (200):**
```json
{
  "status": "ok",
  "texto_transcrito": "la respuesta es la b",
  "respuesta_enviada": "B",
  "resultado_examen": { }
}
```

**Errores posibles:**
- `400` — falta el archivo de audio, sesion_id o pregunta_id
- `422` — el texto transcrito no empieza con A, B, C o D

> **IMPORTANTE:** El servicio extrae la primera letra del texto transcrito como respuesta.
> El candidato debe responder diciendo la letra directamente, por ejemplo: *"B"* o *"La B"* o *"Respuesta B"*.
> Si dice *"La respuesta es la opción B"*, la primera letra extraída sería "L" y el sistema devolvería un error 422.

**Ejemplo con fetch:**
```js
const formData = new FormData();
formData.append('audio', audioBlob, 'respuesta.webm');
formData.append('sesion_id', '42');
formData.append('pregunta_id', '7');

const res = await fetch('http://localhost:3009/api/voz/responder', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
const data = await res.json();
// data.respuesta_enviada => "B"
// data.resultado_examen  => respuesta del motor adaptativo
```

---

## 2. Grabación de Pantalla — Subida de Evidencia

El candidato sube la grabación al terminar (o en segmentos durante) el examen.

```
POST http://localhost:3005/api/telemetria/evidencia
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

| Campo       | Tipo    | Requerido | Descripción                                         |
|-------------|---------|-----------|-----------------------------------------------------|
| `archivo`   | archivo | Sí        | El video o captura de pantalla                      |
| `sesion_id` | texto   | Sí        | ID de la sesión del examen                          |
| `tipo`      | texto   | Sí        | `VIDEO` / `CAPTURA_PANTALLA` / `LOG_TECLEO` / `OTRO`|

**Tamaño máximo:** 250 MB

**Respuesta exitosa (201):**
```json
{
  "status": "ok",
  "evidencia": {
    "id": "uuid-del-registro",
    "tipo": "VIDEO",
    "size_bytes": 1048576,
    "hash_archivo": "sha256...",
    "timestamp_captura": "2026-06-26T10:00:00.000Z",
    "retencion_hasta": "2031-06-26T10:00:00.000Z"
  }
}
```

**Ejemplo con fetch:**
```js
const formData = new FormData();
formData.append('archivo', videoBlob, 'grabacion_sesion.webm');
formData.append('sesion_id', '42');
formData.append('tipo', 'VIDEO');

const res = await fetch('http://localhost:3005/api/telemetria/evidencia', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
const data = await res.json();
// data.evidencia.id => ID para que el auditor descargue después
```

---

## 3. Eventos Antifraude (durante el examen)

El frontend debe reportar comportamientos sospechosos en tiempo real mientras el candidato hace el examen.

```
POST http://localhost:3005/api/telemetria
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "sesion_id": 42,
  "tipo_evento": "CAMBIO_PESTANA",
  "metadatos": { "url_destino": "google.com" }
}
```

**Tipos de evento válidos:**

| tipo_evento          | Cuándo dispararlo                              |
|----------------------|------------------------------------------------|
| `CAMBIO_PESTANA`     | El candidato cambia de pestaña                 |
| `PERDIDA_FOCO`       | La ventana pierde el foco (`window blur`)      |
| `COPIAR_PEGAR`       | Evento `copy` o `paste` detectado              |
| `DEVTOOLS_DETECTADO` | Se detectaron DevTools abiertas                |
| `MULTIPLES_PESTANAS` | Se detectaron múltiples pestañas               |

**Respuesta exitosa (201):**
```json
{
  "status": "ok",
  "suspendido": false,
  "total": 2
}
```

> Si `suspendido: true`, el examen fue bloqueado automáticamente (5 eventos sospechosos acumulados). El frontend debe mostrar una pantalla de suspensión.

**Ejemplo con fetch:**
```js
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) {
    await fetch('http://localhost:3005/api/telemetria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sesion_id: 42, tipo_evento: 'CAMBIO_PESTANA', metadatos: {} }),
    });
  }
});
```

---

## 4. Consulta del Auditor/Administrador

Los siguientes endpoints son para la vista del auditor. Requieren rol `ADMIN`, `EVALUADOR` o `COORDINADOR`.

### 4.1 Listar evidencias de una sesión

```
GET http://localhost:3005/api/telemetria/evidencia/:sesion_id
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "status": "ok",
  "sesion_id": 42,
  "evidencias": [
    {
      "id": "uuid",
      "tipo": "VIDEO",
      "size_bytes": 1048576,
      "hash_archivo": "sha256...",
      "cifrado": true,
      "timestamp_captura": "2026-06-26T10:00:00.000Z",
      "retencion_hasta": "2031-06-26T10:00:00.000Z"
    }
  ]
}
```

### 4.2 Descargar un archivo de evidencia (video/captura)

```
GET http://localhost:3005/api/telemetria/evidencia/descargar/:id
Authorization: Bearer <token>
```

Devuelve el binario del archivo ya descifrado.  
Para mostrarlo en el navegador:

```js
const res = await fetch(`http://localhost:3005/api/telemetria/evidencia/descargar/${evidenciaId}`, {
  headers: { Authorization: `Bearer ${token}` },
});

const blob = await res.blob();
const url = URL.createObjectURL(blob);

// Mostrar en un <video>
document.querySelector('video').src = url;

// O forzar descarga
const a = document.createElement('a');
a.href = url;
a.download = `evidencia_${evidenciaId}.webm`;
a.click();
```

**Error 409:** el hash del archivo no coincide — evidencia corrupta o manipulada.

### 4.3 Ver log de eventos de comportamiento de una sesión

```
GET http://localhost:3005/api/telemetria/:sesion_id
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "status": "ok",
  "sesion_id": 42,
  "eventos": [
    {
      "id": "uuid",
      "tipo_evento": "CAMBIO_PESTANA",
      "metadatos": {},
      "creado_en": "2026-06-26T10:05:00.000Z"
    }
  ]
}
```

### 4.4 Ver trail de auditoría completo de una sesión

```
GET http://localhost:3006/api/audit/trail?sesion_id=42
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "status": "ok",
  "sesion_id": "42",
  "total": 3,
  "registros": [
    {
      "id": "uuid",
      "sesion_id": 42,
      "id_candidato": "candidato-uuid",
      "tipo_evento": "CAMBIO_PESTANA",
      "metadatos": {},
      "fecha_retencion": "2031-06-26T10:00:00.000Z",
      "creado_en": "2026-06-26T10:05:00.000Z"
    }
  ]
}
```

---

---

## 5. ¿El auditor puede reproducir el audio, video y ver las capturas?

### Video y capturas de pantalla — SÍ

El endpoint `GET /api/telemetria/evidencia/descargar/:id` devuelve el binario ya descifrado.
El frontend decide cómo renderizarlo según el campo `tipo` que viene en el listado:

```js
async function verEvidencia(evidencia) {
  const res = await fetch(
    `http://localhost:3005/api/telemetria/evidencia/descargar/${evidencia.id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (res.status === 409) {
    alert('Evidencia corrupta o manipulada — integridad no verificada');
    return;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  if (evidencia.tipo === 'VIDEO') {
    // Mostrar en reproductor de video
    document.querySelector('video').src = url;
    document.querySelector('video').play();

  } else if (evidencia.tipo === 'CAPTURA_PANTALLA') {
    // Mostrar como imagen
    document.querySelector('img').src = url;

  } else if (evidencia.tipo === 'OTRO') {
    // Puede ser audio — intentar reproducir
    document.querySelector('audio').src = url;
    document.querySelector('audio').play();

  } else if (evidencia.tipo === 'LOG_TECLEO') {
    // Es texto/JSON — leer como texto y mostrar en tabla
    const texto = await blob.text();
    console.log(JSON.parse(texto));
  }
}
```

---

### Audio de respuestas por voz — NO se guarda automáticamente

El `voz-service` **solo transcribe el audio en memoria y lo descarta**. No lo almacena en ningún lado. La única cosa que queda guardada es el texto transcrito (como parte de la respuesta al examen en el examen-service).

**Si quieren que el auditor pueda escuchar las respuestas de voz**, el frontend tiene que hacer dos llamadas al responder:

```js
// 1. Enviar al voz-service para transcribir y responder
const formDataVoz = new FormData();
formDataVoz.append('audio', audioBlob, 'respuesta.webm');
formDataVoz.append('sesion_id', String(sesionId));
formDataVoz.append('pregunta_id', String(preguntaId));

await fetch('http://localhost:3009/api/voz/responder', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formDataVoz,
});

// 2. Guardar el mismo audio como evidencia para el auditor
const formDataEvidencia = new FormData();
formDataEvidencia.append('archivo', audioBlob, `audio_pregunta_${preguntaId}.webm`);
formDataEvidencia.append('sesion_id', String(sesionId));
formDataEvidencia.append('tipo', 'OTRO');

await fetch('http://localhost:3005/api/telemetria/evidencia', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formDataEvidencia,
});
```

Así el auditor puede listar las evidencias de la sesión, ver cuáles son de tipo `OTRO` (audios de voz), y reproducirlas con un `<audio>`.

---

### Resumen de reproducción por tipo

| tipo en DB         | Cómo renderizar en el frontend              |
|--------------------|---------------------------------------------|
| `VIDEO`            | `<video src={blobUrl} controls />`          |
| `CAPTURA_PANTALLA` | `<img src={blobUrl} />`                     |
| `OTRO` (audio voz) | `<audio src={blobUrl} controls />`          |
| `LOG_TECLEO`       | `JSON.parse(await blob.text())` → tabla     |

---

## Resumen: qué llama cada rol

| Quién       | Acción                                      | Endpoint                                              |
|-------------|---------------------------------------------|-------------------------------------------------------|
| Candidato   | Responder por voz                           | `POST /api/voz/responder`                             |
| Candidato   | Guardar audio para auditor (opcional)       | `POST /api/telemetria/evidencia` (tipo=OTRO)          |
| Candidato   | Subir grabación de pantalla                 | `POST /api/telemetria/evidencia` (tipo=VIDEO)         |
| Candidato   | Subir captura de pantalla                   | `POST /api/telemetria/evidencia` (tipo=CAPTURA_PANTALLA)|
| Candidato   | Reportar evento sospechoso                  | `POST /api/telemetria`                                |
| Auditor     | Ver lista de evidencias de sesión           | `GET /api/telemetria/evidencia/:sesion_id`            |
| Auditor     | Reproducir/ver video, imagen o audio        | `GET /api/telemetria/evidencia/descargar/:id`         |
| Auditor     | Ver log de comportamiento                   | `GET /api/telemetria/:sesion_id`                      |
| Auditor     | Ver trail completo de auditoría             | `GET /api/audit/trail?sesion_id=42`                   |
