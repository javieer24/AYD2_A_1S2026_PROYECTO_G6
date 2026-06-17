# Bitácora del Sprint — Fase 2 — PRCCD/SICA — Grupo 6

## Sprint Planning

**Fecha:** 15/06/2026
**Duración del sprint:** 15/06/2026 → 19/06/2026
**Objetivo del sprint:** Entregar MVP funcional con 5 módulos: ingesta de datos, examen adaptativo, antifraude, credencial inmutable y dashboard BI.

### Sprint Backlog

| # | Tarea | Responsable | Rama | Estado |
|---|-------|-------------|------|--------|
| F2-01 | Adaptador CSV USAC | Javier Monjes — 202100081 | feature/ingesta-usac | In Progress |
| F2-02 | Adaptador JSON UCR | Javier Monjes — 202100081 | feature/ingesta-ucr | In Progress |
| F2-03 | Adaptador XML UES | Javier Monjes — 202100081 | feature/ingesta-ues | In Progress |
| F2-04 | Servicio de ingesta + endpoint REST | Javier Monjes — 202100081 | feature/ingesta-service | To Do |
| F2-05 | Modelo Candidato PostgreSQL/Sequelize | Javier Monjes — 202100081 | feature/ingesta-usac | In Progress |
| F2-06 | Docker Compose base (PG + Mongo + MinIO + Backend) | Javier Monjes — 202100081 | feature/ingesta-usac | In Progress |
| F2-07 | Módulo de examen adaptativo (banco de preguntas) | Equipo | feature/examen-adaptativo | To Do |
| F2-08 | Módulo antifraude (detección facial + ID) | Equipo | feature/antifraude | To Do |
| F2-09 | Emisión de credencial inmutable (blockchain/hash) | Equipo | feature/credencial | To Do |
| F2-10 | Dashboard BI — métricas de certificación | Equipo | feature/dashboard-bi | To Do |
| F2-11 | API Gateway Nginx + configuración de rutas | Javier Monjes — 202100081 | feature/ingesta-usac | In Progress |
| F2-12 | Integración Keycloak — autenticación federada | Equipo | feature/auth-keycloak | To Do |
| F2-13 | Configuración Apache Kafka — bus de eventos | Equipo | feature/kafka | To Do |
| F2-14 | Frontend Vue 3 — pantalla de ingesta | Equipo frontend | feature/frontend-ingesta | To Do |
| F2-15 | Frontend Vue 3 — pantalla de examen | Equipo frontend | feature/frontend-examen | To Do |

### Captura Kanban inicial
[Insertar captura del tablero aquí]

---

## Daily Standups

### Día 1 — Lunes 16/06/2026

#### Javier Andrés Monjes Solórzano — 202100081
1. **¿Qué implementé ayer?**
   Configuré la estructura base del proyecto (monorepo `prccd-mvp/`, docker-compose, dependencias npm). Implementé el adaptador CSV para USAC con `csv-parse`, mapeando los 5 campos al modelo canónico (`student_id → id_candidato`, `full_name → nombre_completo`, `institution → universidad_origen`, `program → carrera`, `courses → cursos_aprobados`). Resultado esperado: los 5 registros del sample parseados correctamente. También se implementaron el adaptador JSON para UCR y el adaptador XML para UES con `xml2js`, junto con el servicio de ingesta y el endpoint `POST /api/ingest`.

2. **¿Qué voy a codificar hoy?**
   Arrancar la integración con Docker (`docker-compose up`), verificar que los tres adaptadores respondan correctamente con los archivos de muestra, y corregir cualquier ajuste de parseo. Avanzar hacia el módulo de examen adaptativo o el módulo de antifraude según prioridad del equipo.
   Trazabilidad: RF-integración → EaC-interoperabilidad → adaptadores como patrón Adapter definido en Sección 10 Fase 1.

3. **¿Hay impedimentos?**
   Ninguno por el momento.

---

### Día 2 — Martes 17/06/2026

#### Javier Andrés Monjes Solórzano — 202100081
1. **¿Qué implementé ayer?**
   _(completar al final del día 2)_

2. **¿Qué voy a codificar hoy?**
   _(completar al inicio del día 2)_

3. **¿Hay impedimentos?**
   _(completar al inicio del día 2)_

---

### Día 3 — Miércoles 18/06/2026

#### Javier Andrés Monjes Solórzano — 202100081
1. **¿Qué implementé ayer?**
   _(completar)_

2. **¿Qué voy a codificar hoy?**
   _(completar)_

3. **¿Hay impedimentos?**
   _(completar)_

---

### Día 4 — Jueves 19/06/2026

#### Javier Andrés Monjes Solórzano — 202100081
1. **¿Qué implementé ayer?**
   _(completar)_

2. **¿Qué voy a codificar hoy?**
   Preparación final para entrega y defensa en vivo 20-21/06/2026.

3. **¿Hay impedimentos?**
   _(completar)_

---

## Sprint Review — Viernes 20/06/2026

_(completar al finalizar el sprint)_

### Demostración
- [ ] Adaptador USAC — CSV parseado correctamente
- [ ] Adaptador UCR — JSON parseado correctamente
- [ ] Adaptador UES — XML parseado correctamente
- [ ] Endpoint `POST /api/ingest` responde 200 con resumen
- [ ] Candidatos persistidos en PostgreSQL
- [ ] Docker Compose levanta todos los servicios

### Incremento entregado
_(completar)_

---

## Sprint Retrospectiva — Viernes 20/06/2026

### ¿Qué salió bien?
_(completar)_

### ¿Qué mejorar?
_(completar)_

### Acuerdos
_(completar)_
