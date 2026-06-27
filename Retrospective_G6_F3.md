# PRCCD – SICA
## Sprint Retrospective
### Proyecto Fase 3 – Evolución Arquitectónica, CI/CD, Voz y Notificaciones

**Universidad de San Carlos de Guatemala**  
**Facultad de Ingeniería – Escuela de Ciencias y Sistemas**  
**Análisis y Diseño de Sistemas 2, Sección A**  
**Escuela de Vacaciones, Junio 2026**

---

## 1. Propósito

La presente retrospectiva documenta los aprendizajes, decisiones consolidadas, ajustes técnicos y mejoras propuestas durante la **Fase 3** del proyecto **Plataforma Regional de Certificación de Competencias Digitales (PRCCD) para el Sistema de la Integración Centroamericana (SICA)**.

A diferencia de la Fase 2, donde el esfuerzo principal fue materializar el MVP funcional, en esta etapa el equipo se enfocó en evolucionar la solución hacia un ecosistema más robusto, mantenible y preparado para calificación técnica. La Fase 3 incorporó nuevas capacidades arquitectónicas: verificación pública sin autenticación, eventos asíncronos con Kafka, servicio transversal de notificaciones, flujo de respuestas por voz desde dispositivos móviles, pruebas automatizadas, despliegue multi-entorno mediante CI/CD, actualización del Documento de Decisión de Arquitectura y documentación evolutiva entre fases.

La retrospectiva permite identificar qué decisiones funcionaron al interactuar con el código real, qué supuestos de las fases anteriores tuvieron que corregirse y qué acciones técnicas deben mantenerse como buenas prácticas para la evolución futura del sistema.

---

## 2. Objetivos de la retrospectiva

- Evaluar las decisiones de diseño y patrones arquitectónicos consolidados durante la implementación de Fase 3.
- Identificar supuestos de Fase 1 y Fase 2 que no se sostuvieron al incorporar voz, Kafka, notificaciones, CI/CD y despliegue multi-entorno.
- Registrar cuellos de botella, dependencias, riesgos y ajustes aplicados durante el Sprint.
- Proponer mejoras técnicas concretas para mantener el ecosistema PRCCD en futuras iteraciones.
- Dejar evidencia clara de impacto estructural por integrante, vinculada con las tareas asignadas oficialmente.
- Preparar una base documental coherente para la calificación final del proyecto.

---

## 3. Contexto de Fase 3

Durante la Fase 3 se trabajó sobre el MVP construido en Fase 2 y se incorporaron nuevos requerimientos que modificaron la arquitectura de la solución. El cambio más importante fue permitir que el candidato respondiera preguntas del examen adaptativo por voz desde un dispositivo móvil, procesando el audio mediante un flujo de transcripción antes de enviarlo al motor de evaluación.

También se agregó un servicio transversal de notificaciones que reacciona a eventos del ecosistema, por ejemplo: certificado emitido, fraude detectado o reporte institucional. Para desacoplar esos procesos, se introdujo Kafka como bus de eventos. Además, se inició la formalización de CI/CD con fases de Test, Build y Deploy, separando ambientes de Staging y Producción con variables y secretos por entorno.

Esta fase exigió adaptar el DDA, actualizar documentación técnica, validar pruebas unitarias, integración y aceptación, y cerrar la evidencia Scrum mediante Kanban, Daily Standups, Retrospective y Burndown Chart.

---

## 4. Hallazgos por integrante

| Integrante | Rol principal | ¿Qué decisiones de diseño y patrones arquitectónicos se consolidaron con éxito al interactuar con el código fuente real? | ¿Qué supuestos teóricos o diagramas de Fase 1/Fase 2 demostraron fallas evidentes, provocaron cuellos de botella o requirieron refactorización durante la implementación? | ¿Qué mejoras técnicas concretas se proponen para asegurar la mantenibilidad futura del ecosistema? |
|---|---|---|---|---|
| **Luis Fernando Gómez Rendón** | Scrum Master / Frontend / Testing | Se consolidó la gestión Scrum como mecanismo real de control técnico y no solo documental. La organización del Sprint Backlog, el seguimiento del Kanban, la captura de evidencias, la configuración inicial de pruebas con Jest, la actualización del dashboard F3 y la preparación de la prueba de aceptación permitieron mantener trazabilidad entre tareas, código, documentación y calificación. También se validó que la documentación Scrum debe conectarse con la realidad del repositorio, las ramas y los entregables, especialmente cuando existen múltiples frentes activos como CI/CD, notificaciones y pruebas. | En Fase 2 se asumió que el seguimiento del tablero y los documentos Scrum podían mantenerse como una actividad paralela al desarrollo. En Fase 3 se comprobó que esa separación genera riesgo, porque CI/CD, pruebas, dashboard y documentación dependen directamente del estado real de los servicios. También se evidenció que el tablero acumulaba tareas de varias fases, por lo que fue necesario ordenar la lectura del avance para distinguir lo pendiente, lo probado, lo documentado y lo listo para calificación. | Mantener un tablero Kanban con etiquetas por fase y módulo; vincular cada tarjeta con rama, commit y Pull Request; automatizar un resumen de avance diario; exigir evidencia por tarea antes de moverla a Done; integrar resultados de pruebas al dashboard técnico; documentar acuerdos de integración en el Daily; y conservar un README evolutivo que muestre claramente qué cambió en Fase 1, Fase 2 y Fase 3. |
| **Ander Gilberto Popol Porón** | Product Owner / Frontend / Documentación arquitectónica | Se consolidó la capacidad del Product Owner para traducir el giro de Fase 3 en criterios funcionales y arquitectónicos verificables. La actualización del DDA con el flujo de voz, la justificación del estilo Pipes and Filters, la revisión de alertas visuales, los toasts de certificado emitido y fraude detectado, y la aplicación del feedback de Fase 2 permitieron que la nueva funcionalidad no quedara como un agregado improvisado. También se reforzó la importancia de validar que la interfaz, la documentación y los endpoints expresen el mismo flujo de negocio. | El supuesto de que el DDA de Fase 2 era suficiente para cerrar el proyecto dejó de ser válido al introducir respuestas por voz, notificaciones y CI/CD. El flujo de audio no podía tratarse como una simple mejora visual, porque afectaba latencia, usabilidad, adaptabilidad y separación de responsabilidades. Además, algunos prototipos y diagramas previos no contemplaban estados como transcripción fallida, confirmación de respuesta, alerta de fraude, correo pendiente o verificación pública sin datos personales sensibles. | Mantener un archivo de decisiones arquitectónicas para cada cambio relevante; definir criterios de aceptación por historia antes de implementar; actualizar el DDA junto con el código y no al final; documentar cada endpoint nuevo o modificado; validar mensajes de interfaz desde privacidad y usabilidad; mantener trazabilidad entre requerimiento, pantalla, endpoint, evento Kafka y prueba; y realizar revisiones tempranas con el equipo antes de cerrar cambios de arquitectura. |
| **Jencer Hamilton Hernández Alonzo** | Backend motor / Voz / Testing | Se consolidó el diseño del voz-service como componente separado del motor adaptativo, evitando mezclar captura de audio, transcripción y evaluación en un único módulo. La integración del endpoint `POST /api/voz/transcribir`, la conexión de la transcripción con `/api/exam/answer`, el endpoint interno para suspensión de sesión y las pruebas unitarias e integración confirmaron que el motor puede evolucionar sin perder su responsabilidad principal. También se validó que Pipes and Filters es adecuado para separar captura, transcripción, confirmación y evaluación. | En Fase 2 se asumía que el motor adaptativo recibiría únicamente respuestas escritas o seleccionadas en la interfaz. En Fase 3 se evidenció que incorporar voz introduce riesgos de latencia, permisos de micrófono, errores de transcripción, compatibilidad móvil y validación previa. También se detectó que enviar una transcripción directamente al motor sin confirmación del usuario podía provocar respuestas incorrectas y afectar el resultado del examen. | Definir contratos formales para el voz-service; incorporar umbrales de confianza de transcripción; agregar mocks del proveedor Speech-to-Text para pruebas automatizadas; controlar tamaño y duración de audio; separar errores de grabación, transcripción y evaluación; agregar pruebas de contrato entre voz-service y examen-service; medir latencia de transcripción; y mantener una alternativa de respuesta por texto cuando el dispositivo no soporte captura de audio. |
| **Oswaldo Antonio Choc Cuteres** | Backend infraestructura / CI/CD | Se consolidó la infraestructura de Fase 3 mediante Kafka KRaft en Docker Compose, notificaciones-service, mailer SMTP con configuración por ambiente, endpoints internos, build de imágenes Docker, separación de Staging y Producción, y uso de GitHub Secrets. La implementación confirmó que el ecosistema necesita configuración externa, health checks y despliegues reproducibles para evitar diferencias entre equipos y ambientes. También se validó que el pipeline CI/CD es parte de la arquitectura operativa y no solo una actividad de entrega. | En Fase 2 se trabajó principalmente con entorno local y Docker como soporte del MVP. En Fase 3 se comprobó que un despliegue multi-entorno exige mayor disciplina: variables sensibles separadas, orden de arranque de servicios, disponibilidad de Kafka, rutas de Nginx, credenciales SMTP, llaves y configuración de APIs externas. También se evidenció que asumir que un servicio funciona localmente no garantiza que funcione en Staging o Producción. | Formalizar infraestructura como código; agregar health checks a todos los servicios; documentar variables obligatorias por ambiente; separar credenciales con secretos administrados; implementar logs estructurados; agregar monitoreo básico del pipeline; validar imágenes antes del despliegue; usar estrategias de aprobación para Producción; mantener scripts de rollback; y documentar claramente el procedimiento de recuperación cuando Kafka, SMTP o voz-service no estén disponibles. |
| **Javier Andrés Monjes Solórzano** | Backend integración / Seguridad / Eventos | Se consolidó el desacoplamiento entre servicios mediante hotfix del verificador público, definición de topics Kafka, producers para examen completado, certificado emitido y fraude detectado, handlers de notificaciones, `serviceClient.js` con JWT SERVICE, eliminación de lecturas cruzadas y ajuste de MinIO para evidencia ampliada. El código confirmó que la integración no debe depender de consultas directas a bases de datos ajenas, sino de contratos internos, eventos y clientes reutilizables. | En Fase 2 se aceptaron algunas integraciones directas como solución rápida del MVP. En Fase 3 se comprobó que esa práctica afecta mantenibilidad y rompe la independencia de dominios. También se evidenció que el verificador público no debía depender del login, porque su propósito es ser consultado por terceros externos mediante QR o hash. Los payloads de eventos Kafka también requerían estructura estable para que notificaciones, auditoría y alertas no fallaran de forma silenciosa. | Versionar contratos de eventos Kafka; definir esquemas mínimos para cada topic; implementar idempotencia en consumers; agregar Dead Letter Queue para eventos fallidos; documentar payloads y códigos de error; fortalecer JWT SERVICE con permisos mínimos; centralizar serviceClient; validar que el verificador público no exponga PII; aplicar límites y metadatos a evidencia en MinIO; y crear pruebas de integración para producers, consumers y handlers críticos. |
| **Juan José Gerardi Hernández** | Frontend Lead / UI móvil / Evidencia | Se consolidó una interfaz más orientada a flujos reales de usuario: verificador externo sin login, pantalla pública con resultado básico, vista de certificado con botón de compartir verificación, UI móvil para alternar voz/texto, grabación con MediaRecorder, visualizador de audio, transcripción, confirmación/repetición y envío por chunks de evidencia. La implementación confirmó que el frontend debe representar estados técnicos de manera comprensible sin exponer datos sensibles ni romper la navegación existente. | En Fase 2 la interfaz estaba pensada principalmente para flujos tradicionales y pantallas de escritorio. En Fase 3 se comprobó que la entrada por voz exige contemplar permisos de micrófono, estados de grabación, transcripción pendiente, error de audio, confirmación del usuario, reintento y compatibilidad móvil. También se evidenció que el verificador público requiere una experiencia distinta a la consola autenticada, con información mínima y clara para usuarios externos. | Crear una biblioteca de componentes reutilizables para estados de carga, error, éxito y confirmación; agregar pruebas de flujo móvil; documentar compatibilidad de MediaRecorder por navegador; reforzar accesibilidad y mensajes de privacidad; centralizar cliente HTTP e interceptores; diseñar componentes específicos para flujos públicos sin sesión; validar responsive en distintos tamaños; y mantener una guía visual para dashboard, certificado, voz y alertas administrativas. |

---

## 5. Aspectos que funcionaron durante el Sprint

1. **Evolución modular del MVP:** los nuevos requerimientos se agregaron sin romper los módulos principales de Fase 2.
2. **Separación del flujo de voz:** la respuesta por voz se resolvió mediante un servicio desacoplado y un flujo controlado de captura, transcripción, confirmación y evaluación.
3. **Eventos asíncronos con Kafka:** los eventos permitieron conectar certificación, antifraude y notificaciones sin bloquear el flujo principal.
4. **Servicio transversal de notificaciones:** se centralizó el envío de correos y alertas, evitando duplicar lógica en cada servicio.
5. **Mejor encapsulamiento entre servicios:** se sustituyeron lecturas cruzadas por endpoints internos y cliente HTTP con JWT SERVICE.
6. **Verificación pública corregida:** el certificado puede verificarse externamente sin autenticación, manteniendo privacidad.
7. **CI/CD multi-entorno:** el pipeline permitió separar Test, Build, Staging y Producción con variables y secretos por ambiente.
8. **Pruebas documentadas:** se organizaron pruebas unitarias, integración y aceptación con evidencia.
9. **Documentación evolutiva:** el DDA, API_ENDPOINTS, README y documentos Scrum se alinearon con los cambios de Fase 3.

---

## 6. Aspectos que deben mejorarse

1. **Contratos de eventos más formales:** los topics Kafka y sus payloads deben versionarse para evitar incompatibilidades entre producers y consumers.
2. **Observabilidad:** se necesitan logs estructurados, métricas y trazas para diagnosticar fallas en voz, Kafka, notificaciones y CI/CD.
3. **Automatización de pruebas E2E:** las pruebas de aceptación deben automatizarse progresivamente para no depender únicamente de videos manuales.
4. **Gestión de secretos:** Staging y Producción requieren una política más estricta de rotación y control de credenciales.
5. **Compatibilidad móvil:** el flujo de voz necesita pruebas en distintos navegadores y dispositivos.
6. **Manejo de fallos asíncronos:** los consumers deben contemplar reintentos, idempotencia y cola de mensajes fallidos.
7. **Documentación de recuperación:** se debe definir qué hacer si Kafka, SMTP, voz-service o MinIO no están disponibles.
8. **Mayor integración entre Kanban y repositorio:** cada tarjeta debería quedar relacionada con Pull Request, commit, responsable y evidencia.

---

## 7. Acciones de mejora priorizadas para próximas iteraciones

| Prioridad | Acción | Responsable principal | Resultado esperado |
|---|---|---|---|
| Alta | Versionar contratos de eventos Kafka y documentar payloads. | Javier Andrés Monjes Solórzano / Oswaldo Antonio Choc Cuteres | Eventos más estables y menor riesgo de fallas silenciosas entre servicios. |
| Alta | Formalizar pruebas de contrato entre voz-service y examen-service. | Jencer Hamilton Hernández Alonzo | Mayor confiabilidad del flujo de voz hacia el motor adaptativo. |
| Alta | Agregar health checks y logs estructurados a todos los servicios. | Oswaldo Antonio Choc Cuteres | Mejor diagnóstico de errores en Staging y Producción. |
| Alta | Mantener trazabilidad entre DDA, endpoints, pantallas, eventos y pruebas. | Ander Gilberto Popol Porón / Luis Fernando Gómez Rendón | Documentación más consistente y fácil de defender en calificación. |
| Alta | Implementar idempotencia, reintentos y Dead Letter Queue para consumers Kafka. | Javier Andrés Monjes Solórzano | Mayor tolerancia a fallos en notificaciones y eventos críticos. |
| Media | Automatizar pruebas E2E del flujo completo: voz, examen, certificado, correo y verificación pública. | Jencer Hamilton Hernández Alonzo / Juan José Gerardi Hernández | Validación completa del recorrido del candidato y del verificador externo. |
| Media | Crear guía de compatibilidad móvil para MediaRecorder y permisos de micrófono. | Juan José Gerardi Hernández | Experiencia de voz más estable en distintos dispositivos. |
| Media | Integrar resultados de pipeline y pruebas al dashboard técnico. | Luis Fernando Gómez Rendón | Visibilidad rápida del estado de calidad y despliegue. |
| Media | Crear una guía de recuperación para Kafka, SMTP, MinIO y voz-service. | Oswaldo Antonio Choc Cuteres / Javier Andrés Monjes Solórzano | Respuesta operativa más clara ante fallos de infraestructura. |
| Media | Mantener un registro formal de decisiones arquitectónicas por fase. | Ander Gilberto Popol Porón / Equipo | Evidencia clara de evolución arquitectónica desde Fase 1 hasta Fase 3. |

---

## 8. Resumen ejecutivo por integrante

| Integrante / Rol | Se consolidó | Ajuste identificado | Mejora propuesta | Prioridad |
|---|---|---|---|---|
| **Luis Fernando Gómez Rendón**<br>Scrum Master / Frontend / Testing | Gestión Scrum conectada con Kanban, evidencias, pruebas, dashboard y README evolutivo. | El seguimiento documental debía reflejar el estado real de CI/CD, pruebas y ramas. | Vincular tarjetas con commits, PRs, evidencias y resultados de pipeline. | Alta |
| **Ander Gilberto Popol Porón**<br>Product Owner / DDA / Frontend | DDA actualizado con voz, Pipes and Filters, alertas y feedback de Fase 2. | Voz y notificaciones no eran simples pantallas; modificaban la arquitectura. | Mantener ADRs, criterios de aceptación y matriz requerimiento-endpoint-evento-prueba. | Alta |
| **Jencer Hamilton Hernández Alonzo**<br>Backend motor / Voz / Testing | Voz-service separado del motor adaptativo y pruebas unitarias/integración. | El motor asumía respuestas textuales; la voz agregó latencia y errores de transcripción. | Contratos formales, mocks STT, métricas de latencia y fallback a texto. | Alta |
| **Oswaldo Antonio Choc Cuteres**<br>Infraestructura / CI/CD | Kafka, notificaciones-service, SMTP, Docker, Staging/Producción y GitHub Secrets. | Localhost no era suficiente para validar despliegue multi-entorno. | Infraestructura como código, health checks, logs, rollback y monitoreo. | Alta |
| **Javier Andrés Monjes Solórzano**<br>Integración / Seguridad / Eventos | Verificador público, producers Kafka, handlers, serviceClient y MinIO ampliado. | Las lecturas cruzadas y payloads informales afectaban mantenibilidad. | Versionar eventos, DLQ, idempotencia, JWT SERVICE robusto y pruebas de integración. | Alta |
| **Juan José Gerardi Hernández**<br>Frontend Lead / UI móvil | Verificador externo, UI móvil de voz, MediaRecorder, transcripción y compartir certificado. | La interfaz debía contemplar permisos, estados móviles, privacidad y no PII. | Componentes reutilizables, pruebas responsive, accesibilidad y guía de compatibilidad. | Media |

---

## 9. Impacto estructural de Fase 3

| Área | Impacto alcanzado |
|---|---|
| Arquitectura | Se incorporó voz mediante Pipes and Filters, eventos asíncronos con Kafka y notificaciones como servicio transversal. |
| Integración | Se redujo el acoplamiento entre servicios usando endpoints internos, serviceClient y JWT SERVICE. |
| Seguridad | Se corrigió el verificador público sin exponer datos personales sensibles y se separaron secretos por ambiente. |
| Infraestructura | Se avanzó hacia CI/CD multi-entorno con Test, Build, Staging y Producción. |
| Calidad | Se documentaron pruebas unitarias, integración y aceptación. |
| UX | Se agregó experiencia móvil para voz, estados de transcripción y verificación pública clara. |
| Auditoría | Se reforzaron eventos de fraude, evidencia ampliada y notificaciones a auditores. |
| Documentación | Se actualizó DDA, API endpoints, README evolutivo, Daily Standups, Retrospective y planificación. |

---

## 10. Lecciones aprendidas

1. Un requerimiento aparentemente funcional, como responder por voz, puede convertirse en una decisión arquitectónica completa.
2. Kafka aporta valor cuando se usa para desacoplar procesos secundarios, pero requiere contratos claros y manejo de fallos.
3. El servicio de notificaciones debe ser transversal; duplicarlo en cada módulo aumentaría mantenimiento y errores.
4. La verificación pública requiere un balance entre facilidad de acceso y protección de datos personales.
5. CI/CD no debe agregarse al final como formalidad; debe integrarse progresivamente con pruebas y configuración segura.
6. La documentación del DDA debe evolucionar junto con el código, especialmente cuando cambia el estilo arquitectónico.
7. El tablero Kanban solo es útil si refleja el estado real del repositorio, las pruebas y los entregables.
8. Las pruebas de aceptación son más confiables cuando los servicios tienen datos controlados, contratos estables y ambientes reproducibles.

---

## 11. Conclusión

La retrospectiva de Fase 3 evidencia que el equipo logró evolucionar el MVP hacia un ecosistema más completo y alineado con los nuevos requerimientos del SICA. El trabajo no consistió únicamente en agregar funcionalidades, sino en refinar la arquitectura para soportar voz, eventos asíncronos, notificaciones, CI/CD, pruebas y despliegue multi-entorno.

El principal aprendizaje fue que la arquitectura híbrida definida desde las fases anteriores sí puede evolucionar, siempre que cada nuevo componente se integre de forma controlada y trazable. La separación de responsabilidades, el uso de eventos, la centralización de notificaciones, la validación pública del certificado y la actualización del DDA permitieron mantener coherencia entre negocio, código, infraestructura y documentación.

Para futuras iteraciones, el sistema debe fortalecer observabilidad, contratos de eventos, pruebas automatizadas, recuperación ante fallos y monitoreo de ambientes. Con estas mejoras, la PRCCD tendría una base más sólida para crecer como plataforma regional de certificación digital, manteniendo trazabilidad, seguridad, interoperabilidad y mantenibilidad.
