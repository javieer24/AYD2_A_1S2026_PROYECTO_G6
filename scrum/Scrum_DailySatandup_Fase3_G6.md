# PRCCD – SICA
## Documentación Scrum: Daily Standup y Refinamiento Arquitectónico Diario
### Proyecto Fase 3 – Evolución Arquitectónica, CI/CD, Voz y Notificaciones

**Universidad de San Carlos de Guatemala**  
**Facultad de Ingeniería – Escuela de Ciencias y Sistemas**  
**Análisis y Diseño de Sistemas 2, Sección A**  
**Escuela de Vacaciones, Junio 2026**

---

## 1. Propósito del documento

Este documento registra la aplicación de Scrum durante la **Fase 3** del proyecto **Plataforma Regional de Certificación de Competencias Digitales (PRCCD) para el Sistema de la Integración Centroamericana (SICA)**. Su objetivo es dejar evidencia de los Daily Standups realizados por el equipo y del refinamiento arquitectónico aplicado durante la evolución final del MVP.

En esta fase, el trabajo dejó de centrarse únicamente en construir el MVP base y pasó a fortalecerlo con capacidades de cierre técnico: verificación pública sin autenticación, comunicación asíncrona con Kafka, servicio transversal de notificaciones, procesamiento de respuestas por voz, pruebas automatizadas, despliegue multi-entorno mediante CI/CD, actualización del Documento de Decisión de Arquitectura y preparación de evidencias para calificación.

Los Daily Standups permitieron mantener alineado el trabajo técnico de los seis integrantes, revisar dependencias entre servicios y validar que cada tarea respondiera directamente a los nuevos requerimientos de la Fase 3 y al feedback recibido en Fase 2.

---

## 2. Objetivos de los Daily Standups

- Revisar diariamente el avance de las tareas F3 comprometidas en el Sprint Backlog.
- Identificar dependencias entre Kafka, notificaciones, voz, frontend, CI/CD, pruebas y documentación arquitectónica.
- Detectar impedimentos técnicos que pudieran afectar atributos de calidad como mantenibilidad, seguridad, disponibilidad, rendimiento y trazabilidad.
- Asegurar que los cambios de Fase 3 no rompieran los flujos funcionales consolidados en Fase 2.
- Mantener evidencia clara para Scrum: Daily Standups, Kanban, tareas, responsables, bloqueos y planes inmediatos.
- Coordinar el cierre de entregables técnicos y documentales para la calificación.

---

## 3. Organización de trabajo y responsabilidades

| Integrante | Rol principal | Responsabilidad durante la Fase 3 |
|---|---|---|
| Luis Fernando Gómez Rendón | Scrum Master / Frontend / Testing | Seguimiento del tablero Kanban, documentación Scrum, integración del servicio de notificaciones en Docker/Nginx, actualización del dashboard, configuración de pruebas, prueba de aceptación y README evolutivo. |
| Ander Gilberto Popol Porón | Product Owner / Frontend / Documentación arquitectónica | Validación del alcance de Fase 3, actualización del DDA para voz y feedback de Fase 2, correcciones UX, alertas visuales, retrospectiva y trazabilidad de cambios. |
| Jencer Hamilton Hernández Alonzo | Backend motor / Voz / Testing | Implementación del voz-service, integración Speech-to-Text con el motor adaptativo, endpoint de suspensión de sesión, pruebas unitarias e integración documentada. |
| Oswaldo Antonio Choc Cuteres | Backend infraestructura / CI/CD | Configuración de Kafka KRaft, endpoints internos, notificaciones-service, mailer SMTP, build de imágenes Docker, entornos Staging/Producción y variables seguras. |
| Javier Andrés Monjes Solórzano | Backend integración / Seguridad / CI/CD Test | Hotfix del verificador público, contratos Kafka, producers, serviceClient con JWT SERVICE, eliminación de lecturas cruzadas, handlers de notificaciones, fase Test del pipeline y ajustes de MinIO. |
| Juan José Gerardi Hernández | Frontend Lead / UI móvil / Evidencia | Hotfix de verificador externo, interfaz móvil para respuestas por voz, pantalla pública de verificación, resultado sin PII, botón de compartir verificación y soporte de captura MediaRecorder. |

---

## 4. Dinámica aplicada

Cada Daily Standup se organizó alrededor de tres preguntas:

1. ¿Qué componente, servicio, módulo o patrón arquitectónico se implementó o refinó desde el Daily anterior?
2. ¿Qué impedimento, dependencia técnica o riesgo de integración se identificó?
3. ¿Qué actividad se realizará a continuación para mantener trazabilidad con los drivers, atributos de calidad o restricciones del sistema?

Cuando una decisión afectaba a más de un módulo, se registraba como refinamiento arquitectónico del día. Los temas de mayor impacto, como voz, Kafka, CI/CD y notificaciones, se trasladaban a coordinación técnica posterior para evitar extender innecesariamente el Daily.

---

## 5. Registro de Daily Standups

### Día 1 – 22 de junio: Hotfixes, planificación, Kafka base y preparación del Sprint

| Integrante | ¿Qué se implementó o refinó? | Impedimentos o dependencias identificadas | Plan inmediato |
|---|---|---|---|
| Luis Fernando Gómez Rendón | Organizó el Sprint Backlog formal de Fase 3, actualizó la estructura Scrum inicial y verificó que el Kanban reflejara las 56 tareas asignadas. También inició la configuración base de pruebas con Jest para preparar la ejecución automatizada. | Era necesario capturar el estado inicial del tablero antes de mover tarjetas y asegurar que cada rama estuviera vinculada con una tarea F3. | Consolidar el documento Scrum inicial, dejar lista la captura Kanban y apoyar la configuración de pruebas para los servicios principales. |
| Ander Gilberto Popol Porón | Revisó el alcance funcional de Fase 3 desde la perspectiva del Product Owner, priorizando voz, notificaciones, correcciones UX y actualización del DDA. | La nueva entrada por voz debía quedar justificada arquitectónicamente y no podía tratarse como una pantalla adicional sin impacto en el diseño. | Preparar la actualización del DDA con el flujo de voz y definir criterios de aceptación para alertas, verificador público y experiencia móvil. |
| Jencer Hamilton Hernández Alonzo | Analizó el impacto del nuevo voz-service sobre el motor adaptativo y definió el flujo esperado: audio, transcripción, confirmación y envío al endpoint de respuesta. | Se identificó riesgo de latencia si el procesamiento de audio se integraba directamente al motor del examen. | Diseñar el servicio de voz como componente separado y preparar el endpoint de transcripción para conectarlo posteriormente al motor adaptativo. |
| Oswaldo Antonio Choc Cuteres | Preparó la base de infraestructura para Kafka KRaft en Docker Compose, considerando puerto, healthcheck y relación con servicios posteriores. | Kafka debía quedar disponible antes de producers, consumers y notificaciones; de lo contrario, las tareas siguientes quedarían bloqueadas. | Configurar Kafka base, validar disponibilidad local y coordinar con Javier los contratos de topics compartidos. |
| Javier Andrés Monjes Solórzano | Inició el hotfix backend del verificador público, quitando la dependencia de autenticación en la ruta de verificación de certificado. También revisó la definición de topics Kafka. | El endpoint debía ser público sin comprometer otros endpoints protegidos ni exponer información sensible del certificado. | Cerrar el hotfix del endpoint, definir `topics.js` y preparar los producers para examen completado, certificado emitido y fraude detectado. |
| Juan José Gerardi Hernández | Inició el hotfix de interfaz del verificador externo, removiendo redirecciones innecesarias hacia login cuando el usuario no tiene sesión. | La pantalla pública debía funcionar sin autenticación, pero mostrando únicamente datos mínimos para no exponer información personal. | Ajustar la pantalla de verificación externa y preparar el diseño móvil para el flujo de respuesta por voz. |

**Decisiones consolidadas:** el verificador público se manejará como flujo externo sin login; Kafka será la base de eventos asíncronos; el procesamiento de voz se mantendrá desacoplado del motor adaptativo; y el Sprint Backlog F3 se tomará como referencia diaria para el movimiento de tarjetas.

---

### Día 2 – 23 de junio: Producers Kafka, HTTP inter-service y encapsulamiento de servicios

| Integrante | ¿Qué se implementó o refinó? | Impedimentos o dependencias identificadas | Plan inmediato |
|---|---|---|---|
| Luis Fernando Gómez Rendón | Dio seguimiento al movimiento del Kanban y verificó que las tareas de backend del día no bloquearan los cambios posteriores de dashboard, pruebas y documentación Scrum. | Las tareas de frontend y pruebas dependían de que los endpoints internos y eventos Kafka tuvieran contratos claros. | Mantener coordinación de ramas, registrar avances del Daily y preparar el soporte para dashboard F3 y prueba de aceptación. |
| Ander Gilberto Popol Porón | Refinó criterios de aceptación para el flujo de voz, notificaciones y verificador público, asegurando que cada historia respondiera a un valor funcional verificable. | Se detectó que varias mejoras de UI dependían de respuestas estables desde backend, especialmente notificaciones, verificación y alertas. | Avanzar con la documentación del estilo Pipes and Filters para voz y preparar la actualización de interfaces con criterios de privacidad y usabilidad. |
| Jencer Hamilton Hernández Alonzo | Trabajó el endpoint interno para suspender sesiones de examen desde servicios autorizados, alineándolo con el flujo antifraude. | El endpoint requería control de acceso por rol de servicio para evitar suspensiones indebidas desde actores no autorizados. | Validar el endpoint con Oswaldo, preparar casos de prueba y dejarlo listo para integrarse con eventos de fraude. |
| Oswaldo Antonio Choc Cuteres | Implementó endpoints internos para consulta de candidatos y estadísticas, además de coordinar con Javier la comunicación entre servicios. | Era necesario evitar lecturas directas entre bases de datos de microservicios, porque eso afectaba mantenibilidad y encapsulamiento. | Cerrar endpoints internos con rol SERVICE, apoyar la configuración de Kafka y preparar la base del servicio de notificaciones. |
| Javier Andrés Monjes Solórzano | Implementó los producers Kafka en examen-service, certificado-service y telemetria-service. También trabajó la migración para agregar email al candidato, el modelo actualizado y `serviceClient.js` con JWT SERVICE. | La eliminación de lecturas cruzadas dependía de que auth-service, examen-service e ingesta-service ofrecieran endpoints internos confiables. | Terminar producers, cerrar serviceClient reutilizable y reemplazar las consultas cruzadas en certificado-service, telemetria-service y dashboard-service. |
| Juan José Gerardi Hernández | Revisó los contratos necesarios para la pantalla de verificación pública y el flujo móvil de voz, dejando identificados los estados que la UI debía representar. | La UI dependía de campos mínimos del certificado, estado de transcripción y respuestas normalizadas de error. | Preparar componentes visuales para verificador público, respuesta por voz y estados de confirmación antes de integrarlos con API real. |

**Decisiones consolidadas:** se reafirmó que los servicios no deben consultar directamente las bases de otros dominios; la comunicación interna usará endpoints protegidos por rol SERVICE; y los eventos Kafka se usarán para desacoplar procesos posteriores como correo, auditoría y alertas.

---

### Día 3 – 24 de junio: Notificaciones, voz-service, UI móvil y CI/CD inicial

| Integrante | ¿Qué se implementó o refinó? | Impedimentos o dependencias identificadas | Plan inmediato |
|---|---|---|---|
| Luis Fernando Gómez Rendón | Integró el notificaciones-service en Docker Compose y Nginx, considerando dependencia con Kafka. También coordinó el seguimiento del pipeline de pruebas y la preparación del dashboard F3. | El servicio de notificaciones necesitaba arrancar después de Kafka y exponer rutas coherentes para ambiente local y despliegue. | Validar integración de contenedores, apoyar la fase Test/Build del pipeline y avanzar en indicadores del dashboard. |
| Ander Gilberto Popol Porón | Actualizó el DDA incorporando el estilo Pipes and Filters para el flujo de audio, explicando cómo la captura, transcripción, confirmación y evaluación se separan en pasos controlados. | El cambio de voz impactaba atributos de calidad como latencia, adaptabilidad, usabilidad y mantenibilidad, por lo que debía quedar justificado formalmente. | Completar la sección de arquitectura de voz y preparar correcciones UX de Fase 2 en las vistas existentes. |
| Jencer Hamilton Hernández Alonzo | Implementó el scaffold del voz-service con el endpoint `POST /api/voz/transcribir`, integró la alternativa Speech-to-Text y conectó la salida de transcripción con el motor adaptativo. | El flujo debía validar la transcripción antes de enviarla como respuesta definitiva, evitando errores por reconocimiento incorrecto. | Probar audio, transcripción y envío hacia `/api/exam/answer`, además de preparar casos para pruebas unitarias e integración. |
| Oswaldo Antonio Choc Cuteres | Creó la estructura base de notificaciones-service, configuró `app.js`, `env.js`, Dockerfile y mailer con Nodemailer usando Ethereal para desarrollo y SMTP configurable para producción. | Se requería separar credenciales por ambiente para no dejar datos sensibles en código ni mezclar configuración local con producción. | Integrar el mailer con los handlers Kafka y preparar la fase Build del pipeline con imágenes Docker. |
| Javier Andrés Monjes Solórzano | Implementó consumers y handlers para `certificado.emitido` y `fraude.detectado`, permitiendo correo al candidato, reporte a universidad y alerta a auditores. También inició la fase Test del pipeline con estrategia matrix. | Las notificaciones dependen de eventos correctamente publicados y de datos mínimos del candidato, certificado y auditoría. | Validar eventos de extremo a extremo, ajustar payloads y dejar lista la fase de pruebas automatizadas. |
| Juan José Gerardi Hernández | Implementó la UI móvil del examen con toggle voz/texto, botón de grabar, visualizador de audio, vista de transcripción y botones Confirmar/Repetir. También adaptó el layout para pantallas pequeñas. | La experiencia móvil debía evitar enviar respuestas incorrectas por transcripciones ambiguas y conservar accesibilidad básica. | Integrar la UI con voz-service, revisar estados de carga/error y preparar la pantalla pública de verificación. |

**Decisiones consolidadas:** el flujo de voz se separó en captura, transcripción, confirmación y evaluación; notificaciones quedó como servicio transversal dependiente de eventos; y la configuración sensible se manejará por variables de entorno y secretos por ambiente.

---

### Día 4 – 25 de junio: CI/CD multi-entorno, frontend F3 y pruebas documentadas

| Integrante | ¿Qué se implementó o refinó? | Impedimentos o dependencias identificadas | Plan inmediato |
|---|---|---|---|
| Luis Fernando Gómez Rendón | Actualizó el dashboard con nuevos datos de Fase 3 y agregó indicador del estado del pipeline CI/CD para distinguir Staging y Producción. También apoyó la organización de la prueba de aceptación. | El dashboard dependía de endpoints internos de estadísticas y de que el pipeline reportara estados claros por ambiente. | Cerrar dashboard F3, validar prueba de aceptación y preparar README evolutivo de las tres fases. |
| Ander Gilberto Popol Porón | Implementó los toasts o banners para certificado emitido y alerta visual de fraude en el panel administrativo. Además aplicó correcciones UX de feedback de Fase 2 y actualizó documentación de endpoints y DDA. | Las alertas visuales debían ser informativas sin saturar la interfaz ni exponer información innecesaria. | Terminar documentación de DDA/API, revisar privacidad en mensajes UI y preparar la retrospectiva de Fase 3. |
| Jencer Hamilton Hernández Alonzo | Implementó las cinco pruebas unitarias Jest y preparó las pruebas de integración documentadas: audio a voz-service y motor, certificado emitido a Kafka y correo, fraude detectado a Kafka y alerta. | Las pruebas de integración requerían servicios levantados y datos de prueba consistentes para no fallar por configuración. | Grabar evidencias de integración, documentar resultados y ajustar casos si algún servicio devuelve errores controlados. |
| Oswaldo Antonio Choc Cuteres | Configuró entornos Staging y Producción en nube, separó GitHub Secrets por ambiente y agregó deploy automático hacia Staging con aprobación para Producción. | La separación de secretos debía ser estricta para SMTP, JWT, PKI y API de voz; un error podía afectar seguridad y reproducibilidad. | Validar pipeline completo, revisar logs de build/deploy y documentar la configuración del CI/CD. |
| Javier Andrés Monjes Solórzano | Apoyó la validación de eventos Kafka y notificaciones durante las pruebas, revisó payloads y colaboró con la documentación técnica de integración. | Si los mensajes Kafka no mantenían estructura estable, los handlers de notificaciones podían fallar silenciosamente. | Ajustar contratos de eventos, validar fase Test del pipeline y preparar el ajuste de MinIO para evidencia. |
| Juan José Gerardi Hernández | Implementó el botón de compartir verificación pública en la pantalla de certificado y ajustó la pantalla de resultado del verificador para mostrar información básica sin datos personales sensibles. | La verificación pública debía ser clara para usuarios externos, pero limitada para cumplir privacidad y no exponer PII. | Cerrar flujo público de certificado, revisar responsive y preparar evidencia visual de las pantallas finales. |

**Decisiones consolidadas:** el CI/CD se manejará con separación explícita entre Staging y Producción; las pruebas se documentarán con evidencia; y las interfaces de Fase 3 deberán reforzar claridad, privacidad y trazabilidad del certificado.

---

### Día 5 – 26 de junio: Cierre técnico, evidencias finales y preparación para calificación

| Integrante | ¿Qué se implementó o refinó? | Impedimentos o dependencias identificadas | Plan inmediato |
|---|---|---|---|
| Luis Fernando Gómez Rendón | Coordinó el cierre de Daily Standups, README evolutivo, prueba de aceptación y consolidación de evidencias. Verificó que las tareas Scrum reflejaran el avance final en Kanban. | Era necesario que la captura final del tablero coincidiera con las tareas cerradas y que los documentos no contradijeran el estado real del repositorio. | Cerrar documentación Scrum, registrar Daily final, integrar README de evolución y apoyar el merge hacia la rama principal. |
| Ander Gilberto Popol Porón | Trabajó la Sprint Retrospective individual de los seis integrantes y aplicó correcciones de feedback de Fase 2 en DDA y diagramas. | La documentación debía reflejar cambios reales, especialmente voz, Kafka, CI/CD y notificaciones, sin quedar desconectada del código. | Finalizar retrospectiva, validar trazabilidad del DDA y preparar evidencia documental para calificación. |
| Jencer Hamilton Hernández Alonzo | Cerró la validación de pruebas unitarias e integración, revisando que los videos demostraran los flujos técnicos solicitados. | Cualquier falla en un servicio podía afectar la prueba de aceptación completa, especialmente voz, certificado, correo y verificador público. | Documentar resultados de pruebas, apoyar correcciones finales y dejar evidencia lista para revisión. |
| Oswaldo Antonio Choc Cuteres | Verificó el pipeline CI/CD, entornos Staging y Producción, build de imágenes y separación de secretos. | La estabilidad del despliegue dependía de variables correctas y de que los servicios iniciaran en el orden adecuado. | Dejar documentado el procedimiento de despliegue, revisar logs finales y confirmar estado operativo de los entornos. |
| Javier Andrés Monjes Solórzano | Ajustó MinIO para soportar evidencia de mayor tamaño y revisó el flujo de eventos, handlers y notificaciones. | El almacenamiento de evidencia debía soportar chunks de audio/video sin romper límites de carga ni perder metadatos de auditoría. | Validar carga de evidencia, cerrar eventos Kafka y confirmar notificaciones críticas. |
| Juan José Gerardi Hernández | Implementó soporte de captura MediaRecorder y envío de evidencia por chunks desde frontend, además de revisar las vistas finales de voz, verificador y certificado. | La captura de evidencia debía funcionar en dispositivos móviles sin afectar el examen ni saturar la interfaz. | Preparar capturas finales, revisar navegación y dejar listas las pantallas para la calificación. |

**Decisiones consolidadas:** la Fase 3 se cerró con enfoque de estabilización técnica, evidencia verificable y documentación alineada al código. Los entregables finales se organizaron para demostrar evolución arquitectónica, calidad, despliegue y trazabilidad Scrum.

---

## 6. Impedimentos recurrentes y tratamiento aplicado

| Impedimento o riesgo | Tratamiento aplicado |
|---|---|
| Verificador público dependía de autenticación | Se aplicó hotfix en backend y frontend para permitir consulta pública sin token, manteniendo protegidos los demás endpoints. |
| Dependencia entre Kafka, producers, consumers y notificaciones | Se definieron topics compartidos y se integró Kafka antes de activar handlers y servicio de correo. |
| Riesgo de acoplamiento entre microservicios | Se reemplazaron lecturas cruzadas por endpoints internos con rol SERVICE y cliente HTTP reutilizable. |
| Latencia y ambigüedad en respuestas por voz | Se separó el flujo en captura, transcripción, confirmación y envío al motor adaptativo. |
| Exposición de información sensible en verificación pública | La UI pública muestra únicamente datos mínimos del certificado, sin información personal innecesaria. |
| Variables sensibles en pipeline CI/CD | Se separaron secretos por ambiente para SMTP, JWT, PKI y API de voz. |
| Pruebas dependientes de múltiples servicios | Se organizaron pruebas unitarias, integración y aceptación con datos controlados y evidencias documentadas. |
| Evidencia antifraude de mayor tamaño | Se ajustó MinIO y se documentó el envío por chunks desde frontend mediante MediaRecorder. |
| Riesgo de documentación desactualizada | Se actualizó DDA, README evolutivo, documentación Scrum, API endpoints y feedback de Fase 2. |

---

## 7. Resultados del refinamiento arquitectónico

Durante los Daily Standups de Fase 3 se consolidaron las siguientes decisiones:

1. **Verificación pública desacoplada del login.** El certificado puede validarse mediante hash, código o QR sin requerir sesión, preservando privacidad y seguridad.
2. **Kafka como columna de eventos.** Los eventos `examen.completado`, `certificado.emitido` y `fraude.detectado` permiten desacoplar procesos secundarios sin bloquear el flujo principal.
3. **Comunicación inter-service controlada.** Se sustituyeron lecturas cruzadas por endpoints internos con JWT SERVICE, mejorando mantenibilidad y encapsulamiento.
4. **Notificaciones como servicio transversal.** Correos y alertas se centralizaron en un servicio dedicado, configurado por ambiente y conectado a eventos del sistema.
5. **Voz mediante Pipes and Filters.** El flujo de audio se dividió en captura, transcripción, confirmación y evaluación, evitando cargar directamente al motor adaptativo.
6. **CI/CD multi-entorno.** El sistema incorpora fases de Test, Build y Deploy con separación entre Staging y Producción.
7. **Pruebas con evidencia.** Se registran pruebas unitarias, integración y aceptación como respaldo de calidad para la calificación.
8. **Documentación evolutiva.** El DDA y README muestran la evolución entre Fase 1, Fase 2 y Fase 3, facilitando la lectura del avance arquitectónico.

---

## 8. Tabla resumen para seguimiento rápido

| Integrante / Rol | Día 1 – 22/06 | Día 2 – 23/06 | Día 3 – 24/06 | Día 4 – 25/06 | Día 5 – 26/06 |
|---|---|---|---|---|---|
| **Luis Fernando Gómez Rendón**<br>Scrum Master / Frontend / Testing | Sprint Backlog, Kanban inicial y setup Jest. | Seguimiento de dependencias y coordinación de ramas. | Integración de notificaciones-service con Docker/Nginx. | Dashboard F3, estado CI/CD y preparación de prueba de aceptación. | Dailies, README evolutivo, evidencia final y cierre Scrum. |
| **Ander Gilberto Popol Porón**<br>Product Owner / Frontend / DDA | Priorización de voz, notificaciones y feedback F2. | Criterios de aceptación y trazabilidad de voz. | DDA con Pipes and Filters para audio. | Toasts, alerta fraude, UX feedback y documentación API/DDA. | Retrospective, feedback F2 y preparación documental para calificación. |
| **Jencer Hamilton Hernández Alonzo**<br>Backend motor / Voz / Testing | Diseño de flujo voz-service hacia motor adaptativo. | Endpoint interno para suspensión de sesión. | Voz-service, Speech-to-Text y conexión con `/api/exam/answer`. | Pruebas unitarias e integración documentada. | Revisión de pruebas, videos y estabilidad de flujos. |
| **Oswaldo Antonio Choc Cuteres**<br>Infra / Backend / CI/CD | Kafka KRaft en Docker Compose. | Endpoints internos y apoyo a HTTP inter-service. | Notificaciones-service, mailer y configuración SMTP. | Staging, Producción, Secrets y deploy automático. | Verificación final de pipeline, build y despliegue. |
| **Javier Andrés Monjes Solórzano**<br>Backend integración / Seguridad | Hotfix backend verificador público y topics Kafka. | Producers Kafka, migración email, serviceClient y eliminación de lecturas cruzadas. | Handlers de certificado emitido y fraude detectado; CI fase Test. | Validación de eventos, payloads y soporte a pruebas. | MinIO, evidencia ampliada, eventos y notificaciones finales. |
| **Juan José Gerardi Hernández**<br>Frontend Lead / UI móvil | Hotfix UI verificador externo sin login. | Contratos UI para verificador público y voz. | UI móvil voz/texto, grabación, transcripción y responsive. | Compartir verificación y resultado público sin PII. | MediaRecorder, envío por chunks y capturas finales. |

---

## 9. Conclusión

Los Daily Standups de la Fase 3 permitieron coordinar la evolución final del MVP hacia un ecosistema más robusto y preparado para calificación. El equipo mantuvo la misma estructura de seguimiento usada en Fase 2, pero ahora enfocada en nuevos retos técnicos: voz en dispositivos móviles, notificaciones, eventos Kafka, CI/CD, pruebas, evidencia antifraude ampliada y actualización del DDA.

El resultado fue una bitácora de trabajo organizada, coherente con el Sprint Backlog y alineada con las tareas asignadas oficialmente. Cada integrante mantuvo responsabilidades técnicas claras, reportó dependencias reales y contribuyó a que la Fase 3 cerrara con trazabilidad entre código, arquitectura, pruebas, documentación y gestión Scrum.
