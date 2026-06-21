# Trazabilidad Fase 1 → Backend (microservicios)

> Hasta el 2026-06-19, `ARQUITECTURA.md` solo citaba 3 drivers de Fase 1
> (EaC-02, EaC-04, R-03) como justificación de la migración a microservicios.
> No existía una matriz que recorriera **los 12 RF, 8 EaC y 9 Restricciones**
> de `PRCCD_Fase1_G6.md` uno por uno contra lo que el backend implementa hoy.
> Este documento cierra ese vacío. Estado evaluado contra el código en
> `prccd-mvp/services/*` y `docker compose ps` el 2026-06-19.

Leyenda: ✅ implementado y verificado · 🟡 implementado parcial / simulado · ❌ no implementado.

## RF — Requisitos Funcionales

| ID | Requisito | Estado | Dónde / evidencia |
|---|---|---|---|
| RF-01 | Auth federada LDAP/SAML/OAuth2 por institución | 🟡 | `auth-service` simula el login federado (`POST /api/auth/confirmar-identidad`) con JWT unificado; no hay conectores LDAP/SAML/OAuth2 reales ni Keycloak integrado |
| RF-02 | Motor de examen adaptativo, ajusta dificultad en tiempo real | 🟡 | `examen-service` (`/api/examen/responder`) selecciona la siguiente pregunta según acierto/fallo; no se calibró ningún modelo IRT real (campo `metadatos` en Mongo va vacío) |
| RF-03 | Captura y almacenamiento de evidencia antifraude (pantalla, tecleo, video) | ✅ | `telemetria-service`: `/api/telemetria` (eventos sospechosos) + `/api/telemetria/evidencia` (archivos cifrados AES-256-GCM en MinIO, F2-14) |
| RF-04 | Certificados verificables criptográficamente vía PKI o Blockchain | ✅ (PKI) / 🟡 (blockchain) | `certificado-service`: firma RSA-PSS real (`pki.service.js`) + log inmutable encadenado (hash-chain, no es Hyperledger real pero cumple el efecto de inmutabilidad) |
| RF-05 | Rastro de auditoría inmutable por certificado | ✅ | `auditoria-service` (`/api/audit/trail`), retención 5 años, alimentado también desde `telemetria-service` |
| RF-06 | Importar/exportar datos académicos en JSON, XML, CSV | 🟡 | `ingesta-service` **importa** CSV (USAC), JSON (UCR), XML (UES) — no existe endpoint de **exportación** en ningún servicio |
| RF-07 | Integración nativa con USAC, UCR, UES sin que cambien su operación | ✅ | Adaptadores por formato en `ingesta-service`, uno por universidad, sin exigir API del lado de la universidad |
| RF-08 | Dashboards segmentados por país, carrera y género | 🟡 | `dashboard-service` (`/api/dashboard/stats`) segmenta por `universidad` y `carrera`; **no segmenta por género** (no hay campo de género en `candidatos`) |
| RF-09 | Anonimizar/agregar datos antes de exponer en dashboards | ✅ | `dashboard-service` solo expone agregados (`COUNT`, totales); sin PII en la respuesta |
| RF-10 | Verificación externa de certificado por código, QR o hash | 🟡 | Verificación por **hash** sí (`GET /api/certificate/verify?hash=`, `/verificar/:id`); **no hay generación de código QR** en el backend |
| RF-11 | Gestión de usuarios, roles y permisos por institución | 🟡 | Roles (`ADMIN`/`EVALUADOR`/`COORDINADOR`/`ESTUDIANTE`) existen y se validan en cada ruta, pero los usuarios de staff están **hardcodeados** (no hay CRUD de usuarios) |
| RF-12 | Habilitar períodos de certificación solo en la primera semana del mes | ❌ | No existe entidad/tabla de "período de certificación" ni validación de fechas en ningún servicio — UC-1.5 del documento de Fase 1 no está materializado |

## EaC — Escenarios de Atributos de Calidad

| ID | Atributo | Estado | Evidencia |
|---|---|---|---|
| EaC-01 | Escalabilidad (5,000 usuarios, <3s) | ❌ | No se ha hecho prueba de carga; no hay réplicas ni balanceo horizontal configurado en `docker-compose.yml` |
| EaC-02 | Disponibilidad ≥99.9% ante fallo de un componente | ✅ | Probado 2026-06-19: tumbar `dashboard-service` no afecta a los otros 6; gateway solo devuelve 502 en esa ruta. Es la razón principal de ser de la migración a microservicios |
| EaC-03 | Seguridad — alteración de calificación rechazada y registrada | 🟡 | JWT + verificación de rol/propiedad de sesión (403 si no coincide candidato); no hay prueba explícita de intento de alteración directa de `dictamen` en BD |
| EaC-04 | Interoperabilidad — CSV legado 100% sin pérdida | ✅ | `ingesta-service` probado con CSV/JSON/XML reales, reporta `procesados/exitosos/errores` fila por fila |
| EaC-05 | Rendimiento — ajuste de dificultad <2s | 🟡 | El cálculo es síncrono y trivial (in-memory), cumpliría el umbral en la práctica, pero no se midió formalmente |
| EaC-06 | Privacidad — dashboard solo agregados anonimizados | ✅ | Igual que RF-09 |
| EaC-07 | Auditabilidad — consulta de auditoría <5s | 🟡 | Endpoint existe y responde rápido en pruebas manuales; no hay medición formal de latencia |
| EaC-08 | Mantenibilidad — nuevo protocolo de auth en <2 semanas | 🟡 | La separación en `auth-service` independiente lo facilita arquitectónicamente, pero no se ha probado agregando un protocolo real |

## R — Restricciones

| ID | Restricción | Estado | Evidencia |
|---|---|---|---|
| R-01 | Presupuesto ≤ USD 180,000 | N/A | Fuera del alcance técnico del backend |
| R-02 | Priorizar Open Source | ✅ | Node/Express, PostgreSQL, MongoDB, MinIO, Nginx — todo OSS |
| R-03 | Despliegue on-premise reutilizando infraestructura existente | ✅ | Stack 100% Docker Compose, corre en infraestructura local sin dependencias cloud |
| R-04 | Preparada para migración transparente a la nube | 🟡 | Contenedores son portables, pero la BD Postgres **compartida** entre los 7 servicios es una atadura que dificultaría separar servicios en la nube sin antes resolverla |
| R-05 | Cumplimiento GDPR y leyes locales | 🟡 | Cifrado en reposo de evidencia (AES-256-GCM); no existe endpoint de "derecho al olvido" (borrado/anonimización de datos personales a solicitud) |
| R-06 | Evidencia antifraude inalterable ≥5 años | ✅ | MinIO con Object Lock/WORM, retención `GOVERNANCE` de 5 años vía `putObjectRetention`; sin endpoint de borrado por diseño |
| R-07 | Validez jurídica transfronteriza con firma electrónica avanzada | 🟡 | Firma RSA-PSS real, pero no es necesariamente equivalente a un esquema eIDAS/firma avanzada reconocida legalmente — interpretación técnica razonable para el MVP, no validada legalmente |
| R-08 | Integrarse con legados sin que las universidades cambien su operación | ✅ | Ingesta por archivo (CSV/JSON/XML), no requiere que la universidad expon­ga una API |
| R-09 | Primera versión arquitectónica documentada en 3-4 semanas | ✅ | `PRCCD_Fase1_G6.md` ya entregado |

## Resumen ejecutivo

- **Cobertura sólida (✅):** disponibilidad ante fallos (microservicios), evidencia antifraude cifrada con retención WORM, auditoría inmutable, ingesta multi-formato, anonimización de dashboards, stack 100% Open Source on-premise.
- **Brechas funcionales conocidas (❌):** no existe gestión de **períodos de certificación** (RF-12 / UC-1.5 completo) — es el hueco más visible porque es un caso de uso completo del documento de Fase 1 sin ningún rastro en el código. Tampoco hay pruebas de carga (EaC-01) ni endpoint de exportación de datos (parte de RF-06).
- **Simulaciones documentadas como tales (🟡):** auth federada (no hay LDAP/SAML/OAuth2 ni Keycloak reales), blockchain (se usa un hash-chain propio en vez de Hyperledger), motor adaptativo sin calibración IRT real, QR de verificación no generado (solo hash). Estas son decisiones de alcance razonables para un MVP de curso, pero deben presentarse como tales y no como cumplimiento literal del RF.

## Cómo se actualiza este documento

Cuando se cierre una brecha (ej. se agregue el endpoint de períodos, o se generen códigos QR), actualizar la fila correspondiente aquí y en `ARQUITECTURA.md` si afecta una decisión de arquitectura. Este documento vive junto al código, no en el repositorio de Fase 1.
