# Contrato Frontend — Email en Ingesta y Notificaciones

**Responsable:** Javier Andrés Monjes Solórzano — 202100081  
**Tarea:** F3 — feature/email-ingesta-notificaciones  
**Versión:** 1.0 — 2026-06-27

Este documento describe los cambios de Fase 3 que afectan al frontend:
el campo `email` en los expedientes de candidatos y el flujo de notificaciones automáticas.

---

## 1. Qué cambió en el backend

La tabla `candidatos` ahora tiene una columna `email VARCHAR(255)` (nullable).

Los tres adaptadores de ingesta ya extraen ese campo de los archivos fuente:

| Universidad | Formato | Campo en el archivo | Mapea a |
|-------------|---------|---------------------|---------|
| USAC        | CSV     | columna `email`     | `email` |
| UCR         | JSON    | campo `correo`      | `email` |
| UES         | XML     | etiqueta `<email>`  | `email` |

Si el archivo no incluye el campo, el candidato queda con `email = null` (sin error).

---

## 2. Cómo debe verse el formulario de ingesta (coordinador)

El coordinador sube un archivo CSV/JSON/XML al endpoint:

```
POST /api/ingesta
Content-Type: multipart/form-data
Authorization: Bearer <token COORDINADOR>
```

No hay cambio en el endpoint ni en los campos del form.  
El cambio es **en el contenido del archivo que el coordinador sube**.

### Plantilla USAC (CSV)

```csv
student_id,full_name,institution,program,courses,email
USAC-2025-001,Juan Pérez,USAC,Ingeniería en Sistemas,MAT101:90;FIS101:85,juan.perez@usac.edu.gt
USAC-2025-002,Ana Gómez,USAC,Ingeniería Civil,MAT101:75,
```

> La columna `email` es **opcional** — si está vacía o no existe, el sistema la acepta igual.

### Plantilla UCR (JSON)

```json
[
  {
    "matricula": "UCR-2025-042",
    "nombreEstudiante": "María López",
    "universidadProcedencia": "UCR",
    "programaAcademico": "Ciencias de la Computación",
    "correo": "maria.lopez@ucr.ac.cr",
    "materiasAprobadas": [
      { "codigoCurso": "CI-1101", "calificacion": 88 }
    ]
  }
]
```

> El campo `correo` es **opcional** — si no viene, el candidato queda sin email.

### Plantilla UES (XML)

```xml
<expedientes>
  <expediente>
    <id>UES-2025-007</id>
    <nombre>Carlos Ramos</nombre>
    <universidad>UES</universidad>
    <carrera>Ingeniería Industrial</carrera>
    <email>carlos.ramos@ues.edu.sv</email>
    <cursos>
      <curso><codigo>IND-101</codigo><nota>95</nota></curso>
    </cursos>
  </expediente>
</expedientes>
```

> La etiqueta `<email>` es **opcional** — puede omitirse sin error.

---

## 3. Qué muestra el frontend en el perfil del candidato

El endpoint interno `GET /api/auth/candidatos/:id_candidato` ya devuelve el campo `email`.  
Si el frontend necesita mostrar el email del candidato en el panel del coordinador:

```
GET /api/auth/candidatos/:id_candidato
Authorization: Bearer <token SERVICE o ADMIN>
```

```json
{
  "id_candidato": "USAC-2025-001",
  "nombre_completo": "Juan Pérez",
  "universidad_origen": "USAC",
  "carrera": "Ingeniería en Sistemas",
  "email": "juan.perez@usac.edu.gt",
  "estado": "ACTIVO"
}
```

Si `email` es `null`, el candidato no recibirá notificación por correo al emitir su certificado — mostrar un aviso visual al coordinador en ese caso.

---

## 4. Flujo completo de notificaciones (qué ve el candidato)

Cuando se emite un certificado con `dictamen = Aprobado`, el sistema envía automáticamente (vía Kafka → notificaciones-service):

1. **Email al candidato** — si `email != null`:
   - Asunto: "¡Tu certificado PRCCD fue emitido exitosamente!"
   - Contiene: ID del certificado, hash de verificación, link de verificación pública
2. **Email al coordinador de su universidad** — siempre:
   - Asunto: "Nuevo egresado aprobado — USAC/UCR/UES"
   - Contiene: nombre, ID candidato, ID certificado, link de verificación

**El frontend no necesita hacer nada para que esto ocurra** — es completamente automático.

---

## 5. UI sugerida para el coordinador al hacer ingesta

Mostrar advertencia si el archivo tiene candidatos sin email:

```jsx
{resultado.sinEmail?.length > 0 && (
  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
    <p className="text-yellow-800 text-sm font-semibold">
      {resultado.sinEmail.length} candidato(s) sin email registrado
    </p>
    <p className="text-yellow-700 text-sm">
      No recibirán notificación por correo al obtener su certificado.
    </p>
  </div>
)}
```

Para obtener esa lista, el frontend puede comparar `exitosos` vs candidatos sin email
consultando el endpoint de perfil tras la ingesta, o simplemente mostrar el conteo
del campo `errores` cuyo mensaje diga `"email ausente"` si se agrega esa lógica.

---

## 6. Variables de entorno que Oswaldo debe verificar en EC2

El `notificaciones-service` necesita estas variables en el `.env` o en el `docker-compose.yml` de producción para que los emails salgan realmente:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<cuenta-gmail-del-proyecto>
SMTP_PASS=<app-password-de-gmail>
SMTP_FROM=SICA PRCCD <noreply@sica.gt>

USAC_EMAIL=coordinador@usac.edu.gt
UCR_EMAIL=coordinador@ucr.ac.cr
UES_EMAIL=coordinador@ues.edu.sv
AUDITORES_SICA_EMAILS=auditor@sica.gt
```

Si estas variables no están configuradas, el servicio arranca pero los emails no se envían (falla silenciosa en Nodemailer).

---

## Resumen rápido para el equipo frontend

| Qué | Dónde | Cambio |
|-----|-------|--------|
| Campo `email` en candidatos | `candidatos` (DB) | Nuevo campo, nullable |
| Archivo USAC | CSV | Agregar columna `email` (opcional) |
| Archivo UCR | JSON | Agregar campo `correo` (opcional) |
| Archivo UES | XML | Agregar etiqueta `<email>` (opcional) |
| Perfil candidato | `GET /api/auth/candidatos/:id` | Ahora devuelve `email` |
| Notificación certificado | Automática por Kafka | Sin cambio de UI necesario |
