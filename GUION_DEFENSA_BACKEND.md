# Guión de defensa — Equipo Backend (Fase 1 y Fase 2)

> Para: Javier Monjes (202100081), Oswaldo Choc (201901844), Jencer Hernández (202002141).
> Uso: defensa oral del MVP PRCCD/SICA. Cada bloque está escrito en primera
> persona, listo para leer o adaptar. El hilo conductor de todo el guión es
> el mismo en las tres voces: **toda decisión técnica responde a un driver
> de Fase 1 (RF, EaC o Restricción), no a preferencia personal del equipo.**
> Complementa con `MANUAL_TECNICO_BACKEND.md` si el tribunal pide detalle
> técnico más profundo o de presupuesto.

---

## 0. Apertura conjunta (30 seg, cualquiera de los tres)

> "Nosotros tres — Javier, Oswaldo y Jencer — fuimos el equipo de backend
> del proyecto. En Fase 1 definimos la arquitectura; en Fase 2 la
> construimos y la llevamos a microservicios reales. Vamos a explicar no
> solo qué construimos, sino **por qué cada decisión técnica es consecuencia
> directa de un requerimiento, un atributo de calidad o una restricción que
> ya habíamos documentado en Fase 1** — nada se hizo por gusto o por moda
> tecnológica."

---

## 1. Sección de arquitectura (Javier, lead integración/seguridad)

### 1.1 Por qué microservicios y no monolito ni SOA puro

> "En Fase 1 evaluamos cuatro estilos: monolítico, SOA, microservicios y
> orientación a eventos. El monolito quedó descartado de inmediato porque
> el negocio tiene un patrón de carga muy particular: picos masivos de
> miles de candidatos **solo durante la primera semana de cada mes**
> (EaC-01, escalabilidad — 5,000 usuarios simultáneos en menos de 3
> segundos). Un monolito escala todo o nada; nosotros necesitábamos escalar
> únicamente el motor de examen sin tocar certificados o auditoría.
>
> SOA con bus centralizado tampoco resolvía el problema: el bus se vuelve
> cuello de botella exactamente en el momento de mayor carga, y su
> gobernanza centralizada complica integrar tres protocolos de
> autenticación distintos (LDAP, SAML, OAuth2) de USAC, UCR y UES (EaC-04).
>
> Por eso elegimos una **arquitectura híbrida: microservicios con
> orientación a eventos**. Los microservicios resuelven escalabilidad e
> integración heterogénea — cada universidad es un adaptador independiente,
> cada dominio de negocio escala y se reinicia solo. La orientación a
> eventos resuelve auditoría inmutable y evidencia antifraude sin bloquear
> el examen. Esta decisión está documentada con matriz de trazabilidad
> completa por driver en `PRCCD_Fase1_G6.md`, sección 5."

### 1.2 La migración real en Fase 2 — de monolito modular a microservicios de verdad

> "Cuando empezamos a construir en Fase 2, el primer corte de backend que
> entregamos era, honestamente, un **monolito modular**: una sola app
> Express con las rutas de los 7 dominios en un solo proceso. Funcionaba,
> pero no era lo que habíamos diseñado en Fase 1. Antes de la entrega final
> hice la migración completa a microservicios reales: separé el código en
> 7 servicios independientes — `auth-service`, `ingesta-service`,
> `examen-service`, `certificado-service`, `telemetria-service`,
> `auditoria-service`, `dashboard-service` — cada uno en su propio
> contenedor Docker, cada uno con su propio puerto, todos detrás de un
> gateway Nginx que rutea por path.
>
> Esto no fue un refactor cosmético. Lo probamos: si tumbamos
> `dashboard-service`, los otros 6 servicios siguen funcionando sin
> problema, y el gateway solo devuelve 502 en la ruta del servicio caído.
> Eso es exactamente lo que pide EaC-02 (disponibilidad ≥99.9% ante fallo
> de un componente), y es la razón de ser de toda la migración."

### 1.3 Decisión: MongoDB para el banco de preguntas

> "El motor adaptativo necesita responder en menos de 2 segundos por
> pregunta (EaC-05). Las preguntas no tienen una estructura fija — varían
> entre opción múltiple, verdadero/falso, código — y un esquema relacional
> rígido nos obligaba a columnas nulas o a migraciones constantes cada vez
> que cambiara el formato. Por eso migré el banco de preguntas de la tabla
> `preguntas` en Postgres a una colección en MongoDB
> (`prccd_docs.preguntas`), con un campo `metadatos: {}` libre para
> extender el esquema sin tocar código — por ejemplo, ahí es donde a futuro
> entrarían los parámetros IRT reales del modelo adaptativo. Mantuve el
> mismo `id` entero que tenía en Postgres para no romper la compatibilidad
> con `sesiones_examen.preguntas_ids`, que sigue siendo un arreglo de
> enteros en Postgres."

### 1.4 Decisión: MinIO con cifrado y WORM para evidencia antifraude

> "RF-03 exige capturar evidencia antifraude — pantallazos, logs de
> tecleo, video — y R-06 exige que esa evidencia sea inalterable por un
> mínimo de 5 años. Guardar binarios en una base relacional es caro
> operativamente y no da garantías de inmutabilidad por sí solo. Implementé
> el almacenamiento en MinIO, que es Open Source y compatible con S3
> (cumple R-02), con dos capas de protección: cifro cada archivo con
> AES-256-GCM **en la aplicación antes de subirlo** — no dependo de que el
> servidor tenga SSE configurado — y además habilito Object Lock/WORM a
> nivel de bucket con retención `GOVERNANCE` de 5 años vía
> `putObjectRetention`. No existe ningún endpoint de borrado para esos
> archivos. Eso no es un descuido, es la decisión: si hubiera un DELETE,
> WORM no significaría nada."

### 1.5 Decisión: firma PKI real + log inmutable (hash-chain) para certificados

> "RF-04 pide certificados verificables criptográficamente vía PKI o
> Blockchain. Implementé una Autoridad Certificadora local que firma cada
> certificado con RSA-PSS — eso es PKI real, no un placeholder — y un log
> inmutable encadenado por hash, donde cada bloque referencia el hash del
> bloque anterior. Quiero ser honesto con el tribunal: esto **no es
> Hyperledger Fabric**. Es un hash-chain propio. Para un MVP de curso
> cumple el efecto que pide el requerimiento — inmutabilidad verificable —
> sin la complejidad operativa de levantar una red blockchain real, que
> hubiera sido desproporcionado para el presupuesto y el plazo de esta
> fase. Lo documentamos así explícitamente en `TRAZABILIDAD_FASE1.md`, no
> lo presentamos como cumplimiento literal."

### 1.6 Hallazgo y decisión de equipo: dos implementaciones de certificados

> "Al separar `certificado-service` en la migración, encontré algo que vale
> la pena mencionar con transparencia: existían **dos implementaciones de
> certificados sin relación entre sí**, construidas por distintos
> integrantes en distintos momentos — la mía (PKI/hash-chain, tareas
> F2-17/F2-18) y la de Oswaldo (hash+firma simple con `crypto`, tarea
> F2-27). La mía había quedado huérfana — sin ruta que la llamara y sin
> migración para su propia tabla, probablemente sobrescrita en un merge
> anterior. En vez de descartar una de las dos a último momento, decidimos
> **exponer ambas en paralelo** en el mismo servicio, documentar el
> hallazgo en `ARQUITECTURA.md`, y dejar pendiente con el equipo decidir
> cuál es la oficial de cara al frontend. Es una decisión de gestión de
> riesgo: con la entrega encima, preferimos no perder trabajo válido de un
> compañero en vez de arriesgarnos a romper algo por una limpieza
> apresurada."

### 1.7 Auth federada y login de candidatos

> "RF-01 pide autenticación federada LDAP/SAML/OAuth2 por institución.
> Implementé `auth-service` con un endpoint que simula ese login federado
> (`POST /api/auth/confirmar-identidad`) y emite un JWT unificado sin
> importar el protocolo de origen — el patrón Strategy que documentamos en
> Fase 1 para este problema. Aquí también soy transparente: no integramos
> Keycloak ni conectores LDAP/SAML/OAuth2 reales contra las universidades.
> Es una simulación razonable para un MVP académico sin acceso real a los
> sistemas de USAC, UCR y UES, pero está documentada como simulación."

---

## 2. Sección de infraestructura y módulos de negocio (Oswaldo, lead infra)

> Guion sugerido para Oswaldo — ajustar con su propia voz, basado en lo que
> implementó según `Tareas_Fase2_G6.xlsx` y los commits `201901844:*`.

### 2.1 Infraestructura: Docker Compose, migraciones, gateway

> "Mi responsabilidad principal fue la infraestructura del MVP. Configuré
> el `docker-compose.yml` que levanta los 7 servicios de backend junto con
> PostgreSQL, MongoDB, MinIO y el gateway Nginx — todo en contenedores
> independientes, lo cual responde directamente a R-03: la primera versión
> debe desplegarse on-premise reutilizando infraestructura existente del
> SICA, sin depender de un proveedor cloud. También construí los scripts
> de migración de base de datos para las tablas principales — candidatos,
> evaluación, certificado, auditoría — y configuré el API Gateway con
> Nginx, con ruteo por prefijo de path hacia cada microservicio, de forma
> que todo el tráfico externo entra por un solo punto (`http://localhost`)
> y el frontend nunca necesita conocer los puertos internos de cada
> servicio."

### 2.2 Endpoints de auditoría, certificado simple y dashboard

> "Además de infraestructura, construí los endpoints REST de varios
> dominios de negocio: el endpoint de auditoría (`/api/audit/trail`) que
> responde a RF-05 — rastro de auditoría inmutable por certificado — y los
> endpoints de certificado simple (`/api/certificate/issue` y `/verify`),
> con hash y firma vía el módulo `crypto` de Node. La decisión de hacer
> esta versión simple, además de la versión PKI de Javier, fue dar al
> equipo una opción ligera y rápida de verificar mientras se definía cuál
> sería la oficial — priorizamos tener **algo funcionando pronto** sobre
> bloquear el avance esperando una decisión de diseño que no era urgente
> para el MVP.
>
> También implementé el servicio de agregación y anonimización para el
> dashboard BI — RF-09, que exige anonimizar y agregar datos antes de
> exponerlos en interfaces gerenciales — y el endpoint
> `/api/dashboard/stats`, que solo devuelve conteos y totales, nunca datos
> individuales identificables."

### 2.3 Por qué base de datos compartida (decisión consciente, no descuido)

> "Una decisión de arquitectura que quiero explicar directamente: los 7
> microservicios se conectan al mismo PostgreSQL. No hicimos 'database per
> service'. No fue falta de tiempo nada más — fue una decisión consciente
> de alcance: separar la base de datos implicaba además reemplazar las
> lecturas cruzadas entre dominios (`certificado-service`,
> `telemetria-service` y `dashboard-service` leen tablas de otros dominios
> directo) por llamadas HTTP o eventos entre servicios, y eso es trabajo de
> una fase posterior, no de este MVP. Lo que sí logramos — y es lo que
> pedían los drivers EaC-02 y R-03 — es que cada dominio se despliega, se
> reinicia y escala como proceso independiente. Está documentado como
> pendiente explícito en `ARQUITECTURA.md`."

---

## 3. Sección de motor adaptativo y banco de preguntas (Jencer, lead motor adaptativo)

> Guion sugerido para Jencer — ajustar con su propia voz, basado en
> `Tareas_Fase2_G6.xlsx` (tareas #7, #8, #9) y los commits `202002141:*`.

### 3.1 Por qué un algoritmo adaptativo simple en vez de IRT calibrado desde el inicio

> "Mi parte fue el corazón funcional del sistema: el motor de examen
> adaptativo. RF-02 exige que el sistema ajuste la dificultad en tiempo
> real según las respuestas previas del candidato, y EaC-05 exige que ese
> ajuste tome menos de 2 segundos. Implementé el algoritmo de selección de
> preguntas: el candidato inicia en nivel Intermedio, y según acierte o
> falle, el sistema sube o baja de nivel para la siguiente pregunta — la
> lógica vive en `examen-service`, es síncrona y en memoria, así que cumple
> el umbral de tiempo en la práctica sin necesidad de infraestructura
> adicional.
>
> Soy transparente sobre el alcance: esto **no es un modelo IRT calibrado**
> (Teoría de Respuesta al Ítem, con parámetros de discriminación,
> dificultad y adivinanza por pregunta). Calibrar un modelo IRT real
> requiere un banco de datos históricos de respuestas que un MVP de curso
> no tiene. Por eso diseñamos el esquema de Mongo con un campo
> `metadatos: {}` vacío pero ya preparado para recibir esos parámetros el
> día que se calibre un modelo real — la decisión de usar MongoDB en vez de
> Postgres para el banco de preguntas, que implementó Javier, nace
> precisamente de esta necesidad de flexibilidad futura."

### 3.2 Cálculo de ponderación y dictamen final

> "También implementé el cálculo de ponderación por nivel de dificultad y
> el dictamen final de Aprobado/Reprobado al completar las 10 preguntas de
> la sesión. Cada nivel de dificultad pesa distinto en el puntaje final, y
> el sistema compara el puntaje contra un umbral mínimo configurado para
> decidir el dictamen. Este cálculo alimenta directamente tanto el
> certificado — solo se puede emitir un certificado de una sesión
> `completado=true` y `dictamen='Aprobado'` — como el dashboard gerencial,
> que reporta cuántos candidatos aprobaron o reprobaron por universidad y
> carrera."

---

## 4. Cierre conjunto — pendientes y honestidad académica (cualquiera de los tres, 1 min)

> "Para cerrar, queremos ser igual de claros sobre lo que **no** está
> resuelto como lo fuimos sobre lo que sí. Documentamos una matriz completa
> de trazabilidad de los 12 requerimientos funcionales, 8 escenarios de
> calidad y 9 restricciones de Fase 1 contra el código real, en
> `TRAZABILIDAD_FASE1.md`. La brecha más visible es RF-12: los períodos de
> certificación de la primera semana del mes no están implementados en
> absoluto, no hay tabla ni validación de fechas en ningún servicio. Otras
> brechas conocidas: no hay endpoint de exportación de datos, no se generan
> códigos QR de verificación (solo verificación por hash), el dashboard no
> segmenta por género, y no se ha hecho ninguna prueba de carga formal para
> validar los 5,000 usuarios simultáneos de EaC-01.
>
> Lo que sí podemos demostrar en vivo: los 7 microservicios corriendo,
> login federado de candidato, ingesta de un archivo, examen completo de 10
> preguntas contra el banco en MongoDB, emisión de certificado por las dos
> rutas, evidencia cifrada subida a MinIO, consulta de auditoría, y
> dashboard agregado — y la prueba de resiliencia: tumbar un servicio sin
> afectar a los demás."

---

## 5. Posibles preguntas del tribunal y cómo responderlas

| Pregunta probable | Respuesta corta y honesta |
|---|---|
| "¿Por qué Postgres sigue compartido entre 7 servicios si dicen que son microservicios?" | Decisión consciente de alcance: separar la BD requiere primero reemplazar lecturas cruzadas entre dominios por HTTP/eventos. Lo logrado en esta fase es el despliegue y escalado independiente por proceso, que es lo que pedían los drivers EaC-02/R-03. Queda documentado como pendiente explícito. |
| "¿Eso es blockchain de verdad?" | No, es un hash-chain propio (log inmutable encadenado), no Hyperledger Fabric. Cumple el efecto de inmutabilidad que pide RF-04 sin la complejidad operativa de una red blockchain real, documentado como simulación razonable. |
| "¿Por qué hay dos formas de emitir certificados?" | Se construyeron en paralelo por dos integrantes sin saberlo; al descubrirlo, decidimos no descartar trabajo válido bajo presión de tiempo y dejamos ambas expuestas, documentando el hallazgo y la decisión pendiente con el equipo. |
| "¿El motor adaptativo usa IRT real?" | No, es un algoritmo de subir/bajar nivel según acierto. El esquema de datos en MongoDB ya está preparado (`metadatos: {}`) para parámetros IRT reales a futuro, pero no se calibró ningún modelo en este MVP. |
| "¿Probaron la escalabilidad de 5,000 usuarios?" | No, EaC-01 no tiene prueba de carga formal en este MVP. Sí está probada y demostrada la disponibilidad ante fallo de un componente (EaC-02). |
| "¿Cumple GDPR de verdad?" | Parcialmente: hay cifrado en reposo de la evidencia (AES-256-GCM), pero no existe un endpoint de "derecho al olvido" para borrar o anonimizar datos personales a solicitud. |
| "¿Cuánto costaría esto en producción real?" | Ver `MANUAL_TECNICO_BACKEND.md`, sección de presupuesto — incluye comparación entre el presupuesto de Fase 1 (USD 180,000) y una estimación de costo operativo si se migrara a un proveedor cloud. |
