# Plataforma Regional de Certificacion de Competencias Digitales

## PRCCD - SICA

Universidad San Carlos de Guatemala
Facultad de Ingenieria
Escuela de Ciencias y Sistemas
Analisis y Diseno de Sistemas 2 - Seccion A

**Proyecto Fase 1**

| Nombre | Carne
|--------|-------|
| | - |
| Oswaldo Choc | 201901844
| Jencer Hamilton | - |
| Javier Monjes | - |
|  | - |
|  | - |

Catedratica: Ing. Claudia Rojas de Moran
Primer Semestre 2026

---

# Tabla de Contenido

1. Identificacion del caso de negocio y Stakeholders
   - 1.1 Listado de Stakeholders y preocupaciones arquitectonicas
   - 1.2 Core del negocio
2. Caracteristicas del sistema y Drivers Arquitectonicos
   - 2.1 Drivers RF - Requerimientos Funcionales
   - 2.2 Drivers EaC - Escenarios de Atributos de Calidad
   - 2.3 Drivers de Restriccion
   - 2.4 Caracteristicas priorizadas del sistema
3. Diagramas de CDU expandidos
   - 3.1 Diagrama de casos de uso expandidos
   - 3.2 Detalle de drivers por CDU
4. Matrices de trazabilidad
   - 4.1 Stakeholders vs Requerimientos
   - 4.2 Stakeholders vs CDU
   - 4.3 Requerimientos vs CDU
5. Seleccion arquitectonica
6. Vistas Arquitectonicas - Nivel de Sistema
7. Vistas Arquitectonicas - Nivel de Infraestructura
8. Diseno de Datos
9. Diseno de Interfaces UI/UX
10. Patrones de Diseno
11. Gestion del Proyecto

---

# 1. Identificacion del caso de negocio y Stakeholders

## 1.1 Listado de Stakeholders y preocupaciones arquitectonicas

> *Seccion a cargo de: Jencer Hamilton*

---

## 1.2 Core del negocio

> *Seccion a cargo de: Jencer Hamilton*

---

# 2. Caracteristicas del sistema y Drivers Arquitectonicos

## 2.1 Drivers RF - Requerimientos Funcionales

| ID | Requisito Funcional | Prioridad |
|----|---------------------|-----------|
| RF-01 | El sistema debe permitir la autenticacion federada mediante los protocolos LDAP, SAML y OAuth2 segun la institucion universitaria | Alta |
| RF-02 | El sistema debe ejecutar evaluaciones mediante un motor de examenes adaptativos que ajuste la dificultad en tiempo real segun las respuestas previas del candidato | Alta |
| RF-03 | El sistema debe capturar y almacenar evidencia antifraude durante la evaluacion, incluyendo capturas de pantalla, logs de tecleo y rafagas de video | Alta |
| RF-04 | El sistema debe emitir certificados digitales verificables criptograficamente mediante PKI o Blockchain (Hyperledger) | Alta |
| RF-05 | El sistema debe mantener un rastro de auditoria inmutable por cada certificado emitido | Alta |
| RF-06 | El sistema debe importar y exportar datos academicos en formatos JSON, XML y CSV | Media |
| RF-07 | El sistema debe integrarse nativamente con los sistemas de USAC, UCR y UES sin obligar a estas instituciones a cambiar su forma de operar | Alta |
| RF-08 | El sistema debe generar dashboards analiticos segmentados por pais, carrera universitaria y genero | Media |
| RF-09 | El sistema debe anonimizar y agregar los datos antes de exponerlos en las interfaces gerenciales | Alta |
| RF-10 | El sistema debe permitir la verificacion externa de un certificado mediante codigo, QR o hash | Media |
| RF-11 | El sistema debe gestionar usuarios, roles y permisos por institucion | Media |
| RF-12 | El sistema debe habilitar los periodos de certificacion exclusivamente durante la primera semana de cada mes | Alta |

---

## 2.2 Drivers EaC - Escenarios de Atributos de Calidad

| ID | Atributo | Estimulo | Entorno | Respuesta esperada | Medida |
|----|----------|----------|---------|-------------------|--------|
| EaC-01 | Escalabilidad | Miles de usuarios acceden simultaneamente | Primera semana del mes, periodo de certificacion | El sistema escala sin degradar el servicio | Tiempo de respuesta < 3 seg con 5,000 usuarios simultaneos |
| EaC-02 | Disponibilidad | Fallo de un componente interno | Periodo de certificacion activo | El sistema continua operando mediante redundancia | Disponibilidad >= 99.9% |
| EaC-03 | Seguridad | Intento de alteracion de una calificacion | En cualquier momento | El sistema rechaza la alteracion y registra el intento | 0 modificaciones no autorizadas en la bitacora |
| EaC-04 | Interoperabilidad | Universidad envia datos en CSV legacy | Integracion con sistema heredado | El sistema ingesta y normaliza los datos correctamente | 100% de registros procesados sin perdida |
| EaC-05 | Rendimiento | Candidato responde una pregunta | Durante evaluacion activa | El motor adaptativo calcula y presenta la siguiente pregunta | Tiempo de ajuste < 2 segundos |
| EaC-06 | Privacidad | Solicitud de datos para dashboard gerencial | Consulta analitica | El sistema expone solo datos agregados y anonimizados | 0 datos personales identificables expuestos |
| EaC-07 | Auditabilidad | Ministerio solicita verificar un certificado | Post emision | El sistema provee trazabilidad completa e inmutable | Tiempo de consulta de auditoria < 5 segundos |
| EaC-08 | Mantenibilidad | Se requiere agregar un nuevo protocolo de autenticacion | Evolucion del sistema | El sistema permite integrar el nuevo protocolo sin afectar otros modulos | Tiempo de integracion < 2 semanas |

---

## 2.3 Drivers de Restriccion

| ID | Tipo | Restriccion |
|----|------|-------------|
| R-01 | Economica | El presupuesto maximo para el piloto es de USD 180,000 |
| R-02 | Tecnologica | Se debe priorizar el uso de tecnologias Open Source para optimizar costos de licenciamiento |
| R-03 | Operativa | La primera version debe desplegarse on-premise reutilizando infraestructura existente del SICA |
| R-04 | Tecnologica | La arquitectura debe estar preparada para migracion transparente a la nube en fases posteriores |
| R-05 | Normativa | Debe cumplir con GDPR y leyes locales de proteccion de datos de cada pais miembro |
| R-06 | Normativa | La evidencia antifraude debe retenerse de forma inalterable por un minimo de 5 anos |
| R-07 | Normativa | Cada certificado debe tener validez juridica transfronteriza respaldada por firma electronica avanzada |
| R-08 | Operativa | La arquitectura debe integrarse con sistemas legados sin obligar a las universidades a modificar sus procesos |
| R-09 | Temporal | La primera version arquitectonica debe estar completamente definida y documentada en 3-4 semanas |

---

## 2.4 Caracteristicas priorizadas del sistema

| Prioridad | Caracteristica | Justificacion de impacto |
|-----------|---------------|--------------------------|
| 1 | Motor de evaluacion adaptativa | Es el nucleo funcional del negocio, sin esto no hay plataforma |
| 2 | Emision de certificados verificables criptograficamente | Es la propuesta de valor principal ante ministerios e instituciones |
| 3 | Autenticacion federada e integracion universitaria | Sin integracion con USAC/UCR/UES no hay usuarios en el sistema |
| 4 | Auditoria antifraude inmutable | Requisito legal y de confianza institucional obligatorio |
| 5 | Privacidad y cifrado de datos | Cumplimiento normativo no negociable (GDPR) |
| 6 | Dashboards analiticos anonimizados | Valor estrategico para ministerios de educacion y trabajo |
| 7 | Escalabilidad en picos de trafico | Garantia de calidad de servicio durante certificaciones |
| 8 | Preparacion para migracion a nube | Vision de evolucion tecnologica a largo plazo |

---

# 3. Diagramas de CDU expandidos

## 3.1 Diagrama de casos de uso expandidos

> *Seccion a cargo de: Jencer Hamilton*

---

## 3.2 Detalle de drivers por CDU

> *Seccion a cargo de: Jencer Hamilton*

---

# 4. Matrices de trazabilidad

> *Seccion a cargo de: Jencer Hamilton*

## 4.1 Stakeholders vs Requerimientos

> *Pendiente*

---

## 4.2 Stakeholders vs CDU

> *Pendiente*

---

## 4.3 Requerimientos vs CDU

> *Pendiente*

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

| Driver | Como lo atiende la arquitectura seleccionada |
|--------|----------------------------------------------|
| EaC-01 Escalabilidad 5,000 usuarios | El servicio de examenes escala horizontalmente de forma independiente |
| EaC-02 Disponibilidad 99.9% | Cada microservicio tiene redundancia propia; un fallo no compromete el sistema completo |
| EaC-03 Seguridad auditoria inmutable | Los eventos de auditoria se registran de forma asincrona e inmutable en el bus de mensajes |
| EaC-04 Integracion con CSV legacy | Un microservicio de integracion dedicado por universidad maneja cada protocolo y formato |
| EaC-05 Rendimiento motor adaptativo | El motor de examenes es un servicio aislado, sin dependencias que puedan degradarlo |
| EaC-08 Agregar nuevo protocolo | Se agrega un nuevo adaptador sin modificar los servicios existentes |
| R-02 Open Source | Todos los componentes seleccionados tienen alternativas Open Source viables |
| R-03 On-premise | Los microservicios se contendorizan con Docker y se orquestan con Kubernetes on-premise |
| R-04 Migracion a nube | La contenedorizacion permite mover los servicios a cualquier proveedor cloud sin rediseno |

---

# 6. Vistas Arquitectonicas - Nivel de Sistema

## 6.1 Diagrama de bloques

> *Diagrama pendiente de generacion en draw.io*

## 6.2 Descripcion del diagrama de bloques

> *Pendiente*

---

# 7. Vistas Arquitectonicas - Nivel de Infraestructura

## 7.1 Diagrama de componentes

> *Diagrama pendiente de generacion en draw.io*

## 7.2 Diagrama de despliegue

> *Diagrama pendiente de generacion en draw.io*

## 7.3 Diagrama de distribucion

> *Diagrama pendiente de generacion en draw.io*

## 7.4 Justificacion de tecnologias y frameworks

> *Pendiente*

---

# 8. Diseno de Datos

> *Seccion a cargo de: Javier*

---

# 9. Diseno de Interfaces UI/UX

> *Seccion a cargo de: equipo*

---

# 10. Patrones de Diseno

> *Seccion a cargo de: Juan Herrera*

---

# 11. Gestion del Proyecto

> *Tablero Kanban: https://trello.com/b/XWZkVwXY*

> *Repositorio: AYD2_A_1S2026_PROYECTO_G6*

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

