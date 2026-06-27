# SCRUM - Fase 3 Final

**Proyecto:** Plataforma Regional de Certificacion de Competencias Digitales - PRCCD/SICA  
**Grupo:** 6 - Seccion A - 1S2026  
**Sprint:** Fase 3 Final  
**Periodo:** 22/06/2026 - 26/06/2026  
**Responsable SCRUM:** Luis Fernando Gomez Rendon - 201801391  
**Rama Git Flow:** `feature/scrum-f3`  
**Tarea:** F3-53 - Sprint Backlog formal Fase 3 + captura inicial Kanban en SCRUM.md

## Objetivo del sprint

Cerrar la Fase 3 del MVP PRCCD/SICA integrando mejoras de arquitectura, eventos asincronos con Kafka, notificaciones, voz a texto, pruebas automatizadas, CI/CD, dashboard actualizado, verificacion publica y evidencia formal de gestion agil. El foco del sprint es entregar un sistema mas operable, verificable y defendible tecnicamente.

## Roles del equipo

| Integrante | Carnet | Rol operativo Fase 3 | Responsabilidad principal |
|---|---:|---|---|
| Luis Fernando Gomez Rendon | 201801391 | Scrum Master + Frontend/Testing | Coordinar tablero, trazabilidad, dashboard F3, setup Jest, README evolutivo y evidencias SCRUM. |
| Ander Gilberto Popol Poron | 201801518 | Product Owner + Arquitectura | Priorizacion, DDA F3, retrospectiva, feedback F2 y coherencia con requisitos del caso. |
| Jencer Hamilton Hernandez Alonzo | 202002141 | Backend/Testing | Voz a texto, motor adaptativo, pruebas unitarias e integracion funcional. |
| Oswaldo Antonio Choc Cuteres | 201901844 | Infraestructura/CI-CD | Kafka, docker-compose, nginx, CI/CD, despliegue y ambientes. |
| Javier Andres Monjes Solorzano | 202100081 | Backend/Integracion | Kafka topics, servicios internos HTTP, certificados, notificaciones y MinIO. |
| Juan Jose Gerardi Hernandez | 201900532 | Frontend/UI-UX | Verificador publico, vistas moviles, certificado, voz y correcciones de UX. |

## Definition of Ready

Una tarjeta se considera lista para iniciar cuando cumple:

| Criterio | Descripcion |
|---|---|
| Alcance claro | La tarea tiene modulo, responsable, apoyo, rama Git y commit sugerido. |
| Driver asociado | La tarea esta vinculada a RF, EaC, gestion agil o trazabilidad academica. |
| Entrada tecnica disponible | Existen endpoints, contratos, diseno, captura, documento o servicio base requerido. |
| Criterio de validacion | Se conoce como demostrar que la tarea esta completa: prueba, build, captura, video o PR. |

## Definition of Done

Una tarjeta se considera terminada cuando cumple:

| Criterio | Descripcion |
|---|---|
| Codigo o documento integrado | El cambio existe en la rama correspondiente y esta versionado. |
| Validacion ejecutada | Se ejecuto build, test, revision documental o evidencia aplicable. |
| Trazabilidad visible | La tarea puede rastrearse por rama, commit, PR o captura del tablero. |
| Sin bloqueo conocido | No quedan dependencias criticas sin registrar en Kanban. |
| Evidencia disponible | Existe captura, video, resultado de prueba o documento de soporte. |

## Flujo Kanban obligatorio

El tablero Trello del equipo mantiene las columnas obligatorias:

| Columna | Uso |
|---|---|
| To Do | Tareas priorizadas pendientes de iniciar. |
| Blocked | Tareas detenidas por dependencia tecnica, acceso, ambiente o decision pendiente. |
| In Progress | Trabajo activo en desarrollo o documentacion. |
| Ready for Testing | Tareas listas para revision funcional, tecnica o documental. |
| Test/QA | Validacion formal, pruebas, demo o revision cruzada. |
| Done | Tareas cerradas con evidencia suficiente. |

## Captura inicial del tablero Kanban Fase 3

Las siguientes capturas evidencian el estado inicial de planificacion y distribucion del tablero para la Fase 3. Se observan tarjetas F3 en To Do, Ready for Testing y Done, manteniendo las columnas obligatorias del flujo SCRUM/Kanban.

![Kanban Fase 3 - Vista inicial izquierda](kanban_fase3_planificacion_01.png)

![Kanban Fase 3 - Vista inicial derecha](kanban_fase3_planificacion_02.png)

## Resumen del tablero al momento de captura

| Columna | Cantidad observada | Lectura SCRUM |
|---|---:|---|
| To Do | 40 | Backlog pendiente para cierre de Fase 3, incluyendo CI/CD, pruebas y documentacion final. |
| Blocked | 0 | No se observan bloqueos formales en la captura. |
| In Progress | 0 | No habia tarjetas activas en desarrollo al momento de la captura. |
| Ready for Testing | 15 | Existen entregables listos para validacion tecnica. |
| Test/QA | 0 | No habia pruebas formalmente en ejecucion al momento de la captura. |
| Done | 93 | El tablero conserva evidencia acumulada de tareas completadas de fases anteriores y avances integrados. |

## Sprint Backlog formal Fase 3

| ID | Modulo | Tarea tecnica | Tipo | Responsable | Apoyo | Rama Git | Driver / EaC | Estado inicial |
|---|---|---|---|---|---|---|---|---|
| F3-01 | Hotfix | Quitar authMiddleware de GET /api/certificate/verify; debe ser publico sin token. | Hotfix | Javier 202100081 | Oswaldo | `hotfix/public-verify-endpoint` | RF-10, EaC-accesibilidad | To Do |
| F3-02 | Hotfix | Actualizar pantalla verificador externo: remover redirect a login si no hay sesion. | Hotfix | Juan Jose 201900532 | Javier | `hotfix/public-verify-endpoint` | RF-10, UX | To Do |
| F3-03 | Kafka | Agregar servicio Kafka KRaft al docker-compose sin Zookeeper, puerto 9092 y healthcheck. | Infra | Oswaldo 201901844 | Javier | `feature/infra-kafka` | EaC-escalabilidad | To Do |
| F3-04 | Kafka | Definir topics.js compartido: examen.completado, certificado.emitido y fraude.detectado. | Backend | Javier 202100081 | Oswaldo | `feature/kafka-topics` | EaC-interoperabilidad | To Do |
| F3-05 | Kafka | Producer Kafka en examen-service para evento examen.completado. | Backend | Javier 202100081 | Oswaldo | `feature/kafka-examen` | EaC-asincronismo | To Do |
| F3-06 | Kafka | Producer Kafka en certificado-service para evento certificado.emitido. | Backend | Javier 202100081 | Oswaldo | `feature/kafka-certificado` | EaC-asincronismo | To Do |
| F3-07 | Kafka | Producer Kafka en telemetria-service para evento fraude.detectado. | Backend | Javier 202100081 | Jencer | `feature/kafka-telemetria` | EaC-seguridad | To Do |
| F3-08 | HTTP inter-svc | Migracion SQL: agregar campo email a candidatos. | Backend | Javier 202100081 | Oswaldo | `feature/http-intersvc` | RF-notificaciones | To Do |
| F3-09 | HTTP inter-svc | Actualizar candidato.model.js en auth-service e ingesta-service con email. | Backend | Javier 202100081 | Oswaldo | `feature/http-intersvc` | RF-notificaciones | To Do |
| F3-10 | HTTP inter-svc | Crear serviceClient.js reutilizable con axios y JWT SERVICE. | Backend | Javier 202100081 | Oswaldo | `feature/http-intersvc` | EaC-seguridad | To Do |
| F3-11 | HTTP inter-svc | Endpoint interno GET /api/auth/candidatos/:id en auth-service. | Backend | Oswaldo 201901844 | Javier | `feature/http-intersvc` | EaC-encapsulamiento | To Do |
| F3-12 | HTTP inter-svc | Reemplazar SELECT cruzado en certificado-service por llamadas HTTP. | Backend | Javier 202100081 | Oswaldo | `feature/http-intersvc` | EaC-mantenibilidad | To Do |
| F3-13 | HTTP inter-svc | Reemplazar lecturas cruzadas en telemetria-service por HTTP a examen/auditoria. | Backend | Javier 202100081 | Oswaldo | `feature/http-intersvc` | EaC-mantenibilidad | To Do |
| F3-14 | HTTP inter-svc | Endpoints internos stats para ingesta y examen. | Backend | Oswaldo 201901844 | Javier | `feature/http-intersvc` | RF-analitica | To Do |
| F3-15 | HTTP inter-svc | Endpoint PATCH /api/examen/sesion/:id/suspender. | Backend | Jencer 202002141 | Oswaldo | `feature/http-intersvc` | EaC-encapsulamiento | To Do |
| F3-16 | HTTP inter-svc | Dashboard-service consume ingesta y examen por HTTP interno. | Backend | Javier 202100081 | Oswaldo | `feature/http-intersvc` | EaC-mantenibilidad | To Do |
| F3-17 | Notificaciones | Scaffold notificaciones-service en puerto 3008. | Backend | Oswaldo 201901844 | Javier | `feature/notificaciones-svc` | RF-notificaciones | To Do |
| F3-18 | Notificaciones | Implementar mailer.js con Ethereal para desarrollo y SMTP configurable. | Backend | Oswaldo 201901844 | Javier | `feature/notificaciones-svc` | RF-notificaciones | To Do |
| F3-19 | Notificaciones | Consumer Kafka y handler certificadoEmitido. | Backend | Javier 202100081 | Oswaldo | `feature/notificaciones-svc` | RF-notificaciones | To Do |
| F3-20 | Notificaciones | Handler fraudeDetectado con alerta a auditores SICA. | Backend | Javier 202100081 | Oswaldo | `feature/notificaciones-svc` | EaC-seguridad | To Do |
| F3-21 | Notificaciones | Integrar notificaciones-service a docker-compose y nginx.conf. | Infra | Luis 201801391 | Oswaldo | `feature/notificaciones-svc` | EaC-integracion | To Do |
| F3-22 | Voz a texto | Actualizar DDA con estilo Pipes and Filters para flujo audio. | Arquitectura | Ander 201801518 | Luis | `feature/dda-voz` | RF-voz, EaC-adaptabilidad | To Do |
| F3-23 | Voz a texto | Scaffold voz-service y endpoint POST /api/voz/transcribir. | Backend | Jencer 202002141 | Javier | `feature/voz-service` | RF-voz, EaC-latencia | To Do |
| F3-24 | Voz a texto | Integrar Web Speech API o Whisper en voz-service. | Backend | Jencer 202002141 | Javier | `feature/voz-service` | RF-voz | To Do |
| F3-25 | Voz a texto | Conectar salida de voz-service al motor adaptativo. | Backend | Jencer 202002141 | Oswaldo | `feature/voz-service` | RF-voz, RF-evaluacion | To Do |
| F3-26 | Frontend voz | UI movil con toggle voz/texto, grabacion y visualizador audio. | Frontend | Juan Jose 201900532 | Jencer | `feature/ui-voz` | RF-voz, EaC-usabilidad | To Do |
| F3-27 | Frontend voz | Mostrar transcripcion con Confirmar y Repetir. | Frontend | Juan Jose 201900532 | Jencer | `feature/ui-voz` | RF-voz, UX | To Do |
| F3-28 | Frontend voz | Adaptar layout de examen para pantallas pequenas. | Frontend | Juan Jose 201900532 | Ander | `feature/ui-voz` | RF-voz, EaC-usabilidad | To Do |
| F3-29 | Frontend F3 | Pantalla verificador publico sin login, campo hash/codigo/QR scanner. | Frontend | Juan Jose 201900532 | Javier | `feature/ui-verificador-publico` | RF-10, EaC-accesibilidad | To Do |
| F3-30 | Frontend F3 | Resultado de verificacion publico sin exponer PII. | Frontend | Juan Jose 201900532 | Ander | `feature/ui-verificador-publico` | RF-10, EaC-privacidad | To Do |
| F3-31 | Frontend F3 | Toast/banner cuando certificado es emitido. | Frontend | Ander 201801518 | Juan Jose | `feature/ui-notificaciones` | RF-notificaciones, UX | To Do |
| F3-32 | Frontend F3 | Alerta visual de fraude en panel admin. | Frontend | Ander 201801518 | Juan Jose | `feature/ui-notificaciones` | RF-auditoria, UX | To Do |
| F3-33 | Frontend F3 | Dashboard con nuevos datos de Fase 3. | Frontend | Luis 201801391 | Juan Jose | `feature/ui-dashboard-f3` | RF-analitica, EaC-usabilidad | To Do |
| F3-34 | Frontend F3 | Indicador de estado pipeline CI/CD: Staging vs Produccion. | Frontend | Luis 201801391 | Juan Jose | `feature/ui-dashboard-f3` | EaC-operabilidad | To Do |
| F3-35 | Frontend F3 | Pantalla certificado con boton Compartir verificacion. | Frontend | Juan Jose 201900532 | Ander | `feature/ui-certificado-f3` | RF-10, UX | To Do |
| F3-36 | Frontend F3 | Aplicar correcciones de feedback Fase 2 en vistas existentes. | Frontend | Ander 201801518 | Juan Jose | `feature/ui-feedback-f2` | EaC-usabilidad | To Do |
| F3-37 | CI/CD | Fase Test: npm test en paralelo con matrix strategy. | CI/CD | Javier 202100081 | Oswaldo | `feature/cicd-pipeline` | EaC-calidad | To Do |
| F3-38 | CI/CD | Fase Build: construir imagenes Docker y publicar en GHCR. | CI/CD | Oswaldo 201901844 | Luis | `feature/cicd-pipeline` | EaC-automatizacion | To Do |
| F3-39 | CI/CD | Configurar Staging y Produccion en nube. | CI/CD | Oswaldo 201901844 | Javier | `feature/cicd-pipeline` | EaC-multi-entorno | To Do |
| F3-40 | CI/CD | GitHub Secrets por entorno. | CI/CD | Oswaldo 201901844 | Javier | `feature/cicd-pipeline` | EaC-seguridad | To Do |
| F3-41 | CI/CD | Deploy automatico a Staging y Produccion con approval gate. | CI/CD | Oswaldo 201901844 | Luis | `feature/cicd-pipeline` | EaC-automatizacion | To Do |
| F3-42 | Pruebas | Setup Jest y script npm test en servicios. | Testing | Luis 201801391 | Ander | `feature/tests-unit` | EaC-calidad | To Do |
| F3-43 | Pruebas | Cinco pruebas unitarias Jest para adaptadores y motor. | Testing | Jencer 202002141 | Javier | `feature/tests-unit` | EaC-calidad | To Do |
| F3-44 | Pruebas | Video integracion: audio -> voz-service -> motor. | Testing | Jencer 202002141 | Ander | `feature/tests-integracion` | EaC-calidad | To Do |
| F3-45 | Pruebas | Video integracion: certificado -> Kafka -> email candidato. | Testing | Jencer 202002141 | Luis | `feature/tests-integracion` | EaC-calidad | To Do |
| F3-46 | Pruebas | Video integracion: fraude -> Kafka -> alerta auditor. | Testing | Jencer 202002141 | Ander | `feature/tests-integracion` | EaC-calidad | To Do |
| F3-47 | Pruebas | Video aceptacion: examen voz -> certificado -> email -> verify publico. | Testing | Luis 201801391 | Todos | `feature/tests-aceptacion` | EaC-calidad, RF completo | To Do |
| F3-48 | MinIO | Actualizar limite multer de 50MB a 200MB. | Backend | Javier 202100081 | Oswaldo | `feature/minio-video` | RF-auditoria | To Do |
| F3-49 | MinIO | Crear contrato de captura de evidencia para frontend. | Documentacion | Juan Jose 201900532 | Javier | `feature/minio-video` | EaC-interoperabilidad | To Do |
| F3-50 | DDA | ARQUITECTURA.md: Kafka, pendientes resueltos y verify publico. | Documentacion | Ander 201801518 | Javier | `feature/dda-f3` | EaC-mantenibilidad | To Do |
| F3-51 | DDA | API_ENDPOINTS.md con endpoints nuevos F3. | Documentacion | Ander 201801518 | Javier | `feature/dda-f3` | EaC-mantenibilidad | To Do |
| F3-52 | DDA | README.md: evolucion documental Fase1 -> Fase2 -> Fase3. | Documentacion | Luis 201801391 | Ander | `feature/dda-f3` | Trazabilidad academica | To Do |
| F3-53 | SCRUM | Sprint Backlog formal Fase 3 + captura inicial Kanban. | SCRUM | Luis 201801391 | Todos | `feature/scrum-f3` | Gestion agil | To Do |
| F3-54 | SCRUM | Daily Standups diarios de todos los integrantes. | SCRUM | Luis 201801391 | Todos | `feature/scrum-f3` | Gestion agil | To Do |
| F3-55 | SCRUM | Sprint Retrospective individual y Burndown Chart Fase 3. | SCRUM | Ander 201801518 | Luis | `feature/scrum-f3` | Gestion agil | To Do |
| F3-56 | SCRUM | Aplicar feedback Fase 2: corregir DDA y diagramas. | SCRUM | Ander 201801518 | Todos | `feature/feedback-f2` | Retroalimentacion | To Do |

## Riesgos y dependencias de sprint

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Docker/WSL no disponible en todas las maquinas | Puede retrasar la validacion local completa del ecosistema. | Usar pruebas unitarias, CI/CD y ejecucion en una maquina con Docker operativo. |
| Conflictos entre ramas de frontend y backend | Puede bloquear PRs hacia develop. | Integrar develop frecuentemente y resolver conflictos antes de solicitar merge. |
| Dependencias entre Kafka, notificaciones y certificados | Puede afectar pruebas de integracion. | Validar primero productores/consumidores con eventos mockeados y luego con docker-compose. |
| Evidencia final incompleta | Puede afectar defensa del sprint. | Mantener capturas, videos, resultados de pruebas y commits asociados a cada tarea. |

## Cierre SCRUM esperado

El sprint se considerara cerrado cuando las tareas criticas de Fase 3 esten integradas en `develop`, las evidencias SCRUM esten versionadas, las pruebas automaticas esten ejecutadas y el tablero Kanban refleje el estado real del trabajo. Este documento funciona como evidencia formal de planificacion y control del sprint.
