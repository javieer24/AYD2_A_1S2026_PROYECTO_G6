## Fase 1: Plataforma Regional de Certificación de Competencias Digitales - SICA

**Universidad:** Universidad de San Carlos de Guatemala  
**Facultad:** Facultad de Ingeniería  
**Escuela:** Escuela de Ciencias y Sistemas
**Curso:** Análisis y Diseño de Sistemas II
**Período:** Escuela de vacaciones junio de 2026  
**Modalidad:** Proyecto en grupo  
**Enfoque de trabajo:** Documentación y justificación arquitectónica de la solución  

---

## Evolucion documental Fase 1 -> Fase 2 -> Fase 3

La documentacion del proyecto PRCCD/SICA evoluciono de forma incremental y controlada durante las tres fases del curso. No se trato unicamente de acumular archivos, sino de madurar una arquitectura desde su planteamiento conceptual inicial hasta una solucion verificable, integrada y defendible tecnicamente.

Desde una perspectiva de arquitectura de software, cada fase agrego una capa distinta de evidencia: primero se definio el problema y los drivers; luego se materializo el MVP y se contrastaron los supuestos de diseno; finalmente se cerraron los elementos de calidad, pruebas, automatizacion, trazabilidad y evidencia operativa. Esta evolucion permite demostrar que el equipo paso de una arquitectura propuesta a una arquitectura ejecutada, observada y validada.

### Proposito de la evolucion documental

| Proposito | Descripcion |
|---|---|
| Mantener trazabilidad academica | Relacionar cada entregable con los requisitos, atributos de calidad, decisiones arquitectonicas, tareas SCRUM, ramas Git y evidencias de validacion. |
| Reducir ambiguedad tecnica | Documentar no solo que se implemento, sino por que se tomo cada decision y como impacta al ecosistema PRCCD/SICA. |
| Facilitar evaluacion y defensa | Consolidar una narrativa verificable para explicar la arquitectura, el MVP, las integraciones, las pruebas y el cierre del proyecto. |
| Preservar continuidad del equipo | Permitir que cualquier integrante pueda entender el estado del sistema, sus componentes, riesgos, dependencias y criterios de cierre. |

### Resumen ejecutivo por fase

| Fase | Enfoque principal | Pregunta arquitectonica respondida | Resultado documental |
|---|---|---|---|
| Fase 1 | Descubrimiento, analisis y diseno arquitectonico inicial. | Que sistema necesita el caso PRCCD/SICA y bajo que restricciones debe construirse? | Se establecio la vision arquitectonica, los stakeholders, drivers, requisitos, atributos de calidad, casos de uso y vistas iniciales. |
| Fase 2 | Construccion del MVP y validacion temprana de la arquitectura. | La arquitectura propuesta puede materializarse en servicios, interfaces, datos y flujos funcionales? | Se documento la implementacion del MVP, integraciones, dashboard BI, certificados, telemetria, SCRUM, dailies, retrospectiva y evidencia Kanban. |
| Fase 3 | Cierre final, endurecimiento tecnico, pruebas y operabilidad. | El sistema es demostrable, verificable, automatizable y defendible frente a criterios de calidad? | Se agrego evidencia de Kafka, CI/CD, pruebas unitarias, integracion, aceptacion, dashboard actualizado, trazabilidad documental y cierre SCRUM. |

### Evolucion detallada de artefactos

| Area documental | Fase 1 - Base conceptual | Fase 2 - Materializacion MVP | Fase 3 - Cierre y validacion |
|---|---|---|---|
| Vision del sistema | Definicion del problema regional de certificacion digital y alcance PRCCD/SICA. | Ajuste del alcance al MVP ejecutable y priorizacion de funcionalidades centrales. | Consolidacion del alcance final con evidencia de operabilidad, pruebas y defensa. |
| Stakeholders | Identificacion de ministerios, universidades, candidatos, administradores y entidades regionales. | Relacion de stakeholders con flujos reales: ingesta, examen, certificacion, auditoria y dashboard. | Validacion de necesidades mediante pruebas de aceptacion y visibilidad publica de certificados. |
| Requisitos funcionales | Levantamiento de RF principales y casos de uso base. | Implementacion parcial de flujos MVP en frontend y microservicios. | Confirmacion mediante pruebas, scripts, endpoints, videos y evidencia de ejecucion. |
| Atributos de calidad | Definicion de seguridad, interoperabilidad, mantenibilidad, auditabilidad, disponibilidad y usabilidad. | Aplicacion inicial mediante autenticacion, adaptadores, dashboard, evidencia antifraude y servicios separados. | Refuerzo con CI/CD, Jest, Kafka, verificacion publica, logs, pruebas y criterios de Definition of Done. |
| Arquitectura logica | Diagramas UML, componentes conceptuales y responsabilidades por modulo. | Separacion en servicios concretos: auth, ingesta, examen, certificado, auditoria, telemetria, dashboard y notificaciones. | Ajuste final con comunicacion asincrona, eventos Kafka, clientes HTTP reutilizables y contratos de integracion. |
| Arquitectura de despliegue | Vista inicial de infraestructura y distribucion propuesta. | Docker Compose, servicios backend, frontend, bases de datos y dependencias locales. | Pipeline CI/CD, staging, produccion, build de imagenes, pruebas automatizadas y evidencia de despliegue. |
| Datos e integracion | Modelo conceptual, fuentes externas y formatos universitarios. | Adaptadores USAC/UCR/UES, persistencia, normalizacion y validacion de expedientes. | Pruebas sobre adaptadores, contratos de integracion, eventos y trazabilidad entre servicios. |
| Analitica y dashboard | Necesidad de visibilidad gerencial identificada como driver de analitica. | Dashboard BI con graficas por pais, carrera, genero y estado operativo inicial. | Dashboard actualizado con endpoint `/stats`, datos Fase 3 e indicador de pipeline CI/CD. |
| Seguridad y certificacion | Requisitos de autenticacion, integridad, no repudio y verificacion. | Emision de certificados, hashing, PKI y evidencia antifraude. | Flujo completo con certificado emitido, evento, email y verificacion publica sin login. |
| Gestion agil | Definicion de roles y tablero Kanban inicial. | Sprint Backlog Fase 2, Daily Standups, retrospectiva, burndown y capturas Kanban. | Sprint Backlog Fase 3, trazabilidad final, captura inicial, evidencias de cierre y criterios SCRUM. |
| Pruebas y calidad | Criterios de calidad esperados, sin automatizacion completa. | Validaciones manuales y pruebas funcionales de componentes MVP. | Jest configurado, pruebas unitarias, integracion, aceptacion y evidencia de resultados. |

### Trazabilidad entre fases

| Elemento trazable | Origen en Fase 1 | Evidencia en Fase 2 | Consolidacion en Fase 3 |
|---|---|---|---|
| RF de certificacion | Caso de uso de emision y consulta de certificado. | Servicio de certificado, hash, PKI y visualizacion inicial. | Emision conectada a Kafka, email y verificacion publica sin autenticacion. |
| RF de evaluacion | Flujo de examen y dictamen del candidato. | Motor de examen adaptativo y banco de preguntas. | Prueba de aceptacion examen voz -> aprueba -> certificado -> email -> verify. |
| EaC de interoperabilidad | Integracion con universidades y formatos externos. | Adaptadores CSV, JSON y XML para expedientes. | Pruebas automatizadas y contratos de entrada para adaptadores. |
| EaC de auditabilidad | Necesidad de evidencia, logs y trazabilidad de acciones. | Evidencia antifraude, telemetria y auditoria inicial. | Eventos Kafka, auditoria inmutable, evidencias de pruebas y tablero de seguimiento. |
| EaC de mantenibilidad | Separacion modular propuesta por componentes. | Microservicios y rutas separadas por dominio. | Jest, CI/CD, contratos, ramas Git Flow y documentacion de evolucion. |
| EaC de operabilidad | Necesidad de operar y monitorear el sistema. | Docker Compose y dashboard de estado. | Pipeline Staging/Produccion, build automatizado y dashboard con estado CI/CD. |

### Criterio de cierre documental

| Nivel de madurez | Evidencia esperada | Estado alcanzado |
|---|---|---|
| Intencion arquitectonica | La Fase 1 define el problema, actores, drivers, restricciones y arquitectura objetivo. | Alcanzado: existe base documental para justificar el diseno. |
| Ejecucion tecnica | La Fase 2 demuestra que el diseno puede implementarse como MVP funcional. | Alcanzado: existen servicios, frontend, integraciones, tablero SCRUM y evidencia de avance. |
| Validacion operativa | La Fase 3 comprueba comportamiento mediante pruebas, eventos, CI/CD, dashboard y evidencias. | Alcanzado: se agregan pruebas, automatizacion, trazabilidad final y soporte para defensa. |
| Transferencia de conocimiento | La documentacion permite que otro integrante comprenda estado, decisiones y dependencias. | Alcanzado: README, SCRUM.md, backlog, dailies, retrospectiva y capturas Kanban actuan como memoria tecnica. |

### Lectura arquitectonica final

La evolucion documental evidencia que el proyecto paso por tres niveles de madurez: definicion, implementacion y validacion. En la primera fase se establecio el marco de decision; en la segunda se comprobo la viabilidad mediante un MVP; y en la tercera se reforzo la calidad con pruebas, automatizacion, eventos asincronos, dashboard operativo y evidencia SCRUM.

Como resultado, el repositorio no solo contiene codigo y diagramas, sino una linea historica de decisiones tecnicas. Esto permite defender el proyecto como una arquitectura viva: una solucion que cambio a medida que se descubrieron restricciones reales, dependencias entre servicios, necesidades de integracion, riesgos de operacion y criterios de calidad verificables.

---

## Cuadro de roles del grupo

| Integrante | Carnet | Rol propuesto | Responsabilidad principal |
|---|---:|---|---|
| Luis Fernando Gómez Rendón | 201801391 | Scrum Master / Coordinador de repositorio | Organizar el flujo de trabajo, validar estructura del repositorio, coordinar merges, revisar que se cumpla Git Flow y consolidar avances. |
| Ander Gilberto Popol Porón | 201801518 | Product Owner / Analista de negocio | Asegurar que la solución responda al caso SICA, stakeholders, preocupaciones, core del negocio y priorización de características. |
| Jencer Hamilton Hernández Alonzo | 202002141 | Arquitecto de drivers y calidad | Identificar requisitos funcionales, escenarios de atributos de calidad, restricciones y su relación con el problema. |
| Oswaldo Antonio Choc Cuteres | 201901844 | Arquitecto de sistema e infraestructura | Diseñar vistas arquitectónicas, diagrama de bloques, componentes, despliegue y distribución física. |
| Javier Andrés Monjes Solórzano | 202100081 | Diseñador de datos e integración | Elaborar diseño de datos, auditoría, almacenamiento, interoperabilidad, APIs, autenticación y formatos externos. |
| Juan José Gerardi Hernández | 201900532 | Diseñador UI/UX y patrones | Prototipos de interfaces, patrones de diseño, diagramas UML de clases y apoyo en presentación final. |

---

## Consideraciones para el trabajo en Git

El equipo trabajará bajo una estrategia de Git Flow adaptada a la fase documental. La rama principal de trabajo documental será:

```bash
develop/docs
```


A partir de esta rama podrán generarse ramas específicas por sección o entregable, por ejemplo:

```bash
feature/docs-stakeholders
feature/docs-drivers
feature/docs-cdu
feature/docs-trazabilidad
feature/docs-arquitectura
feature/docs-infraestructura
feature/docs-datos
feature/docs-uiux
feature/docs-patrones
feature/docs-kanban
feature/docs-presentacion
```

Cada commit deberá respetar el formato indicado en el enunciado:

```bash
carnet: mensaje
```

Ejemplos:

```bash
201801518: crear estructura base de documentacion
201801391: agregar stakeholders y caso de negocio
202002141: agregar drivers arquitectonicos del sistema
201901844: agregar vistas arquitectonicas de sistema e infraestructura
202100081: agregar diseno de datos e integracion
201900532: agregar prototipos y patrones de diseno
```

---

# Evidencia del Tablero Kanban

Para la gestión ágil del proyecto se utiliza un tablero Kanban en Trello correspondiente al proyecto AYD2_A_1S2026_PROYECTO_G6.

## Herramienta utilizada

Trello.

## Columnas configuradas

El tablero cuenta con las columnas mínimas requeridas para evidenciar el flujo de trabajo del proyecto:

- To Do
- Blocked
- In Progress
- Ready for Testing
- Test/QA
- Done

## Evidencia

La evidencia visual del tablero Kanban se muestra a continuación:

![Tablero Kanban - Vista general](imagenes/trello_kanban_01.jpg)

![Tablero Kanban - Vista complementaria](imagenes/trello_kanban_02.jpg)

## Observación

El tablero debe utilizarse para representar historias de usuario y tareas relacionadas con el desarrollo arquitectónico de la Plataforma Regional de Certificación de Competencias Digitales. Se debe evitar que el backlog principal esté compuesto únicamente por tareas documentales.
