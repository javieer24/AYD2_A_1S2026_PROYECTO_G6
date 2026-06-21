# PRCCD – SICA  
## Documentación Scrum: Daily Standup y Refinamiento Arquitectónico Diario  
### Proyecto Fase 2 – MVP

**Universidad de San Carlos de Guatemala**  
**Facultad de Ingeniería – Escuela de Ciencias y Sistemas**  
**Análisis y Diseño de Sistemas 2, Sección A**  
**Escuela de Vacaciones, Junio 2026**

---

## 1. Propósito del documento

Este documento registra la aplicación de Scrum durante la Fase 2 del proyecto **Plataforma Regional de Certificación de Competencias Digitales (PRCCD) para el Sistema de la Integración Centroamericana (SICA)**. Su objetivo es dejar evidencia de los Daily Standups realizados por el equipo y del refinamiento arquitectónico que acompañó la construcción del MVP.

Los Daily Standups se utilizaron como un espacio breve de sincronización. Además de revisar el avance individual, permitieron detectar dependencias entre interfaz, servicios, persistencia, seguridad e infraestructura antes de que se convirtieran en bloqueos de implementación. Debido a que el proyecto integra procesos de certificación, verificación, auditoría y consulta de información, las reuniones también sirvieron para mantener coherencia con los requisitos y decisiones documentadas en la Fase 1.

---

## 2. Objetivos de los Daily Standups

- Revisar el avance diario de las tareas comprometidas para el MVP.
- Identificar impedimentos técnicos, funcionales o de coordinación.
- Ajustar el trabajo del día según las dependencias entre módulos.
- Validar que la implementación conserve la trazabilidad con los requisitos, casos de uso y drivers arquitectónicos.
- Registrar decisiones de refinamiento necesarias durante la construcción del sistema.

---

## 3. Organización de trabajo y responsabilidades

| Integrante | Rol principal | Responsabilidad durante la Fase 2 |
|---|---|---|
| Luis Fernando Gómez Rendón | Scrum Master / Coordinador de repositorio | Facilitación de ceremonias, seguimiento del tablero, integración de ramas, revisión de conflictos y control de entregables. |
| Ander Gilberto Popol Porón | Product Owner / Analista de negocio | Priorización del backlog, validación funcional, definición de criterios de aceptación y revisión de que las pantallas respondan al flujo de negocio. |
| Jencer Hamilton Hernández Alonzo | Arquitecto de drivers y calidad | Validación de atributos de calidad, pruebas funcionales, revisión de trazabilidad y criterios de seguridad, auditoría y rendimiento. |
| Oswaldo Antonio Choc Cuteres | Arquitecto de sistema e infraestructura | Estructura técnica del backend, configuración de entorno, despliegue, variables de configuración y decisiones de infraestructura. |
| Javier Andrés Monjes Solórzano | Diseñador de datos e integración | Modelo de datos, migraciones, persistencia e integración entre servicios, universidades y mecanismos de verificación. |
| Juan José Gerardi Hernández | Diseñador UI/UX y patrones | Diseño de vistas, componentes reutilizables, navegación, patrones de interfaz y consistencia de la experiencia de usuario. |

---

## 4. Dinámica aplicada

Cada reunión se organizó alrededor de tres preguntas:

1. ¿Qué se implementó o refinó desde el Daily anterior?
2. ¿Qué impedimento, dependencia o riesgo se identificó?
3. ¿Qué actividad se realizará a continuación?

Cuando surgía una decisión que afectaba a más de un módulo, se registraba como refinamiento arquitectónico. Los temas que requerían mayor discusión se trasladaban a una sesión técnica posterior para no extender innecesariamente el Daily.

---

## 5. Registro de Daily Standups

### Día 1 – Preparación del sprint y base del MVP

| Integrante | ¿Qué se implementó o refinó? | Impedimentos o dependencias identificadas | Plan inmediato |
|---|---|---|---|
| Luis Fernando Gómez Rendón | Organizó el tablero de trabajo, definió la estrategia de ramas y preparó la estructura inicial del repositorio para frontend, backend y documentación. | Era necesario acordar convenciones de nombres, flujo de pull requests y responsables de revisión antes de iniciar cambios simultáneos. | Consolidar las reglas de integración y verificar que cada integrante trabaje en una rama funcional. |
| Ander Gilberto Popol Porón | Priorizó el flujo inicial del MVP: acceso al sistema, consulta de certificaciones, ingesta de información y emisión o verificación de certificados. | Algunas historias requerían precisar criterios de aceptación para evitar que la interfaz se diseñara sin validar el proceso de negocio. | Documentar criterios de aceptación mínimos y validar el orden de implementación con el equipo. |
| Jencer Hamilton Hernández Alonzo | Revisó los drivers de calidad definidos en Fase 1 y los tradujo en controles iniciales: validación de datos, trazabilidad, manejo de errores y evidencia de auditoría. | Se debía definir qué eventos serían auditables desde el inicio para no agregar el registro de forma tardía. | Proponer los eventos mínimos de auditoría y los casos de prueba iniciales. |
| Oswaldo Antonio Choc Cuteres | Preparó la base técnica del backend, estructura de configuración y separación inicial por módulos. | La configuración local dependía de acordar variables de entorno y el motor de persistencia que se utilizaría en el MVP. | Crear la plantilla de configuración y dejar documentado el procedimiento de levantamiento. |
| Javier Andrés Monjes Solórzano | Identificó las entidades principales: usuario, universidad, competencia, certificado, solicitud de ingesta y evento de auditoría. | Era necesario validar las relaciones entre certificado, candidato y universidad para evitar duplicidad de datos. | Elaborar el modelo lógico inicial y preparar las primeras migraciones. |
| Juan José Gerardi Hernández | Definió la estructura visual base, navegación principal y distribución de las pantallas prioritarias. | La maqueta dependía de los campos definitivos que se mostrarían en la ingesta y en la consulta de certificados. | Construir el layout general y las vistas iniciales con datos de prueba controlados. |

**Decisiones consolidadas:** se acordó mantener una estructura modular, separar frontend y backend, centralizar la configuración mediante variables de entorno y construir primero los flujos de mayor valor para el MVP.

---

### Día 2 – Diseño funcional, datos y navegación

| Integrante | ¿Qué se implementó o refinó? | Impedimentos o dependencias identificadas | Plan inmediato |
|---|---|---|---|
| Luis Fernando Gómez Rendón | Verificó la creación de ramas y el uso del tablero; organizó las tareas según dependencia técnica. | Existía riesgo de integrar pantallas antes de contar con contratos claros de datos. | Coordinar revisión corta entre interfaz, backend y datos antes de fusionar cambios. |
| Ander Gilberto Popol Porón | Refinó los criterios de aceptación de la pantalla principal, ingesta y consulta de certificados. | Se detectó que el flujo de emisión debía diferenciar claramente entre registro, validación y publicación del certificado. | Actualizar historias y validar los mensajes funcionales que verá cada actor. |
| Jencer Hamilton Hernández Alonzo | Definió escenarios de prueba para registros incompletos, certificados inexistentes y consultas de verificación. | Faltaba confirmar el formato mínimo del identificador de certificado y el comportamiento ante errores de integración. | Preparar matriz de pruebas y criterios de respuesta para errores controlados. |
| Oswaldo Antonio Choc Cuteres | Ajustó la estructura de rutas y módulos del backend para que los recursos no quedaran concentrados en un solo archivo. | Los endpoints dependían del modelo de datos y de las reglas de validación acordadas. | Implementar rutas base y servicios desacoplados de la capa de presentación. |
| Javier Andrés Monjes Solórzano | Preparó el esquema inicial de tablas y relaciones para usuarios, universidades, certificados y bitácora. | Se debía resolver cómo conservar la referencia institucional de la universidad sin duplicar información en cada certificado. | Aplicar migraciones iniciales y definir claves, índices y restricciones. |
| Juan José Gerardi Hernández | Maquetó el layout de consola y las vistas iniciales para inicio, ingesta y certificados. | La visualización final dependía de los nombres de campos y estados proporcionados por el backend. | Conectar componentes a servicios simulados y dejar preparada la sustitución por API real. |

**Decisiones consolidadas:** se estableció que la interfaz consumiría contratos de datos definidos por el backend; se priorizó la validación de entradas y se dejó preparada una bitácora para acciones relevantes.

---

### Día 3 – Implementación de ingesta y persistencia

| Integrante | ¿Qué se implementó o refinó? | Impedimentos o dependencias identificadas | Plan inmediato |
|---|---|---|---|
| Luis Fernando Gómez Rendón | Supervisó la integración de los primeros cambios y revisó que las ramas no introdujeran conflictos en la estructura común. | Se identificó la necesidad de revisar cambios de datos antes de fusionarlos, porque las migraciones podían afectar a otros módulos. | Establecer revisión obligatoria para migraciones y cambios de contratos. |
| Ander Gilberto Popol Porón | Validó el flujo de ingesta desde la perspectiva de negocio, incluyendo datos obligatorios, estados y mensajes de confirmación. | Era necesario definir qué información debía quedar visible para la universidad y cuál sería interna para administración. | Ajustar criterios de aceptación y validar la visibilidad por rol. |
| Jencer Hamilton Hernández Alonzo | Revisó validaciones de formato y consistencia de los datos de ingesta; propuso pruebas para registros duplicados. | La detección de duplicados requería una regla de negocio acordada entre datos y backend. | Documentar casos límite y verificar respuestas consistentes de la API. |
| Oswaldo Antonio Choc Cuteres | Implementó la base de servicios para recibir solicitudes de ingesta y manejar errores de forma centralizada. | La conexión final con persistencia dependía de la disponibilidad de migraciones y modelos definitivos. | Integrar el servicio con la capa de datos y documentar variables de entorno. |
| Javier Andrés Monjes Solórzano | Implementó o refinó migraciones y modelos para almacenar solicitudes, certificados y eventos asociados. | Se identificó la necesidad de conservar estados históricos para evitar perder trazabilidad de cambios. | Incorporar campos de estado, fechas de creación y actualización, y relación con bitácora. |
| Juan José Gerardi Hernández | Refinó el formulario de ingesta, sus validaciones visuales y la retroalimentación para el usuario. | La pantalla requería respuestas de error normalizadas para mostrar mensajes claros. | Ajustar componentes para consumir respuestas reales del servicio. |

**Decisiones consolidadas:** los estados no se sobrescribirán sin evidencia; se conservarán fechas y eventos relevantes para trazabilidad. La validación se aplicará tanto en interfaz como en backend.

---

### Día 4 – Certificados, verificación y auditoría

| Integrante | ¿Qué se implementó o refinó? | Impedimentos o dependencias identificadas | Plan inmediato |
|---|---|---|---|
| Luis Fernando Gómez Rendón | Dio seguimiento al avance del flujo de certificados y verificó la correspondencia entre tareas del tablero y cambios integrados. | Varias tareas dependían de que el identificador de certificado fuera único y estable. | Coordinar revisión de la regla de generación y preparar integración de la vista final. |
| Ander Gilberto Popol Porón | Validó que la consulta de certificados respondiera al objetivo del MVP: localizar, revisar estado y verificar integridad. | Se debía aclarar qué información puede observar un verificador externo y qué información queda restringida. | Definir criterios de visibilidad y mensajes para certificado válido, inexistente o con inconsistencia. |
| Jencer Hamilton Hernández Alonzo | Revisó los controles de calidad del flujo de verificación y definió pruebas para integridad de la cadena y estados de certificado. | La evidencia de auditoría requería una estructura consistente para relacionar acción, fecha, actor y resultado. | Validar que las operaciones críticas generen eventos de auditoría consultables. |
| Oswaldo Antonio Choc Cuteres | Ajustó los servicios para consulta y verificación, incorporando manejo de errores y configuración separada por ambiente. | La verificación de integridad dependía de la definición de datos que se usarían como evidencia en el MVP. | Implementar la integración con la bitácora y revisar respuestas del servicio. |
| Javier Andrés Monjes Solórzano | Refinó la persistencia de certificados, estados de emisión y eventos de auditoría. | Se detectó que la consulta debía ser eficiente aun cuando el histórico creciera; se requirieron índices sobre identificador y fecha. | Crear índices necesarios y validar consultas frecuentes. |
| Juan José Gerardi Hernández | Implementó o refinó la vista de certificados, mostrando estado, fecha, universidad y controles de verificación. | La interfaz dependía de la definición exacta de los estados que devolvería el backend. | Conectar la vista a la API y asegurar mensajes comprensibles para cada resultado. |

**Decisiones consolidadas:** la verificación se trató como un flujo independiente de la emisión; se establecieron estados explícitos y se reforzó la bitácora para operaciones críticas.

---

### Día 5 – Integración, pruebas y cierre del sprint

| Integrante | ¿Qué se implementó o refinó? | Impedimentos o dependencias identificadas | Plan inmediato |
|---|---|---|---|
| Luis Fernando Gómez Rendón | Coordinó la integración final, revisión de pendientes y preparación de evidencias del sprint. | Algunos cambios requerían pruebas conjuntas antes de fusionarse a la rama principal. | Cerrar pull requests pendientes, etiquetar versión demostrable y actualizar documentación. |
| Ander Gilberto Popol Porón | Realizó validación funcional del flujo completo y registró ajustes menores de usabilidad y reglas de negocio. | Se identificaron mensajes que podían ser ambiguos para usuarios no técnicos. | Priorizar correcciones de alto impacto y preparar demostración del MVP. |
| Jencer Hamilton Hernández Alonzo | Ejecutó pruebas funcionales y de consistencia sobre flujos principales, errores y registros de auditoría. | Quedaron mejoras de cobertura y automatización como trabajo posterior, sin bloquear la demostración. | Documentar resultados de prueba, defectos corregidos y riesgos residuales. |
| Oswaldo Antonio Choc Cuteres | Verificó el levantamiento del sistema, configuración de entorno y estabilidad de servicios principales. | La infraestructura de producción requerirá endurecimiento adicional, monitoreo y gestión formal de secretos. | Dejar guía de ejecución y lista de mejoras para despliegue posterior. |
| Javier Andrés Monjes Solórzano | Validó migraciones, consistencia de datos y consultas principales de certificados. | Se identificó como mejora futura la política de archivado y retención del histórico. | Documentar estrategia inicial de crecimiento, respaldos e índices. |
| Juan José Gerardi Hernández | Realizó ajustes finales de navegación, consistencia visual, mensajes de estado y respuesta de formularios. | Algunas mejoras visuales quedaron como refinamiento posterior para no afectar el cierre del MVP. | Preparar capturas, recorrido de demostración y lista de mejoras de experiencia de usuario. |

**Decisiones consolidadas:** se cerró una versión demostrable con los flujos priorizados; los pendientes no críticos se registraron como backlog técnico para el siguiente ciclo.

---

## 6. Impedimentos recurrentes y tratamiento aplicado

| Impedimento o riesgo | Tratamiento aplicado |
|---|---|
| Dependencia entre pantallas y contratos de API | Se realizaron revisiones breves entre diseño, backend y datos antes de integrar cambios. |
| Posibles inconsistencias por cambios en migraciones | Se estableció revisión previa de cambios de esquema y se documentaron las migraciones. |
| Ambigüedad en estados y reglas de negocio | El Product Owner refinó criterios de aceptación y validó los mensajes visibles para cada actor. |
| Necesidad de trazabilidad y auditoría | Se incorporó una bitácora de eventos para operaciones relevantes desde las primeras iteraciones. |
| Riesgo de concentrar lógica en archivos únicos | Se mantuvo separación por módulos, rutas, servicios, modelos y componentes. |
| Diferencias de configuración entre equipos | Se utilizaron variables de entorno y una guía de levantamiento del proyecto. |

---

## 7. Resultados del refinamiento arquitectónico

Durante los Daily Standups se consolidaron las siguientes decisiones:

1. **Arquitectura modular para el MVP.** La solución se organizó separando interfaz, servicios, persistencia y configuración, evitando concentrar toda la lógica en un único componente o archivo.
2. **Trazabilidad desde el diseño.** Las operaciones relevantes de ingesta, emisión y verificación se vincularon con registros de auditoría para facilitar consulta y seguimiento.
3. **Persistencia preparada para crecimiento.** El modelo de datos considera identificadores únicos, estados, fechas e índices para las consultas principales.
4. **Validación en capas.** La interfaz mejora la experiencia del usuario, mientras que el backend protege la consistencia de reglas y datos.
5. **Integración controlada.** El repositorio y el tablero se utilizaron para reducir conflictos y asegurar que los cambios mantuvieran coherencia con el MVP.
6. **Backlog técnico explícito.** Las mejoras no críticas se registraron para iteraciones posteriores, evitando comprometer la estabilidad de la versión demostrable.

---

## 8. Conclusión

Los Daily Standups permitieron mantener al equipo alineado durante la implementación de la Fase 2. Más allá de informar avances, funcionaron como un mecanismo práctico para detectar dependencias, resolver dudas de negocio y tomar decisiones técnicas de manera oportuna.

El resultado fue una implementación más coherente con la documentación de Fase 1, con responsabilidades claras, flujos priorizados y una base técnica preparada para continuar evolucionando. La evidencia registrada en este documento muestra que Scrum se aplicó como una práctica de seguimiento y mejora continua, no únicamente como una formalidad de planificación.
