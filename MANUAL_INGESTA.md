# Manual de Integración — Módulo de Ingesta de Datos
## PRCCD/SICA — Grupo 6 — Fase 2

**Responsable del módulo:** Javier Andrés Monjes Solórzano — 202100081
**Dirigido a:** Oswaldo (y cualquier integrante que trabaje sobre este módulo o consuma su endpoint)
**Última actualización:** 16/06/2026

---

## 1. ¿Qué hace este módulo?

El módulo de ingesta recibe expedientes académicos de tres universidades del SICA (USAC, UCR, UES), los transforma a un **modelo canónico único** y los persiste en PostgreSQL. Cada universidad entrega sus datos en un formato diferente:

| Universidad | Formato | Adaptador |
|-------------|---------|-----------|
| USAC (Guatemala) | CSV | `usac.adapter.js` |
| UCR (Costa Rica) | JSON | `ucr.adapter.js` |
| UES (El Salvador) | XML | `ues.adapter.js` |

El flujo completo es:

```
Cliente (curl / frontend)
       │
       ▼
POST /api/ingest  (multipart/form-data: archivo + universidad)
       │
       ▼
ingesta.routes.js  → valida campos + sube archivo en memoria (multer)
       │
       ▼
ingesta.service.js → detecta formato, llama al adaptador correcto
       │
       ├─ USAC → usac.adapter.js → parsea CSV con csv-parse
       ├─ UCR  → ucr.adapter.js  → parsea JSON nativo
       └─ UES  → ues.adapter.js  → parsea XML con xml2js
       │
       ▼
Modelo canónico  →  candidatos (PostgreSQL/Sequelize)
       │
       ▼
Respuesta JSON  { status, procesados, exitosos, errores }
```

---

## 2. Modelo canónico (contrato interno)

Todos los adaptadores deben devolver sus datos en esta estructura. **No modificarla sin avisar al equipo.**

```json
{
  "id_candidato": "USAC-2021-0081",
  "nombre_completo": "Carlos Alejandro Pérez Ramírez",
  "universidad_origen": "USAC",
  "carrera": "Ingeniería en Sistemas de Información",
  "cursos_aprobados": [
    { "codigo": "IPC1", "nota_final": 85 },
    { "codigo": "IPC2", "nota_final": 78 }
  ]
}
```

Reglas de validación:
- `universidad_origen` solo acepta: `"USAC"`, `"UCR"`, `"UES"` (mayúsculas)
- `nota_final` debe ser número entre **0 y 100**
- Todos los campos son obligatorios
- `cursos_aprobados` puede ser array vacío `[]` pero no puede ser `null`

---

## 3. Configuración del entorno local

### 3.0 Cada vez que haces pull del repo (LEER ANTES DE CUALQUIER COSA)

Como el equipo ya tiene el repo en su máquina y trabaja con **GitKraken**, el flujo para recibir cambios nuevos y arrancar a trabajar es:

**1. En GitKraken:** hacer Pull sobre `develop` para traer los últimos cambios.

**2. Luego, en la terminal, desde `prccd-mvp/backend`:**

```bash
cd prccd-mvp/backend
npm install
```

> Ejecutar `npm install` después de cada pull es importante porque alguien pudo haber agregado una nueva dependencia al `package.json`. Si no lo haces y falta un paquete, el servidor no arranca.

**3. Solo si es la primera vez que tocas el proyecto en tu máquina (no tienes `.env`):**

```bash
# Dentro de prccd-mvp/backend/
cp .env.example .env
# Ese .env es tuyo, local. No lo commitees, ya está en el .gitignore.
```

**4. En GitKraken:** crear tu rama desde `develop` con el nombre que corresponda a tu tarea (ej: `feature/ingesta-service`, `feature/examen-adaptativo`, etc.) y trabajar sobre ella.

---

**¿Por qué no están `node_modules/` ni `.env` en el repo?**

| Archivo / Carpeta | ¿Está en el repo? | Motivo |
|-------------------|------------------|--------|
| `node_modules/` | ❌ No | Pesa 100+ MB y cada quien lo genera con `npm install` |
| `.env` | ❌ No | Tiene contraseñas — cada quien tiene el suyo local |
| `.env.example` | ✅ Sí | Plantilla pública sin secretos, base para crear tu `.env` |
| `dist/` (build del frontend) | ❌ No | Se genera con `npm run build`, no se versiona |
| Todo el código fuente | ✅ Sí | Eso sí se versiona y comparte entre todos |

> **Error típico si no corriste `npm install`:** `Error: Cannot find module 'express'` o `Cannot find module 'csv-parse'`. Solución: correr `npm install` en la carpeta `backend/`.

---

### Opción A — Con Docker (recomendado, levanta todo)

```bash
# Desde la raíz del proyecto (prccd-mvp/)
cp backend/.env.example backend/.env

docker-compose up --build
```

Esto levanta:
- **PostgreSQL** → `localhost:5432`  (usuario: `prccd_user`, pass: `prccd_pass`, BD: `prccd_db`)
- **MongoDB** → `localhost:27017`
- **MinIO** → `localhost:9000` (consola web: `localhost:9001`, user/pass: `minioadmin`)
- **Backend** → `localhost:3000`

La tabla `candidatos` se crea automáticamente al arrancar PostgreSQL gracias al script en `backend/migrations/001_create_candidatos.sql`.

### Opción B — Sin Docker (solo el backend, necesitas PostgreSQL local)

```bash
# 1. Tener PostgreSQL corriendo localmente
# 2. Crear la BD manualmente:
psql -U postgres -c "CREATE DATABASE prccd_db;"
psql -U postgres -c "CREATE USER prccd_user WITH PASSWORD 'prccd_pass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE prccd_db TO prccd_user;"

# 3. Copiar y editar variables de entorno
cd prccd-mvp/backend
cp .env.example .env
# Editar .env: cambiar DB_HOST=localhost

# 4. Instalar dependencias (si no se hizo)
npm install

# 5. Levantar en modo desarrollo (con hot-reload)
npm run dev
```

### Variables de entorno (`.env`)

| Variable | Valor por defecto | Descripción |
|----------|------------------|-------------|
| `PORT` | `3000` | Puerto del servidor Express |
| `DB_HOST` | `postgres` (Docker) / `localhost` (local) | Host de PostgreSQL |
| `DB_PORT` | `5432` | Puerto PostgreSQL |
| `DB_NAME` | `prccd_db` | Nombre de la base de datos |
| `DB_USER` | `prccd_user` | Usuario PostgreSQL |
| `DB_PASSWORD` | `prccd_pass` | Contraseña PostgreSQL |
| `MONGO_URI` | `mongodb://mongodb:27017/prccd_docs` | URI de MongoDB |

---

## 4. El endpoint: `POST /api/ingest`

### Especificación

```
Método:       POST
URL:          http://localhost:3000/api/ingest
Content-Type: multipart/form-data
```

### Campos del body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `archivo` | File | Sí | El expediente (`.csv`, `.json` o `.xml`) |
| `universidad` | String | Sí | `"USAC"`, `"UCR"` o `"UES"` |

**Importante:** El campo del archivo se llama exactamente `archivo` (en minúscula). Si el frontend lo envía con otro nombre, el backend responderá 400.

### Respuestas

#### 200 — Procesado correctamente (con o sin errores parciales)

```json
{
  "status": "ok",
  "procesados": 5,
  "exitosos": 4,
  "errores": [
    { "fila": 3, "mensaje": "nota_final fuera de rango en curso \"IPC3\": 105" }
  ]
}
```

- `procesados`: total de filas/registros que se intentaron procesar
- `exitosos`: cuántos se insertaron/actualizaron en BD correctamente
- `errores`: array de errores por fila (puede estar vacío `[]` si todo fue bien)

#### 400 — Falta el archivo o el campo `universidad`

```json
{
  "status": "error",
  "message": "El campo \"archivo\" es obligatorio"
}
```

```json
{
  "status": "error",
  "message": "Datos de entrada inválidos",
  "errores": [
    { "msg": "universidad debe ser USAC, UCR o UES", "path": "universidad" }
  ]
}
```

#### 422 — Formato incorrecto o incompatible con la universidad

```json
{
  "status": "error",
  "message": "USAC solo acepta archivos CSV"
}
```

#### 500 — Error interno del servidor

```json
{
  "status": "error",
  "message": "Error interno del servidor"
}
```

---

## 5. Ejemplos con curl

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

### Verificar que el servidor está vivo

```bash
curl http://localhost:3000/health
# Respuesta: { "status": "ok", "service": "prccd-backend", "timestamp": "..." }
```

### Ejemplo desde JavaScript (fetch / frontend)

```javascript
async function ingestarExpediente(archivo, universidad) {
  const form = new FormData();
  form.append('archivo', archivo);         // archivo: objeto File del input
  form.append('universidad', universidad); // ej: 'USAC'

  const res = await fetch('http://localhost:3000/api/ingest', {
    method: 'POST',
    body: form,
    // NO pongas Content-Type manualmente; el browser lo setea con el boundary
  });

  return res.json();
}
```

---

## 6. Cómo funciona cada adaptador (para extender o corregir)

### 6.1 Adaptador USAC — `src/adapters/usac.adapter.js`

Parsea archivos CSV donde las columnas son:

```
student_id, full_name, institution, program, courses
```

El campo `courses` usa formato propio de USAC:
```
IPC1:85;IPC2:78;MATE1:90
```
Es decir: `CÓDIGO:NOTA` separados por punto y coma.

**Función exportada:**
```javascript
const { processUSAC } = require('./adapters/usac.adapter');
const resultado = await processUSAC(fileBuffer); // Buffer del archivo
```

**Retorna:**
```javascript
{
  success: true,
  data: [ /* registros canónicos válidos */ ],
  errors: [ /* { fila: N, mensaje: '...' } por cada fila con problema */ ]
}
```

### 6.2 Adaptador UCR — `src/adapters/ucr.adapter.js`

Parsea JSON con esta estructura (puede ser un objeto o un array de objetos):

```json
{
  "matricula": "UCR-C10-2021-0045",
  "nombreEstudiante": "Valeria Quesada",
  "universidadProcedencia": "UCR",
  "programaAcademico": "Bachillerato en Ciencias de la Computación",
  "materiasAprobadas": [
    { "codigoCurso": "CI-1310", "calificacion": 87 }
  ]
}
```

**Función exportada:**
```javascript
const { processUCR } = require('./adapters/ucr.adapter');
const resultado = await processUCR(rawData); // objeto o array ya parseado de JSON
```

### 6.3 Adaptador UES — `src/adapters/ues.adapter.js`

Parsea XML con dos formatos posibles:

**Un solo expediente:**
```xml
<expediente>
  <id>UES-ISC-2021-00312</id>
  <nombre>Luis Martínez</nombre>
  <universidad>UES</universidad>
  <carrera>Ingeniería en Sistemas Computacionales</carrera>
  <cursos>
    <curso><codigo>PRG101</codigo><nota>83</nota></curso>
  </cursos>
</expediente>
```

**Múltiples expedientes:**
```xml
<expedientes>
  <expediente>...</expediente>
  <expediente>...</expediente>
</expedientes>
```

**Función exportada:**
```javascript
const { processUES } = require('./adapters/ues.adapter');
const resultado = await processUES(fileBuffer); // Buffer del archivo XML
```

---

## 7. Estructura de la tabla `candidatos` en PostgreSQL

```sql
CREATE TABLE candidatos (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  id_candidato     VARCHAR(100) UNIQUE NOT NULL,   -- identificador regional único
  nombre_completo  VARCHAR(255) NOT NULL,
  universidad_origen VARCHAR(10) NOT NULL
    CHECK (universidad_origen IN ('USAC', 'UCR', 'UES')),
  carrera          VARCHAR(255) NOT NULL,
  cursos_aprobados JSONB       NOT NULL DEFAULT '[]',  -- array de { codigo, nota_final }
  fecha_ingesta    TIMESTAMP   NOT NULL DEFAULT NOW(),
  estado           VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
);
```

- Si se ingesta dos veces el mismo `id_candidato`, la fila existente se **actualiza** (upsert), no se duplica.
- `cursos_aprobados` se guarda como JSONB para poder hacer queries como:
  ```sql
  SELECT * FROM candidatos
  WHERE cursos_aprobados @> '[{"codigo": "IPC1"}]';
  ```

---

## 8. Archivos de prueba disponibles

Están en `backend/samples/`. Úsalos para probar sin necesidad de datos reales.

| Archivo | Universidad | Registros |
|---------|-------------|-----------|
| `usac_sample.csv` | USAC | 5 estudiantes, Ingeniería en Sistemas |
| `ucr_sample.json` | UCR | 3 estudiantes, Ciencias de la Computación |
| `ues_sample.xml` | UES | 3 estudiantes, Ingeniería en Sistemas Computacionales |

---

## 9. Cómo agregar una nueva universidad (para futuras iteraciones)

Si en una siguiente fase se agrega, por ejemplo, UNAH (Honduras):

1. Crear `backend/src/adapters/unah.adapter.js` siguiendo la misma firma:
   ```javascript
   async function processUNAH(fileBuffer) {
     // parsear el formato específico de UNAH
     return { success: true, data: [...], errors: [...] };
   }
   module.exports = { processUNAH };
   ```

2. En `ingesta.service.js`, agregar el caso en `invocarAdaptador`:
   ```javascript
   if (uni === 'UNAH') {
     return processUNAH(fileBuffer);
   }
   ```

3. Actualizar el `CHECK` de la columna `universidad_origen` en PostgreSQL:
   ```sql
   ALTER TABLE candidatos
     DROP CONSTRAINT candidatos_universidad_origen_check,
     ADD CONSTRAINT candidatos_universidad_origen_check
       CHECK (universidad_origen IN ('USAC', 'UCR', 'UES', 'UNAH'));
   ```

4. Actualizar la validación en `ingesta.routes.js`:
   ```javascript
   .isIn(['USAC', 'UCR', 'UES', 'UNAH'])
   ```

---

## 10. Notas importantes

- El backend **siempre responde JSON**, nunca HTML. Incluso los errores 500 son JSON.
- El límite de tamaño de archivo es **10 MB**. Si necesitas subir archivos más grandes, modificar `limits.fileSize` en `ingesta.routes.js`.
- Si una fila/registro tiene error, **no se detiene el proceso**: se guarda en `errores[]` y se continúa con el resto.
- La ingesta es **idempotente**: subir el mismo archivo dos veces no genera duplicados (upsert por `id_candidato`).
- El backend no guarda el archivo físicamente: lo procesa en memoria (`multer.memoryStorage()`), así que no genera basura en disco.
- **Multer 1.x** tiene vulnerabilidades conocidas en producción. Para el MVP académico está bien; en producción migrar a `multer@2.x` cuando salga estable.

---

## 11. Contacto

Cualquier duda sobre este módulo:
- **Javier Andrés Monjes Solórzano** — 202100081 — rama `feature/ingesta-usac`
- Revisar también `SCRUM.md` para el estado de las tareas F2-01, F2-02 y F2-03.
