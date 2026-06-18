# Plataforma Regional de Certificacion de Competencias Digitales

## PRCCD - SICA

Universidad San Carlos de Guatemala
Facultad de Ingenieria
Escuela de Ciencias y Sistemas
Analisis y Diseno de Sistemas 2 - Seccion A
Escuela de Vacaciones Junio 2026

**Proyecto Fase 1**

| Nombre                           | Carne     | Rol                                       |
| ---------------------------------- | ----------- | ------------------------------------------- |
| Luis Fernando Gomez Rendon       | 201801391 | Scrum Master / Coordinador de repositorio |
| Ander Gilberto Popol Poron       | 201801518 | Product Owner / Analista de negocio       |
| Jencer Hamilton Hernandez Alonzo | 202002141 | Arquitecto de drivers y calidad           |
| Oswaldo Antonio Choc Cuteres     | 201901844 | Arquitecto de sistema e infraestructura   |
| Javier Andres Monjes Solorzano   | 202100081 | Disenador de datos e integracion          |
| Juan Jose Gerardi Hernandez      | 201900532 | Disenador UI/UX y patrones                |

Catedratica: Ing. Claudia Rojas de Moran
Vacaciones de junio 2026

---

# Tabla de Contenido

1. Identificacion del caso de negocio y Stakeholders
   * 1.1 Listado de Stakeholders y preocupaciones arquitectonicas
   * 1.2 Core del negocio
2. Caracteristicas del sistema y Drivers Arquitectonicos
   * 2.1 Drivers RF - Requerimientos Funcionales
   * 2.2 Drivers EaC - Escenarios de Atributos de Calidad
   * 2.3 Drivers de Restriccion
   * 2.4 Caracteristicas priorizadas del sistema
3. Diagramas de CDU expandidos
   * 3.1 Diagrama de casos de uso expandidos
   * 3.2 Detalle de drivers por CDU
4. Matrices de trazabilidad
   * 4.1 Stakeholders vs Requerimientos
   * 4.2 Stakeholders vs CDU
   * 4.3 Requerimientos vs CDU
5. Seleccion arquitectonica
6. Vistas Arquitectonicas - Nivel de Sistema
7. Vistas Arquitectonicas - Nivel de Infraestructura
8. Diseño de Datos
9. Diseño de Interfaces UI/UX
10. Patrones de Diseño
11. Gestion del Proyecto

---

# 1. Identificacion del caso de negocio y Stakeholders

## 1.1 Listado de Stakeholders y preocupaciones arquitectonicas

# Stakeholders y Preocupaciones Arquitectónicas — PRCCD

## 1. Directivos de Alta Dirección del SICA

### Intereses

* Unificar la región centroamericana bajo una sola plataforma de certificación.
* Que la primera versión arquitectónica esté completamente definida y documentada en 3–4 semanas.
* Visibilidad política del proyecto como logro regional.

### Preocupaciones y conflictos

* Presión de tiempo vs. calidad arquitectónica.
* Expectativa de integración sin forzar cambios en las instituciones educativas.

---

## 2. Dirección Financiera

### Intereses

* Respetar el presupuesto máximo de USD 180,000 para el piloto.
* Priorizar tecnologías Open Source para minimizar costos de licenciamiento.

### Preocupaciones y conflictos

* Tensión entre presupuesto limitado y los requerimientos técnicos complejos como blockchain, PKI, motor adaptativo y almacenamiento seguro de evidencia biométrica.

---

## 3. Administradores de TI Operativos del SICA

### Intereses

* Despliegue on-premise reutilizando servidores e infraestructura física existente.
* Que el sistema sea mantenible con personal de soporte limitado.
* Arquitectura preparada para migración futura a la nube.

### Preocupaciones y conflictos

* Capacidades técnicas heterogéneas del equipo interno.
* Complejidad de mantenimiento de un ecosistema de software fragmentado.

---

## 4. Instituciones Educativas como USAC, UCR, UES

### Intereses

* No modificar sus sistemas ni flujos de trabajo actuales.
* Integración nativa con sus sistemas legacy.

### Preocupaciones y conflictos

* Cada institución opera como silo tecnológico con protocolos de autenticación distintos: LDAP, SAML y OAuth2.
* Formatos de datos dispares: JSON, XML y CSV.
* Riesgo de rechazo institucional si se les exige adaptación.

---

## 5. Estudiantes y Profesionales Certificados (Usuarios Finales)

### Intereses

* Experiencia de evaluación fluida e intuitiva, incluso bajo exámenes adaptativos.
* Certificados digitales válidos transfronterizamente y verificables.
* Protección de sus datos personales (derecho al olvido y encriptación).

### Preocupaciones y conflictos

* Riesgo de degradación del servicio durante picos de tráfico como en la primera semana de cada mes.
* Privacidad ante la recolección de evidencia biométrica como capturas, logs de tecleo y video.

---

## 6. Ministerios de Trabajo y Educación

### Intereses

* Dashboards analíticos con métricas segmentadas por país, carrera y género.
* Validez jurídica transfronteriza de los certificados emitidos.
* Rastro de auditoría inmutable en cada certificado.

### Preocupaciones y conflictos

* Los datos analíticos deben anonimizarse antes de exponerse, generando un conflicto entre inteligencia de negocio y privacidad.

---

## 7. Entes Regulatorios y Normativos

### Intereses

* Cumplimiento con GDPR y leyes locales como la Ley de Acceso a la Información Pública de Guatemala.
* Encriptación de datos sensibles en reposo y en tránsito.
* Retención inalterable de evidencia por 5 años.
* Firmas electrónicas avanzadas para prevenir fraude académico.

### Preocupaciones y conflictos

* Distintas legislaciones de privacidad por país generan requisitos normativos en conflicto entre sí.


---

## 1.2 Core del negocio

El SICA necesita una plataforma regional (PRCCD) que evalúe y certifique competencias digitales mediante exámenes adaptativos, emita certificados con validez jurídica transfronteriza verificables criptográficamente, se integre con universidades heterogéneas (USAC, UCR, UES) sin obligarlas a cambiar, soporte picos masivos de tráfico durante la primera semana de cada mes, y provea analítica anonimizada a ministerios, todo bajo un presupuesto de USD 180,000 on-premise y con cumplimiento normativo multinacional.

## 1.3 Caso de Uso de alto nivel

![Diagrama CDU Alto Nivel](imagenes/CDU__AltoNivel.png)
---

## 1.4 Primera descomposicion

![Diagrama CDU Alto Nivel](imagenes/IMG-20260616-WA0014.jpg)

# 2. Caracteristicas del sistema y Drivers Arquitectonicos

## 2.1 Drivers RF - Requerimientos Funcionales

| ID    | Requisito Funcional                                                                                                                                                | Prioridad |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| RF-01 | El sistema debe permitir la autenticacion federada mediante los protocolos LDAP, SAML y OAuth2 segun la institucion universitaria                                  | Alta      |
| RF-02 | El sistema debe ejecutar evaluaciones mediante un motor de examenes adaptativos que ajuste la dificultad en tiempo real segun las respuestas previas del candidato | Alta      |
| RF-03 | El sistema debe capturar y almacenar evidencia antifraude durante la evaluacion, incluyendo capturas de pantalla, logs de tecleo y rafagas de video                | Alta      |
| RF-04 | El sistema debe emitir certificados digitales verificables criptograficamente mediante PKI o Blockchain (Hyperledger)                                              | Alta      |
| RF-05 | El sistema debe mantener un rastro de auditoria inmutable por cada certificado emitido                                                                             | Alta      |
| RF-06 | El sistema debe importar y exportar datos academicos en formatos JSON, XML y CSV                                                                                   | Media     |
| RF-07 | El sistema debe integrarse nativamente con los sistemas de USAC, UCR y UES sin obligar a estas instituciones a cambiar su forma de operar                          | Alta      |
| RF-08 | El sistema debe generar dashboards analiticos segmentados por pais, carrera universitaria y genero                                                                 | Media     |
| RF-09 | El sistema debe anonimizar y agregar los datos antes de exponerlos en las interfaces gerenciales                                                                   | Alta      |
| RF-10 | El sistema debe permitir la verificacion externa de un certificado mediante codigo, QR o hash                                                                      | Media     |
| RF-11 | El sistema debe gestionar usuarios, roles y permisos por institucion                                                                                               | Media     |
| RF-12 | El sistema debe habilitar los periodos de certificacion exclusivamente durante la primera semana de cada mes                                                       | Alta      |

---

## 2.2 Drivers EaC - Escenarios de Atributos de Calidad

| ID     | Atributo          | Estimulo                                                | Entorno                                          | Respuesta esperada                                                       | Medida                                                     |
| -------- | ------------------- | --------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| EaC-01 | Escalabilidad     | Miles de usuarios acceden simultaneamente               | Primera semana del mes, periodo de certificacion | El sistema escala sin degradar el servicio                               | Tiempo de respuesta < 3 seg con 5,000 usuarios simultaneos |
| EaC-02 | Disponibilidad    | Fallo de un componente interno                          | Periodo de certificacion activo                  | El sistema continua operando mediante redundancia                        | Disponibilidad >= 99.9%                                    |
| EaC-03 | Seguridad         | Intento de alteracion de una calificacion               | En cualquier momento                             | El sistema rechaza la alteracion y registra el intento                   | 0 modificaciones no autorizadas en la bitacora             |
| EaC-04 | Interoperabilidad | Universidad envia datos en CSV legacy                   | Integracion con sistema heredado                 | El sistema ingesta y normaliza los datos correctamente                   | 100% de registros procesados sin perdida                   |
| EaC-05 | Rendimiento       | Candidato responde una pregunta                         | Durante evaluacion activa                        | El motor adaptativo calcula y presenta la siguiente pregunta             | Tiempo de ajuste < 2 segundos                              |
| EaC-06 | Privacidad        | Solicitud de datos para dashboard gerencial             | Consulta analitica                               | El sistema expone solo datos agregados y anonimizados                    | 0 datos personales identificables expuestos                |
| EaC-07 | Auditabilidad     | Ministerio solicita verificar un certificado            | Post emision                                     | El sistema provee trazabilidad completa e inmutable                      | Tiempo de consulta de auditoria < 5 segundos               |
| EaC-08 | Mantenibilidad    | Se requiere agregar un nuevo protocolo de autenticacion | Evolucion del sistema                            | El sistema permite integrar el nuevo protocolo sin afectar otros modulos | Tiempo de integracion < 2 semanas                          |

---

## 2.3 Drivers de Restriccion

| ID   | Tipo        | Restriccion                                                                                                   |
| ------ | ------------- | --------------------------------------------------------------------------------------------------------------- |
| R-01 | Economica   | El presupuesto maximo para el piloto es de USD 180,000                                                        |
| R-02 | Tecnologica | Se debe priorizar el uso de tecnologias Open Source para optimizar costos de licenciamiento                   |
| R-03 | Operativa   | La primera version debe desplegarse on-premise reutilizando infraestructura existente del SICA                |
| R-04 | Tecnologica | La arquitectura debe estar preparada para migracion transparente a la nube en fases posteriores               |
| R-05 | Normativa   | Debe cumplir con GDPR y leyes locales de proteccion de datos de cada pais miembro                             |
| R-06 | Normativa   | La evidencia antifraude debe retenerse de forma inalterable por un minimo de 5 anos                           |
| R-07 | Normativa   | Cada certificado debe tener validez juridica transfronteriza respaldada por firma electronica avanzada        |
| R-08 | Operativa   | La arquitectura debe integrarse con sistemas legados sin obligar a las universidades a modificar sus procesos |
| R-09 | Temporal    | La primera version arquitectonica debe estar completamente definida y documentada en 3-4 semanas              |

---

## 2.4 Caracteristicas priorizadas del sistema

| Prioridad | Caracteristica                                          | Justificacion de impacto                                            |
| ----------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| 1         | Motor de evaluacion adaptativa                          | Es el nucleo funcional del negocio, sin esto no hay plataforma      |
| 2         | Emision de certificados verificables criptograficamente | Es la propuesta de valor principal ante ministerios e instituciones |
| 3         | Autenticacion federada e integracion universitaria      | Sin integracion con USAC/UCR/UES no hay usuarios en el sistema      |
| 4         | Auditoria antifraude inmutable                          | Requisito legal y de confianza institucional obligatorio            |
| 5         | Privacidad y cifrado de datos                           | Cumplimiento normativo no negociable (GDPR)                         |
| 6         | Dashboards analiticos anonimizados                      | Valor estrategico para ministerios de educacion y trabajo           |
| 7         | Escalabilidad en picos de trafico                       | Garantia de calidad de servicio durante certificaciones             |
| 8         | Preparacion para migracion a nube                       | Vision de evolucion tecnologica a largo plazo                       |

---

# 3. Diagramas de CDU expandidos

# CDU 01 — Gestionar Certificación Digital
## Plataforma Regional de Certificación de Competencias Digitales (PRCCD)



![Diagrama de casos de uso expandidos GestionarCertificacion](imagenes/cdu01.png)


 
---
 
## UC-1.1 — Registrar candidato
 
| | |
|---|---|
| **Nombre** | Registrar candidato |
| **Actores** | Estudiantes / Profesores |
| **Propósito** | Permitir que un nuevo usuario se registre en la plataforma PRCCD para acceder a los procesos de certificación. |
 
**Resumen:** El caso de uso inicia cuando un candidato accede al formulario de registro. El sistema valida los datos académicos suministrados, asigna un rol y confirma el registro. Finaliza cuando el candidato recibe confirmación de su cuenta creada.
 
### Curso Normal de Eventos
 
| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El candidato accede al formulario de registro e ingresa sus datos personales y académicos (nombre, carnet, universidad de origen, correo institucional). | 2. El sistema valida que el correo institucional corresponda a una de las universidades pilares (USAC, UCR, UES). |
| | 3. El sistema verifica que el candidato no tenga una cuenta activa previamente registrada. |
| | 4. El sistema invoca UC-1.3 «Validar datos académicos» para confirmar la vigencia del candidato en su institución. |
| 5. El candidato confirma los datos ingresados y envía el formulario. | 6. El sistema invoca UC-1.4 «Asignar rol candidato» y asigna el rol correspondiente según la institución. |
| | 7. El sistema crea la cuenta, genera un ID único de candidato y envía un correo de confirmación. |
| 8. El candidato recibe el correo y activa su cuenta. | 9. El sistema registra el evento de creación en la bitácora de auditoría y finaliza el caso de uso. |
 
### Cursos Alternos
 
| Condición | Acción |
|---|---|
| En el paso 2 — correo no institucional | El sistema muestra un mensaje de error indicando que el correo no corresponde a una institución registrada. El candidato puede corregirlo y reintentar. |
| En el paso 3 — cuenta duplicada | El sistema notifica que ya existe una cuenta asociada al correo. Ofrece la opción de recuperar contraseña o contactar soporte. |
 
---
 
## UC-1.2 — Autenticar identidad
 
| | |
|---|---|
| **Nombre** | Autenticar identidad |
| **Actores** | Estudiantes / Profesores, Alta dirección |
| **Propósito** | Verificar la identidad del usuario mediante el protocolo de autenticación correspondiente a su institución antes de permitir el acceso al sistema. |
 
**Resumen:** El caso de uso inicia cuando un usuario intenta iniciar sesión. El sistema detecta el protocolo de autenticación de la institución (LDAP, SAML u OAuth2), delega la verificación y genera un token unificado de sesión. Finaliza cuando el usuario accede al panel principal o es bloqueado tras intentos fallidos.
 
### Curso Normal de Eventos
 
| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El usuario ingresa sus credenciales (correo institucional y contraseña) en la pantalla de inicio de sesión. | 2. El sistema detecta la institución origen del correo e identifica el protocolo de autenticación aplicable (LDAP para USAC, SAML para UCR, OAuth2 para UES). |
| | 3. El sistema invoca UC-1.5 «Verificar protocolo auth.» y redirige la solicitud al proveedor de identidad correspondiente. |
| 4. El usuario completa el flujo de autenticación con su proveedor de identidad institucional. | 5. El proveedor retorna la respuesta de autenticación al sistema. |
| | 6. El sistema valida la respuesta, genera un token JWT unificado con los atributos del usuario y establece la sesión. |
| | 7. El sistema registra el evento de inicio de sesión en la bitácora y redirige al usuario a su panel principal. |
 
### Cursos Alternos
 
| Condición | Acción |
|---|---|
| En el paso 4 — credenciales incorrectas (intento 1 o 2) | El sistema muestra mensaje de error y permite al usuario reintentar. El contador de intentos fallidos se incrementa. |
| En el paso 4 — credenciales incorrectas (3er intento) | El sistema invoca UC-1.6 «Bloquear acceso», suspende la cuenta temporalmente y notifica al usuario por correo con instrucciones de desbloqueo. |
| En el paso 3 — proveedor de identidad no disponible | El sistema muestra mensaje de indisponibilidad temporal y registra el fallo en la bitácora para revisión por Admin. TI. |
 
---
 
## UC-1.3 — Validar datos académicos
 
| | |
|---|---|
| **Nombre** | Validar datos académicos |
| **Actores** | Estudiantes / Profesores *(indirecto — invocado por UC-1.1)* |
| **Propósito** | Confirmar con el sistema universitario externo que el candidato está activo y vigente en su institución de origen. |
 
**Resumen:** El caso de uso es invocado automáticamente durante el registro. El sistema consulta el API o repositorio de datos de la universidad correspondiente para verificar que el candidato figura como activo. Finaliza retornando el resultado de la validación al proceso que lo invocó.
 
### Curso Normal de Eventos
 
| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-1.1 invoca este caso de uso con los datos del candidato (carnet, correo, institución). | 2. El sistema consulta el conector de integración correspondiente a la universidad indicada. |
| | 3. El conector realiza la consulta al sistema universitario externo mediante el protocolo disponible (REST / SOAP / CSV). |
| | 4. El sistema universitario externo retorna el estado del estudiante (activo, inactivo, egresado). |
| | 5. El sistema evalúa la respuesta: si el candidato está activo, aprueba la validación y retorna VÁLIDO al proceso invocante. |
 
### Cursos Alternos
 
| Condición | Acción |
|---|---|
| En el paso 4 — candidato inactivo o no encontrado | El sistema retorna INVÁLIDO. UC-1.1 muestra al candidato el mensaje correspondiente e interrumpe el registro. |
| En el paso 3 — sistema universitario no disponible | El sistema retorna PENDIENTE y programa un reintento automático. El registro queda en estado provisional hasta confirmar la validación. |
 
---
 
## UC-1.4 — Asignar rol candidato
 
| | |
|---|---|
| **Nombre** | Asignar rol candidato |
| **Actores** | Estudiantes / Profesores *(indirecto — invocado por UC-1.1)* |
| **Propósito** | Determinar y asignar el rol y permisos adecuados al candidato según su perfil institucional dentro de la plataforma PRCCD. |
 
**Resumen:** El caso de uso es invocado tras la validación exitosa de datos académicos. El sistema determina el rol apropiado (candidato estudiante o candidato profesional) según los atributos retornados por la institución, asigna los permisos correspondientes y persiste la asignación. Finaliza retornando el rol asignado al proceso UC-1.1.
 
### Curso Normal de Eventos
 
| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-1.1 invoca este caso de uso con los atributos del candidato validado (nivel académico, carrera, institución). | 2. El sistema evalúa los atributos: si el candidato es estudiante activo asigna rol `CANDIDATO_ESTUDIANTE`; si es egresado o profesional asigna rol `CANDIDATO_PROFESIONAL`. |
| | 3. El sistema carga el perfil de permisos asociado al rol asignado (acceso a exámenes, historial de certificaciones, descarga de credenciales). |
| | 4. El sistema persiste la asignación de rol en la base de datos de usuarios. |
| | 5. El sistema registra el evento de asignación en la bitácora y retorna el rol asignado al proceso invocante. |
 
### Cursos Alternos
 
| Condición | Acción |
|---|---|
| En el paso 2 — perfil no clasificable | El sistema asigna rol `CANDIDATO_PENDIENTE` y notifica al Administrador SICA para revisión manual del perfil. |
 
---
 
## UC-1.5 — Habilitar período de evaluación
 
| | |
|---|---|
| **Nombre** | Habilitar período de evaluación |
| **Actores** | Alta dirección, Dirección Financiera |
| **Propósito** | Activar el período de certificación mensual, habilitando el acceso a los exámenes adaptativos para los candidatos registrados durante la primera semana de cada mes. |
 
**Resumen:** El caso de uso inicia cuando la Alta dirección solicita la habilitación del período. El sistema verifica la aprobación presupuestaria, activa el período de evaluación, notifica a los candidatos elegibles y registra la acción. Finaliza cuando el período queda activo y los candidatos pueden acceder a los exámenes.
 
### Curso Normal de Eventos
 
| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. La Alta dirección accede al panel de administración y solicita la habilitación del período de evaluación para el mes en curso. | 2. El sistema verifica que la Dirección Financiera haya aprobado el presupuesto operativo del período. |
| | 3. El sistema valida que no exista un período activo previo sin cerrar. |
| | 4. El sistema activa el período: establece fecha de inicio, fecha de cierre (7 días), cupos máximos y parámetros del examen adaptativo. |
| | 5. El sistema invoca UC-1.7 «Enviar recordatorio» y envía avisos a todos los candidatos registrados con cuenta activa. |
| | 6. El sistema registra el evento de habilitación en la bitácora con sello de tiempo y firma del actor responsable. |
| 7. La Alta dirección recibe confirmación del período habilitado con el resumen de candidatos notificados. | |
 
### Cursos Alternos
 
| Condición | Acción |
|---|---|
| En el paso 2 — presupuesto no aprobado | El sistema muestra alerta indicando que la Dirección Financiera no ha completado la aprobación. El período no se habilita hasta recibir confirmación. |
| En el paso 5 — envío de notificaciones falla parcialmente | El sistema registra los candidatos no notificados y programa reintento automático. El período se habilita de todas formas. |
 
---
 
## UC-1.6 — Bloquear acceso
 
| | |
|---|---|
| **Nombre** | Bloquear acceso |
| **Actores** | Sistema *(automático — `«extend»` desde UC-1.2)* |
| **Propósito** | Suspender temporalmente el acceso de un usuario que ha superado el número máximo de intentos de autenticación fallidos para prevenir accesos no autorizados. |
 
**Resumen:** El caso de uso se activa automáticamente cuando el sistema detecta que un usuario ha fallado la autenticación tres veces consecutivas. El sistema bloquea la cuenta, registra el evento de seguridad y notifica al usuario con instrucciones de desbloqueo. Finaliza cuando la cuenta queda suspendida y el evento queda registrado.
 
### Curso Normal de Eventos
 
| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El sistema detecta el tercer intento de autenticación fallido para el mismo usuario en un período de 15 minutos. | 2. El sistema marca la cuenta como `BLOQUEADA_TEMPORAL` y establece un tiempo de bloqueo de 30 minutos. |
| | 3. El sistema registra el evento de bloqueo en la bitácora de seguridad con IP de origen, timestamp y número de intentos. |
| | 4. El sistema envía correo al usuario con notificación del bloqueo y enlace para desbloqueo mediante verificación de identidad alterna. |
| | 5. El sistema notifica al Administrador SICA si el patrón de bloqueos es recurrente en el mismo usuario (más de 3 bloqueos en 24 horas). |
 
### Cursos Alternos
 
| Condición | Acción |
|---|---|
| Después del bloqueo — el usuario completa verificación alterna | El sistema restablece el contador de intentos, desbloquea la cuenta y registra el desbloqueo en la bitácora. |
| Bloqueo recurrente (más de 3 en 24h) | El sistema escala a bloqueo permanente y requiere intervención manual del Administrador SICA para rehabilitar la cuenta. |
 
---
 
## UC-1.7 — Enviar recordatorio
 
| | |
|---|---|
| **Nombre** | Enviar recordatorio |
| **Actores** | Sistema *(automático — `«extend»` desde UC-1.5)*, Alta dirección |
| **Propósito** | Notificar a los candidatos registrados que aún no han iniciado su examen durante las primeras 48 horas del período de evaluación activo. |
 
**Resumen:** El caso de uso se activa automáticamente 48 horas después de habilitado el período de evaluación. El sistema identifica a los candidatos con cuenta activa que no han accedido al examen, genera y envía un recordatorio personalizado. Finaliza cuando todos los recordatorios han sido enviados y registrados.
 
### Curso Normal de Eventos
 
| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El sistema detecta que han transcurrido 48 horas desde la habilitación del período de evaluación activo. | 2. El sistema consulta la lista de candidatos con cuenta activa y estado de examen = `NO_INICIADO`. |
| | 3. El sistema genera un mensaje de recordatorio personalizado que incluye: nombre del candidato, días restantes del período y enlace directo al examen. |
| | 4. El sistema envía el recordatorio por correo electrónico a cada candidato identificado. |
| | 5. El sistema registra en la bitácora la lista de candidatos notificados, timestamp y estado del envío (`ENVIADO` / `FALLIDO`). |
| 6. La Alta dirección puede consultar el reporte de recordatorios enviados desde el panel de administración. | |
 
### Cursos Alternos
 
| Condición | Acción |
|---|---|
| En el paso 4 — envío falla para un candidato | El sistema registra el fallo y programa un reintento en 2 horas. Si el reintento falla, el candidato queda marcado como `NO_NOTIFICADO` en el reporte. |
| Candidato no tiene correo activo | El sistema omite el envío y registra la incidencia. El Administrador SICA puede gestionar el contacto de forma manual. |

# CDU 02 — Rendir Examen Adaptativo
## Plataforma Regional de Certificación de Competencias Digitales (PRCCD)


![Diagrama de casos de uso expandidos GestionarCertificacion](imagenes/cdu02.png)



---

## UC-2.1 — Iniciar sesión examen

| | |
|---|---|
| **Nombre** | Iniciar sesión examen |
| **Actores** | Estudiantes / Profesores |
| **Propósito** | Permitir que un candidato autenticado acceda y arranque su sesión de examen adaptativo dentro del período de certificación activo. |

**Resumen:** El caso de uso inicia cuando el candidato, ya autenticado, solicita comenzar su examen. El sistema verifica que la sesión esté activa, carga el banco de preguntas correspondiente al perfil del candidato e inicia el motor de evaluación adaptativa. Finaliza cuando la primera pregunta es presentada al candidato.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El candidato accede al panel principal y selecciona la opción "Iniciar examen" durante el período de certificación activo. | 2. El sistema invoca UC-2.3 «Verificar sesión activa» para confirmar que no existe otra sesión de examen abierta para el mismo candidato. |
| | 3. El sistema verifica que el candidato no haya agotado sus intentos permitidos para el período actual. |
| | 4. El sistema invoca UC-2.2 «Cargar banco preguntas» para obtener el conjunto inicial de preguntas según el perfil del candidato. |
| | 5. El sistema registra el timestamp de inicio, genera un ID único de sesión de examen y persiste el estado `EN_PROGRESO`. |
| | 6. El sistema invoca UC-2.4 «Ajustar dificultad» para determinar la dificultad de la primera pregunta según el perfil previo del candidato. |
| 7. El candidato visualiza la primera pregunta y comienza a responder. | 8. El sistema activa la captura de evidencia antifraude invocando UC-2.5 «Capturar evidencia» en segundo plano. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — sesión de examen ya activa | El sistema notifica al candidato que ya tiene una sesión en curso y le ofrece la opción de reanudarla. Se invoca UC-2.6 «Reanudar examen». |
| En el paso 3 — intentos agotados | El sistema muestra mensaje indicando que el candidato ha alcanzado el límite de intentos para el período. No se permite iniciar un nuevo examen. |
| En el paso 4 — banco de preguntas no disponible | El sistema registra el fallo, muestra mensaje de error técnico y notifica al Admin. TI para revisión inmediata. |

---

## UC-2.2 — Cargar banco preguntas

| | |
|---|---|
| **Nombre** | Cargar banco preguntas |
| **Actores** | Sistema *(invocado por UC-2.1)* |
| **Propósito** | Recuperar y preparar el conjunto de preguntas disponibles para la sesión de examen según el perfil académico y área de certificación del candidato. |

**Resumen:** El caso de uso es invocado automáticamente al iniciar la sesión de examen. El sistema consulta el repositorio de preguntas, filtra por área de competencia y nivel de dificultad inicial, y prepara el pool de preguntas para el motor adaptativo. Finaliza retornando el conjunto de preguntas listo para su uso.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-2.1 invoca este caso de uso con el perfil del candidato (área de certificación, historial de exámenes previos). | 2. El sistema consulta el repositorio de preguntas filtrando por área de competencia y estado `ACTIVA`. |
| | 3. El sistema aplica el algoritmo de selección: excluye preguntas ya respondidas en intentos anteriores del mismo período. |
| | 4. El sistema organiza las preguntas por niveles de dificultad (básico, intermedio, avanzado) para uso del motor adaptativo. |
| | 5. El sistema retorna el pool de preguntas estructurado al proceso UC-2.1. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — repositorio sin preguntas para el área solicitada | El sistema retorna error `BANCO_VACIO`. UC-2.1 interrumpe el inicio del examen y notifica al Admin. TI. |
| En el paso 3 — candidato ha respondido todas las preguntas disponibles | El sistema amplía el pool incluyendo preguntas de períodos anteriores no respondidas. Si aún es insuficiente, notifica al Admin. TI para agregar nuevas preguntas. |

---

## UC-2.3 — Verificar sesión activa

| | |
|---|---|
| **Nombre** | Verificar sesión activa |
| **Actores** | Sistema *(invocado por UC-2.1)* |
| **Propósito** | Confirmar que el candidato no tiene una sesión de examen simultánea abierta para garantizar la integridad del proceso de evaluación. |

**Resumen:** El caso de uso es invocado antes de iniciar o reanudar un examen. El sistema consulta las sesiones activas del candidato, verifica su estado y retorna el resultado al proceso invocante. Finaliza indicando si existe una sesión previa abierta o si el candidato puede iniciar una nueva.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-2.1 invoca este caso de uso con el ID del candidato y el ID del período de certificación activo. | 2. El sistema consulta la tabla de sesiones de examen filtrando por candidato y estado `EN_PROGRESO`. |
| | 3. El sistema evalúa el resultado: si no existe sesión activa, retorna `LIBRE` al proceso invocante. |
| | 4. El sistema registra la verificación en el log de auditoría de sesiones. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — existe sesión activa con tiempo transcurrido menor a 30 min | El sistema retorna `SESION_ACTIVA` con los datos de la sesión existente para que UC-2.1 ofrezca al candidato reanudarla. |
| En el paso 2 — existe sesión activa con tiempo transcurrido mayor a 30 min sin actividad | El sistema marca la sesión como `ABANDONADA`, libera el slot y retorna `LIBRE` para que el candidato pueda iniciar una nueva sesión. |

---

## UC-2.4 — Ajustar dificultad

| | |
|---|---|
| **Nombre** | Ajustar dificultad |
| **Actores** | Sistema *(invocado por UC-2.1 en cada pregunta)* |
| **Propósito** | Determinar dinámicamente el nivel de dificultad de la siguiente pregunta en función de las respuestas previas del candidato dentro de la sesión actual. |

**Resumen:** El caso de uso es invocado de forma continua durante la sesión de examen, después de cada respuesta del candidato. El sistema evalúa la respuesta previa, calcula el nuevo nivel de dificultad usando el algoritmo adaptativo y selecciona la siguiente pregunta. Finaliza retornando la siguiente pregunta al motor de examen.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El candidato envía su respuesta a la pregunta actual. | 2. El sistema evalúa si la respuesta es correcta o incorrecta y calcula el puntaje parcial acumulado. |
| | 3. El sistema aplica el algoritmo adaptativo: si la respuesta fue correcta, incrementa un nivel de dificultad; si fue incorrecta, mantiene o reduce el nivel. |
| | 4. El sistema selecciona del pool disponible la siguiente pregunta que corresponda al nivel de dificultad calculado. |
| | 5. El sistema registra la transición (pregunta respondida → nivel calculado → pregunta siguiente) en el log de sesión. |
| | 6. El sistema retorna la siguiente pregunta al motor de examen para presentarla al candidato. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — no hay preguntas disponibles en el nivel calculado | El sistema selecciona la pregunta más cercana disponible en el nivel inmediatamente inferior o superior. |
| En el paso 1 — el candidato excede el tiempo límite por pregunta | El sistema registra la pregunta como `NO_RESPONDIDA`, penaliza el puntaje según la política del período y avanza a la siguiente pregunta automáticamente. |

---

## UC-2.5 — Capturar evidencia

| | |
|---|---|
| **Nombre** | Capturar evidencia |
| **Actores** | Estudiantes / Profesores *(sujeto pasivo)*, Entes regulatorios |
| **Propósito** | Recopilar y almacenar de forma segura la telemetría de comportamiento del candidato durante el examen para garantizar la integridad del proceso y cumplir con los requisitos de auditoría antifraude. |

**Resumen:** El caso de uso se ejecuta en segundo plano durante toda la sesión de examen. El sistema recolecta capturas de pantalla periódicas, logs de tecleo y ráfagas de video, los cifra y los almacena de forma segura. Los Entes regulatorios tienen acceso a esta evidencia para auditorías. Finaliza cuando la sesión de examen termina y toda la evidencia queda almacenada e inmutable.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-2.1 activa la captura de evidencia al inicio de la sesión de examen. | 2. El sistema inicia la recolección de telemetría: captura de pantalla cada 60 segundos, registro de patrones de tecleo en tiempo real. |
| | 3. El sistema activa la captura de video ocasional según umbrales de actividad sospechosa definidos por los Entes regulatorios. |
| | 4. El sistema cifra cada artefacto de evidencia con la llave pública del período de certificación antes de persistirlo. |
| | 5. El sistema almacena la evidencia cifrada en el repositorio seguro con metadatos: ID sesión, timestamp, tipo de artefacto, hash de integridad. |
| | 6. El sistema mantiene un contador de artefactos recolectados y verifica continuamente la integridad del almacenamiento. |
| 7. Al finalizar el examen, el candidato cierra la sesión. | 8. El sistema cierra el proceso de captura, genera el resumen de evidencia de la sesión y actualiza el estado a `EVIDENCIA_COMPLETA`. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| Durante la captura — se detecta patrón sospechoso | El sistema invoca UC-2.7 «Detectar anomalía» para analizar el comportamiento y determinar si se requiere intervención. |
| En el paso 5 — fallo en el almacenamiento | El sistema reintenta el almacenamiento en repositorio alternativo. Si falla tres veces, suspende el examen y notifica al Admin. TI. |
| En el paso 3 — candidato bloquea acceso a cámara o micrófono | El sistema registra el bloqueo como evento de posible anomalía e invoca UC-2.7 «Detectar anomalía». |

---

## UC-2.6 — Suspender examen

| | |
|---|---|
| **Nombre** | Suspender examen |
| **Actores** | Sistema *(automático — `«extend»` desde UC-2.1)*, Entes regulatorios |
| **Propósito** | Interrumpir y suspender una sesión de examen cuando se confirma una anomalía grave que compromete la integridad del proceso de evaluación. |

**Resumen:** El caso de uso se activa cuando UC-2.7 «Detectar anomalía» confirma un nivel de riesgo alto. El sistema suspende la sesión, preserva toda la evidencia recolectada hasta ese momento, notifica al candidato y a los Entes regulatorios, y registra el evento de suspensión con todos los detalles. Finaliza cuando la sesión queda en estado `SUSPENDIDA` y la evidencia asegurada.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-2.7 invoca este caso de uso al confirmar una anomalía con nivel de riesgo `ALTO`. | 2. El sistema detiene inmediatamente la presentación de preguntas y bloquea la interfaz del candidato. |
| | 3. El sistema preserva y cierra el proceso de captura de evidencia, asegurando que todos los artefactos recolectados queden cifrados e inmutables. |
| | 4. El sistema marca la sesión como `SUSPENDIDA` con el motivo, timestamp y referencia al evento de anomalía detectado. |
| | 5. El sistema notifica al candidato explicando que su examen ha sido suspendido y que será revisado por los Entes regulatorios. |
| | 6. El sistema genera un reporte de suspensión y lo envía a los Entes regulatorios para revisión. |
| | 7. El sistema registra el evento completo de suspensión en la bitácora de auditoría inmutable. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| Después de la revisión — Ente regulatorio determina falso positivo | El sistema rehabilita la sesión del candidato, le notifica y le otorga un nuevo intento sin penalización dentro del mismo período. |
| Después de la revisión — Ente regulatorio confirma fraude | El sistema mantiene la suspensión, inhabilita al candidato para el período actual y registra el incidente en el historial permanente del candidato. |

---

## UC-2.7 — Detectar anomalía

| | |
|---|---|
| **Nombre** | Detectar anomalía |
| **Actores** | Sistema *(automático — `«extend»` desde UC-2.5)*, Entes regulatorios |
| **Propósito** | Analizar los artefactos de telemetría recolectados durante el examen para identificar patrones de comportamiento sospechoso que puedan indicar un intento de fraude. |

**Resumen:** El caso de uso se activa condicionalmente cuando UC-2.5 detecta un patrón inusual en la telemetría del candidato. El sistema analiza los artefactos recientes, calcula un nivel de riesgo y determina la acción apropiada. Si el riesgo es alto, escala a UC-2.6 «Suspender examen». Finaliza retornando el nivel de riesgo evaluado y registrando el evento.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-2.5 invoca este caso de uso al detectar un patrón de tecleo inusual, cambio de ventana o bloqueo de cámara. | 2. El sistema recopila los últimos artefactos de telemetría de los 5 minutos previos al evento detectado. |
| | 3. El sistema aplica el modelo de detección de anomalías: compara los patrones del candidato contra los perfiles de referencia del período. |
| | 4. El sistema calcula el nivel de riesgo: `BAJO` (registro sin acción), `MEDIO` (alerta sin suspensión) o `ALTO` (suspensión inmediata). |
| | 5. El sistema registra el evento de anomalía con todos los metadatos (tipo de anomalía, nivel de riesgo, artefactos asociados) en la bitácora de auditoría. |
| | 6. Si el nivel es `ALTO`, el sistema invoca UC-2.6 «Suspender examen». Si es `MEDIO`, genera alerta para revisión posterior por los Entes regulatorios. |
| 7. Los Entes regulatorios reciben la alerta de nivel `MEDIO` o `ALTO` para su seguimiento. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 3 — modelo de detección no disponible | El sistema registra el evento como `NO_ANALIZADO` y eleva automáticamente el nivel de riesgo a `MEDIO` por precaución. |
| Múltiples anomalías de nivel `MEDIO` en la misma sesión (más de 3) | El sistema eleva automáticamente el nivel combinado a `ALTO` e invoca UC-2.6 «Suspender examen» sin esperar una nueva anomalía individual de ese nivel. |


# CDU 03 — Emitir Credencial Digital
## Plataforma Regional de Certificación de Competencias Digitales (PRCCD)


![Diagrama de casos de uso expandidos EmitirCredenciales](imagenes/cdu03.png)


---

## UC-3.1 — Calcular resultado

| | |
|---|---|
| **Nombre** | Calcular resultado |
| **Actores** | Estudiantes / Profesores |
| **Propósito** | Determinar el puntaje final del candidato al concluir el examen adaptativo y decidir si aplica la emisión de la credencial digital. |

**Resumen:** El caso de uso inicia automáticamente al finalizar la sesión de examen. El sistema consolida el puntaje acumulado, verifica si supera el umbral de aprobación y determina el flujo siguiente: emisión de credencial si aprueba, o notificación de reprobación si no. Finaliza retornando el resultado al proceso de emisión o al candidato según corresponda.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El candidato responde la última pregunta y envía su examen. | 2. El sistema invoca UC-3.2 «Consolidar puntaje» para sumar los puntos obtenidos en cada respuesta según su nivel de dificultad. |
| | 3. El sistema invoca UC-3.3 «Verificar aprobación» para comparar el puntaje consolidado contra el umbral mínimo del período de certificación. |
| | 4. Si el candidato aprueba, el sistema registra el resultado como `APROBADO` y continúa el flujo hacia UC-3.4 «Firmar criptográficamente». |
| | 5. El sistema registra el resultado final en la bitácora con timestamp, ID de sesión y puntaje obtenido. |
| 6. El candidato recibe notificación inmediata del resultado en su panel. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 3 — puntaje no supera el umbral | El sistema registra el resultado como `REPROBADO`, invoca UC-3.8 «Notificar reprobación» e informa al candidato con su puntaje y la posibilidad de reintentar en el siguiente período. |
| En el paso 2 — error al consolidar puntaje | El sistema suspende el cálculo, preserva la sesión en estado `PENDIENTE_CALCULO` y notifica al Admin. TI para resolución manual. |

---

## UC-3.2 — Consolidar puntaje

| | |
|---|---|
| **Nombre** | Consolidar puntaje |
| **Actores** | Sistema *(invocado por UC-3.1)* |
| **Propósito** | Sumar y ponderar los puntos obtenidos por el candidato en cada pregunta respondida durante el examen adaptativo, considerando el nivel de dificultad de cada una. |

**Resumen:** El caso de uso es invocado al finalizar la sesión de examen. El sistema recupera el registro completo de respuestas de la sesión, aplica la ponderación por nivel de dificultad y calcula el puntaje total. Finaliza retornando el puntaje consolidado al proceso UC-3.1.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-3.1 invoca este caso de uso con el ID de sesión de examen. | 2. El sistema recupera el historial completo de respuestas de la sesión: pregunta, respuesta dada, respuesta correcta, nivel de dificultad. |
| | 3. El sistema aplica la fórmula de ponderación: preguntas de nivel básico tienen peso 1, intermedio peso 1.5 y avanzado peso 2. |
| | 4. El sistema descuenta puntos por preguntas marcadas como `NO_RESPONDIDA` según la política del período. |
| | 5. El sistema calcula el puntaje total ponderado sobre 100 y lo retorna al proceso UC-3.1. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — historial de respuestas incompleto | El sistema identifica las respuestas faltantes, las marca como `NO_RESPONDIDA` y continúa el cálculo con los datos disponibles. |
| En el paso 3 — política de ponderación no configurada para el período | El sistema aplica la ponderación por defecto (peso 1 para todos los niveles) y registra una alerta para revisión por el Admin. TI. |

---

## UC-3.3 — Verificar aprobación

| | |
|---|---|
| **Nombre** | Verificar aprobación |
| **Actores** | Sistema *(invocado por UC-3.1)* |
| **Propósito** | Comparar el puntaje consolidado del candidato contra el umbral mínimo de aprobación establecido para el período de certificación activo. |

**Resumen:** El caso de uso es invocado tras la consolidación del puntaje. El sistema recupera el umbral mínimo configurado para el área de certificación del candidato y determina si el puntaje obtenido lo supera. Finaliza retornando `APROBADO` o `REPROBADO` al proceso UC-3.1.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-3.1 invoca este caso de uso con el puntaje consolidado y el área de certificación del candidato. | 2. El sistema consulta la configuración del período activo para obtener el umbral mínimo de aprobación por área de certificación. |
| | 3. El sistema compara el puntaje del candidato contra el umbral: si el puntaje es mayor o igual al umbral, retorna `APROBADO`. |
| | 4. El sistema registra la verificación en el log de resultados con el puntaje, el umbral y el veredicto. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — umbral no configurado para el área | El sistema aplica el umbral general por defecto (70 puntos sobre 100) y registra una alerta para revisión por la Alta dirección. |
| En el paso 3 — puntaje exactamente igual al umbral | El sistema retorna `APROBADO` (el umbral es inclusivo) y lo registra como caso límite en el log para posibles revisiones estadísticas. |

---

## UC-3.4 — Firmar criptográficamente

| | |
|---|---|
| **Nombre** | Firmar criptográficamente |
| **Actores** | Sistema *(invocado por UC-3.1 si aprueba)*, Entes Regulatorios |
| **Propósito** | Aplicar una firma electrónica avanzada al certificado digital del candidato aprobado para garantizar su autenticidad, integridad y validez jurídica transfronteriza. |

**Resumen:** El caso de uso inicia tras la aprobación del candidato. El sistema genera el par de llaves PKI para la sesión, produce el documento formal del certificado y aplica la firma criptográfica. Finaliza invocando UC-3.7 «Registrar en blockchain» para asegurar la inmutabilidad del certificado firmado.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-3.1 invoca este caso de uso con los datos del candidato aprobado (ID, puntaje, área de certificación, fecha). | 2. El sistema invoca UC-3.5 «Generar par de llaves PKI» para obtener las llaves criptográficas de la sesión de emisión. |
| | 3. El sistema invoca UC-3.6 «Generar documento certificado» para producir el documento formal con los datos del candidato y el período. |
| | 4. El sistema calcula el hash SHA-256 del documento generado. |
| | 5. El sistema aplica la firma electrónica avanzada usando la llave privada de la Autoridad Certificadora del SICA. |
| | 6. El sistema adjunta la firma y el certificado de llave pública al documento, generando el certificado firmado final. |
| | 7. El sistema invoca UC-3.7 «Registrar en blockchain» para publicar el hash del certificado en la red distribuida. |
| 8. El candidato recibe notificación de que su certificado ha sido emitido y está disponible para descarga. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — fallo al generar el par de llaves PKI | El sistema registra el error, suspende la emisión y notifica al Admin. TI. El certificado queda en estado `PENDIENTE_FIRMA`. |
| En el paso 5 — llave privada de la Autoridad Certificadora no disponible | El sistema no puede emitir el certificado. Registra el fallo crítico, notifica a la Alta dirección y al Admin. TI para restaurar el servicio PKI. |
| Los Entes Regulatorios solicitan verificación de validez legal | El sistema invoca UC-3.9 «Verificar validez legal» para confirmar el cumplimiento normativo del certificado antes de entregarlo al candidato. |

---

## UC-3.5 — Generar par de llaves PKI

| | |
|---|---|
| **Nombre** | Generar par de llaves PKI |
| **Actores** | Sistema *(invocado por UC-3.4)* |
| **Propósito** | Generar el par de llaves criptográficas (pública y privada) necesario para el proceso de firma del certificado digital, asociado a la sesión de emisión. |

**Resumen:** El caso de uso es invocado durante el proceso de firma. El sistema genera un par de llaves asimétricas RSA-2048 o superior, asocia la llave pública al certificado y custodia la llave privada de forma segura. Finaliza retornando las llaves listas para el proceso de firma.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-3.4 invoca este caso de uso con el ID de la sesión de emisión y el área de certificación. | 2. El sistema genera un par de llaves asimétricas RSA-2048 asociado al ID de emisión. |
| | 3. El sistema registra la llave pública en el repositorio de certificados con metadatos de validez (fecha de emisión, fecha de expiración, área). |
| | 4. El sistema almacena la llave privada en el módulo HSM (Hardware Security Module) cifrada bajo la llave maestra de la Autoridad Certificadora. |
| | 5. El sistema retorna el par de llaves al proceso UC-3.4. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — módulo HSM no disponible | El sistema almacena la llave privada cifrada en el repositorio seguro de respaldo y registra una alerta crítica para revisión inmediata por el Admin. TI. |
| En el paso 2 — entropía insuficiente para generación segura | El sistema espera hasta obtener entropía suficiente del sistema operativo antes de proceder. Si el tiempo de espera supera 30 segundos, registra el evento y notifica al Admin. TI. |

---

## UC-3.6 — Generar documento certificado

| | |
|---|---|
| **Nombre** | Generar documento certificado |
| **Actores** | Sistema *(invocado por UC-3.4)* |
| **Propósito** | Producir el documento formal del certificado digital con todos los datos del candidato, los resultados del examen y los metadatos de validez requeridos para su firma y registro. |

**Resumen:** El caso de uso es invocado durante el proceso de firma. El sistema compila los datos del candidato, el resultado del examen y los metadatos institucionales, aplica la plantilla oficial del SICA y genera el documento en formato estándar (PDF/A y JSON-LD para interoperabilidad). Finaliza retornando el documento generado al proceso UC-3.4.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-3.4 invoca este caso de uso con los datos del candidato aprobado y los metadatos del período de certificación. | 2. El sistema compila los campos requeridos: nombre completo, institución de origen, área de competencia certificada, puntaje obtenido, fecha de emisión, ID único de certificado. |
| | 3. El sistema aplica la plantilla oficial del SICA al documento con los elementos visuales y textuales requeridos por los Entes Regulatorios. |
| | 4. El sistema genera el documento en formato PDF/A-3 (para archivo de largo plazo) y JSON-LD (para interoperabilidad con sistemas externos). |
| | 5. El sistema calcula el hash del documento generado y lo adjunta como metadato de integridad. |
| | 6. El sistema retorna el documento generado al proceso UC-3.4 para su firma. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 3 — plantilla oficial no disponible | El sistema utiliza la plantilla de respaldo almacenada localmente, registra la incidencia y notifica al Admin. TI para restaurar la plantilla principal. |
| En el paso 2 — datos del candidato incompletos | El sistema identifica los campos faltantes, suspende la generación y retorna error a UC-3.4 con el detalle de los campos requeridos. |

---

## UC-3.7 — Registrar en blockchain

| | |
|---|---|
| **Nombre** | Registrar en blockchain |
| **Actores** | Sistema *(invocado por UC-3.4)*, Entes Regulatorios |
| **Propósito** | Publicar el hash del certificado digital firmado en la red de registros distribuidos para garantizar su inmutabilidad y permitir verificación transfronteriza independiente. |

**Resumen:** El caso de uso inicia tras la firma del certificado. El sistema calcula el hash inmutable del certificado firmado, lo publica en la red blockchain (Hyperledger o PKI distribuida) y obtiene la referencia de la transacción. Los Entes Regulatorios pueden consultar este registro para validación. Finaliza cuando el hash queda registrado de forma permanente e irrevocable.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-3.4 invoca este caso de uso con el certificado firmado y sus metadatos. | 2. El sistema calcula el hash SHA-256 del certificado firmado (documento + firma + metadatos). |
| | 3. El sistema construye la transacción blockchain con el hash, el ID de certificado, la institución emisora y el timestamp. |
| | 4. El sistema publica la transacción en la red distribuida (Hyperledger Fabric o red PKI equivalente). |
| | 5. La red retorna el ID de transacción (TxID) y el bloque donde fue incluida la transacción. |
| | 6. El sistema persiste el TxID junto al certificado del candidato para uso en verificaciones futuras. |
| | 7. El sistema invoca UC-3.10 «Notificar emisión» para informar al candidato que su certificado está disponible. |
| 8. Los Entes Regulatorios pueden consultar el registro usando el TxID para verificar la autenticidad del certificado. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — red blockchain no disponible | El sistema encola la transacción en el buffer de publicación pendiente, entrega el certificado al candidato con estado `PENDIENTE_BLOCKCHAIN` y reintenta la publicación cada 5 minutos. |
| Los Entes Regulatorios detectan fraude posterior a la emisión | El sistema invoca UC-3.11 «Revocar credencial» para registrar la revocación en la misma red blockchain con referencia al TxID original. |

---

## UC-3.8 — Notificar reprobación

| | |
|---|---|
| **Nombre** | Notificar reprobación |
| **Actores** | Estudiantes / Profesores *(receptor)*, Sistema *(automático — `«extend»` desde UC-3.1)* |
| **Propósito** | Informar al candidato que no superó el umbral de aprobación del examen, proporcionando su puntaje, la diferencia con el umbral y las opciones disponibles para el siguiente período. |

**Resumen:** El caso de uso se activa cuando UC-3.1 determina que el candidato reprobó. El sistema genera una notificación detallada con el resultado, envía el comunicado al candidato y registra el evento. Finaliza cuando el candidato ha sido notificado y el resultado queda registrado en su historial.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-3.1 invoca este caso de uso con los datos del candidato y el resultado `REPROBADO`. | 2. El sistema genera el mensaje de notificación incluyendo: puntaje obtenido, puntaje mínimo requerido, diferencia, área de competencia evaluada y fecha del próximo período disponible. |
| | 3. El sistema actualiza el historial del candidato registrando el intento fallido con fecha, puntaje y período. |
| | 4. El sistema envía la notificación al correo institucional del candidato y la muestra en su panel de usuario. |
| | 5. El sistema registra el evento de notificación en la bitácora. |
| 6. El candidato visualiza el resultado en su panel y puede revisar el detalle de su desempeño. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — fallo al enviar correo | El sistema registra el fallo de envío y programa un reintento en 30 minutos. La notificación en el panel del candidato se muestra de todas formas. |
| El candidato ha agotado todos los intentos del período | El sistema incluye en la notificación que deberá esperar al siguiente período de certificación para reintentar, sin posibilidad de intento adicional en el actual. |

---

## UC-3.9 — Verificar validez legal

| | |
|---|---|
| **Nombre** | Verificar validez legal |
| **Actores** | Entes Regulatorios, Sistema *(`«extend»` desde UC-3.4)* |
| **Propósito** | Confirmar que el certificado digital cumple con los marcos normativos de los países donde será reconocido, incluyendo requisitos de firma electrónica avanzada y leyes de protección de datos aplicables. |

**Resumen:** El caso de uso se activa cuando los Entes Regulatorios solicitan una validación formal del certificado o cuando el sistema detecta que el candidato es de un país con requisitos normativos especiales. El sistema verifica el cumplimiento contra el marco regulatorio correspondiente. Finaliza retornando el estado de validez legal al proceso invocante.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. Los Entes Regulatorios solicitan verificación del certificado o el sistema la activa automáticamente por el país del candidato. | 2. El sistema identifica el marco normativo aplicable según el país de origen del candidato (GDPR, Ley de Firma Electrónica local, normativas SICA). |
| | 3. El sistema verifica que la firma electrónica aplicada cumpla con los estándares requeridos (eIDAS, X.509 v3 o equivalente). |
| | 4. El sistema confirma que los datos del candidato en el certificado hayan sido tratados conforme a las leyes de protección de datos del país. |
| | 5. El sistema retorna el estado de validez legal: `VÁLIDO`, `VÁLIDO_CON_RESTRICCIONES` o `NO_VÁLIDO` con el detalle del incumplimiento. |
| 6. Los Entes Regulatorios reciben el resultado de la verificación y pueden emitir una anotación formal si es necesario. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — marco normativo del país no catalogado | El sistema aplica el marco general del SICA como referencia y marca el resultado como `VÁLIDO_CON_RESTRICCIONES` pendiente de revisión por los Entes Regulatorios. |
| En el paso 5 — resultado `NO_VÁLIDO` | El sistema suspende la entrega del certificado al candidato, notifica a la Alta dirección y a los Entes Regulatorios con el detalle del incumplimiento para resolución. |

---

## UC-3.10 — Notificar emisión

| | |
|---|---|
| **Nombre** | Notificar emisión |
| **Actores** | Estudiantes / Profesores *(receptor)*, Sistema *(automático — `«extend»` desde UC-3.7)* |
| **Propósito** | Informar al candidato aprobado que su certificado digital ha sido emitido, firmado y registrado exitosamente, y que está disponible para descarga y uso. |

**Resumen:** El caso de uso se activa tras el registro exitoso en blockchain. El sistema genera y envía una notificación completa al candidato con el enlace de descarga de su certificado, el código QR de verificación y el TxID de blockchain. Finaliza cuando el candidato ha sido notificado y puede acceder a su certificado.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-3.7 invoca este caso de uso tras confirmar el registro exitoso en blockchain. | 2. El sistema genera el código QR que enlaza al portal de verificación pública con el TxID del certificado. |
| | 3. El sistema construye el mensaje de notificación incluyendo: nombre del candidato, área certificada, puntaje, enlace de descarga PDF, código QR y TxID de blockchain. |
| | 4. El sistema envía la notificación al correo institucional del candidato. |
| | 5. El sistema actualiza el panel del candidato mostrando el certificado disponible con opciones de descarga y compartir. |
| | 6. El sistema registra el evento de notificación en la bitácora con timestamp y confirmación de entrega. |
| 7. El candidato recibe el correo, descarga su certificado y puede compartir el código QR para verificaciones externas. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — fallo al enviar correo | El sistema registra el fallo y programa reintento en 30 minutos. El certificado queda disponible en el panel del candidato de todas formas. |
| En el paso 2 — fallo al generar código QR | El sistema entrega el certificado sin código QR, incluye el TxID en texto plano para verificación manual y registra la incidencia para revisión técnica. |

---

## UC-3.11 — Revocar credencial

| | |
|---|---|
| **Nombre** | Revocar credencial |
| **Actores** | Entes Regulatorios, Sistema *(automático — `«extend»` desde UC-3.7)* |
| **Propósito** | Invalidar un certificado digital previamente emitido cuando se confirma fraude, error en la evaluación o incumplimiento normativo, registrando la revocación de forma inmutable en blockchain. |

**Resumen:** El caso de uso se activa cuando los Entes Regulatorios confirman que un certificado emitido debe ser revocado. El sistema registra la revocación en la misma red blockchain referenciando el TxID original, notifica al candidato y a las instituciones correspondientes, y actualiza el estado del certificado. Finaliza cuando la revocación queda registrada de forma permanente e irrevocable.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. Los Entes Regulatorios confirman la necesidad de revocar el certificado y solicitan la revocación con el motivo documentado. | 2. El sistema verifica la identidad y autorización del Ente Regulatorio solicitante. |
| | 3. El sistema construye la transacción de revocación en blockchain referenciando el TxID original del certificado emitido. |
| | 4. El sistema publica la transacción de revocación en la red distribuida, generando un nuevo TxID de revocación. |
| | 5. El sistema actualiza el estado del certificado en la base de datos local a `REVOCADO` con fecha, motivo y TxID de revocación. |
| | 6. El sistema notifica al candidato por correo explicando la revocación, el motivo y el proceso de apelación disponible. |
| | 7. El sistema notifica a las universidades e instituciones que hayan consultado el certificado previamente. |
| | 8. El sistema registra el evento completo de revocación en la bitácora de auditoría inmutable. |
| 9. Los Entes Regulatorios reciben confirmación de la revocación con el TxID de revocación como evidencia. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — red blockchain no disponible | El sistema registra la revocación localmente como `REVOCADO_PENDIENTE_BLOCKCHAIN`, bloquea el certificado para verificaciones externas y reintenta la publicación en blockchain cada 5 minutos. |
| El candidato apela la revocación | El sistema registra la apelación, suspende los efectos de la revocación temporalmente y notifica a los Entes Regulatorios para revisión del caso dentro de un plazo de 15 días hábiles. |

# CDU 04 — Integrar Sistemas Universitarios
## Plataforma Regional de Certificación de Competencias Digitales (PRCCD)

![Diagrama de casos de uso expandidos integrar](imagenes/cdu04.png)


---

## UC-4.1 — Federar autenticación

| | |
|---|---|
| **Nombre** | Federar autenticación |
| **Actores** | Admin. TI, Instituciones (USAC / UCR / UES) |
| **Propósito** | Establecer un mecanismo unificado de autenticación que permita a la PRCCD interoperar con los distintos proveedores de identidad de las universidades pilares sin modificar sus sistemas internos. |

**Resumen:** El caso de uso inicia cuando un usuario de una institución universitaria intenta acceder a la PRCCD. El sistema detecta el protocolo de autenticación de la institución, emite un token unificado interno y establece la sesión federada. Finaliza cuando el usuario queda autenticado en la plataforma con sus atributos institucionales mapeados.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El usuario de una institución universitaria solicita acceso a la PRCCD con sus credenciales institucionales. | 2. El sistema invoca UC-4.2 «Detectar protocolo institución» para identificar el mecanismo de autenticación aplicable (LDAP, SAML u OAuth2). |
| | 3. El sistema redirige la solicitud de autenticación al proveedor de identidad de la institución usando el protocolo detectado. |
| 4. El proveedor de identidad institucional valida las credenciales y retorna la respuesta de autenticación. | 5. El sistema recibe la respuesta y extrae los atributos del usuario (rol, carrera, estado académico). |
| | 6. El sistema invoca UC-4.3 «Emitir token» para generar el token JWT unificado con los atributos mapeados al esquema interno de la PRCCD. |
| | 7. El sistema establece la sesión federada y registra el evento de autenticación en la bitácora. |
| 8. El Admin. TI puede monitorear las sesiones federadas activas desde el panel de administración. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — protocolo no identificado automáticamente | El sistema invoca UC-4.9 «Mapear protocolo legacy» para intentar una identificación manual o por heurística del protocolo de la institución. |
| En el paso 4 — proveedor de identidad institucional no disponible | El sistema registra el fallo de conectividad, notifica al Admin. TI y muestra al usuario un mensaje de indisponibilidad temporal con tiempo estimado de resolución. |
| En el paso 5 — atributos del usuario incompletos | El sistema asigna valores por defecto para los atributos faltantes, marca el perfil como `INCOMPLETO` y solicita al usuario completar su información en el primer acceso. |

---

## UC-4.2 — Detectar protocolo institución

| | |
|---|---|
| **Nombre** | Detectar protocolo institución |
| **Actores** | Sistema *(invocado por UC-4.1)* |
| **Propósito** | Identificar automáticamente el protocolo de autenticación que utiliza la institución universitaria de origen del usuario para enrutar correctamente la solicitud de autenticación federada. |

**Resumen:** El caso de uso es invocado durante el proceso de federación. El sistema consulta el catálogo de instituciones registradas, recupera el protocolo configurado para la institución del usuario y retorna el protocolo al proceso invocante. Finaliza retornando el protocolo identificado (LDAP, SAML u OAuth2) o una señal de protocolo desconocido.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-4.1 invoca este caso de uso con el dominio del correo institucional del usuario. | 2. El sistema extrae el dominio del correo y lo busca en el catálogo de instituciones registradas en la PRCCD. |
| | 3. El sistema recupera la configuración de la institución: protocolo de autenticación, URL del proveedor de identidad y parámetros de conexión. |
| | 4. El sistema verifica que el endpoint del proveedor de identidad esté disponible mediante un health check. |
| | 5. El sistema retorna el protocolo identificado y la configuración de conexión al proceso UC-4.1. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — dominio no encontrado en el catálogo | El sistema retorna `PROTOCOLO_DESCONOCIDO` al proceso UC-4.1 para que active UC-4.9 «Mapear protocolo legacy». |
| En el paso 4 — endpoint del proveedor no disponible | El sistema retorna el protocolo con estado `ENDPOINT_NO_DISPONIBLE` y registra la incidencia para notificación al Admin. TI. |

---

## UC-4.3 — Emitir token

| | |
|---|---|
| **Nombre** | Emitir token |
| **Actores** | Sistema *(invocado por UC-4.1)* |
| **Propósito** | Generar un token JWT unificado que represente la identidad del usuario dentro de la PRCCD, independientemente del protocolo de autenticación de origen de su institución. |

**Resumen:** El caso de uso es invocado tras la autenticación exitosa con el proveedor institucional. El sistema mapea los atributos del usuario al esquema interno de la PRCCD, genera un token JWT firmado con tiempo de expiración y lo retorna para establecer la sesión. Finaliza cuando el token queda generado y disponible para la sesión activa.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-4.1 invoca este caso de uso con los atributos del usuario validados por el proveedor institucional. | 2. El sistema mapea los atributos institucionales al esquema de usuario interno de la PRCCD (ID interno, rol, institución, área de competencia). |
| | 3. El sistema construye el payload del token JWT incluyendo: ID usuario, institución, rol, permisos, timestamp de emisión y tiempo de expiración (8 horas). |
| | 4. El sistema firma el token JWT con la llave privada del servidor de autenticación de la PRCCD. |
| | 5. El sistema registra el token emitido en el registro de sesiones activas con su tiempo de expiración. |
| | 6. El sistema retorna el token JWT al proceso UC-4.1. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — atributo de rol no mapeado | El sistema asigna el rol `USUARIO_BASICO` por defecto, registra la advertencia y notifica al Admin. TI para revisar el mapeo de la institución. |
| En el paso 4 — llave de firma no disponible | El sistema detiene la emisión del token, registra el error crítico y notifica al Admin. TI para restaurar el servicio de autenticación. |

---

## UC-4.4 — Transformar formatos

| | |
|---|---|
| **Nombre** | Transformar formatos |
| **Actores** | Admin. TI, Instituciones |
| **Propósito** | Convertir los datos académicos recibidos de las instituciones universitarias en distintos formatos (JSON, XML, CSV) al esquema canónico interno de la PRCCD para su procesamiento uniforme. |

**Resumen:** El caso de uso inicia cuando la PRCCD recibe datos académicos de una institución en cualquier formato soportado. El sistema normaliza el esquema, valida la integridad de los datos transformados e invoca la sincronización de registros. Finaliza cuando los datos quedan disponibles en el formato canónico interno listo para sincronización.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. La institución universitaria envía datos académicos a la PRCCD (matrícula, historial, estado del candidato) en su formato nativo (JSON, XML o CSV). | 2. El sistema identifica el formato del payload recibido mediante inspección del content-type y estructura del contenido. |
| | 3. El sistema aplica el transformador correspondiente al formato detectado para convertir los datos al esquema canónico interno. |
| | 4. El sistema invoca UC-4.5 «Normalizar esquemas datos» para estandarizar los nombres de campos y tipos de datos. |
| | 5. El sistema invoca UC-4.6 «Validar datos» para verificar la integridad y completitud de los datos transformados. |
| | 6. El sistema retorna los datos en formato canónico al proceso de sincronización UC-4.7. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — formato no reconocido | El sistema registra el error de formato, rechaza el payload y notifica a la institución con el detalle del formato esperado y la documentación de la API. |
| En el paso 3 — datos CSV con estructura irregular | El sistema activa UC-4.8 «Importar CSV» para aplicar un parser más flexible que maneje variaciones en delimitadores, encabezados o codificación de caracteres. |
| En el paso 5 — datos no superan validación | El sistema rechaza el lote completo, genera un reporte de errores detallado por campo y lo retorna a la institución para corrección. |

---

## UC-4.5 — Normalizar esquemas datos

| | |
|---|---|
| **Nombre** | Normalizar esquemas datos |
| **Actores** | Sistema *(invocado por UC-4.4)* |
| **Propósito** | Estandarizar los nombres de campos, tipos de datos y estructuras de los datos académicos transformados para garantizar la coherencia con el esquema canónico interno de la PRCCD. |

**Resumen:** El caso de uso es invocado durante la transformación de formatos. El sistema aplica las reglas de mapeo de campos definidas para cada institución, convierte los tipos de datos al estándar interno y resuelve inconsistencias de nomenclatura. Finaliza retornando los datos normalizados al proceso UC-4.4.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-4.4 invoca este caso de uso con los datos parcialmente transformados y el identificador de la institución origen. | 2. El sistema carga el mapa de campos configurado para la institución (ej: `student_id` → `carnet`, `grade` → `puntaje`). |
| | 3. El sistema aplica las conversiones de tipo de dato: fechas a ISO 8601, identificadores a UUID interno, estados académicos al vocabulario controlado de la PRCCD. |
| | 4. El sistema resuelve campos opcionales faltantes asignando valores nulos o por defecto según la configuración del esquema. |
| | 5. El sistema retorna los datos normalizados al proceso UC-4.4. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — mapa de campos no configurado para la institución | El sistema aplica el mapa de campos genérico, marca los datos como `NORMALIZACION_PARCIAL` y genera una alerta para que el Admin. TI configure el mapa específico de la institución. |
| En el paso 3 — valor de campo no convertible al tipo esperado | El sistema registra el campo problemático, lo marca como `ERROR_CONVERSION` y continúa la normalización del resto de campos para no bloquear el lote completo. |

---

## UC-4.6 — Validar datos

| | |
|---|---|
| **Nombre** | Validar datos |
| **Actores** | Sistema *(invocado por UC-4.4)* |
| **Propósito** | Verificar la integridad, completitud y consistencia de los datos académicos normalizados antes de permitir su sincronización con los registros internos de la PRCCD. |

**Resumen:** El caso de uso es invocado tras la normalización de datos. El sistema aplica las reglas de validación definidas para cada tipo de dato académico: campos obligatorios presentes, valores dentro de rangos permitidos y referencias cruzadas consistentes. Finaliza retornando el resultado de la validación al proceso UC-4.4.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-4.4 invoca este caso de uso con los datos normalizados y el tipo de entidad (candidato, matrícula, historial). | 2. El sistema verifica que todos los campos obligatorios del esquema canónico estén presentes y no sean nulos. |
| | 3. El sistema valida los rangos y formatos: fechas válidas, puntajes entre 0 y 100, estados académicos dentro del vocabulario controlado. |
| | 4. El sistema verifica referencias cruzadas: que el ID de institución exista en el catálogo registrado, que el carnet no esté duplicado en el sistema. |
| | 5. Si todas las validaciones pasan, el sistema retorna `VÁLIDO` al proceso UC-4.4. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — campos obligatorios faltantes | El sistema retorna `INVÁLIDO` con la lista de campos faltantes. UC-4.4 rechaza el lote y genera el reporte de errores para la institución. |
| En el paso 4 — carnet duplicado detectado | El sistema retorna `DUPLICADO` con el ID interno del registro existente. UC-4.4 decide si actualizar el registro existente o rechazar el nuevo según la política configurada. |

---

## UC-4.7 — Sincronizar registros

| | |
|---|---|
| **Nombre** | Sincronizar registros |
| **Actores** | Admin. TI, Instituciones, Alta dirección |
| **Propósito** | Actualizar los registros académicos internos de la PRCCD con los datos validados y normalizados provenientes de las instituciones universitarias, manteniendo la consistencia entre ambos sistemas. |

**Resumen:** El caso de uso inicia con los datos académicos validados listos para persistir. El sistema compara los registros entrantes contra los existentes, aplica las actualizaciones necesarias e invoca la confirmación de sincronización. La Alta dirección puede monitorear el estado de las sincronizaciones. Finaliza cuando todos los registros del lote quedan actualizados y confirmados.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-4.4 retorna los datos validados y el sistema inicia la sincronización del lote. | 2. El sistema invoca UC-4.10 «Confirmar sincronización» para establecer el punto de control (checkpoint) antes de aplicar cambios. |
| | 3. El sistema compara cada registro entrante contra el registro existente en la PRCCD usando el carnet como clave primaria. |
| | 4. Para registros nuevos: el sistema los inserta en la base de datos interna. Para registros existentes: aplica las actualizaciones en los campos modificados. |
| | 5. El sistema registra el log de sincronización: número de registros insertados, actualizados y sin cambios. |
| | 6. El sistema invoca UC-4.10 «Confirmar sincronización» para cerrar el lote y notificar a la institución del resultado. |
| 7. La Alta dirección puede consultar el reporte de sincronizaciones desde el panel de administración. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 3 — se detectan registros en conflicto (mismo carnet, datos distintos) | El sistema invoca UC-4.11 «Notificar conflicto» para escalar la discrepancia al Admin. TI y a la institución para resolución manual. |
| En el paso 4 — fallo durante la escritura en base de datos | El sistema revierte el lote completo usando el checkpoint del paso 2, registra el error y activa UC-4.12 «Reintentar sincronización» con espera de 5 minutos. |
| La sincronización excede el tiempo límite de 30 minutos | El sistema suspende el lote, guarda el progreso parcial y notifica al Admin. TI para revisión. |

---

## UC-4.8 — Importar CSV

| | |
|---|---|
| **Nombre** | Importar CSV |
| **Actores** | Admin. TI, Instituciones *(— `«extend»` desde UC-4.4)* |
| **Propósito** | Procesar archivos planos CSV generados manualmente por instituciones con sistemas legacy que no disponen de API REST o SOAP para la integración automatizada. |

**Resumen:** El caso de uso se activa cuando la institución entrega datos en formato CSV. El sistema aplica un parser flexible que maneja variaciones de estructura, convierte los datos al formato JSON canónico y los pasa al proceso de transformación estándar. Finaliza cuando el contenido del CSV queda disponible como datos estructurados para UC-4.4.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. La institución sube un archivo CSV al portal de integración o lo envía por el canal seguro habilitado por el Admin. TI. | 2. El sistema detecta el encoding del archivo (UTF-8, Latin-1) y el delimitador utilizado (coma, punto y coma, tabulación). |
| | 3. El sistema lee la primera fila para identificar los encabezados de columna y los mapea a los campos del esquema canónico de la PRCCD. |
| | 4. El sistema parsea cada fila del CSV, convierte los valores a los tipos de dato correspondientes y construye los objetos JSON internos. |
| | 5. El sistema retorna el array de objetos JSON al proceso UC-4.4 para continuar con la normalización y validación. |
| 6. El Admin. TI recibe el reporte de importación con el número de filas procesadas, convertidas y con errores. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 3 — encabezados no reconocibles | El sistema solicita al Admin. TI el mapeo manual de columnas antes de continuar la importación. |
| En el paso 4 — fila con número incorrecto de columnas | El sistema omite la fila, la registra en el reporte de errores con el número de línea y continúa procesando el resto del archivo. |
| Archivo CSV supera el límite de tamaño (50 MB) | El sistema rechaza el archivo e indica a la institución que debe dividirlo en lotes más pequeños o usar la API de integración. |

---

## UC-4.9 — Mapear protocolo legacy

| | |
|---|---|
| **Nombre** | Mapear protocolo legacy |
| **Actores** | Admin. TI *(— `«extend»` desde UC-4.1)* |
| **Propósito** | Configurar manualmente el protocolo de autenticación para instituciones cuyo sistema no es identificado automáticamente por la PRCCD, permitiendo la federación con sistemas heredados no estándar. |

**Resumen:** El caso de uso se activa cuando el sistema no puede identificar automáticamente el protocolo de autenticación de una institución. El Admin. TI interviene para configurar el mapeo manualmente usando el panel de administración. Finaliza cuando el protocolo queda configurado y la institución puede autenticarse en la PRCCD.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El sistema notifica al Admin. TI que la institución con dominio X no tiene protocolo de autenticación configurado. | 2. El sistema muestra al Admin. TI el formulario de configuración de protocolo con las opciones disponibles: LDAP, SAML, OAuth2, API Key o CSV manual. |
| 3. El Admin. TI ingresa los parámetros del protocolo: URL del endpoint, credenciales de conexión, parámetros de mapeo de atributos. | 4. El sistema valida la conectividad con el endpoint configurado mediante un test de conexión. |
| | 5. El sistema guarda la configuración del protocolo en el catálogo de instituciones. |
| | 6. El sistema notifica al proceso UC-4.1 que la institución ya tiene protocolo configurado y puede proceder con la autenticación. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — test de conexión falla | El sistema muestra el error de conectividad al Admin. TI con sugerencias de diagnóstico (firewall, certificado SSL, puerto bloqueado). La configuración no se guarda hasta que el test sea exitoso. |
| La institución usa un protocolo propietario no soportado | El sistema registra la limitación, el Admin. TI configura la integración en modo CSV manual y notifica a la institución las instrucciones para exportar sus datos en formato compatible. |

---

## UC-4.10 — Confirmar sincronización

| | |
|---|---|
| **Nombre** | Confirmar sincronización |
| **Actores** | Sistema *(invocado por UC-4.7)*, Instituciones |
| **Propósito** | Cerrar formalmente el proceso de sincronización de un lote de datos, notificar a la institución el resultado y garantizar la consistencia del estado entre ambos sistemas. |

**Resumen:** El caso de uso es invocado al finalizar el procesamiento de un lote de sincronización. El sistema genera el reporte de resultados del lote, lo envía a la institución y actualiza el registro de última sincronización. Finaliza cuando la institución recibe la confirmación y el estado queda registrado.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-4.7 invoca este caso de uso al completar el procesamiento del lote de sincronización. | 2. El sistema genera el reporte de sincronización: total de registros recibidos, insertados, actualizados, sin cambios y con error. |
| | 3. El sistema actualiza el registro de metadatos de la institución: fecha y hora de última sincronización exitosa, número de lote procesado. |
| | 4. El sistema envía el reporte de confirmación a la institución por el canal configurado (correo o callback API). |
| | 5. El sistema registra el cierre del lote en la bitácora de integraciones con estado `COMPLETADO`. |
| 6. La institución recibe la confirmación y puede verificar en su sistema que los datos fueron procesados correctamente. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — fallo al enviar confirmación a la institución | El sistema registra el fallo de notificación y programa un reintento. El lote se marca como `COMPLETADO_SIN_NOTIFICAR` hasta que la confirmación sea entregada. |

---

## UC-4.11 — Notificar conflicto

| | |
|---|---|
| **Nombre** | Notificar conflicto |
| **Actores** | Admin. TI, Instituciones *(— `«extend»` desde UC-4.7)* |
| **Propósito** | Escalar al Admin. TI y a la institución universitaria las discrepancias detectadas durante la sincronización de registros para su resolución manual antes de persistir los datos. |

**Resumen:** El caso de uso se activa cuando UC-4.7 detecta registros en conflicto durante la sincronización. El sistema suspende la aplicación de los registros conflictivos, genera un reporte detallado de las discrepancias y lo envía a las partes involucradas para resolución. Finaliza cuando el conflicto queda documentado y en espera de resolución.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-4.7 invoca este caso de uso con los registros en conflicto identificados. | 2. El sistema genera el reporte de conflicto detallando para cada registro: carnet, campo en conflicto, valor en PRCCD, valor recibido de la institución y timestamp de ambas versiones. |
| | 3. El sistema suspende los registros conflictivos del lote y los coloca en estado `PENDIENTE_RESOLUCION`. |
| | 4. El sistema envía el reporte al Admin. TI y a la institución universitaria para resolución conjunta. |
| | 5. El sistema registra el conflicto en la bitácora con referencia al lote de sincronización. |
| 6. El Admin. TI y la institución revisan el conflicto y determinan cuál versión de los datos es correcta. | 7. El sistema aplica la resolución indicada: actualiza el registro con la versión correcta o mantiene el existente según la decisión. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 6 — no se recibe resolución en 48 horas | El sistema mantiene el registro en estado `PENDIENTE_RESOLUCION`, envía un recordatorio a las partes y escala a la Alta dirección si el conflicto no se resuelve en 72 horas. |
| El Admin. TI decide resolver automáticamente usando la versión más reciente | El sistema aplica la política de resolución automática: prevalece el dato con timestamp más reciente y registra la resolución en la bitácora. |

---

## UC-4.12 — Reintentar sincronización

| | |
|---|---|
| **Nombre** | Reintentar sincronización |
| **Actores** | Sistema *(automático — `«extend»` desde UC-4.7)*, Admin. TI |
| **Propósito** | Volver a intentar la sincronización de un lote que falló por problemas técnicos transitorios (timeout, error de base de datos, caída de servicio) sin requerir intervención manual en los primeros reintentos. |

**Resumen:** El caso de uso se activa automáticamente cuando UC-4.7 falla en la escritura de registros. El sistema restaura el estado desde el último checkpoint, espera el tiempo configurado y reintenta la sincronización. Si los reintentos automáticos se agotan, escala al Admin. TI. Finaliza cuando la sincronización se completa exitosamente o queda en espera de intervención manual.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-4.7 invoca este caso de uso al detectar un fallo en la sincronización. | 2. El sistema registra el fallo con el código de error, timestamp y número de intento actual. |
| | 3. El sistema restaura el estado del lote desde el último checkpoint guardado por UC-4.7. |
| | 4. El sistema espera el tiempo de backoff configurado (5 min en intento 1, 15 min en intento 2, 30 min en intento 3). |
| | 5. El sistema reintenta la sincronización del lote desde el checkpoint restaurado. |
| | 6. Si el reintento es exitoso, el sistema continúa el proceso normal de UC-4.7 e invoca UC-4.10 «Confirmar sincronización». |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 5 — tercer reintento también falla | El sistema marca el lote como `FALLO_PERMANENTE`, notifica al Admin. TI con el historial de errores y el lote queda en cola para intervención manual. |
| El Admin. TI solicita reintento manual después de resolver el problema subyacente | El sistema restablece el contador de reintentos a cero y ejecuta el paso 5 de inmediato sin esperar el tiempo de backoff. |


# CDU 05 — Consultar Analítica Regional
## Plataforma Regional de Certificación de Competencias Digitales (PRCCD)

![Diagrama de casos de uso expandidos integrar](imagenes/cdu05.png)


---

## UC-5.1 — Anonimizar datos

| | |
|---|---|
| **Nombre** | Anonimizar datos |
| **Actores** | Alta dirección, Entes Regulatorios |
| **Propósito** | Eliminar o enmascarar los atributos identificables de los candidatos en los datos académicos antes de exponerlos a las capas de analítica y visualización, garantizando el cumplimiento normativo de privacidad. |

**Resumen:** El caso de uso inicia cuando se solicita una consulta analítica sobre los datos de la plataforma. El sistema aplica técnicas de seudonimización y anonimización sobre los registros, verifica el cumplimiento con GDPR y legislaciones locales, y retorna los datos anonimizados listos para agregación. Finaliza cuando los datos quedan disponibles sin atributos identificables para el proceso de métricas.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. La Alta dirección o los Entes Regulatorios solicitan una consulta analítica desde el panel de administración. | 2. El sistema identifica el conjunto de datos requerido para la consulta y recupera los registros del repositorio interno. |
| | 3. El sistema aplica seudonimización: reemplaza identificadores directos (nombre, carnet, correo) por tokens no reversibles. |
| | 4. El sistema aplica supresión de atributos cuasi-identificadores que en combinación podrían revelar la identidad del candidato. |
| | 5. El sistema invoca UC-5.2 «Verificar cumplimiento GDPR» para confirmar que los datos anonimizados cumplen con los marcos normativos aplicables. |
| | 6. El sistema retorna los datos anonimizados al proceso UC-5.3 «Agregar métricas» para su procesamiento. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 5 — verificación GDPR detecta incumplimiento | El sistema suspende el flujo analítico, registra el incumplimiento y notifica a los Entes Regulatorios con el detalle del problema para resolución antes de continuar. |
| Los Entes Regulatorios solicitan eliminación de un candidato específico | El sistema activa UC-5.8 «Aplicar derecho al olvido» para eliminar permanentemente los datos del candidato del repositorio analítico. |

---

## UC-5.2 — Verificar cumplimiento GDPR

| | |
|---|---|
| **Nombre** | Verificar cumplimiento GDPR |
| **Actores** | Sistema *(invocado por UC-5.1)*, Entes Regulatorios |
| **Propósito** | Confirmar que los datos anonimizados cumplen con el Reglamento General de Protección de Datos (GDPR) y las legislaciones locales de privacidad de los países miembros del SICA antes de exponerlos en la capa analítica. |

**Resumen:** El caso de uso es invocado tras la anonimización de datos. El sistema evalúa el conjunto de datos anonimizados contra las reglas de privacidad configuradas para cada país involucrado, verifica que no existan combinaciones de atributos que permitan reidentificación y retorna el resultado de la verificación. Finaliza retornando `CUMPLE` o `NO_CUMPLE` con el detalle al proceso invocante.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-5.1 invoca este caso de uso con el conjunto de datos anonimizados y los países de origen de los candidatos incluidos. | 2. El sistema carga las reglas de privacidad configuradas para cada país presente en el conjunto de datos (GDPR para países aplicables, leyes locales para los demás). |
| | 3. El sistema evalúa el riesgo de reidentificación: verifica que ninguna combinación de atributos restantes permita identificar a un candidato individual. |
| | 4. El sistema verifica que el propósito de la consulta analítica esté dentro de los usos permitidos bajo las normativas aplicables. |
| | 5. Si todas las verificaciones pasan, el sistema retorna `CUMPLE` al proceso UC-5.1. |
| 6. Los Entes Regulatorios pueden consultar el historial de verificaciones de cumplimiento desde el panel de auditoría. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 3 — riesgo de reidentificación detectado | El sistema aplica k-anonimato adicional: generaliza los atributos problemáticos hasta reducir el riesgo por debajo del umbral aceptable y reintenta la verificación. |
| En el paso 2 — reglas de privacidad no configuradas para un país | El sistema aplica el estándar GDPR como marco más restrictivo por defecto y registra una alerta para que los Entes Regulatorios configuren las reglas específicas del país. |

---

## UC-5.3 — Agregar métricas

| | |
|---|---|
| **Nombre** | Agregar métricas |
| **Actores** | Alta dirección, Ministerio |
| **Propósito** | Calcular los indicadores clave de desempeño (KPI) regionales a partir de los datos anonimizados, segmentando la información por país, carrera universitaria y género para su visualización en los dashboards gerenciales. |

**Resumen:** El caso de uso inicia con los datos anonimizados disponibles. El sistema aplica las segmentaciones requeridas, calcula los KPI definidos por la Alta dirección y los Ministerios, y prepara los resultados para visualización. Finaliza cuando todos los indicadores están calculados y listos para ser presentados en el dashboard o exportados como reporte.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-5.1 retorna los datos anonimizados y el sistema inicia el proceso de agregación. | 2. El sistema invoca UC-5.4 «Segmentar por país/carrera/género» para organizar los datos en las dimensiones de análisis requeridas. |
| | 3. El sistema calcula los KPI por cada segmento: tasa de aprobación, puntaje promedio, número de certificaciones emitidas, tasa de crecimiento mensual. |
| | 4. El sistema calcula los KPI consolidados a nivel regional para la vista ejecutiva de la Alta dirección. |
| | 5. El sistema retorna los indicadores calculados al proceso UC-5.5 «Visualizar dashboard» para su presentación. |
| 6. La Alta dirección y los Ministerios reciben los indicadores en su panel según sus permisos de visualización. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 3 — segmento sin datos suficientes para calcular estadística confiable | El sistema marca el KPI del segmento como `DATO_INSUFICIENTE` y lo muestra con una advertencia en el dashboard en lugar de un valor numérico. |
| Los Ministerios solicitan un informe descargable | El sistema activa UC-5.9 «Exportar reporte regional» para generar el documento formal con los indicadores calculados. |
| Se detecta un indicador fuera del rango esperado | El sistema activa UC-5.7 «Alertar anomalía estadística» para notificar a la Alta dirección del valor atípico detectado. |

---

## UC-5.4 — Segmentar por país/carrera/género

| | |
|---|---|
| **Nombre** | Segmentar por país/carrera/género |
| **Actores** | Sistema *(invocado por UC-5.3)* |
| **Propósito** | Organizar los datos anonimizados en grupos homogéneos según las dimensiones de análisis requeridas (país, carrera universitaria y género) para permitir el cálculo diferenciado de métricas por cada segmento. |

**Resumen:** El caso de uso es invocado durante la agregación de métricas. El sistema agrupa los registros anonimizados por las combinaciones de dimensiones solicitadas y retorna las estructuras de datos segmentadas listas para el cálculo de KPI. Finaliza cuando todos los segmentos están construidos y disponibles para UC-5.3.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-5.3 invoca este caso de uso con los datos anonimizados y las dimensiones de segmentación requeridas. | 2. El sistema agrupa los registros por país de la institución de origen del candidato. |
| | 3. El sistema aplica una segunda segmentación por carrera universitaria dentro de cada grupo país. |
| | 4. El sistema aplica una tercera segmentación por género dentro de cada grupo país/carrera. |
| | 5. El sistema verifica que cada segmento tenga un mínimo de registros para garantizar el anonimato (mínimo k=5 por celda). |
| | 6. El sistema retorna la estructura de datos segmentada al proceso UC-5.3. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 5 — segmento con menos de k=5 registros | El sistema fusiona el segmento con el más similar para garantizar el umbral mínimo de anonimato y registra la fusión en los metadatos del resultado. |
| La consulta solicita una dimensión de segmentación no disponible en los datos | El sistema omite esa dimensión, continúa con las disponibles y registra una advertencia indicando que la dimensión solicitada no pudo ser aplicada. |

---

## UC-5.5 — Visualizar dashboard

| | |
|---|---|
| **Nombre** | Visualizar dashboard |
| **Actores** | Alta dirección, Ministerio |
| **Propósito** | Presentar los indicadores analíticos calculados en una interfaz visual interactiva que permita a la Alta dirección y los Ministerios explorar el estado de las competencias digitales de la región. |

**Resumen:** El caso de uso inicia cuando los indicadores calculados están disponibles. El sistema renderiza las gráficas interactivas, habilita los filtros dinámicos para exploración y presenta el dashboard al usuario. Finaliza cuando el usuario puede interactuar con la visualización completa de los datos regionales.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. La Alta dirección o el Ministerio accede al módulo de analítica desde su panel. | 2. El sistema invoca UC-5.6 «Renderizar gráfica» para generar las visualizaciones de cada KPI calculado. |
| | 3. El sistema invoca UC-5.10 «Aplicar filtros dinámicos» para habilitar los controles de filtrado interactivo sobre el dashboard. |
| | 4. El sistema ensambla el dashboard completo con todas las gráficas y controles de filtrado. |
| | 5. El sistema presenta el dashboard al usuario con los indicadores regionales actualizados. |
| 6. El usuario interactúa con los filtros para explorar los datos por país, carrera, género o período. | 7. El sistema actualiza las visualizaciones en tiempo real según los filtros aplicados sin recargar la página. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — fallo al renderizar una gráfica específica | El sistema muestra las demás gráficas disponibles, indica el error en el espacio de la gráfica fallida y registra la incidencia para revisión técnica. |
| El usuario solicita descargar el reporte en el paso 6 | El sistema activa UC-5.9 «Exportar reporte regional» con los filtros actualmente aplicados para generar el documento con la vista personalizada. |

---

## UC-5.6 — Renderizar gráfica

| | |
|---|---|
| **Nombre** | Renderizar gráfica |
| **Actores** | Sistema *(invocado por UC-5.5)* |
| **Propósito** | Generar las representaciones visuales (gráficas de barras, líneas, mapas de calor, etc.) de cada indicador analítico para su presentación en el dashboard gerencial. |

**Resumen:** El caso de uso es invocado durante la construcción del dashboard. El sistema selecciona el tipo de gráfica más apropiado para cada KPI, aplica los estilos institucionales del SICA y genera el componente visual listo para insertar en el dashboard. Finaliza retornando cada gráfica renderizada al proceso UC-5.5.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-5.5 invoca este caso de uso con los datos de un KPI y el tipo de visualización requerida. | 2. El sistema selecciona el tipo de gráfica según la naturaleza del KPI: barras para comparaciones, líneas para tendencias temporales, mapas para distribución geográfica. |
| | 3. El sistema aplica la paleta de colores y estilos institucionales del SICA definidos en la guía visual de la plataforma. |
| | 4. El sistema genera el componente gráfico con etiquetas, leyendas y tooltips informativos. |
| | 5. El sistema retorna el componente gráfico renderizado al proceso UC-5.5. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — tipo de gráfica no soportado | El sistema utiliza el tipo de gráfica por defecto (barras agrupadas), registra la advertencia y continúa con la renderización. |
| En el paso 4 — conjunto de datos demasiado grande para renderización fluida | El sistema aplica muestreo representativo para la visualización y muestra una nota indicando que la gráfica representa una muestra del total de datos. |

---

## UC-5.7 — Alertar anomalía estadística

| | |
|---|---|
| **Nombre** | Alertar anomalía estadística |
| **Actores** | Alta dirección, Ministerio *(— `«extend»` desde UC-5.5)* |
| **Propósito** | Notificar proactivamente a la Alta dirección y los Ministerios cuando un indicador analítico presenta un valor atípico o una variación significativa respecto a los períodos anteriores que requiera atención. |

**Resumen:** El caso de uso se activa cuando UC-5.3 o UC-5.5 detectan un KPI fuera del rango esperado. El sistema analiza la magnitud de la anomalía, genera la alerta correspondiente y la envía a los actores relevantes con el contexto necesario para la toma de decisiones. Finaliza cuando la alerta queda registrada y los actores han sido notificados.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-5.3 o UC-5.5 detecta un KPI con valor fuera del rango estadístico esperado (más de 2 desviaciones estándar respecto al promedio histórico). | 2. El sistema clasifica la severidad de la anomalía: `INFORMATIVA` (variación leve), `MODERADA` (variación significativa) o `CRÍTICA` (variación extrema). |
| | 3. El sistema genera el mensaje de alerta con: KPI afectado, valor actual, valor esperado, período de referencia y posibles causas sugeridas. |
| | 4. El sistema envía la alerta a la Alta dirección y a los Ministerios correspondientes según el área geográfica o académica afectada. |
| | 5. El sistema muestra la alerta visualmente en el dashboard con un indicador de color según la severidad. |
| | 6. El sistema registra la alerta en el historial de anomalías para análisis posterior. |
| 7. La Alta dirección o el Ministerio revisan la alerta y pueden marcarla como atendida o escalarla. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — anomalía clasificada como `CRÍTICA` | El sistema notifica adicionalmente a los Entes Regulatorios y genera un ticket de investigación automático para seguimiento. |
| En el paso 7 — la anomalía no es atendida en 24 horas | El sistema reenvía la alerta con mayor nivel de urgencia e incluye al Administrador SICA como destinatario adicional. |

---

## UC-5.8 — Aplicar derecho al olvido

| | |
|---|---|
| **Nombre** | Aplicar derecho al olvido |
| **Actores** | Entes Regulatorios *(— `«extend»` desde UC-5.1)* |
| **Propósito** | Eliminar permanente e irreversiblemente todos los datos personales de un candidato del repositorio analítico de la PRCCD en cumplimiento con su solicitud formal bajo GDPR o legislaciones locales equivalentes. |

**Resumen:** El caso de uso se activa cuando los Entes Regulatorios tramitan una solicitud formal de derecho al olvido de un candidato. El sistema localiza todos los registros asociados al candidato en la capa analítica, los elimina de forma permanente y genera la constancia de eliminación. Finaliza cuando todos los datos del candidato han sido eliminados y se ha emitido la constancia correspondiente.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. Los Entes Regulatorios presentan la solicitud formal de derecho al olvido con el ID del candidato y la documentación de respaldo. | 2. El sistema verifica la identidad y autorización del Ente Regulatorio solicitante y la validez de la solicitud. |
| | 3. El sistema localiza todos los registros del candidato en el repositorio analítico: historial de exámenes, métricas agregadas con participación individual, logs de sesión. |
| | 4. El sistema verifica si existen obligaciones legales de retención que impidan la eliminación inmediata (ej: evidencia de auditoría por período mínimo legal). |
| | 5. El sistema elimina permanentemente los registros no sujetos a retención obligatoria y anonimiza irreversiblemente los que deben conservarse por obligación legal. |
| | 6. El sistema genera la constancia de eliminación con detalle de registros eliminados, registros retenidos por obligación legal y base normativa aplicada. |
| | 7. El sistema notifica al candidato y a los Entes Regulatorios que la solicitud ha sido completada, adjuntando la constancia. |
| 8. Los Entes Regulatorios reciben la constancia como evidencia de cumplimiento normativo. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — todos los registros están sujetos a retención obligatoria | El sistema informa a los Entes Regulatorios que la eliminación no puede completarse en el período legal actual, indica la fecha a partir de la cual procederá y programa la eliminación automática para esa fecha. |
| En el paso 2 — solicitud inválida o sin documentación suficiente | El sistema rechaza la solicitud, detalla los requisitos faltantes y registra el intento de solicitud en la bitácora de auditoría. |

---

## UC-5.9 — Exportar reporte regional

| | |
|---|---|
| **Nombre** | Exportar reporte regional |
| **Actores** | Ministerio, Alta dirección *(— `«extend»` desde UC-5.3 y UC-5.5)* |
| **Propósito** | Generar un documento formal descargable con los indicadores analíticos regionales calculados, en el formato requerido por los Ministerios o la Alta dirección para uso en informes de política pública o decisiones estratégicas. |

**Resumen:** El caso de uso se activa cuando el Ministerio o la Alta dirección solicita un reporte descargable desde el dashboard. El sistema compila los indicadores con los filtros aplicados, genera el documento en el formato solicitado (PDF, Excel o CSV) y lo entrega para descarga. Finaliza cuando el documento está disponible para descarga y el evento queda registrado.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El Ministerio o la Alta dirección solicita la exportación del reporte desde el dashboard con los filtros actualmente aplicados. | 2. El sistema captura el estado actual del dashboard: KPIs calculados, segmentos activos, filtros aplicados y período de referencia. |
| | 3. El sistema genera el reporte en el formato solicitado: PDF con gráficas para presentaciones, Excel para análisis adicional, CSV para integración con otros sistemas. |
| | 4. El sistema aplica la portada institucional del SICA y los metadatos del reporte (fecha de generación, usuario solicitante, período cubierto). |
| | 5. El sistema registra la generación del reporte en la bitácora con el usuario, timestamp y parámetros utilizados. |
| | 6. El sistema entrega el archivo al usuario para descarga inmediata y lo almacena en el historial de reportes del usuario por 30 días. |
| 7. El Ministerio o la Alta dirección descarga el reporte y lo utiliza para sus procesos internos. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 3 — generación del reporte excede 30 segundos por volumen de datos | El sistema procesa el reporte en segundo plano, notifica al usuario por correo cuando esté listo y lo deja disponible en el historial de reportes. |
| En el paso 3 — formato solicitado no disponible | El sistema genera el reporte en PDF como formato por defecto y notifica al usuario que el formato solicitado no está disponible temporalmente. |

---

## UC-5.10 — Aplicar filtros dinámicos

| | |
|---|---|
| **Nombre** | Aplicar filtros dinámicos |
| **Actores** | Sistema *(invocado por UC-5.5)*, Alta dirección, Ministerio |
| **Propósito** | Habilitar controles interactivos en el dashboard que permitan a los usuarios explorar los datos analíticos filtrando por país, carrera, género, período de certificación y área de competencia sin recargar la página. |

**Resumen:** El caso de uso es invocado durante la construcción del dashboard. El sistema genera los controles de filtrado disponibles según los datos presentes, aplica las selecciones del usuario en tiempo real y actualiza las visualizaciones dinámicamente. Finaliza cuando los controles están activos y responden a las interacciones del usuario.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-5.5 invoca este caso de uso al construir el dashboard. | 2. El sistema consulta los valores disponibles para cada dimensión de filtrado: lista de países, carreras, géneros y períodos presentes en los datos actuales. |
| | 3. El sistema genera los controles de filtrado: listas desplegables, selectores múltiples, rangos de fecha y botones de período rápido (último mes, último trimestre, año actual). |
| | 4. El sistema enlaza cada control al motor de actualización de visualizaciones para que los cambios se propaguen en tiempo real. |
| | 5. El sistema retorna los controles configurados al proceso UC-5.5 para su inserción en el dashboard. |
| 6. El usuario selecciona valores en los filtros para explorar los datos por dimensiones específicas. | 7. El sistema recalcula los KPI afectados por el filtro aplicado y actualiza las gráficas correspondientes sin recargar la página completa. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 7 — el filtro aplicado resulta en un conjunto de datos vacío | El sistema muestra un mensaje informativo indicando que no hay datos para los filtros seleccionados y sugiere ampliar el criterio de búsqueda. |
| En el paso 7 — el filtro genera un conjunto de datos menor al umbral de anonimato (k<5) | El sistema bloquea la visualización del segmento filtrado, muestra el mensaje `DATOS INSUFICIENTES PARA GARANTIZAR PRIVACIDAD` y mantiene visible solo la vista agregada sin el segmento problemático. |

## UC-5.11 — Detectar brecha de genero

## Actores
Ministerio, Alta dirección

## Propósito
Identificar y alertar automáticamente cuando la segmentación por género revela una diferencia estadísticamente significativa en las tasas de aprobación, puntajes promedio o número de certificaciones entre géneros dentro de una región o área de competencia.

## Resumen
El caso de uso se activa condicionalmente cuando UC-5.3 «Agregar métricas» calcula los indicadores segmentados por género y detecta una disparidad que supera el umbral estadístico definido. El sistema analiza la magnitud de la brecha, genera el reporte de disparidad y notifica a los actores correspondientes. Finaliza cuando la alerta queda registrada y los Ministerios y Alta dirección han sido notificados para la toma de decisiones de política pública.

## Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|----------------|--------------------------------|
| 1. El proceso UC-5.3 detecta que la diferencia entre indicadores de géneros supera el umbral configurado (por defecto 10 puntos porcentuales en tasa de aprobación) e invoca este caso de uso. | 2. El sistema calcula la magnitud exacta de la brecha por segmento: diferencia en tasa de aprobación, diferencia en puntaje promedio y diferencia en número de certificaciones emitidas. |
| | 3. El sistema clasifica la severidad de la brecha: **LEVE** (10–20%), **MODERADA** (20–35%) o **CRÍTICA** (más de 35% de diferencia). |
| | 4. El sistema identifica las dimensiones adicionales donde se manifiesta la brecha: países específicos, carreras universitarias o períodos de certificación con mayor disparidad. |
| | 5. El sistema genera el reporte de brecha de género con: indicadores afectados, magnitud por segmento, comparativa histórica de períodos anteriores y mapa de calor regional. |
| | 6. El sistema muestra la alerta visualmente en el dashboard con indicador de color según la severidad y el segmento afectado destacado. |
| | 7. El sistema envía el reporte a los Ministerios de Educación y Trabajo y a la Alta dirección de los países con brecha detectada. |
| | 8. El sistema registra el evento de detección en el historial de brechas para análisis de tendencia en períodos futuros. |
| 9. El Ministerio y la Alta dirección reciben el reporte y pueden iniciar acciones de política pública o programas de inclusión según la severidad detectada. | |

## Cursos Alternos

| Condición | Acción |
|-----------|--------|
| En el paso 3 — severidad CRÍTICA | El sistema escala adicionalmente a los Entes Regulatorios y genera un ticket de seguimiento obligatorio que requiere respuesta formal del Ministerio en un plazo máximo de 15 días hábiles. |
| En el paso 4 — brecha detectada únicamente en un país específico | El sistema focaliza la notificación al Ministerio del país afectado y excluye a los demás para evitar comunicaciones irrelevantes, manteniendo el registro a nivel regional para el análisis consolidado. |
| En el paso 2 — datos insuficientes en algún género para calcular la brecha con confianza estadística | El sistema marca el resultado como `BRECHA_NO_CALCULABLE` por datos insuficientes, registra la advertencia y omite la alerta para ese segmento hasta contar con suficiente volumen de datos. |


# CDU 06 — Auditar Rastro Inmutable
## Plataforma Regional de Certificación de Competencias Digitales (PRCCD)
![Diagrama de casos de uso AuditarRastro](imagenes/cdu06.png)
---

## UC-6.1 — Consultar bitácoras

| | |
|---|---|
| **Nombre** | Consultar bitácoras |
| **Actores** | Ministerio |
| **Propósito** | Permitir al Ministerio revisar el historial completo de eventos registrados en la bitácora de auditoría de la PRCCD para verificar la trazabilidad de las operaciones realizadas sobre certificados, sesiones y accesos. |

**Resumen:** El caso de uso inicia cuando el Ministerio accede al módulo de auditoría y solicita la consulta de bitácoras. El sistema aplica los filtros solicitados, recupera los eventos registrados y presenta los resultados. Invoca automáticamente la verificación de firma digital para garantizar la integridad de los registros consultados. Finaliza cuando el Ministerio visualiza los eventos filtrados con su estado de integridad verificado.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El Ministerio accede al módulo de auditoría y especifica los criterios de consulta: rango de fechas, tipo de evento, institución o área geográfica. | 2. El sistema valida los permisos del usuario para acceder al nivel de detalle solicitado según su rol. |
| | 3. El sistema recupera los registros de la bitácora que coinciden con los criterios especificados, ordenados cronológicamente. |
| | 4. El sistema invoca UC-6.2 «Verificar firma digital» para confirmar que los registros recuperados no han sido alterados desde su escritura original. |
| | 5. El sistema presenta los resultados al Ministerio con indicadores visuales del estado de integridad de cada registro. |
| | 6. El sistema registra el acceso a la bitácora en un log de accesos de auditoría de segundo nivel para trazabilidad del propio acceso. |
| 7. El Ministerio revisa los eventos y puede navegar entre registros para obtener el detalle de cada uno. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — usuario sin permisos suficientes para el nivel de detalle solicitado | El sistema filtra los campos sensibles según el perfil del usuario y presenta solo la información autorizada, indicando que existen campos restringidos. |
| En el paso 3 — consulta sin resultados para los criterios especificados | El sistema muestra mensaje informativo y sugiere ampliar el rango de fechas o los criterios de búsqueda. |
| El Ministerio requiere el reporte en formato descargable | El sistema activa UC-6.5 «Exportar reporte de auditoría» para generar el documento formal con los registros consultados. |

---

## UC-6.2 — Verificar firma digital

| | |
|---|---|
| **Nombre** | Verificar firma digital |
| **Actores** | Sistema *(invocado por UC-6.1)*, Entes Regulatorios |
| **Propósito** | Confirmar que los registros de la bitácora y los certificados digitales no han sido alterados desde su emisión original, recalculando y comparando su hash contra el registro inmutable en blockchain. |

**Resumen:** El caso de uso es invocado durante la consulta de bitácoras y puede ser activado directamente por los Entes Regulatorios para verificar certificados específicos. El sistema recalcula el hash de cada registro, lo compara con el registrado en blockchain y determina si existe alguna discrepancia. Invoca la retención de evidencia para garantizar la custodia de los artefactos verificados. Finaliza retornando el estado de integridad de cada registro verificado.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-6.1 invoca este caso de uso con el conjunto de registros a verificar, o los Entes Regulatorios solicitan la verificación de un certificado específico por su ID. | 2. El sistema recupera el hash original de cada registro desde el repositorio de blockchain usando el TxID asociado. |
| | 3. El sistema recalcula el hash SHA-256 del registro actual tal como está almacenado en la base de datos interna. |
| | 4. El sistema compara el hash recalculado con el hash original en blockchain: si coinciden, el registro es `ÍNTEGRO`; si difieren, el registro es `ALTERADO`. |
| | 5. El sistema invoca UC-6.3 «Retener evidencia» para asegurar los artefactos relacionados con los registros verificados. |
| | 6. El sistema retorna el estado de integridad de cada registro al proceso invocante. |
| 7. Los Entes Regulatorios reciben el resultado de la verificación con el detalle técnico del proceso para uso en auditorías formales. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — hash no coincide (`ALTERADO`) | El sistema activa UC-6.4 «Alertar intento fraude» de forma inmediata, suspende el acceso al registro comprometido y notifica a los Entes Regulatorios y a la Alta dirección. |
| En el paso 2 — TxID de blockchain no encontrado | El sistema marca el registro como `NO_VERIFICABLE`, lo reporta al Ministerio con la advertencia y notifica al Admin. TI para investigación del registro huérfano. |
| La red blockchain no está disponible para consulta | El sistema utiliza el repositorio de hashes local como respaldo temporal, marca la verificación como `VERIFICADO_LOCAL` e indica que la confirmación en blockchain está pendiente. |

---

## UC-6.3 — Retener evidencia

| | |
|---|---|
| **Nombre** | Retener evidencia |
| **Actores** | Entes Regulatorios |
| **Propósito** | Garantizar la custodia segura, cifrada e inalterable de toda la evidencia de auditoría (artefactos biométricos, logs de sesión, registros de certificados) durante el período de retención legal obligatorio de 5 años. |

**Resumen:** El caso de uso es invocado tras la verificación de firma digital. El sistema cifra los artefactos de evidencia en reposo, aplica la política de retención legal correspondiente y programa la eliminación automática al vencimiento del período. Los Entes Regulatorios supervisan el estado de la retención. Finaliza cuando la evidencia queda bajo custodia segura con la política de retención aplicada.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-6.2 invoca este caso de uso con los artefactos de evidencia asociados a los registros verificados. | 2. El sistema cifra cada artefacto de evidencia con AES-256 usando la llave de custodia del período correspondiente. |
| | 3. El sistema invoca UC-6.6 «Aplicar política retención» para determinar el período de retención aplicable según el tipo de evidencia y la legislación del país de origen. |
| | 4. El sistema almacena la evidencia cifrada en el repositorio de custodia de largo plazo con metadatos: tipo de artefacto, fecha de creación, fecha de vencimiento de retención, hash de integridad. |
| | 5. El sistema programa la tarea automática de eliminación para la fecha de vencimiento del período de retención. |
| | 6. El sistema retorna la confirmación de custodia con el ID de retención al proceso invocante. |
| 7. Los Entes Regulatorios pueden consultar el inventario de evidencia bajo custodia y su estado de retención desde el panel de auditoría. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — capacidad de almacenamiento insuficiente | El sistema notifica al Admin. TI el nivel crítico de almacenamiento, prioriza la retención de evidencia crítica (fraudes confirmados) y registra una alerta para expansión inmediata de capacidad. |
| En el paso 5 — se aproxima la fecha de vencimiento de retención | El sistema invoca UC-6.7 «Notificar vencimiento retención» para alertar a los Entes Regulatorios con 30 días de anticipación antes de la eliminación automática. |

---

## UC-6.4 — Alertar intento fraude

| | |
|---|---|
| **Nombre** | Alertar intento fraude |
| **Actores** | Sistema *(automático — `«extend»` desde UC-6.2)*, Entes Regulatorios |
| **Propósito** | Notificar de forma inmediata y escalada a los Entes Regulatorios y a la Alta dirección cuando se detecta que un registro de bitácora o certificado ha sido alterado, indicando un posible intento de fraude académico. |

**Resumen:** El caso de uso se activa automáticamente cuando UC-6.2 detecta que el hash de un registro no coincide con el registrado en blockchain. El sistema genera la alerta de fraude, escala la notificación a los actores correspondientes y abre un expediente de investigación. Finaliza cuando la alerta queda registrada, los actores notificados y el expediente de investigación creado.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-6.2 detecta que el hash de un registro es `ALTERADO` e invoca este caso de uso con el detalle del registro comprometido. | 2. El sistema bloquea inmediatamente el acceso al registro comprometido y a todos los certificados relacionados con él. |
| | 3. El sistema clasifica la severidad del fraude: `SOSPECHOSO` (primera discrepancia detectada) o `CONFIRMADO` (patrón de múltiples alteraciones). |
| | 4. El sistema genera el expediente de investigación con: ID del registro alterado, hash esperado, hash encontrado, timestamp de detección, historial de accesos al registro. |
| | 5. El sistema envía alerta de prioridad alta a los Entes Regulatorios y a la Alta dirección con el expediente adjunto. |
| | 6. El sistema notifica al Admin. TI para que inicie la investigación forense de la alteración detectada. |
| | 7. El sistema registra el evento de fraude en la bitácora de seguridad con estado `PENDIENTE_INVESTIGACION`. |
| 8. Los Entes Regulatorios reciben el expediente y pueden iniciar el proceso formal de investigación desde el panel de auditoría. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 3 — severidad `CONFIRMADO` (patrón de alteraciones) | El sistema escala adicionalmente a los Ministerios afectados y activa el protocolo de contingencia que suspende la emisión de nuevos certificados hasta resolver la integridad del sistema. |
| En el paso 8 — los Entes Regulatorios confirman que es un falso positivo | El sistema restaura el acceso al registro, documenta el resultado de la investigación, cierra el expediente y ajusta los parámetros del detector para reducir falsos positivos similares. |

---

## UC-6.5 — Exportar reporte de auditoría

| | |
|---|---|
| **Nombre** | Exportar reporte de auditoría |
| **Actores** | Ministerio *(— `«extend»` desde UC-6.1)* |
| **Propósito** | Generar un documento formal descargable con los registros de bitácora consultados, incluyendo los resultados de verificación de integridad, para uso en procesos legales, inspecciones regulatorias o informes de gestión. |

**Resumen:** El caso de uso se activa cuando el Ministerio solicita exportar los resultados de una consulta de bitácora. El sistema compila los registros filtrados con sus estados de integridad verificados, aplica la plantilla oficial de reporte de auditoría y genera el documento. Finaliza cuando el documento está disponible para descarga y el evento de exportación queda registrado.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El Ministerio solicita la exportación del reporte de auditoría desde los resultados de la consulta de bitácora activa. | 2. El sistema captura el conjunto de registros consultados con sus filtros activos, estados de integridad y metadatos de verificación. |
| | 3. El sistema aplica la plantilla oficial de reporte de auditoría del SICA con portada institucional, tabla de contenidos y sección de certificación del reporte. |
| | 4. El sistema genera el documento en formato PDF/A-3 (estándar para archivo legal de largo plazo) con firma digital del sistema como garante de la autenticidad del reporte. |
| | 5. El sistema registra la generación del reporte en la bitácora con: usuario solicitante, timestamp, parámetros de consulta usados y hash del documento generado. |
| | 6. El sistema entrega el documento al Ministerio para descarga y lo almacena en el repositorio de reportes de auditoría por 5 años. |
| 7. El Ministerio descarga el reporte y lo utiliza en sus procesos regulatorios o legales. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 4 — fallo al aplicar firma digital al reporte | El sistema genera el documento sin firma, lo marca como `BORRADOR_SIN_FIRMA`, notifica al Ministerio y programa el proceso de firma para cuando el servicio PKI esté disponible. |
| El volumen de registros excede el límite para generación síncrona (más de 10,000 registros) | El sistema procesa el reporte en segundo plano, notifica al Ministerio por correo cuando esté listo y lo deja disponible en el repositorio de reportes de auditoría. |

---

## UC-6.6 — Aplicar política retención

| | |
|---|---|
| **Nombre** | Aplicar política retención |
| **Actores** | Sistema *(invocado por UC-6.3)*, Entes Regulatorios |
| **Propósito** | Determinar y aplicar el período de retención legal obligatorio para cada tipo de evidencia según la legislación vigente del país de origen del candidato, garantizando el cumplimiento con GDPR y leyes locales. |

**Resumen:** El caso de uso es invocado al almacenar evidencia bajo custodia. El sistema consulta las políticas de retención configuradas, determina el período aplicable para el tipo de evidencia y país correspondiente, y retorna los parámetros de retención para que UC-6.3 programe la eliminación automática. Finaliza retornando la política aplicable al proceso invocante.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El proceso UC-6.3 invoca este caso de uso con el tipo de evidencia y el país de origen del candidato al que pertenece. | 2. El sistema consulta el catálogo de políticas de retención configuradas por los Entes Regulatorios para el país indicado. |
| | 3. El sistema determina el período de retención aplicable según el tipo de evidencia: evidencia biométrica de examen (5 años por GDPR), registros de certificados emitidos (10 años), logs de acceso (2 años). |
| | 4. El sistema calcula la fecha exacta de vencimiento sumando el período al timestamp de creación de la evidencia. |
| | 5. El sistema retorna la política aplicada al proceso UC-6.3: período en días, fecha de vencimiento y base normativa que la sustenta. |
| 6. Los Entes Regulatorios pueden revisar y actualizar las políticas de retención desde el panel de configuración normativa. | |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 2 — política de retención no configurada para el país indicado | El sistema aplica el período más largo entre las políticas configuradas para los países disponibles como medida de máxima precaución, y genera una alerta para que los Entes Regulatorios configuren la política del país faltante. |
| Los Entes Regulatorios actualizan una política de retención ya aplicada | El sistema recalcula las fechas de vencimiento de todos los registros afectados por el cambio y actualiza las tareas de eliminación programadas. |

---

## UC-6.7 — Notificar vencimiento retención

| | |
|---|---|
| **Nombre** | Notificar vencimiento retención |
| **Actores** | Sistema *(automático — activado desde UC-6.3)*, Entes Regulatorios |
| **Propósito** | Alertar a los Entes Regulatorios con antelación suficiente cuando la evidencia bajo custodia está próxima a alcanzar su fecha de vencimiento de retención legal, permitiéndoles tomar decisiones antes de la eliminación automática. |

**Resumen:** El caso de uso se activa automáticamente cuando el sistema detecta que un registro de evidencia vencerá en los próximos 30 días. El sistema genera la notificación con el detalle de la evidencia próxima a vencer, la envía a los Entes Regulatorios y espera su confirmación o instrucción de extensión. Finaliza cuando los Entes Regulatorios han sido notificados y el sistema queda en espera de su respuesta antes de proceder con la eliminación.

### Curso Normal de Eventos

| Acción del actor | Respuesta del proceso de negocio |
|---|---|
| 1. El sistema detecta que un registro de evidencia bajo custodia vencerá en los próximos 30 días. | 2. El sistema genera el aviso de vencimiento con: ID de la evidencia, tipo de artefacto, candidato asociado (referencia anonimizada), fecha exacta de vencimiento y base normativa que establece el período. |
| | 3. El sistema envía la notificación a los Entes Regulatorios por correo electrónico y la muestra en el panel de alertas del módulo de auditoría. |
| | 4. El sistema registra el envío de la notificación en la bitácora con timestamp y estado `PENDIENTE_CONFIRMACION`. |
| 5. Los Entes Regulatorios revisan la notificación y confirman que la evidencia puede eliminarse o solicitan una extensión del período de retención. | 6. El sistema actualiza el estado del registro según la instrucción recibida: `APROBADO_ELIMINACION` o `RETENCION_EXTENDIDA` con la nueva fecha de vencimiento. |

### Cursos Alternos

| Condición | Acción |
|---|---|
| En el paso 5 — no se recibe respuesta de los Entes Regulatorios en 15 días | El sistema reenvía la notificación con urgencia indicando que la eliminación automática procederá en los días restantes si no se recibe instrucción contraria. |
| Los Entes Regulatorios solicitan extensión del período de retención | El sistema actualiza la fecha de vencimiento según lo indicado, invoca UC-6.6 para registrar la nueva política aplicada y confirma la extensión a los Entes Regulatorios con el nuevo plazo. |
| La fecha de vencimiento llega sin confirmación de los Entes Regulatorios | El sistema procede con la eliminación automática según la política original, genera la constancia de eliminación y la envía a los Entes Regulatorios como registro del evento. |

---

#
# 4. Matrices de trazabilidad


## 4.1 Stakeholders vs Requerimientos

La matriz de trazabilidad Stakeholders vs Requerimientos permite identificar qué actores del negocio exigen, validan o se ven impactados por cada requisito funcional del sistema. Su objetivo es demostrar que los requerimientos definidos para la Plataforma Regional de Certificación de Competencias Digitales (PRCCD) responden directamente a necesidades reales de los involucrados, evitando requisitos aislados o sin justificación dentro del caso de negocio.

Esta matriz también facilita el análisis de impacto: si cambia un requisito funcional, el equipo puede identificar rápidamente qué stakeholder debe ser consultado o qué área del negocio se verá afectada. Por esa razón, se utiliza como evidencia de alineación entre las necesidades del negocio, la arquitectura propuesta y los requisitos funcionales definidos para la solución.



## Stakeholders considerados

| ID | Stakeholder | Interés o preocupación principal |
|---|---|---|
| ST-01 | Secretaría General del SICA | Impulsa la iniciativa regional y requiere que la plataforma unifique la certificación de competencias digitales en la región. |
| ST-02 | Alta dirección del SICA | Exige una solución estratégica, escalable y justificable que pueda integrarse regionalmente sin afectar la operación de las instituciones. |
| ST-03 | Dirección financiera | Controla el presupuesto del piloto, prioriza costos, licenciamiento y sostenibilidad económica de la solución. |
| ST-04 | Administradores de TI / Soporte operativo | Se encargan de la operación, soporte, despliegue on-premise, seguridad técnica y administración de usuarios. |
| ST-05 | Universidades integradas: USAC, UCR y UES | Proveen identidad, datos académicos e integración con sistemas heredados sin cambiar sus protocolos internos. |
| ST-06 | Ministerios de educación | Consumen información analítica y validan el impacto educativo de las competencias digitales certificadas. |
| ST-07 | Ministerios de trabajo | Requieren información confiable sobre competencias laborales y certificados verificables para el ecosistema laboral. |
| ST-08 | Candidatos / estudiantes / profesionales | Utilizan la plataforma para autenticarse, evaluarse y obtener una certificación digital verificable. |
| ST-09 | Entes reguladores y autoridades de protección de datos | Velan por el cumplimiento normativo, privacidad, derecho al olvido, retención e integridad de la evidencia. |
| ST-10 | Auditores | Revisan evidencia antifraude, trazabilidad, bitácoras inmutables y validez de certificados emitidos. |
| ST-11 | Verificadores externos de certificados | Consultan la autenticidad de certificados mediante código, QR o hash. |

## Requerimientos funcionales trazados

| ID | Requerimiento funcional | Prioridad |
|---|---|---|
| RF-01 | El sistema debe permitir la autenticación federada mediante los protocolos LDAP, SAML y OAuth2 según la institución universitaria. | Alta |
| RF-02 | El sistema debe ejecutar evaluaciones mediante un motor de exámenes adaptativos que ajuste la dificultad en tiempo real según las respuestas previas del candidato. | Alta |
| RF-03 | El sistema debe capturar y almacenar evidencia antifraude durante la evaluación, incluyendo capturas de pantalla, logs de tecleo y ráfagas de video. | Alta |
| RF-04 | El sistema debe emitir certificados digitales verificables criptográficamente mediante PKI o Blockchain (Hyperledger). | Alta |
| RF-05 | El sistema debe mantener un rastro de auditoría inmutable por cada certificado emitido. | Alta |
| RF-06 | El sistema debe importar y exportar datos académicos en formatos JSON, XML y CSV. | Media |
| RF-07 | El sistema debe integrarse nativamente con los sistemas de USAC, UCR y UES sin obligar a estas instituciones a cambiar su forma de operar. | Alta |
| RF-08 | El sistema debe generar dashboards analíticos segmentados por país, carrera universitaria y género. | Media |
| RF-09 | El sistema debe anonimizar y agregar los datos antes de exponerlos en las interfaces gerenciales. | Alta |
| RF-10 | El sistema debe permitir la verificación externa de un certificado mediante código, QR o hash. | Media |
| RF-11 | El sistema debe gestionar usuarios, roles y permisos por institución. | Media |
| RF-12 | El sistema debe habilitar los períodos de certificación exclusivamente durante la primera semana de cada mes. | Alta |

## Matriz Stakeholders vs Requerimientos

| Stakeholder | RF-01 | RF-02 | RF-03 | RF-04 | RF-05 | RF-06 | RF-07 | RF-08 | RF-09 | RF-10 | RF-11 | RF-12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ST-01 - Secretaría General del SICA | X | X | X | X | X | X | X | X | X | X | X | X |
| ST-02 - Alta dirección del SICA | X | X | X | X | X | X | X | X | X | X | X | X |
| ST-03 - Dirección financiera |  |  |  | X | X |  |  | X | X | X | X | X |
| ST-04 - Administradores de TI / Soporte operativo | X | X | X | X| X | X | X |  | X | X | X | X |
| ST-05 - Universidades integradas: USAC, UCR y UES | X | X |  |  |  | X | X | X | X |  | X | X |
| ST-06 - Ministerios de educación |  |  |  | X | X |  |  | X | X | X |  |  |
| ST-07 - Ministerios de trabajo |  |  |  | X | X |  |  | X | X | X |  |  |
| ST-08 - Candidatos / estudiantes / profesionales | X | X | X | X |  |  |  |  |  | X |  | X |
| ST-09 - Entes reguladores y autoridades de protección de datos |  |  | X | X | X |  |  | X | X | X |  |  |
| ST-10 - Auditores |  |  | X | X | X |  |  |  | X | X |  |  |
| ST-11 - Verificadores externos de certificados |  |  |  | X | X |  |  |  |  | X |  |  |

## Justificación de trazabilidad

| Stakeholder | Requerimientos relacionados | Justificación |
|---|---|---|
| ST-01 / ST-02 | RF-02, RF-04, RF-07, RF-08, RF-12 | Estos stakeholders impulsan la plataforma regional, por lo que exigen evaluación adaptativa, certificación verificable, integración universitaria, analítica y control de períodos de certificación. |
| ST-03 | RF-05, RF-08, RF-09, RF-10, RF-11, RF-12 | La dirección financiera necesita control, auditoría, evidencia de valor institucional, administración de accesos y trazabilidad para justificar el piloto. |
| ST-04 | RF-01, RF-03, RF-05, RF-06, RF-07, RF-11, RF-12 | El área operativa se ve impactada por autenticación, integración, usuarios, seguridad, evidencia y operación de períodos de certificación. |
| ST-05 | RF-01, RF-06, RF-07 | Las universidades exigen interoperabilidad real, autenticación federada y compatibilidad con formatos heterogéneos sin modificar sus procesos internos. |
| ST-06 / ST-07 | RF-04, RF-05, RF-08, RF-09, RF-10 | Los ministerios necesitan certificados confiables, auditoría y dashboards con datos agregados y anonimizados para tomar decisiones regionales. |
| ST-08 | RF-01, RF-02, RF-04, RF-10, RF-12 | Los candidatos necesitan acceder, evaluarse en períodos habilitados, obtener certificación y poder demostrar su validez ante terceros. |
| ST-09 | RF-03, RF-05, RF-09 | Los reguladores impactan directamente los requisitos de evidencia, auditoría, privacidad y anonimización. |
| ST-10 | RF-03, RF-05, RF-10 | Los auditores requieren evidencia antifraude, bitácora inmutable y mecanismos de verificación. |
| ST-11 | RF-10 | Los verificadores externos dependen principalmente de la consulta pública de autenticidad del certificado. |

## Lectura de la matriz

La matriz evidencia que los requisitos funcionales de mayor prioridad se encuentran asociados con los stakeholders más críticos del proyecto. Por ejemplo, la autenticación federada y la integración universitaria se relacionan directamente con las universidades USAC, UCR y UES, debido a que el enunciado establece que cada institución trabaja con protocolos y formatos distintos. Asimismo, la emisión de certificados verificables, la auditoría inmutable y la verificación externa se relacionan con ministerios, auditores, entes reguladores y verificadores externos, debido a la necesidad de garantizar validez jurídica, trazabilidad y prevención de fraude académico.

También se observa que los requisitos de analítica y anonimización están ligados principalmente a los ministerios y autoridades regulatorias, ya que los dashboards deben mostrar información segmentada sin exponer datos personales identificables. Finalmente, los requisitos relacionados con el motor de evaluación adaptativa y los períodos de certificación impactan directamente a los candidatos y a la alta dirección del SICA, porque representan el núcleo funcional de la plataforma y la condición operativa principal del negocio.

---

## 4.2 Stakeholders vs CDU

La presente matriz de trazabilidad relaciona los stakeholders identificados para la Plataforma Regional de Certificación de Competencias Digitales (PRCCD) con los Casos de Uso del Sistema (CDU). Su propósito es demostrar que cada funcionalidad implementada responde a necesidades específicas de los actores involucrados y que todos los stakeholders relevantes tienen representación dentro de la solución arquitectónica.

Esta matriz complementa la trazabilidad Stakeholders vs Requerimientos al mostrar cómo dichas necesidades se materializan en funcionalidades concretas del sistema.


### Matriz Stakeholders vs Casos de Uso del Sistema

| Stakeholder                           | CUS-01 | CUS-02 | CUS-03 | CUS-03.1 | CUS-04 | CUS-05 | CUS-06 | CUS-07 | CUS-07.1 | CUS-08 | CUS-09 | CUS-10 | CUS-11 | CUS-12 |
| ------------------------------------- | ------ | ------ | ------ | -------- | ------ | ------ | ------ | ------ | -------- | ------ | ------ | ------ | ------ | ------ |
| ST-01 Secretaría General del SICA     | X      | X      | X      | X        | X      | X      | X      | X      | X        | X      | X      | X      | X      | X      |
| ST-02 Alta Dirección del SICA         | X      | X      | X      | X        | X      | X      | X      | X      | X        | X      | X      | X      | X      | X      |
| ST-03 Dirección Financiera            |        | X      |        |          |        | X      | X      |        |          |        | X      | X      | X      | X      |
| ST-04 Administradores TI / Operativos | X      | X      | X      | X        | X      | X      | X      | X      | X        | X      |        |        | X      | X      |
| ST-05 Universidades USAC / UCR / UES  | X      |        | X      |          |        |        |        | X      | X        | X      |        |        |        |        |
| ST-06 Ministerios de Educación        |        |        |        |          |        | X     | X      |        |          |        | X      | X      | X      |        |
| ST-07 Ministerios de Trabajo          |        |        |        |          |        | X     | X      |        |          |        | X      | X      | X      |        |
| ST-08 Candidatos / Profesionales      | X      |        | X      |          | X      | X      |        |        |          |        |        |        | X      | X      |
| ST-09 Entes Regulatorios              |        |        |        |          | X      | X      | X      |        |          |        | X      | X      | X      |        |
| ST-10 Auditores                       |        |        |        |          | X      | X      | X      |        |          |        |        | X      | X      |        |
| ST-11 Verificadores Externos          |        |        |        |          |        |        |        |        |          |        |        |        | X      |        |

### Resumen de Participación por Stakeholder

| Stakeholder                 | Casos de uso principales                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Secretaría General del SICA | Ejecutar evaluación adaptativa, emitir certificados, auditoría inmutable, dashboards, sincronización universitaria y administración de períodos. |
| Alta Dirección del SICA     | Certificación regional, evaluación adaptativa, integración universitaria, analítica y control operativo.                                         |
| Dirección Financiera        | Auditoría, certificación, verificación y control institucional.                                                                                  |
| Administradores TI          | Autenticación, gestión de usuarios, integración universitaria, sincronización y administración de períodos.                                      |
| Universidades               | Autenticación federada, importación/exportación de datos y sincronización institucional.                                                         |
| Ministerios de Educación    | Dashboards, anonimización, auditoría y verificación de certificados.                                                                             |
| Ministerios de Trabajo      | Dashboards, anonimización, auditoría y verificación de certificados.                                                                             |
| Candidatos / Profesionales  | Autenticación, evaluación adaptativa, captura de evidencia y emisión de certificados.                                                            |
| Entes Regulatorios          | Auditoría, privacidad, anonimización y cumplimiento normativo.                                                                                   |
| Auditores                   | Evidencia antifraude, auditoría inmutable y validación de certificados.                                                                          |
| Verificadores Externos      | Verificación pública de certificados mediante código, QR o hash.                                                                                 |

### Análisis de Cobertura

La matriz evidencia que todos los stakeholders identificados durante el análisis del negocio poseen participación directa o indirecta en al menos un Caso de Uso del Sistema. Los candidatos y profesionales interactúan principalmente con las funcionalidades de autenticación, evaluación y certificación, mientras que las universidades se relacionan con los procesos de interoperabilidad e integración de datos. Por otra parte, los ministerios, auditores y entes reguladores participan principalmente en los procesos de auditoría, verificación, anonimización y explotación analítica de la información.

Asimismo, se observa que los casos de uso más estratégicos para el negocio son CUS-03 Ejecutar evaluación adaptativa, CUS-05 Emitir certificado digital, CUS-06 Registrar auditoría inmutable y CUS-07.1 Sincronizar sistemas universitarios, debido a que concentran la mayor cantidad de stakeholders interesados y representan el núcleo funcional de la Plataforma Regional de Certificación de Competencias Digitales (PRCCD).

### Cobertura CDU vs Stakeholders

| CDU                                          | Stakeholders Relacionados                                     |
| -------------------------------------------- | ------------------------------------------------------------- |
| CUS-01 Autenticar usuario                    | ST-01, ST-02, ST-04, ST-05, ST-08                             |
| CUS-02 Gestionar usuarios y roles            | ST-01, ST-02, ST-03, ST-04                                    |
| CUS-03 Ejecutar evaluación adaptativa        | ST-01, ST-02, ST-05, ST-08                                    |
| CUS-03.1 Gestionar banco de preguntas        | ST-01, ST-02, ST-04                                           |
| CUS-04 Capturar evidencia antifraude         | ST-01, ST-02, ST-08, ST-09, ST-10                             |
| CUS-05 Emitir certificado digital            | ST-01, ST-02, ST-03, ST-06, ST-07, ST-08, ST-09, ST-10        |
| CUS-06 Registrar auditoría inmutable         | ST-01, ST-02, ST-03, ST-06, ST-07, ST-09, ST-10               |
| CUS-07 Importar datos académicos             | ST-01, ST-02, ST-04, ST-05                                    |
| CUS-07.1 Sincronizar sistemas universitarios | ST-01, ST-02, ST-04, ST-05                                    |
| CUS-08 Exportar datos académicos             | ST-01, ST-02, ST-04, ST-05                                    |
| CUS-09 Generar dashboards analíticos         | ST-01, ST-02, ST-03, ST-06, ST-07, ST-09                      |
| CUS-10 Anonimizar y agregar datos            | ST-03, ST-06, ST-07, ST-09, ST-10                             |
| CUS-11 Verificar certificado                 | ST-01, ST-02, ST-03, ST-04, ST-06, ST-07, ST-09, ST-10, ST-11 |
| CUS-12 Administrar períodos de certificación | ST-01, ST-02, ST-03, ST-04, ST-08                             |


---

## 4.3 Requerimientos vs CDU

La matriz de trazabilidad Requerimientos vs Casos de Uso del Sistema (CDU) permite verificar que todos los requerimientos funcionales identificados durante el análisis del negocio se encuentran implementados mediante uno o más casos de uso del sistema. Su objetivo principal es garantizar la cobertura funcional completa de la solución y demostrar que no existen requisitos sin representación dentro del modelo funcional de la Plataforma Regional de Certificación de Competencias Digitales (PRCCD).

Esta matriz constituye un mecanismo de validación arquitectónica que facilita la identificación de requisitos no implementados, casos de uso redundantes o funcionalidades sin justificación de negocio.

### Leyenda

| Símbolo   | Significado                                                                |
| --------- | -------------------------------------------------------------------------- |
| X         | El caso de uso implementa total o parcialmente el requerimiento funcional. |
| *(vacío)* | No existe relación directa.                                                |

---

### Matriz Requerimientos Funcionales vs Casos de Uso

| RF / CDU                                            | CUS-01 | CUS-02 | CUS-03 | CUS-03.1 | CUS-04 | CUS-05 | CUS-06 | CUS-07 | CUS-07.1 | CUS-08 | CUS-09 | CUS-10 | CUS-11 | CUS-12 |
| --------------------------------------------------- | ------ | ------ | ------ | -------- | ------ | ------ | ------ | ------ | -------- | ------ | ------ | ------ | ------ | ------ |
| RF-01 Autenticación federada LDAP/SAML/OAuth2       | X      |        |        |          |        |        |        |        |          |        |        |        |        |        |
| RF-02 Evaluación adaptativa                         |        |        | X      | X        |        |        |        |        |          |        |        |        |        |        |
| RF-03 Evidencia antifraude                          |        |        |        |          | X      |        |        |        |          |        |        |        |        |        |
| RF-04 Certificados verificables criptográficamente  |        |        |        |          |        | X      |        |        |          |        |        |        |        |        |
| RF-05 Auditoría inmutable                           |        |        |        |          |        |        | X      |        |          |        |        |        |        |        |
| RF-06 Importación y exportación de datos académicos |        |        |        |          |        |        |        | X      |          | X      |        |        |        |        |
| RF-07 Integración con USAC, UCR y UES               | X      |        |        |          |        |        |        | X      | X        |        |        |        |        |        |
| RF-08 Dashboards analíticos                         |        |        |        |          |        |        |        |        |          |        | X      |        |        |        |
| RF-09 Anonimización y agregación de datos           |        |        |        |          |        |        |        |        |          |        |        | X      |        |        |
| RF-10 Verificación externa de certificados          |        |        |        |          |        |        |        |        |          |        |        |        | X      |        |
| RF-11 Gestión de usuarios, roles y permisos         | X      | X      |        |          |        |        |        |        |          |        |        |        |        |        |
| RF-12 Administración de períodos de certificación   |        |        | X      |          |        |        |        |        |          |        |        |        |        | X      |

---

### Resumen de Cobertura de Requerimientos

| Requerimiento | Casos de Uso Asociados   |
| ------------- | ------------------------ |
| RF-01         | CUS-01                   |
| RF-02         | CUS-03, CUS-03.1         |
| RF-03         | CUS-04                   |
| RF-04         | CUS-05                   |
| RF-05         | CUS-06                   |
| RF-06         | CUS-07, CUS-08           |
| RF-07         | CUS-01, CUS-07, CUS-07.1 |
| RF-08         | CUS-09                   |
| RF-09         | CUS-10                   |
| RF-10         | CUS-11                   |
| RF-11         | CUS-01, CUS-02           |
| RF-12         | CUS-03, CUS-12           |

---

### Resumen de Cobertura de Casos de Uso

| Caso de Uso                                  | Requerimientos Cubiertos |
| -------------------------------------------- | ------------------------ |
| CUS-01 Autenticar usuario                    | RF-01, RF-07, RF-11      |
| CUS-02 Gestionar usuarios, roles y permisos  | RF-11                    |
| CUS-03 Ejecutar evaluación adaptativa        | RF-02, RF-12             |
| CUS-03.1 Gestionar banco de preguntas        | RF-02                    |
| CUS-04 Capturar evidencia antifraude         | RF-03                    |
| CUS-05 Emitir certificado digital            | RF-04                    |
| CUS-06 Registrar auditoría inmutable         | RF-05                    |
| CUS-07 Importar datos académicos             | RF-06, RF-07             |
| CUS-07.1 Sincronizar sistemas universitarios | RF-07                    |
| CUS-08 Exportar datos académicos             | RF-06                    |
| CUS-09 Generar dashboards analíticos         | RF-08                    |
| CUS-10 Anonimizar y agregar datos            | RF-09                    |
| CUS-11 Verificar certificado                 | RF-10                    |
| CUS-12 Administrar períodos de certificación | RF-12                    |

---

### Validación de Cobertura

El análisis de trazabilidad evidencia que los doce requerimientos funcionales definidos para la Plataforma Regional de Certificación de Competencias Digitales (PRCCD) se encuentran completamente representados por uno o más Casos de Uso del Sistema. No se identificaron requerimientos sin implementación funcional ni casos de uso sin justificación de negocio.

Asimismo, se observa que ciertos requerimientos estratégicos poseen cobertura múltiple debido a su impacto transversal dentro de la arquitectura. Destacan RF-07 Integración con universidades, implementado mediante los casos de uso de autenticación federada, importación de datos y sincronización institucional; RF-11 Gestión de usuarios, cubierto por autenticación y administración de roles; y RF-12 Gestión de períodos de certificación, que afecta tanto la ejecución de evaluaciones como la administración operativa del sistema.

La matriz confirma que la solución propuesta mantiene alineación completa entre las necesidades del negocio, los requerimientos funcionales definidos y las funcionalidades representadas en el modelo de casos de uso del sistema, garantizando consistencia arquitectónica y trazabilidad de extremo a extremo.

---

# 5. Seleccion arquitectonica

## 5.1 Analisis de estilos candidatos

Para seleccionar el estilo arquitectonico del PRCCD se evaluaron los estilos mas representativos considerando los drivers identificados, en especial los picos de trafico de la primera semana del mes, la integracion con tres universidades de protocolos distintos y el requisito de auditoria inmutable.

### Monolitico

Concentra toda la logica del sistema en una sola aplicacion desplegable. Es la opcion mas simple de desarrollar al inicio, pero presenta limitaciones criticas para este proyecto: no permite escalar partes especificas del sistema de forma independiente, lo que lo hace incompatible con los picos de miles de usuarios simultaneos durante los periodos de certificacion. Ademas, una falla en cualquier modulo puede comprometer todo el sistema. Descartado.

### SOA - Arquitectura Orientada a Servicios

Organiza el sistema en servicios de negocio que se comunican a traves de un bus central (ESB). Ofrece buena separacion de responsabilidades y es un estilo probado en entornos gubernamentales. Sin embargo, el bus central representa un cuello de botella cuando se presentan los picos de trafico del PRCCD, y la gobernanza centralizada dificulta la integracion con los protocolos heterogeneos de USAC, UCR y UES. No se descarta completamente, pero por si solo no es suficiente.

### Microservicios

Divide el sistema en servicios pequeños, autonomos y desplegables de forma independiente. Cada servicio tiene su propia base de datos y se comunica con los demas a traves de APIs. Este estilo responde directamente al problema de escalabilidad: durante la primera semana del mes se puede escalar unicamente el servicio del motor de examenes sin tocar el resto del sistema. Tambien facilita integrar cada universidad como un adaptador independiente sin afectar los demas.

### Orientacion a Eventos - EDA

Los componentes del sistema se comunican mediante eventos asincronos a traves de un bus de mensajes. Este estilo es especialmente util para registros de auditoria inmutables, captura de evidencia antifraude y cualquier proceso que no requiera una respuesta inmediata. El candidato responde una pregunta, se emite un evento, y el sistema de auditoria lo registra de forma independiente sin bloquear el flujo del examen.

---

## 5.2 Estilo seleccionado

**Arquitectura hibrida: Microservicios con Orientacion a Eventos**

La arquitectura del PRCCD combina ambos estilos porque cada uno resuelve un problema diferente del sistema:

Los microservicios abordan la escalabilidad y la integracion heterogenea. Cada dominio del negocio, como evaluaciones, certificados, integracion universitaria o analitica, es un servicio independiente que puede escalar, desplegarse y mantenerse por separado. Esto permite que durante los periodos de certificacion el servicio de examenes soporte la carga sin arrastrar a los demas modulos.

La orientacion a eventos aborda la auditoria inmutable y la captura de evidencia antifraude. Cada accion relevante del sistema genera un evento que se publica en un bus de mensajes. Estos eventos son consumidos por el servicio de auditoria, que los registra de forma inmutable sin interferir con el flujo principal del examen ni con la emision de certificados.

### Justificacion por driver

| Driver                               | Como lo atiende la arquitectura seleccionada                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------- |
| EaC-01 Escalabilidad 5,000 usuarios  | El servicio de examenes escala horizontalmente de forma independiente                      |
| EaC-02 Disponibilidad 99.9%          | Cada microservicio tiene redundancia propia; un fallo no compromete el sistema completo    |
| EaC-03 Seguridad auditoria inmutable | Los eventos de auditoria se registran de forma asincrona e inmutable en el bus de mensajes |
| EaC-04 Integracion con CSV legacy    | Un microservicio de integracion dedicado por universidad maneja cada protocolo y formato   |
| EaC-05 Rendimiento motor adaptativo  | El motor de examenes es un servicio aislado, sin dependencias que puedan degradarlo        |
| EaC-08 Agregar nuevo protocolo       | Se agrega un nuevo adaptador sin modificar los servicios existentes                        |
| R-02 Open Source                     | Todos los componentes seleccionados tienen alternativas Open Source viables                |
| R-03 On-premise                      | Los microservicios se contendorizan con Docker y se orquestan con Kubernetes on-premise    |
| R-04 Migracion a nube                | La contenedorizacion permite mover los servicios a cualquier proveedor cloud sin rediseno  |

---

# 6. Vistas Arquitectonicas - Nivel de Sistema

## 6.1 Diagrama de bloques

![Diagrama de bloques](imagenes/DiagramadeBloques.png)

## 6.2 Descripcion del diagrama de bloques

El diagrama representa la arquitectura del PRCCD organizada en tres zonas funcionales.

**Zona de integracion**

A la izquierda se ubican las tres universidades piloto: USAC, UCR y UES. Cada una se conecta a la Capa de Integracion Universitaria, que es el unico punto de entrada al sistema para instituciones externas. Esta capa traduce los distintos protocolos de autenticacion (LDAP, SAML, OAuth2) y formatos de datos (JSON, XML, CSV) a un formato interno estandarizado, de modo que cada universidad puede seguir operando con sus propios sistemas sin modificarlos.

**Zona de procesamiento**

En el centro opera el nucleo del negocio. El Motor de Evaluacion Adaptativa recibe al candidato, gestiona el examen en tiempo real y ajusta la dificultad de las preguntas segun las respuestas previas. La comunicacion con el candidato es bidireccional: el motor le presenta preguntas y recibe sus respuestas de forma continua durante la evaluacion. Al aprobar, el Servicio de Certificacion genera el certificado digital con respaldo criptografico mediante PKI o Blockchain. El Servicio de Analitica consume eventos del bus para construir los dashboards destinados a los ministerios, asegurando que los datos expuestos sean siempre agregados y anonimizados.

**Zona de eventos y persistencia**

A la derecha el Bus de Eventos actua como columna vertebral asincrona del sistema. Recibe eventos del motor de examenes y del servicio de certificacion, y los distribuye al Servicio de Auditoria Inmutable y al Almacenamiento Seguro de Evidencia Antifraude. Este diseno garantiza que ninguna accion relevante pueda modificarse o eliminarse, cumpliendo con el requisito de retencion de 5 anos establecido por el GDPR y las legislaciones locales.

Los Ministerios de Educacion y Trabajo acceden al sistema por dos vias: a traves del Servicio de Analitica para consultar dashboards con metricas regionales, y a traves del Servicio de Auditoria para verificar la validez de certificados emitidos.

---

# 7. Vistas Arquitectonicas - Nivel de Infraestructura

## 7.1 Diagrama de componentes

![Diagrama de componentes](imagenes/componentes_uml.png)

## 7.2 Diagrama de despliegue

![Diagrama de despliegue](imagenes/despliegue_uml.png)

## 7.3 Diagrama de distribucion

![Diagrama de distribucion](imagenes/distribucion_uml.png)

## 7.4 Justificacion de tecnologias y frameworks

| Tecnologia         | Rol en el sistema                      | Justificacion                                                                                                                                   |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Docker             | Contenedorizacion de microservicios    | Permite desplegar cada servicio de forma independiente on-premise y facilita la migracion a nube sin redisenar la arquitectura (R-03, R-04)     |
| Kubernetes         | Orquestacion de contenedores           | Gestiona el escalado automatico de servicios durante los picos de la primera semana del mes (EaC-01)                                            |
| Kafka              | Bus de eventos                         | Maneja grandes volumenes de mensajes de forma asincrona, garantiza que los eventos de auditoria no se pierdan ni se modifiquen (EaC-03, EaC-07) |
| Nginx              | Balanceador de carga                   | Distribuye el trafico entre instancias durante los picos de certificacion. Open Source y ampliamente probado en produccion (R-02)               |
| PostgreSQL         | Base de datos relacional               | Almacena usuarios, certificados y registros de auditoria. Open Source, robusto y con soporte de transacciones ACID (R-02)                       |
| MongoDB            | Base de datos documental               | Almacena las preguntas y resultados de examenes por su estructura flexible y variable (R-02)                                                    |
| Hyperledger Fabric | Blockchain para certificados           | Implementa el registro distribuido e inmutable de certificados emitidos con validez juridica transfronteriza (RF-04, R-07)                      |
| Keycloak           | Gestion de identidad federada          | Maneja autenticacion con LDAP, SAML y OAuth2 desde un solo punto sin obligar a las universidades a cambiar sus sistemas (RF-01, R-08)           |
| MinIO              | Almacenamiento de evidencia antifraude | Almacenamiento de objetos Open Source compatible con politicas WORM para retencion inmutable de 5 anos (R-06)                                   |

---

# 8. Diseño de Datos
---

# DER
![Flujo autenticacion federada UES](imagenes/DER.png)

## 8.1 Entidades principales del modelo de datos

El modelo de datos del PRCCD se derive directamente de los servicios definidos en el diagrama de distribucion: Servidor de Base de Datos (PostgreSQL y MongoDB), Servidor PKI, y Servidor de Almacenamiento Antifraude (MinIO). Se identificaron 14 entidades agrupadas en cinco dominios funcionales.

### Dominio de identidad y acceso

| Entidad | Atributos principales | Descripcion |
|---|---|---|
| Usuario | id (PK), nombre, apellido, email, hashContrasena, fechaCreacion, estado, institucionId (FK) | Toda persona con acceso al sistema: candidatos, administradores y personal ministerial. |
| Rol | id (PK), nombre, descripcion | Niveles de acceso: candidato, evaluador, administrador institucional, administrador SICA, analista ministerial. |
| Permiso | id (PK), recurso, accion | Accion concreta que un rol puede ejecutar sobre un recurso del sistema. |
| RolPermiso | rolId (FK), permisoId (FK) | Relacion muchos a muchos entre roles y permisos. |
| Institucion | id (PK), nombre, pais, protocoloAuth, endpointAuth, formatoDatos, activa | Registra cada universidad con su protocolo de autenticacion (LDAP, SAML, OAuth2) y formato de datos. |

### Dominio de evaluacion

| Entidad | Atributos principales | Descripcion |
|---|---|---|
| Evaluacion | id (PK), titulo, descripcion, competencia, periodoInicio, periodoFin, estado, dificultadBase | Examen disponible durante la primera semana del mes. El campo estado controla la habilitacion del periodo de certificacion (RF-12). |
| Pregunta | id (PK), evaluacionId (FK), enunciado, tipo, nivelDificultad, parametroIRT_a, parametroIRT_b, parametroIRT_c | Pregunta del banco con parametros IRT (discriminacion, dificultad, adivinanza) usados por el motor adaptativo para ajuste en tiempo real (RF-02). |
| SesionExamen | id (PK), usuarioId (FK), evaluacionId (FK), fechaInicio, fechaFin, estado, puntajeFinal, aprobado, habilidadEstimada | Sesion activa de un candidato. El campo habilidadEstimada es actualizado por el algoritmo IRT tras cada respuesta (EaC-05). |
| Respuesta | id (PK), sesionId (FK), preguntaId (FK), contenido, esCorrecta, tiempoRespuestaMs, timestamp | Cada respuesta individual del candidato, con marca de tiempo para el motor adaptativo y para auditorias antifraude (RF-03). |

### Dominio de certificacion

| Entidad | Atributos principales | Descripcion |
|---|---|---|
| Certificado | id (PK), sesionId (FK), usuarioId (FK), competencia, institucionId (FK), fechaEmision, hashSHA256, firmaDigital, algoritmoFirma, serialPKI, hashBlockchain, estado, qrVerificacion | Certificado digital emitido tras la aprobacion. El hashSHA256 garantiza integridad del contenido. La firmaDigital provee no-repudio. El campo hashBlockchain almacena la referencia al registro en Hyperledger Fabric (RF-04, R-07). |
| RegistroAuditoria | id (PK), entidad, entidadId, accion, usuarioId, ipOrigen, timestamp, hashEvento, inmutable | Registro de toda accion relevante. El campo inmutable indica que la fila es de solo escritura: no admite UPDATE ni DELETE (RF-05, EaC-03). |

### Dominio de evidencia antifraude

| Entidad | Atributos principales | Descripcion |
|---|---|---|
| EvidenciaAntifraude | id (PK), sesionId (FK), usuarioId (FK), tipo, urlStorage, sizeBytes, hashArchivo, timestampCaptura, cifrado, retencionHasta | Metadatos de la evidencia almacenada en MinIO. El archivo fisico se guarda con cifrado AES-256 y politica WORM. El campo retencionHasta garantiza conservacion por 5 anos (RF-03, R-06). |

### Dominio analitico

| Entidad | Atributos principales | Descripcion |
|---|---|---|
| MetricaAgregada | id (PK), pais, carrera, genero, competencia, totalEvaluados, totalAprobados, tasaAprobacion, periodoMes, periodoAnio, generadaEn | Tabla de solo lectura poblada por el proceso de anonimizacion. Nunca contiene datos individuales identificables. Es la unica fuente de los dashboards ministeriales (RF-08, RF-09, EaC-06). |

---

## 8.2 Diseno del esquema: modelo hibrido relacional y documental

La arquitectura establece tres motores de persistencia conforme al diagrama de distribucion:

### PostgreSQL — datos transaccionales (Servidor de Base de Datos)

Almacena las entidades de identidad, evaluacion y certificacion: Usuario, Rol, Permiso, RolPermiso, Institucion, Evaluacion, SesionExamen, Respuesta, Certificado, RegistroAuditoria y MetricaAgregada.

**Justificacion:** Estas entidades tienen relaciones complejas y requieren integridad referencial y transacciones ACID. El esquema relacional permite consultas de trazabilidad completa desde un usuario hasta su certificado emitido, necesario para cumplir EaC-07 (tiempo de consulta de auditoria menor a 5 segundos) y EaC-03 (cero modificaciones no autorizadas en la bitacora).

### MongoDB — banco de preguntas (Servidor de Base de Datos)

El banco de preguntas de cada evaluacion se almacena en MongoDB como documentos JSON con los parametros IRT embebidos. Esto permite al motor adaptativo recuperar y filtrar preguntas por nivel de dificultad con latencia menor a 2 segundos sin necesidad de joins relacionales durante la evaluacion activa.

**Justificacion:** El esquema de preguntas varia segun el tipo (opcion multiple, verdadero/falso, codigo, respuesta libre). Un modelo documental flexible elimina columnas nulas y permite evolucionar el formato de pregunta sin migraciones de esquema, cumpliendo EaC-05 (tiempo de ajuste del motor menor a 2 segundos) y EaC-08 (agregar nuevo protocolo sin afectar otros modulos).

### MinIO — evidencia antifraude (Servidor de Almacenamiento Antifraude)

Los archivos fisicos de capturas de pantalla, rafagas de video y logs de tecleo se almacenan en MinIO con politica WORM (Write Once Read Many). Los metadatos se registran en la tabla EvidenciaAntifraude de PostgreSQL.

**Justificacion:** El almacenamiento de objetos binarios en una base de datos relacional elevaria significativamente el costo operativo. MinIO, como solucion Open Source compatible con S3, permite cifrado por objeto (AES-256), retencion configurable y politica de inmutabilidad a nivel de bucket. Cumple R-02 (Open Source), R-06 (retencion inalterable 5 anos) y R-05 (GDPR).

---

## 8.3 Estrategia de auditoria e inmutabilidad

El cumplimiento de R-06 (retencion 5 anos), R-07 (firma electronica avanzada) y EaC-03 (cero modificaciones no autorizadas) requiere una estrategia que va mas alla del diseno de tabla.

### Inmutabilidad a nivel de base de datos

La tabla RegistroAuditoria se configura con las siguientes restricciones en PostgreSQL:

- **Solo INSERT permitido:** se revoca el privilegio UPDATE y DELETE al usuario de aplicacion sobre esta tabla. Unicamente el usuario de sistema con privilegio de auditoria puede ejecutar INSERT.
- **Trigger de verificacion:** un trigger de PostgreSQL calcula el hashSHA256 de cada fila al momento de insercion y lo almacena en el campo hashEvento. Cualquier intento de modificacion posterior rompe la cadena de hashes y es detectable de inmediato.
- **Particionamiento mensual:** la tabla se particiona por mes. Las particiones del mes anterior se marcan como de solo lectura una vez cerrado el periodo, evitando modificaciones retroactivas.

### Retencion de evidencia biometrica

El Servidor de Almacenamiento Antifraude utiliza MinIO con politica de bucket configurada en modo WORM con retencion minima de 1,825 dias (5 anos). Ningun proceso de aplicacion puede eliminar objetos dentro del periodo de retencion, incluso con credenciales de administrador. El campo retencionHasta en EvidenciaAntifraude permite al sistema alertar antes de que venza la retencion legal.

### Cumplimiento normativo

| Requisito | Mecanismo implementado |
|---|---|
| GDPR — derecho al olvido | Campo estadoBorrado en tabla Usuario con borrado logico. Los datos personales se reemplazan por tokens anonimizados. El certificado permanece valido pero desvinculado del titular. |
| GDPR — retencion 5 anos | Politica WORM en MinIO y campo retencionHasta en EvidenciaAntifraude. |
| Ley de Acceso a la Informacion Publica de Guatemala | Los registros de auditoria son accesibles mediante API autenticada para entes regulatorios con rol autorizado. |
| Inmutabilidad de calificaciones | El campo puntajeFinal de SesionExamen es de solo escritura una vez que el estado cambia a CERRADA. Un trigger de base de datos rechaza cualquier UPDATE posterior. |

---

## 8.4 Estrategia de interoperabilidad

El PRCCD debe integrarse con USAC, UCR y UES sin obligar a ninguna institucion a modificar sus sistemas (R-08, RF-07). La estrategia se basa en el patron de microservicio adaptador por institucion, visible en el diagrama de componentes donde se definen los adaptadores USAC (LDAP), UCR (SAML) y UES (OAuth2/CSV).

### Microservicio adaptador por universidad

Cada universidad tiene un adaptador dedicado que actua como capa anticorrupcion entre el protocolo externo y el modelo interno del PRCCD:

| Adaptador | Universidad | Protocolo de autenticacion | Formato de datos soportado |
|---|---|---|---|
| Adaptador USAC | USAC | LDAP | JSON / CSV |
| Adaptador UCR | UCR | SAML 2.0 | XML |
| Adaptador UES | UES | OAuth2 | JSON / CSV |

Cada adaptador es responsable de tres funciones:

1. Traducir el protocolo de autenticacion externo a un token JWT interno valido para el API Gateway.
2. Transformar los datos academicos entrantes al formato canonico interno del PRCCD, independientemente de si llegan como JSON, XML o archivos planos CSV.
3. Exponer un endpoint de sincronizacion periodica que el sistema invoca para importar novedades academicas de cada institucion mediante Apache Camel como motor de integracion.

### Flujo de integracion de datos

![Integracion de datos PRCCD](imagenes/integracion_datos.png)


### Cumplimiento de drivers

| Driver | Como lo atiende esta estrategia |
|---|---|
| RF-06 (JSON/XML/CSV) | Cada adaptador implementa un parser especifico para el formato de su institucion. |
| RF-07 (integracion sin cambios) | Las universidades no modifican nada; el adaptador se conecta a sus endpoints existentes. |
| EaC-04 (CSV legacy) | El Adaptador USAC incluye un procesador de archivos planos con validacion de columnas y manejo de registros malformados. |
| EaC-08 (nuevo protocolo en menos de 2 semanas) | Agregar una nueva universidad implica crear un nuevo microservicio adaptador sin tocar los existentes. |

---

## 8.5 Autenticacion federada

El PRCCD implementa autenticacion federada mediante Keycloak como Identity Broker centralizado, tecnologia ya definida en la seccion 7.4. Keycloak actua como intermediario unico entre los tres protocolos universitarios y el sistema interno.

### Flujo por institucion

**USAC — LDAP:**
![Flujo autenticacion federada USAC](imagenes/auth_usac.png)

**UCR — SAML 2.0:**
![Flujo autenticacion federada UCR](imagenes/auth_ucr.png)

**UES — OAuth2:**
![Flujo autenticacion federada UES](imagenes/auth_ues.png)

### Resultado unificado

Independientemente de la institucion de origen, el sistema siempre trabaja con un Token JWT firmado por Keycloak que contiene: usuarioId, institucionId, rol y expiracion. El resto de microservicios del PRCCD no conocen el protocolo original de cada universidad; solo validan el JWT contra la llave publica de Keycloak. Esto cumple RF-01 y R-08 sin requerir cambios en los sistemas universitarios.

---
## 8.6 Estrategia de privacidad y cifrado

El cumplimiento del GDPR y las legislaciones locales (R-05) impone cuatro requisitos que la arquitectura de datos atiende de forma explicita.

### Cifrado en transito

Toda comunicacion entre componentes utiliza TLS 1.3. Esto aplica a:

- Conexiones externas: universidades hacia API Gateway, candidatos hacia API Gateway, ministerios hacia API Gateway.
- Comunicacion interna: entre microservicios dentro de la Red Interna SICA.
- Conexiones a base de datos: aplicaciones hacia PostgreSQL, aplicaciones hacia MongoDB.

### Cifrado en reposo

| Capa | Mecanismo | Estandar |
|---|---|---|
| PostgreSQL — datos transaccionales | Cifrado de columnas sensibles con pgcrypto | AES-256 |
| MinIO — evidencia antifraude | Cifrado por objeto en bucket | AES-256-SSE |
| Servidor PKI — llaves privadas CA | Cifrado de volumen del servidor | AES-256 |

### Derecho al olvido

El borrado de datos personales se implementa en dos fases:

1. **Fase 1 — Anonimizacion inmediata:** al recibir la solicitud, los campos identificables del Usuario (nombre, email, datos de contacto) se reemplazan por tokens no reversibles. El usuarioId permanece como referencia tecnica para mantener integridad referencial con certificados y registros de auditoria.
2. **Fase 2 — Purga programada:** una tarea programada verifica semanalmente si han vencido los periodos de retencion legal. Los certificados asociados a un usuario con solicitud de olvido se marcan como REVOCADO pero conservan el hashSHA256 y el hashBlockchain para permitir verificacion de autenticidad historica sin revelar identidad.

### Anonimizacion para dashboards

El proceso de anonimizacion ejecuta agregaciones sobre SesionExamen y Certificado antes de insertar filas en MetricaAgregada. Las reglas aplicadas son:

- Solo se exponen grupos con un minimo de 10 registros para evitar re-identificacion estadistica.
- Los campos de genero y carrera se aplican como dimensiones de agrupamiento, nunca como identificadores individuales.
- El servicio de analitica solo puede leer de MetricaAgregada, nunca directamente de tablas transaccionales, cumpliendo EaC-06 (cero datos personales identificables expuestos).

---

## 8.7 Certificados verificables: PKI con respaldo en Hyperledger Fabric

El enunciado establece que los certificados deben ser verificables criptograficamente mediante PKI o Blockchain (Hyperledger). La arquitectura del PRCCD implementa ambos en dos capas complementarias, alineadas con las tecnologias definidas en la seccion 7.4.

### Capa 1 — PKI con firma digital (Servidor PKI)

La capa base de firma utiliza el Servidor PKI dedicado. El proceso de emision es el siguiente:

1. El candidato aprueba el examen. El servicio de certificacion construye el payload con: identificador unico, nombre de la competencia, institucion, fecha de emision y puntaje obtenido.
2. Se genera el hash SHA-256 del payload. Esta huella garantiza que cualquier alteracion posterior al contenido sea detectable.
3. El Servidor PKI firma el hash con la llave privada de la CA del SICA utilizando RSA-2048 o ECDSA-P256.
4. Se emite el certificado en formato X.509, el estandar internacional de infraestructura de llave publica.
5. El candidato recibe el certificado con un codigo QR que apunta al endpoint de verificacion publica, donde cualquier tercero puede validar la autenticidad usando la llave publica de la CA del SICA (RF-10).

### Capa 2 — Registro inmutable en Hyperledger Fabric

Una vez emitido el certificado X.509, el Servicio de Certificacion publica el hashSHA256 del certificado en la red Hyperledger Fabric. Este registro distribuido actua como bitacora inmutable adicional que demuestra la existencia del certificado desde el momento de su emision.

El campo hashBlockchain en la tabla Certificado almacena la referencia a la transaccion en Hyperledger Fabric. Esto permite que ministerios y empresas verificadoras confirmen tanto la validez de la firma digital (via PKI) como la existencia historica del registro (via Hyperledger), satisfaciendo el requisito de validez juridica transfronteriza (R-07).

### Proceso completo de emision
![Flujo emision certificado PRCCD](imagenes/flujo_emision_certificado.png)

### Cumplimiento de drivers

| Driver | Como lo atiende esta estrategia |
|---|---|
| RF-04 (certificados verificables criptograficamente) | Firma digital sobre hash SHA-256 via PKI + registro en Hyperledger Fabric. |
| RF-05 (rastro de auditoria inmutable) | Registro en tabla RegistroAuditoria de solo INSERT y registro en blockchain. |
| RF-10 (verificacion externa por QR/hash) | Endpoint publico que valida firma contra llave publica CA del SICA. |
| R-02 (Open Source) | Keycloak (Apache 2.0), MinIO (AGPL), PostgreSQL (PostgreSQL License), Hyperledger Fabric (Apache 2.0). |
| R-07 (validez juridica transfronteriza) | X.509 reconocido internacionalmente; Hyperledger Fabric como registro distribuido adicional. |
| EaC-03 (cero modificaciones no autorizadas) | La firma digital hace detectable cualquier alteracion del certificado. El blockchain hace irrefutable la existencia del registro original. |
| EaC-07 (consulta de auditoria menor a 5 segundos) | Consulta indexada por certificadoId o hashSHA256 en PostgreSQL. |

---

# 9. Diseño de Interfaces UI/UX

### Definicion de perfiles de usuario y pantallas del sistema

* #### Candidato
  Usuario que realiza el proceso de inscripcion, autenticacion y evaluacion dentro de la plataforma.
  ##### Pantallas
  * Registro de usuario
  * Inicio de sesión federado
  * Dashboard del candidato
  * Selección de evaluación
  * Verificación de identidad
  * Ejecución de examen adaptativo
  * Visualización de resultados
  * Descarga de certificado
  * Historial de evaluaciones
  
* #### Administrador SICA
  Usuario encargado de administracion general de certificaciones, instituciones y configuraciones del sistema.
  ##### Pantallas
  * Inicio de sesión administrativo
  * Dashboard administrativo
  * Gestión de certificaciones
  * Gestión de usuarios
  * Gestión de instituciones
  * Gestión de evaluaciones
  * Auditoría y monitoreo
  * Configuración del sistema

* #### Universidad
  Institucion academica integrada al sistema federado para sincronizacion y validacion de informacion academica.
  ##### Pantallas
  * Inicio de sesión institucional
  * Dashboard universitario
  * Gestión de estudiantes
  * Validación de candidatos
  * Sincronización de datos académicos
  * Gestión de períodos académicos
  * Estado de integraciones
  * Reportes institucionales
  
* #### Ministerio/Dashboard General
  Entidad encargada de supervisar métricas nacionales, indicadores y estadisticas agregadas del sistema.
  ##### Pantallas
  * Dashboard gerencial
  * Métricas por país
  * Estadísticas por carrera universitaria
  * Indicadores por género
  * Reportes agregados y anonimizados
  * Visualización de tendencias
  * Exportación de reportes
  
* #### Auditor
  Usuario encargado de supervisar trazabilidad, integridad y cumplimiento de procesos dentro de la plataforma.
  ##### Pantalla
  * Inicio de sesión de auditoría
  * Dashboard de auditoría
  * Historial de certificaciones
  * Verificación de integridad
  * Validación de transacciones blockchain
  * Reportes de auditoría
  * Monitoreo de actividad

* #### Verificador Externo  
  Usuario externo encargado de validar la autenticidad de certificados emitidos por la plataforma.
  ##### Pantalla
  * Consulta de certificado
  * Escaneo de código QR
  * Verificación mediante hash o código
  * Estado de autenticidad
  * Visualización pública del certificado

---
## Prototipos de Interfaces UI/UX

![Diagrama de bloques](imagenes/prototipo01.png)

![Diagrama de bloques](imagenes/prototipo02.png)

![Diagrama de bloques](imagenes/prototipo03.png)

![Diagrama de bloques](imagenes/prototipo04.png)

---

# 10. Patrones de Diseño

### Patrón 1 — Strategy *(Comportamiento)*

**Descripción**  
 Es un patron de diseño de comportamiento que permite definir una familia de algoritmos, colocar cada uno de ellos en una clase separada y hacer sus objetos intercambiables.

**Aplicación en el proyecto**  
En el proyecto se aplica en el sistema de autentificacion federada para manejar los distintos protocolos universitarios como LDAP, SAML y Outh2.

**Justificación**  
Permite cambiar el metodo de autenticacion según la universidad sin modificar el nucleo del sistema. Facilitando agregar nuevas instituciones y reduce el acoplamiento. 

**Diagrama**
![diagrama de clases strategy](./imagenes/strategy.png)


### Patrón 2 — Adapter *(Estructural)*

**Descripción**  
Adapter es un patron de diseño estructural que permite la colaboracion entre objetos con interfaces incompatibles. Es decir que se puede crear un objeto especial que convierte la interfaz de un objeto, de forma que otro objeto pueda comprenderla.

**Aplicación en el proyecto**  
En el proyecto se implementa en los microservicios de integracion para transformar formatos externos (CSV, XML, JSON) al modelo canonico interno del PRCCD

**Justificación**  
Cada universidad maneja tecnologias, protocolos y formatos distintos. Adapter permite integrar esos sistemas al modelo interno del proyecto sin o+ pbligarlos a las instituciones a modificar su infraestructura existente. Ademas facilita el mantenimiento, la escalabilidad y la incorporacion de nuevas universidades o tecnologias futuras.

**Diagrama**
![diagrama de clases adapter](./imagenes/adapter.png)

### Patrón 3 — Decorator *(Estructural)*

**Descripción**  
Es un patron de diseño estructural que permite añadir funcionalidades a objetos colocando estos objetos dentro de objetos encapsuladores especiales que contienen estas funcionalidades.

**Aplicación en el proyecto**  
Se usa en el modulo de analitica para aplicar capas de anonimizacion y transformacion a los datos antes de mostrar en dashboards ministeriales.

**Justificación**  
Permite agregar reglas de privacidad de formam modular y combinable, evitando clases monoliticas y facilitando extensiones.

**Diagrama**
![diagrama de clases decorator](./imagenes/decorator.png)

### Patrón 4 — Facade *(Estructural)*

**Descripción**  
Es un patron de diseño estructural que proporciona una interfaz simplificada a una biblioteca, un framework o cualquier otro grupo complejo de clases.

**Aplicación en el proyecto**  
se utiliza en el proceso de emision de certificados, coordinando servicios como PKI, blockchain, auditoria y notificaciones.

**Justificación**  
Simplifica el acceso a un flujo complejo, reduciendo el acoplamiento entre el controlador y multiples servicios internos.

**Diagrama**
![diagrama facade](./imagenes/facade.png)

### Patrón 5 — Chain of Responsability *(Comportamiento)*

**Descripción**  
Es un patron de diseño de comportamiento que permite pasar solicitudes a lo largo de una cadena de manejadores. Al recibir una solicitud, cada manejador decide si la procesa o si la pasa al siguiente manejador de la cadena.

**Aplicación en el proyecto**  
Se implementa en el flujo de validacion previo al acceso de examenes, verificando JWT, periodo activo y restricciones antifraude antes de permitir el ingreso del usuario.

**Justificación**  
Cada validacion se mantiene independiente y desacoplada, facilitando agregar o modificar reglas sin afectar el resto del flujo principal de validacion.

**Diagrama**
![chain of responsability](./imagenes/chain.png)
---

# 11. Gestion del Proyecto

> *Tablero Kanban: https://trello.com/b/XWZkVwXY*

> *Repositorio: AYD2\_A\_1S2026\_PROYECTO\_G6*
> 

---

## 11.1 Control de Versiones y Flujo Git Flow

Para el desarrollo de la fase uno del proyecto se utilizará una estrategia de ramas basada en Git Flow, con el objetivo de mantener un control ordenado de los cambios, separar el trabajo de cada integrante y asegurar que la documentación avance de forma controlada, revisable y coherente.

### Ramas principales

#### main

La rama `main` representa la versión estable y final del proyecto. En esta rama solo se integrarán entregables revisados, aprobados y listos para ser presentados. No se debe trabajar directamente sobre esta rama.

#### release

La rama `release` se utilizará para preparar versiones candidatas de entrega. En esta rama se realizarán ajustes finales de redacción, formato, numeración, referencias internas y validación general antes de integrar los cambios a `main`.

#### develop

La rama `develop` será la rama principal de integración del trabajo del equipo. Todas las ramas de tipo `feature` deberán partir desde `develop` y, al finalizar una tarea, deberán integrarse nuevamente mediante Pull Request.

#### docs

La rama `docs` se utilizará como rama de integración específica para la documentación del proyecto. En esta rama se consolidarán los avances documentales antes de integrarlos a ramas principales del flujo de trabajo.

### Ramas de trabajo para documentación

Para cada tarea específica de documentación se utilizarán ramas con el formato `feature/docs-*`. Estas ramas deberán crearse a partir de `develop` o de `docs`, según la organización definida por el equipo.

Ejemplos de ramas:

- `feature/docs-gitflow`
- `feature/docs-kanban`
- `feature/docs-stakeholders`
- `feature/docs-arquitectura`
- `feature/docs-revision`
- `feature/docs-consolidacion`

### Regla de commits

Cada commit deberá utilizar el siguiente formato:

`carnet: mensaje del cambio`

Ejemplo:

`201801391: documentar flujo git flow para la fase uno`

El mensaje del commit debe ser claro, breve y representar el cambio realizado. No se deben utilizar mensajes genéricos como “cambios”, “avance” o “documento final”.

### Flujo de trabajo

El flujo de trabajo será el siguiente:

1. Actualizar la rama base con los últimos cambios del repositorio remoto.
2. Crear una rama `feature/docs-*` para la tarea asignada.
3. Realizar los cambios correspondientes en la documentación, diagramas o evidencias.
4. Confirmar los cambios mediante commits con el formato establecido.
5. Subir la rama al repositorio remoto.
6. Crear un Pull Request hacia `docs` o `develop`, según corresponda.
7. Solicitar revisión de al menos un integrante del equipo.
8. Corregir observaciones si existieran.
9. Integrar los cambios mediante merge.
10. Eliminar la rama `feature` una vez integrada.

### Criterios para integrar cambios

Una rama podrá integrarse cuando cumpla con los siguientes criterios:

- La sección asignada está completa.
- El contenido está alineado con el enunciado del proyecto.
- No existen conflictos con otras secciones.
- El formato es consistente con el documento principal.
- El commit respeta el formato definido.
- El Pull Request fue revisado por otro integrante del equipo.
