# Login federado de candidatos (F2-28) — `feature/infra-setup`

Responsable: Javier Andrés Monjes Solórzano — 202100081
Rama: `feature/infra-setup`

## 1. Qué se implementó

El sistema ya tenía login para staff (ADMIN/EVALUADOR/COORDINADOR) hardcodeado en
`auth.routes.js`, pero **no existía ninguna forma de que un candidato (estudiante)
se autenticara**. La tabla `candidatos` tampoco tiene (ni debe tener) password,
porque los datos que llegan de USAC/UCR/UES por la ingesta son solo académicos
(`id_candidato`, `nombre_completo`, `universidad_origen`, `carrera`,
`cursos_aprobados`).

### Diseño (por qué se hizo así)

En la retroalimentación de Fase 1 se corrigió el caso de uso "Autenticar
identidad": **no se registra ni se crea ninguna cuenta**. Lo que el sistema debe
hacer es *confirmar* la identidad del candidato contra los datos académicos que
ya entregó su universidad — eso es lo que en producción harían las llamadas
reales a LDAP/SAML/OAuth2 de cada institución. Como este es un prototipo (sin
conexión real a los IdP de USAC/UCR/UES), se simula ese paso: el candidato envía
los datos que ya están en `candidatos` (cargados previamente por los
adaptadores de ingesta) y el sistema los confirma uno a uno.

No hay registro, no hay contraseña creada, no hay "crear cuenta". Si los tres
campos no coinciden exactamente con un registro `ACTIVO`, se rechaza.

## 2. Archivos modificados

| Archivo | Cambio |
|---|---|
| `backend/src/routes/auth.routes.js` | Nuevo endpoint `POST /api/auth/confirmar-identidad` (login candidato) |
| `backend/src/routes/examen.routes.js` | Cierre de hueco de suplantación: un JWT `rol: ESTUDIANTE` solo puede iniciar/responder/consultar **sus propias** sesiones de examen. Los roles de staff no cambian de comportamiento. |
| `docker-compose.yml` | Fix `driver: bridges` → `bridge` (typo que rompía la red). Se agregó `healthcheck` a Postgres y `depends_on: condition: service_healthy` en backend, más `restart: unless-stopped` en todos los servicios — sin esto, `docker compose up` en limpio hacía crashear el backend porque arrancaba antes que Postgres estuviera listo para aceptar conexiones. |
| `.gitignore` (raíz) | Tenía marcadores de merge sin resolver (`<<<<<<<`/`=======`/`>>>>>>>`) desde commit `ca8eb86`, ya corregido. Se agregó regla para nunca commitear claves privadas (`prccd-mvp/backend/data/pki/*-private.pem`). |

## 3. Contrato de API

### `POST /api/auth/confirmar-identidad` (público, sin JWT previo)

```json
// Request
{
  "id_candidato": "USAC-2024-001",
  "nombre_completo": "Maria Lopez",
  "universidad_origen": "USAC"
}

// Response 200
{
  "status": "ok",
  "token": "<jwt>",
  "usuario": {
    "id_candidato": "USAC-2024-001",
    "nombre": "Maria Lopez",
    "rol": "ESTUDIANTE",
    "universidad": "USAC"
  }
}

// Response 401 (no coincide o no existe o no está ACTIVO)
{ "status": "error", "message": "No se pudo confirmar la identidad del candidato" }
```

El JWT resultante (`rol: ESTUDIANTE`) se usa igual que el de staff: header
`Authorization: Bearer <token>` en cualquier ruta protegida.

### Rutas de examen ahora validan propiedad (`/api/examen/*`)

- `POST /iniciar` — si `rol === ESTUDIANTE`, el `id_candidato` del body debe ser
  el mismo del token, si no → `403`.
- `POST /responder` — si `rol === ESTUDIANTE`, se valida que la sesión
  (`sesion_id`) le pertenezca al candidato del token, si no → `403`.
- `GET /sesion/:id` — mismo chequeo, si no → `403`.

Para roles de staff no cambia nada (pueden operar sobre cualquier candidato,
igual que antes).

## 4. Cómo probar

### Con Docker (igual a como se demuestra: microservicios, no monolito)

```bash
cd prccd-mvp
docker compose up -d --build      # primera vez / tras cambios de código
# Validar que todo levantó sano:
docker compose ps                 # postgres debe decir "(healthy)"
curl http://localhost:3000/health          # backend directo
curl http://localhost/health               # backend vía nginx (puerto 80)

# Sembrar el banco de preguntas (una sola vez por volumen nuevo):
docker compose exec backend node scripts/seedPreguntas.js
```

Flujo de prueba (candidato debe existir antes en `candidatos`, vía
`POST /api/ingest` con un archivo USAC/UCR/UES, o ya estar cargado):

```bash
# 1. Confirmar identidad (login candidato)
curl -X POST http://localhost:3000/api/auth/confirmar-identidad \
  -H "Content-Type: application/json" \
  -d '{"id_candidato":"USAC-2024-001","nombre_completo":"Maria Lopez","universidad_origen":"USAC"}'
# -> copiar el "token" de la respuesta

# 2. Iniciar examen con ese token
curl -X POST http://localhost:3000/api/examen/iniciar \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"id_candidato":"USAC-2024-001"}'

# 3. Probar que NO puede iniciar examen de otro candidato (debe dar 403)
curl -X POST http://localhost:3000/api/examen/iniciar \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"id_candidato":"USAC-2024-002"}'
```

Ya se corrió este flujo completo de punta a punta (ingesta → confirmar
identidad → iniciar examen → bloqueo de suplantación) y todo respondió como se
espera.

**Importante para la demo:** con los fixes de `docker-compose.yml`, un
`docker compose up -d --build` desde cero (`docker compose down -v` primero)
ya no hace crashear el backend — espera a que Postgres esté `healthy` antes de
conectarse.

### Sin Docker (backend nativo con Node)

Útil para desarrollo rápido o si alguien no tiene Docker a mano. Requiere
Postgres accesible (puede ser el de Docker, ya que expone el puerto 5432 al
host, o uno local).

```bash
cd prccd-mvp/backend
npm install     # primera vez

# Si Postgres corre en Docker (docker compose up -d postgres):
DB_HOST=localhost DB_PORT=5432 DB_NAME=prccd_db DB_USER=prccd_user \
DB_PASSWORD=prccd_pass JWT_SECRET=prccd_secret_2026 PORT=3001 node index.js
```

Se probó así (puerto 3001 para no chocar con el contenedor) y el endpoint
`/api/auth/confirmar-identidad` respondió exactamente igual que en Docker —
el código es el mismo, solo cambia de dónde saca las variables de entorno.

## 4bis. Probar con Postman (para el resto del equipo de backend)

Se dejó una colección lista en `prccd-mvp/postman_collection.json` con todos
los endpoints actuales del backend (no solo el login de candidato), pensada
para que Oswaldo/Jencer/cualquiera la pueda correr sin escribir nada a mano:

1. Levantar el stack: `docker compose up -d --build` (ver sección 4) y, si es
   la primera vez con un volumen nuevo, sembrar preguntas con
   `docker compose exec backend node scripts/seedPreguntas.js`.
2. En Postman: **Import** → arrastrar `postman_collection.json`.
3. La colección trae una variable `base_url` = `http://localhost:3000`
   (cambiarla a `http://localhost` si se quiere probar pasando por nginx).
4. Correr las requests **en orden** (cada una ya tiene un script que guarda el
   token/sesión en variables de colección para que la siguiente lo use solo):
   1. `Health check` → debe dar `{"status":"ok",...}`
   2. `Login staff (admin)` → guarda `admin_token`
   3. `Ingesta USAC` → adjuntar un CSV (`student_id,full_name,institution,program,courses`)
      con el botón de archivo en el body `form-data` antes de enviar — Postman
      no permite dejar esto fijo en el JSON de la colección
   4. `Confirmar identidad` → guarda `estudiante_token` (usa el candidato que
      se ingestó en el paso 3, o cualquiera que ya exista en la BD)
   5. `Iniciar examen` → guarda `sesion_id`
   6. `Responder pregunta`, `Ver mi sesión`
   7. `[Negativo] Iniciar examen de OTRO candidato` → **debe dar 403**, si da
      200 algo se rompió en el control de propiedad
5. Cualquier endpoint nuevo que se agregue (certificados, periodos de
   certificación, etc.) debería agregarse a esta misma colección para que
   quede un solo lugar de verdad de cómo se prueba el backend.

## 5. Cómo lo integra el frontend

El frontend (`Frontend/`, React + Vite, todavía sin nada de auth ni llamadas al
backend) hoy no tiene `axios` ni cliente HTTP instalado — alcanza con `fetch`
nativo, no hace falta agregar dependencias para esto.

### 5.1. Qué levantar para desarrollar el frontend contra el backend real

```bash
# Terminal 1 — backend completo (Docker)
cd prccd-mvp
docker compose up -d --build
docker compose exec backend node scripts/seedPreguntas.js   # solo la primera vez

# Terminal 2 — frontend
cd Frontend
npm install
npm run dev      # Vite, normalmente http://localhost:5173
```

El backend tiene `cors()` habilitado sin restricciones (`app.js`), así que
Vite en `:5173` puede llamar directo a `http://localhost:3000` sin problema de
CORS. No es necesario pasar por nginx durante desarrollo del frontend.

### 5.2. Configurar la URL del backend

Crear `Frontend/.env` (Vite expone solo variables prefijadas `VITE_`):

```
VITE_API_URL=http://localhost:3000
```

### 5.3. Cliente de API mínimo

```js
// Frontend/src/api/client.js
const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
  return data;
}
```

### 5.4. Login de candidato (F2-28)

1. **Pantalla de login de candidato** (distinta a la de staff): formulario con
   `id_candidato` (carnet/matrícula), `nombre_completo`, `universidad_origen`
   (puede ser un select USAC/UCR/UES).

```js
// Frontend/src/api/auth.js
import { apiFetch } from './client';

export async function confirmarIdentidad({ id_candidato, nombre_completo, universidad_origen }) {
  const data = await apiFetch('/api/auth/confirmar-identidad', {
    method: 'POST',
    body: JSON.stringify({ id_candidato, nombre_completo, universidad_origen }),
  });
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  return data.usuario;
}
```

2. Manejo de respuesta:
   - `200` → ya quedó guardado el `token`/`usuario`, redirigir a la pantalla
     de examen.
   - Error (`401` u otro) → `apiFetch` lanza excepción; mostrar "No pudimos
     confirmar tu identidad, verifica tus datos" genérico — no decir cuál de
     los tres campos falló, evita dar pistas de enumeración.
3. Todas las llamadas a `/api/examen/*` ya van autenticadas automáticamente
   porque `apiFetch` agrega el header `Authorization` si hay `token` en
   `localStorage` — el mismo cliente sirve para las rutas de staff y de
   candidato.
4. Para distinguir la UI según rol, usar `usuario.rol` guardado
   (`"ESTUDIANTE"` vs `"ADMIN"/"EVALUADOR"/"COORDINADOR"`) — mismo patrón que
   ya existe para staff vía `GET /api/auth/me`.
5. Si el backend responde `403` en cualquier ruta de examen, es porque el
   `id_candidato`/`sesion_id` no le pertenece al token — no debería pasar en
   el flujo normal del frontend (solo relevante si alguien manipula el
   request a mano), pero conviene manejarlo como error genérico igual que el
   401.

### 5.5. Cómo verificar que la integración real funciona

1. Levantar backend + sembrar preguntas (5.1).
2. Ingestar al menos un candidato real con Postman/curl (`POST /api/ingest`,
   ver sección 4bis) para tener datos con los que probar el formulario.
3. `npm run dev` en `Frontend/`, abrir el formulario de login candidato,
   llenar con los datos del candidato ingestado.
4. Confirmar en DevTools → Network que `POST /api/auth/confirmar-identidad`
   da `200` y que las siguientes llamadas a `/api/examen/...` llevan el header
   `Authorization: Bearer ...`.
5. Probar el caso negativo a mano (nombre mal escrito) y confirmar que se
   muestra el mensaje de error sin tumbar la app.

## 6. Pendiente — qué falta y quién continúa

### Para Oswaldo (infraestructura — F2-26/27/29)

El login de candidato **ya quedó funcional**, esto no es un esqueleto a medio
hacer. Lo que sigue siendo tarea de infraestructura, no de este cambio:

- **Kubernetes**: hoy solo existe `docker-compose.yml` (un solo host). La
  propuesta de Fase 1 habla de microservicios con capacidad de escalar
  horizontalmente (ej. motor de examen) y de preparar migración a nube. Falta
  el manifiesto K8s (Deployments/Services por servicio, o al menos por
  backend+postgres+mongo+minio) si se quiere mostrar eso en la demo, además
  del compose.
- **Servicio de certificados**: la migración `005_create_certificados.sql` ya
  existe, pero no hay ningún `certificado.service.js` ni rutas en `src/` que
  use el par de llaves PKI (`backend/data/pki/`) para firmar/verificar. Esa es
  la tarea F2-27 a nivel de código de aplicación, todavía no iniciada.
- **nginx.conf**: el reverse proxy es funcional pero básico (no hay rate
  limiting, no hay TLS, no hay separación de rutas públicas vs protegidas a
  nivel de proxy). No es necesario para que la demo funcione, pero si se quiere
  mostrar "seguridad de infraestructura" en la presentación, falta.
- Verificar el `Dockerfile` del backend — está bien para desarrollo, pero usa
  `npm install` (no `npm ci`) y copia todo el contexto sin un `.dockerignore`
  explícito (existe `node_modules/` en `backend/.gitignore` pero no hay
  `.dockerignore`, así que si hay `node_modules` local se copia innecesariamente
  a la imagen antes del propio `npm install` — no rompe nada porque luego se
  pisa, pero alarga el build).

### Para Jencer (motor de examen — F2-02)

- Avisarle que se modificó `examen.routes.js` (no se tocó `examen.service.js`)
  para agregar el control de propiedad de sesión por candidato.
- Hay un archivo muerto `src/routes/examen.js` con sintaxis Fastify/ESM que no
  está conectado a `app.js` (la app usa `examen.routes.js`, Express/CommonJS) —
  no se tocó porque no es parte de esta tarea, pero alguien debería confirmar
  si se puede borrar.

### Para quien define el periodo de certificación

En la presentación de Fase 1 se menciona que el examen solo debería habilitarse
durante la "primera semana de cada mes" (restricción de negocio) y que el flujo
de acceso pasa por una cadena: JWT → periodo de certificación activo →
verificación antifraude (patrón Chain of Responsibility). Hoy solo existe el
primer eslabón (JWT). No hay tabla ni lógica de "periodos de certificación" en
el código — falta decidir quién la implementa y dónde vive.
