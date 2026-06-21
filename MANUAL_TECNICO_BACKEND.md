# Manual Técnico del Backend — PRCCD/SICA

> Documento de respaldo para la defensa del MVP. Complementa
> `GUION_DEFENSA_BACKEND.md` (guión oral) con el detalle técnico que el
> tribunal pueda pedir: cómo funciona el sistema, por qué se tomó cada
> decisión de arquitectura, y qué impacto tiene en el presupuesto definido
> en Fase 1. Fuentes primarias, más detalladas que este resumen:
> `prccd-mvp/ARQUITECTURA.md`, `prccd-mvp/API_ENDPOINTS.md`,
> `prccd-mvp/TRAZABILIDAD_FASE1.md`, `PRCCD_Fase1_G6.md`.

---

## 1. Visión general

El backend de PRCCD es un conjunto de **7 microservicios independientes**
(Node.js + Express, un proceso/contenedor por dominio de negocio), detrás de
un gateway Nginx que rutea por path. Surge de migrar un monolito modular
construido en un primer corte de Fase 2 hacia la arquitectura de
microservicios con orientación a eventos que se diseñó en Fase 1
(`PRCCD_Fase1_G6.md`, sección 5).

```
                         ┌──────────────┐
   Internet / Frontend → │  Nginx (80)  │
                         └──────┬───────┘
        ┌──────────┬──────────┼──────────┬──────────┬──────────┬──────────┐
        ▼          ▼          ▼          ▼          ▼          ▼          ▼
     auth      ingesta     examen   certificado  telemetria  auditoria  dashboard
     :3001      :3002      :3003       :3004        :3005       :3006      :3007
        └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
              PostgreSQL          MongoDB             MinIO
            (compartida x7)   (banco preguntas)   (evidencia cifrada)
```

| Servicio | Puerto | Dominio | Persistencia |
|---|---|---|---|
| `auth-service` | 3001 | Auth staff + login federado simulado de candidatos | Postgres (`candidatos`, lectura) |
| `ingesta-service` | 3002 | Adaptadores USAC (CSV) / UCR (JSON) / UES (XML) | Postgres (`candidatos`, escritura) |
| `examen-service` | 3003 | Motor adaptativo + banco de preguntas | Postgres (`sesiones_examen`) + MongoDB (`prccd_docs.preguntas`) |
| `certificado-service` | 3004 | Emisión simple (F2-27) + PKI/log inmutable (F2-17/18) | Postgres (`certificados`, `certificados_pki`) |
| `telemetria-service` | 3005 | Antifraude + evidencia cifrada (F2-13/14) | Postgres (`auditoria`, `evidencia_antifraude`) + MinIO (bucket `evidencias`) |
| `auditoria-service` | 3006 | Bitácora general, retención 5 años | Postgres (`auditoria`) |
| `dashboard-service` | 3007 | BI agregado y anonimizado | Postgres (`candidatos`, `sesiones_examen`, `certificados`, lectura) |

Infraestructura compartida (no son servicios de negocio): `postgres`,
`mongodb`, `minio`, `nginx`.

---

## 2. Marco de toma de decisiones

Todas las decisiones técnicas de este backend siguen el mismo proceso, que
es el que se documentó en Fase 1 y se respetó en Fase 2:

1. **Se parte de un driver documentado** — un Requisito Funcional (RF), un
   Escenario de Atributo de Calidad (EaC) o una Restricción (R) de
   `PRCCD_Fase1_G6.md`. Ninguna decisión de stack o de patrón se tomó "porque
   sí" o por preferencia tecnológica del equipo.
2. **Se evalúan alternativas con su trade-off explícito** — por ejemplo, la
   selección de estilo arquitectónico (sección 5 de `PRCCD_Fase1_G6.md`)
   compara monolito, SOA, microservicios y EDA driver por driver antes de
   elegir el híbrido.
3. **Se documenta la decisión y su alcance** — incluyendo lo que
   deliberadamente se dejó fuera de alcance para esta entrega (ej. base de
   datos compartida, auth federada simulada), para que no se confunda una
   limitación de tiempo/presupuesto con un error de diseño no detectado.
4. **Se revisita cuando el código revela algo que el diseño no anticipó** —
   el caso más claro es el hallazgo de las dos implementaciones de
   certificados (sección 4.3): no se forzó el diseño original, se ajustó la
   decisión con el nuevo dato y se documentó el porqué.

Esta trazabilidad completa, driver por driver, está en
`prccd-mvp/TRAZABILIDAD_FASE1.md` — 12 RF + 8 EaC + 9 Restricciones, cada
uno con su estado real contra el código (✅ implementado, 🟡 parcial/simulado,
❌ no implementado) y la evidencia concreta.

---

## 3. Decisiones de arquitectura clave (qué se decidió y por qué)

### 3.1 Microservicios + orientación a eventos (híbrido), no microservicios puros

**Decisión:** dividir el sistema en 7 servicios de negocio independientes,
con intención futura de comunicación asíncrona vía bus de eventos para
auditoría y evidencia.

**Por qué:** EaC-01 (5,000 usuarios, <3s) y EaC-02 (disponibilidad ≥99.9%)
exigen que un fallo o un pico de carga en un dominio no afecte a los demás.
Probado el 2026-06-19: detener `dashboard-service` no afecta a los otros 6;
el gateway solo responde 502 en esa ruta.

**Lo que falta para ser microservicios "puros":** el bus de eventos (Kafka,
mencionado en Fase 1) no está integrado — la comunicación entre dominios hoy
es lectura cruzada de tablas Postgres, no eventos.

### 3.2 Base de datos relacional compartida (no "database per service")

**Decisión:** los 7 servicios comparten la misma instancia de Postgres
(`prccd_db`), en vez de tener una base de datos propia cada uno.

**Por qué:** separar la base de datos requiere primero reemplazar las
lecturas cruzadas entre dominios (`certificado-service`,
`telemetria-service` y `dashboard-service` leen tablas de otros dominios
directamente) por llamadas HTTP o eventos. Dado el plazo de entrega, se
priorizó lograr el despliegue/escalado independiente por proceso (lo que
pedían EaC-02/R-03) y se dejó la separación de datos como trabajo de fase
posterior.

**Costo de no resolverlo:** mientras la BD esté compartida, escalar
horizontalmente un servicio (ej. múltiples réplicas de `examen-service`
durante el pico de la primera semana del mes) sigue limitado por el único
Postgres como cuello de botella. Es deuda técnica con impacto directo en
EaC-01, no solo un detalle de implementación.

### 3.3 MongoDB para el banco de preguntas

**Decisión:** el banco de preguntas vive en MongoDB
(`prccd_docs.preguntas`), no en la tabla Postgres `preguntas` (que queda
legada, sin borrarse).

**Por qué:** esquema de pregunta variable (opción múltiple, código,
verdadero/falso) sin joins relacionales necesarios durante el examen activo
— responde a EaC-05 (ajuste de dificultad <2s) y EaC-08 (agregar
funcionalidad sin migraciones). El campo `metadatos: {}` queda preparado
para parámetros IRT reales a futuro, aunque hoy va vacío (no se calibró
ningún modelo IRT en este MVP).

### 3.4 MinIO con cifrado de aplicación + WORM para evidencia antifraude

**Decisión:** los archivos de evidencia se cifran con AES-256-GCM en la
aplicación antes de subirse a MinIO, en un bucket con Object Lock/WORM y
retención `GOVERNANCE` de 5 años. No existe endpoint de borrado.

**Por qué:** R-06 exige retención inalterable ≥5 años; R-05 (GDPR) exige
cifrado de datos sensibles en reposo. Cifrar en la aplicación (no depender
de SSE del servidor) da control total sobre la llave y la garantía de
cifrado independientemente de cómo esté configurado el storage.

**Por qué MinIO y no una base relacional o un disco compartido:** guardar
binarios en Postgres eleva significativamente el costo operativo de la BD
transaccional (ver sección de presupuesto); MinIO es Open Source,
compatible con S3 (facilita migración a cloud a futuro, R-04) y soporta
WORM nativamente a nivel de bucket.

### 3.5 PKI real (RSA-PSS) + hash-chain propio, no Hyperledger Fabric

**Decisión:** firma criptográfica real vía Autoridad Certificadora local
(`pki.service.js`) + log inmutable encadenado por hash (cada bloque
referencia el hash del anterior).

**Por qué no blockchain real:** levantar y operar una red Hyperledger
Fabric (nodos, canales, chaincode, ordering service) es una inversión de
infraestructura y tiempo desproporcionada para un MVP de curso con plazo de
3-4 semanas (R-09) y presupuesto de piloto de USD 180,000 (R-01). El
hash-chain cumple el efecto que pide RF-04 — inmutabilidad verificable e
imposible de alterar sin romper la cadena — sin esa inversión. Se documenta
explícitamente como simulación razonable, no como Hyperledger real.

### 3.6 Coexistencia de dos implementaciones de certificados

**Hallazgo:** al separar `certificado-service`, se encontraron dos
implementaciones construidas independientemente por distintos
integrantes: la simple de Oswaldo (F2-27, hash+firma con `crypto`, tabla
`certificados`) y la PKI/hash-chain de Javier (F2-17/18, RSA-PSS + log
inmutable, tabla `certificados_pki`, que había quedado huérfana sin ruta ni
migración).

**Decisión:** exponer ambas en paralelo en vez de descartar una bajo presión
de tiempo, documentar el hallazgo, y dejar pendiente con el equipo decidir
cuál es la oficial de cara al frontend (o unificarlas). Es una decisión de
gestión de riesgo de entrega, no una indecisión de diseño.

### 3.7 Auth federada simulada (sin Keycloak/LDAP/SAML/OAuth2 reales)

**Decisión:** `auth-service` simula el login federado por institución con
un endpoint único (`POST /api/auth/confirmar-identidad`) que emite un JWT
unificado, usando el patrón Strategy para aislar el "protocolo" de cada
universidad.

**Por qué:** no hay acceso real a los sistemas de identidad de USAC, UCR y
UES para un proyecto de curso; simular el contrato (entrada/salida) permite
validar el resto del flujo (ingesta → examen → certificado → auditoría) sin
bloquear el desarrollo esperando integraciones externas reales.

---

## 4. Seguridad — resumen técnico

- **Autenticación:** JWT con expiración de 8h. Roles: `ADMIN`,
  `EVALUADOR`, `COORDINADOR` (atado a `universidad`), `ESTUDIANTE` (atado a
  `id_candidato` + `universidad`).
- **Autorización por propiedad de recurso:** un `ESTUDIANTE` solo puede
  consultar su propia sesión de examen o su propia evidencia — `examen-
  service` y `telemetria-service` devuelven 403 si el `id_candidato`/
  `universidad` del token no coincide con el de la sesión consultada.
- **Cifrado en tránsito:** no implementado a nivel de TLS en este MVP
  (corre en `http://localhost`, on-premise); pendiente para producción.
- **Cifrado en reposo:** AES-256-GCM a nivel de aplicación para evidencia
  antifraude en MinIO.
- **Integridad y no repudio de certificados:** firma RSA-PSS (PKI) +
  hash-chain encadenado; verificación de hash SHA-256 al descargar evidencia
  (responde 409 si no coincide).
- **Brecha conocida (R-05, GDPR):** no existe endpoint de "derecho al
  olvido" (borrado/anonimización de datos personales a solicitud).

---

## 5. Trazabilidad Fase 1 → Backend (resumen)

Ver matriz completa en `prccd-mvp/TRAZABILIDAD_FASE1.md`. Resumen ejecutivo:

- **Cobertura sólida (✅):** disponibilidad ante fallo de componente
  (microservicios), evidencia antifraude cifrada con retención WORM,
  auditoría inmutable, ingesta multi-formato (CSV/JSON/XML), anonimización
  de dashboards, stack 100% Open Source on-premise (R-02, R-03).
- **Brechas funcionales (❌):** no existe gestión de períodos de
  certificación (RF-12 / UC-1.5 completo — es el hueco más visible, sin
  ningún rastro en el código); sin pruebas de carga (EaC-01); sin endpoint
  de exportación de datos (parte de RF-06).
- **Simulaciones documentadas como tales (🟡):** auth federada, "blockchain"
  (hash-chain propio), motor adaptativo sin calibración IRT real, QR de
  verificación no generado (solo hash). Decisiones de alcance razonables
  para un MVP de curso — presentadas como tales, no como cumplimiento
  literal del requerimiento.

---

## 6. Presupuesto e impacto económico

### 6.1 Restricción de origen (Fase 1)

`PRCCD_Fase1_G6.md` define dos restricciones económicas explícitas:

| ID | Restricción |
|---|---|
| R-01 | Presupuesto máximo del piloto: **USD 180,000** |
| R-02 | Priorizar tecnologías Open Source para minimizar costos de licenciamiento |

El documento de Fase 1 no desglosa el presupuesto en una tabla monetaria
línea por línea — lo trata como restricción de diseño (R-01/R-02) que
condiciona qué tecnologías son viables, no como un presupuesto contable
detallado. El backend respeta esa restricción a través de decisiones de
**stack**, no de recorte de alcance funcional.

### 6.2 Cómo cada decisión técnica protege el presupuesto

| Decisión técnica | Alternativa típica de mercado | Ahorro/impacto en presupuesto |
|---|---|---|
| PostgreSQL (OSS) | Oracle DB / SQL Server | Sin costo de licencia por núcleo/usuario (puede representar decenas de miles de USD/año en licenciamiento empresarial) |
| MongoDB Community (OSS) | MongoDB Atlas dedicado / Oracle NoSQL | Sin cuota de suscripción mensual por clúster gestionado |
| MinIO (OSS, self-hosted) | Amazon S3 / Azure Blob | Sin costo recurrente por GB almacenado ni por petición; costo se limita al disco propio on-premise |
| Hash-chain propio | Hyperledger Fabric productivo (nodos, ordering service, canales) | Evita meses-persona de DevOps especializado en blockchain + infraestructura de nodos — costo desproporcionado para un piloto de USD 180,000 |
| Nginx (OSS) como gateway | Kong Enterprise / API Gateway gestionado (AWS/Azure) | Sin cuota de licencia ni costo por request |
| Docker Compose on-premise | Kubernetes gestionado (EKS/GKE/AKS) | Sin costo de control-plane gestionado; usa infraestructura física ya existente del SICA (R-03) |
| Auth federada simulada (sin Keycloak en producción aún) | Licencias de IdP comercial (Okta, Auth0) | Sin costo por usuario activo mensual durante el piloto; Keycloak (OSS) es la ruta planeada cuando se integre de verdad |

La fila más importante para el tribunal: **la decisión de no construir una
red Hyperledger real es, además de una decisión de plazo, una decisión de
presupuesto.** Una red blockchain productiva exige nodos dedicados,
monitoreo, y personal especializado — un costo recurrente que un piloto de
USD 180,000 no puede absorber junto con todo lo demás (PKI, motor
adaptativo, almacenamiento seguro de evidencia, integración con 3
universidades).

### 6.3 Estimación de costo operativo si se migrara a un proveedor cloud

Esta sección **no proviene de Fase 1** (que definió el piloto como
on-premise, R-03) — es una estimación adicional, construida para responder
si el tribunal pregunta "¿y si esto corriera en la nube?", conectando con
R-04 (preparación para migración futura) y con el caso de uso UC-7.9
("Estimar costos de migración") que ya estaba previsto en el documento de
Fase 1.

Estimación de orden de magnitud, mensual, para un volumen acorde al piloto
(picos de hasta 5,000 usuarios concurrentes solo en la primera semana del
mes, tráfico bajo el resto del mes) en un proveedor cloud típico (AWS/GCP),
usando los servicios administrados equivalentes a lo que hoy corre
on-premise:

| Componente | Servicio cloud equivalente | Estimado mensual (USD) |
|---|---|---|
| 7 microservicios (cómputo) | Contenedores (ej. Fargate/Cloud Run), escalado a demanda | 150 – 400 |
| PostgreSQL compartido | RDS/Cloud SQL, instancia pequeña-mediana | 80 – 250 |
| MongoDB (banco de preguntas) | Atlas o instancia gestionada, tier bajo | 60 – 150 |
| Almacenamiento de evidencia | S3/Cloud Storage + costo de retención WORM 5 años | 30 – 100 (crece con volumen acumulado) |
| Gateway / Load Balancer | ALB/Cloud Load Balancing | 20 – 40 |
| Transferencia de datos (egress) | Variable según tráfico de picos | 20 – 80 |
| **Total estimado (operación estable)** | | **≈ USD 360 – 1,020 / mes** |

Esto **no incluye** componentes que en Fase 1 se previeron pero no se
integraron en el MVP (Keycloak gestionado, Kafka/MSK como bus de eventos,
HSM como servicio para custodia de llaves PKI) — de integrarse, el rango
sube a un estimado de **USD 600 – 1,800/mes** adicional, dependiendo del
volumen real.

**Lectura para el tribunal:** el costo operativo cloud proyectado
(≈USD 4,300 – 12,200/año en el escenario más amplio) es una fracción
pequeña del presupuesto de piloto de USD 180,000, lo cual confirma que la
arquitectura **sí está preparada para migración a la nube sin rediseño
mayor** (R-04) — los contenedores son portables — aunque hoy la base de
datos compartida (sección 3.2) sería la primera limitación técnica a
resolver antes de separar servicios entre distintas instancias cloud.

### 6.4 Costo de la deuda técnica pendiente

No toda decisión pendiente es gratis de postergar. Para que el tribunal vea
el balance completo:

- **BD compartida sin separar:** limita escalar horizontalmente un servicio
  de forma aislada — impacto directo en EaC-01 si el sistema creciera más
  allá del piloto.
- **Sin pruebas de carga (EaC-01):** no hay evidencia medida de que el
  sistema soporte 5,000 usuarios simultáneos; es un riesgo no cuantificado,
  no un costo monetario inmediato.
- **Dos implementaciones de certificados sin unificar:** mantenerlas en
  paralelo indefinidamente duplica el trabajo de mantenimiento futuro
  (dos rutas, dos esquemas, dos lugares donde corregir un bug).
- **Auth federada simulada:** integrar Keycloak/LDAP/SAML/OAuth2 reales es
  trabajo no trivial pendiente; mientras no se haga, el sistema no puede
  operar con usuarios reales de las universidades.

---

## 7. Cómo levantar y verificar el stack

```bash
cd prccd-mvp
docker compose up -d --build
docker compose ps
curl http://localhost/health/auth        # repetir por cada servicio
```

Sembrar el banco de preguntas en MongoDB (requerido tras un `docker compose
up` limpio):
```bash
docker compose exec examen-service node scripts/seedPreguntas.js
```

Aplicar una migración SQL nueva contra una BD ya existente (el volumen
`postgres_data` no re-ejecuta `docker-entrypoint-initdb.d` si ya tiene
datos):
```bash
docker exec -i prccd_postgres psql -U prccd_user -d prccd_db < migrations/00X_archivo.sql
```

---

## 8. Pendientes conocidos (hoja de ruta post-entrega)

1. Separar base de datos relacional por servicio.
2. Reemplazar lecturas cruzadas de tablas por llamadas HTTP o eventos
   (Kafka).
3. Decidir cuál implementación de certificados es la oficial, o unificarlas.
4. Calibrar parámetros IRT reales en el banco de preguntas.
5. Integrar captura real de evidencia desde el frontend (el backend ya
   tiene el endpoint de subida/descarga).
6. Implementar RF-12 (períodos de certificación) — brecha funcional
   completa, sin tabla ni validación en ningún servicio.
7. Pruebas de carga formales para validar EaC-01.
8. Endpoint de "derecho al olvido" (R-05).
9. Integrar Keycloak/LDAP/SAML/OAuth2 reales y Kafka como bus de eventos.
