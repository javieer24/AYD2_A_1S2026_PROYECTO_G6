# PRCCD – SICA
## Sprint Retrospective
### Proyecto Fase 2 – MVP

**Universidad de San Carlos de Guatemala**  
**Facultad de Ingeniería – Escuela de Ciencias y Sistemas**  
**Análisis y Diseño de Sistemas 2, Sección A**  
**Escuela de Vacaciones, Junio 2026**

---

## 1. Propósito

La presente retrospectiva documenta los principales aprendizajes obtenidos durante la implementación de la Fase 2 del proyecto **Plataforma Regional de Certificación de Competencias Digitales (PRCCD) para el Sistema de la Integración Centroamericana (SICA)**.

El análisis se elaboró a partir de la interacción del equipo con el código fuente real, la integración de los módulos del MVP y los ajustes realizados frente a los planteamientos definidos en la Fase 1. Su finalidad es identificar las decisiones que funcionaron, los supuestos que debieron ajustarse y las mejoras técnicas que permitirán mantener y evolucionar el ecosistema de manera ordenada.

---

## 2. Objetivos de la retrospectiva

- Evaluar las decisiones de diseño y arquitectura que se validaron durante la implementación.
- Identificar diferencias entre la planificación teórica de la Fase 1 y las necesidades encontradas en el código real.
- Registrar cuellos de botella, dependencias y refactorizaciones necesarias.
- Proponer mejoras concretas para futuros Sprints y para la evolución del MVP.
- Mantener evidencia de los acuerdos técnicos y de proceso alcanzados por el equipo.

---

## 3. Hallazgos por integrante

| Integrante | Rol principal | ¿Qué decisiones de diseño y patrones arquitectónicos se consolidaron con éxito al interactuar con el código fuente real? | ¿Qué supuestos teóricos o diagramas de la Fase 1 demostraron fallas evidentes, provocaron cuellos de botella o requirieron una refactorización de emergencia durante la implementación? | ¿Qué mejoras técnicas concretas se proponen para asegurar la mantenibilidad futura del ecosistema? |
|---|---|---|---|---|
| **Luis Fernando Gómez Rendón** | Scrum Master / Coordinador de repositorio | Se consolidó la organización del trabajo mediante un repositorio centralizado, ramas por funcionalidad, tablero Kanban y seguimiento del Sprint. En el código se validó la necesidad de dividir las tareas por módulos funcionales, evitando que varias personas modificaran simultáneamente los mismos archivos críticos. También se consolidó el uso de una estructura ordenada de documentación, evidencias y entregables para que el avance técnico fuera trazable. | En Fase 1 se asumió que la planificación inicial y la división documental serían suficientes para implementar sin ajustes. Durante el desarrollo fue necesario adaptar el tablero y reorganizar tareas porque la integración entre frontend, backend, autenticación e ingesta generó dependencias reales que no eran visibles únicamente en los diagramas. Se evidenció que algunas tareas inicialmente consideradas independientes requerían coordinación previa sobre contratos de API, rutas y estructura de datos. | Mantener un backlog técnico separado del backlog funcional; definir criterios de aceptación y definición de terminado para cada tarjeta; exigir revisión de código antes de fusionar ramas; estandarizar nombres de ramas y commits; registrar bloqueos técnicos en Kanban; automatizar validaciones básicas mediante integración continua; mantener un archivo de decisiones arquitectónicas y cambios realizados durante cada Sprint. |
| **Ander Gilberto Popol Porón** | Product Owner / Analista de negocio | Se consolidó la priorización del MVP sobre los flujos de mayor valor: acceso al sistema, navegación principal e ingesta de expedientes académicos. Se comprobó que traducir los requerimientos funcionales, stakeholders y casos de uso en historias de usuario permitió orientar la implementación hacia funciones demostrables. También se consolidó la necesidad de mantener la autenticación existente sin alterarla mientras se integraban los nuevos módulos. | En Fase 1 se modeló una plataforma regional completa con examen adaptativo, certificación, auditoría, analítica e integración de varias universidades. Al implementar, se confirmó que no era viable construir todos esos dominios al mismo tiempo dentro del Sprint. Fue necesario acotar el alcance al MVP y priorizar el módulo de ingesta como demostración del problema de interoperabilidad. Algunos casos de uso estaban correctamente planteados a nivel de negocio, pero requerían mayor detalle técnico sobre validaciones, mensajes de error, estados de carga y reglas de aceptación. | Refinar las historias de usuario con criterios de aceptación verificables; mantener una matriz que relacione requerimientos, endpoints, pantallas y pruebas; documentar reglas de negocio del proceso de ingesta; definir datos de prueba representativos para CSV, JSON y otros formatos; incorporar validación temprana con usuarios o docentes sobre las pantallas principales; mantener priorizado el backlog según valor de negocio, riesgo técnico y dependencia. |
| **Jencer Hamilton Hernández Alonzo** | Arquitecto de drivers y calidad | Se consolidó la separación de responsabilidades entre interfaz, rutas, servicios de consumo, backend y persistencia. El código real confirmó que los drivers de calidad, especialmente mantenibilidad, seguridad, interoperabilidad y disponibilidad, deben reflejarse en decisiones concretas: contratos de API, validaciones, manejo de errores y módulos independientes. También se validó que la autenticación no debe mezclarse con la lógica específica de ingesta, permitiendo preservar el mecanismo de login existente. | La arquitectura híbrida propuesta en Fase 1 era adecuada como visión de largo plazo, pero resultó demasiado amplia para implementarla literalmente en el MVP. El supuesto de iniciar directamente con múltiples microservicios, eventos, PKI, blockchain, dashboards y conectores universitarios habría incrementado la complejidad operativa y dificultado las pruebas. Se requirió aterrizar el diseño a módulos claramente delimitados y a una integración inicial síncrona por API, dejando la comunicación asíncrona para procesos de mayor carga o procesamiento diferido. | Crear una especificación versionada de API con OpenAPI/Swagger; agregar pruebas unitarias, de integración y de contrato; centralizar el manejo de excepciones y códigos HTTP; definir políticas de validación de entrada y salida; incorporar análisis estático, cobertura de pruebas y revisión de calidad en el pipeline; establecer métricas de rendimiento para carga de archivos y procesamiento de expedientes; documentar los atributos de calidad que serán medidos en cada nueva iteración. |
| **Oswaldo Antonio Choc Cuteres** | Arquitecto de sistema e infraestructura | Se consolidó la arquitectura por capas y el uso de un punto de acceso común mediante gateway para consumir el backend. La implementación permitió comprobar que mantener frontend y backend desacoplados facilita el despliegue, las pruebas y la evolución de cada componente. También se consolidó la configuración externa mediante variables de entorno para no fijar URLs, credenciales o parámetros sensibles directamente en el código. | Los diagramas de infraestructura de Fase 1 planteaban una solución completa con componentes distribuidos, escalamiento, servicios especializados y despliegue on-premise preparado para nube. En el MVP se evidenció que desplegar toda esa infraestructura desde el inicio no era proporcional al alcance ni al tiempo disponible. También se identificó que asumir conectividad, puertos, rutas y servicios disponibles sin una configuración centralizada puede generar fallas de integración entre frontend, gateway y backend. | Contenerizar los servicios con Docker y definir un entorno reproducible con Docker Compose; separar configuraciones de desarrollo, pruebas y producción; centralizar secretos y variables de entorno; agregar health checks, logs estructurados y monitoreo; documentar el procedimiento de despliegue y recuperación; preparar una estrategia gradual de escalamiento para la carga de ingesta; incorporar respaldos de base de datos y políticas de retención de archivos cargados. |
| **Javier Andrés Monjes Solórzano** | Diseñador de datos e integración | Se consolidó la necesidad de un módulo de ingesta independiente para recibir y normalizar información académica proveniente de sistemas heterogéneos. La interacción con el backend confirmó que los datos deben validarse antes de persistirse y que la integración debe exponer contratos claros para el frontend. También se validó la separación entre datos transaccionales, registros de procesamiento y evidencias de errores, lo cual facilita auditoría y trazabilidad. | En Fase 1 se asumía que la interoperabilidad entre universidades podía representarse de forma uniforme mediante conectores abstractos. Durante la implementación se comprobó que los formatos reales requieren reglas explícitas de mapeo, validación de campos obligatorios, tratamiento de duplicados y reporte de filas inválidas. También se evidenció que cargar archivos directamente sin control de tamaño, estructura y estado de procesamiento puede convertirse en un cuello de botella y afectar la consistencia de los datos. | Definir un esquema canónico de expediente académico y adaptadores por universidad o formato; versionar los contratos de importación; implementar validación de archivos, límites de tamaño, control de duplicados e idempotencia; registrar bitácoras de carga con estado, fecha, usuario, errores y resultados; procesar cargas masivas de forma asíncrona cuando el volumen aumente; agregar migraciones controladas, índices y respaldos; crear pruebas con archivos válidos, incompletos, duplicados y malformados. |
| **Juan José Gerardi Hernández** | Diseñador UI/UX y patrones | Se consolidó una estructura de frontend organizada por vistas, rutas, componentes y servicios, evitando concentrar toda la lógica en un único archivo. La implementación confirmó que separar la pantalla principal, la vista de ingesta y los servicios de API mejora la legibilidad y permite reutilizar componentes. También se consolidó el patrón de rutas protegidas o controladas por autenticación, respetando el login ya implementado y evitando duplicar esa lógica. | Los prototipos de Fase 1 mostraban el flujo general de la plataforma, pero no contemplaban con suficiente detalle los estados reales de la interfaz: carga, error de conexión, archivo inválido, carga exitosa, resultados parciales y reintentos. Durante la integración fue necesario ajustar la navegación y la distribución de componentes para que las rutas no afectaran el flujo de autenticación existente ni mezclaran lógica visual con consumo de API. | Crear una biblioteca interna de componentes reutilizables; centralizar el cliente HTTP y los interceptores de autenticación; implementar estados de carga, error, confirmación y accesibilidad en todas las pantallas; definir validaciones de formulario tanto en cliente como en servidor; agregar pruebas de componentes y pruebas de flujo de usuario; documentar las rutas y permisos por rol; mantener un sistema de diseño con estilos, tipografías, espaciados y patrones de interacción consistentes. |

---

## 4. Aspectos que funcionaron durante el Sprint

1. **Priorización del MVP:** se concentró el esfuerzo en los flujos que demostraban valor inmediato, especialmente autenticación, navegación e ingesta de expedientes académicos.
2. **Separación por módulos:** la división entre interfaz, rutas, servicios, persistencia y configuración facilitó el trabajo paralelo y redujo el riesgo de conflictos.
3. **Control de cambios:** el uso de repositorio centralizado, ramas funcionales y tablero Kanban permitió mantener visibilidad sobre avances y bloqueos.
4. **Respeto a componentes existentes:** se preservó la autenticación ya implementada y se evitó mezclarla con la lógica específica de ingesta.
5. **Refinamiento progresivo:** las decisiones de Fase 1 se usaron como guía, pero se ajustaron conforme aparecieron dependencias y restricciones reales.

---

## 5. Aspectos que deben mejorarse

1. **Mayor detalle técnico desde la planificación:** los casos de uso y diagramas deben complementarse con contratos de API, validaciones, estados de error y criterios de aceptación verificables.
2. **Gestión explícita de dependencias:** las tareas de frontend, backend, datos e infraestructura no deben tratarse como completamente independientes cuando comparten contratos o flujos.
3. **Automatización de calidad:** las revisiones manuales deben reforzarse con pruebas, análisis estático e integración continua.
4. **Preparación de datos de prueba:** se requieren archivos y escenarios representativos para validar cargas válidas, incompletas, duplicadas y malformadas.
5. **Evolución gradual de arquitectura:** la visión híbrida de largo plazo debe implementarse por etapas, evitando incorporar componentes distribuidos antes de que el MVP los necesite.

---

## 6. Acciones de mejora priorizadas para el siguiente Sprint

| Prioridad | Acción | Responsable principal | Resultado esperado |
|---|---|---|---|
| Alta | Versionar y publicar la especificación de API. | Jencer Hamilton Hernández Alonzo / Oswaldo Antonio Choc Cuteres | Contratos claros para frontend, backend e integración. |
| Alta | Definir criterios de aceptación y definición de terminado por historia. | Ander Gilberto Popol Porón / Luis Fernando Gómez Rendón | Historias verificables y menor retrabajo durante la integración. |
| Alta | Implementar validación completa de archivos y bitácora de cargas. | Javier Andrés Monjes Solórzano | Mayor consistencia, trazabilidad y control de errores de ingesta. |
| Alta | Centralizar manejo de errores, autenticación y configuración de entorno. | Oswaldo Antonio Choc Cuteres / Juan José Gerardi Hernández | Integración más estable entre módulos y ambientes. |
| Media | Incorporar pruebas unitarias, de integración y de flujo de usuario. | Jencer Hamilton Hernández Alonzo / Equipo | Detección temprana de regresiones y mayor confianza en cambios. |
| Media | Crear componentes reutilizables y documentar rutas por rol. | Juan José Gerardi Hernández | Interfaz consistente, mantenible y fácil de ampliar. |
| Media | Preparar Docker Compose, health checks y guía de despliegue. | Oswaldo Antonio Choc Cuteres | Entorno reproducible y menor dependencia de configuraciones manuales. |
| Media | Mantener un registro de decisiones arquitectónicas. | Luis Fernando Gómez Rendón / Equipo | Evidencia de cambios, razones y consecuencias para futuras iteraciones. |

---

## 7. Conclusión

La retrospectiva confirma que la Fase 1 proporcionó una visión útil del problema, de los actores, de los requisitos y de la arquitectura objetivo. Sin embargo, la implementación del MVP demostró que los diagramas y planteamientos iniciales debían traducirse en decisiones más concretas sobre contratos, validaciones, configuración, persistencia, pruebas y experiencia de usuario.

El principal aprendizaje fue que la arquitectura híbrida definida para la plataforma debe evolucionar de manera gradual. Para el MVP resultó más conveniente consolidar módulos desacoplados, integración síncrona por API, persistencia controlada y una estructura de frontend organizada. Los componentes de mayor complejidad, como procesamiento asíncrono, conectores especializados, eventos, PKI, blockchain y analítica avanzada, quedan como una evolución planificada cuando el volumen, los riesgos y el alcance funcional lo justifiquen.

Las acciones propuestas permitirán que los siguientes Sprints mantengan la coherencia del ecosistema, reduzcan retrabajo y faciliten el crecimiento de la Plataforma Regional de Certificación de Competencias Digitales.
