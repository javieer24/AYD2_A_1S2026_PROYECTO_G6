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

## 2. Sección de infraestructura y módulos de negocio (Oswaldo Choc, 201901844, lead infra)

> Guion para Oswaldo — autocontenido: si solo te toca defender tu parte, con
> leer esta sección y la tabla de preguntas 2.6 alcanza. Basado en lo que
> implementaste según `Tareas_Fase2_G6.xlsx` (tareas #4, #10, #15, #19,
> #22, #23, #26, #27, #29) y los commits `201901844:*`. Código real en
> `prccd-mvp/services/dashboard-service/src/routes/dashboard.routes.js`,
> `auditoria-service/src/routes/auditoria.routes.js` y
> `certificado-service/src/routes/certificado.routes.js` (rutas `/issue`,
> `/verify`).

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
> servicio (3001-3007 quedan expuestos solo para debugging del backend)."

### 2.2 Endpoint de auditoría — retención de 5 años calculada en cada registro

> "Construí `auditoria-service`, que expone `GET /api/audit/trail` y
> `POST /api/audit/trail`. Esto responde a RF-05 (rastro de auditoría
> inmutable por certificado) y a R-06 (retención inalterable mínima de 5
> años). La parte que quiero resaltar técnicamente: cada vez que se inserta
> un evento, el servicio calcula `fecha_retencion` sumando 5 años a la
> fecha actual y la guarda junto al registro —
> `fecha_retencion.setFullYear(fecha_retencion.getFullYear() + 5)` — para
> que la obligación de retención quede explícita por fila, no como una
> regla solo documentada aparte. En la práctica, el flujo normal del
> sistema no escribe aquí directo: `telemetria-service` es quien
> normalmente alimenta esta misma tabla cuando ocurre un evento
> antifraude, y este endpoint queda como punto de consulta general del
> rastro de auditoría por sesión."

### 2.3 Certificados simples (F2-27) — hash + firma con `crypto`, sin PKI

> "Implementé la primera versión de emisión de certificados:
> `POST /api/certificate/issue` y `GET /api/certificate/verify?hash=`.
> La lógica es deliberadamente simple: tomo los datos del certificado
> (`id_candidato`, `sesion_id`, `datos_certificado`), genero un hash
> SHA-256 del contenido para identificarlo de forma única, y genero una
> 'firma digital' con SHA-512 sobre el contenido **más el secreto JWT del
> sistema** (`crypto.createHash('sha512').update(contenido +
> process.env.JWT_SECRET)`) — esto no es una firma asimétrica como la PKI
> de Javier, es un HMAC artesanal: solo alguien que conoce el secreto del
> sistema pudo haber generado esa firma, lo cual da integridad básica sin
> necesidad de generar y custodiar un par de llaves RSA.
>
> La decisión de construir esta versión, **antes** de saber que Javier
> tenía en paralelo una versión con PKI real, fue priorizar tener algo
> funcionando pronto sobre bloquear el avance del equipo esperando una
> decisión de diseño criptográfico que no era urgente para validar el
> resto del flujo del MVP (examen → certificado → verificación). Cuando se
> descubrió la duplicidad al migrar a microservicios, decidimos entre
> todos no descartar ninguna de las dos bajo presión de tiempo: la mía
> sigue viva en `/issue` y `/verify` sobre la tabla `certificados`; la de
> Javier vive en `/emitir`, `/verificar/:id` y `/cadena/verificar` sobre
> `certificados_pki`."

### 2.4 Dashboard BI — agregación anonimizada (RF-08, RF-09)

> "Implementé `GET /api/dashboard/stats` en `dashboard-service`. RF-09
> exige anonimizar y agregar los datos antes de exponerlos en interfaces
> gerenciales, así que cada consulta que escribí usa `COUNT(*)` y
> `GROUP BY` — nunca selecciono una fila individual de un candidato.
> Devuelvo cuatro bloques: candidatos por universidad, candidatos por
> carrera (con filtro opcional `?carrera=`), estadísticas de exámenes
> (total de sesiones, aprobados, reprobados, en progreso) y total de
> certificados emitidos/vigentes. La respuesta incluye literalmente una
> nota: *'Datos agregados y anonimizados — sin datos personales
> identificables'*, para que quede explícito en el contrato de la API, no
> solo en la documentación.
>
> Quiero ser transparente en un punto: la query de exámenes compara
> `UPPER(dictamen) = 'APROBADO'`. La usé en mayúsculas a propósito porque
> en algún momento de la integración detectamos que el valor real
> guardado en la base es `'Aprobado'` (con mayúscula inicial solamente) —
> compararlo en minúsculas o con case sensible nunca daba match. Es un
> ejemplo concreto de un bug de integración entre el dato que produce
> `examen-service` y el dato que consume `dashboard-service`, que se
> corrigió forzando `UPPER()` en la comparación en vez de asumir un
> formato exacto."

### 2.5 Por qué base de datos compartida (decisión consciente, no descuido)

> "Una decisión de arquitectura que quiero explicar directamente: los 7
> microservicios se conectan al mismo PostgreSQL. No hicimos 'database per
> service'. No fue falta de tiempo nada más — fue una decisión consciente
> de alcance: separar la base de datos implicaba además reemplazar las
> lecturas cruzadas entre dominios (`certificado-service`,
> `telemetria-service` y `dashboard-service` leen tablas de otros dominios
> directo, como hice yo mismo en `dashboard-service` leyendo `candidatos`,
> `sesiones_examen` y `certificados`) por llamadas HTTP o eventos entre
> servicios, y eso es trabajo de una fase posterior, no de este MVP. Lo que
> sí logramos — y es lo que pedían los drivers EaC-02 y R-03 — es que cada
> dominio se despliega, se reinicia y escala como proceso independiente.
> Está documentado como pendiente explícito en `ARQUITECTURA.md`."

### 2.6 Preguntas probables sobre mi parte (Oswaldo)

| Pregunta probable | Respuesta corta y honesta |
|---|---|
| "¿Por qué la firma de tus certificados no usa PKI?" | Es una firma HMAC con SHA-512 sobre el secreto del sistema, no una firma asimétrica. Da integridad básica y fue rápida de implementar para no bloquear el avance del equipo mientras se decidía el esquema criptográfico definitivo. |
| "¿Por qué hay dos formas de emitir certificados?" | Se construyeron en paralelo sin saberlo (yo hice la simple, Javier la PKI). Al encontrarlo durante la migración a microservicios, decidimos exponer ambas en vez de descartar trabajo válido bajo presión de tiempo. |
| "¿El dashboard puede filtrar por género como pide RF-08?" | No — `candidatos` no tiene campo de género en este MVP, así que el dashboard solo segmenta por universidad y carrera. Es una brecha documentada, no implementada. |
| "¿Por qué Postgres es compartido entre todos los servicios?" | Separar la BD requiere antes reemplazar las lecturas cruzadas (mi propio `dashboard-service` lee tablas de 3 dominios distintos) por HTTP/eventos. Se priorizó el despliegue/escalado independiente por proceso para esta entrega. |
| "¿Cómo garantizas la retención de 5 años en auditoría?" | Cada fila de la tabla `auditoria` guarda su propia `fecha_retencion`, calculada al insertarse (fecha actual + 5 años), no solo documentada aparte. |

---

## 3. Sección de motor adaptativo y banco de preguntas (Jencer Hernández, 202002141, lead motor adaptativo)

> Guion para Jencer — autocontenido: si solo te toca defender tu parte, con
> leer esta sección y la tabla de preguntas 3.5 alcanza. Basado en
> `Tareas_Fase2_G6.xlsx` (tareas #7, #8, #9) y los commits `202002141:*`.
> Código real en
> `prccd-mvp/services/examen-service/src/services/examen.service.js`.

### 3.1 El banco de preguntas y por qué se carga por nivel, no por orden fijo

> "Construí el servicio de banco de preguntas: la carga inicial desde el
> origen de datos (Excel/JSON) y la función `getPregunta(nivel,
> excluirIds)` que trae una pregunta al azar de un nivel específico
> (`Básico`, `Medio` o `Avanzado`) excluyendo las que el candidato ya
> respondió en esa sesión. Esto responde a RF-02: el motor adaptativo
> necesita poder pedir 'una pregunta de este nivel que el candidato no haya
> visto' en cualquier momento del examen, no recorrer una lista fija. En
> Mongo esto se resuelve con un `$match` por nivel e id excluido, más un
> `$sample: { size: 1 }` para tomarla al azar — así dos candidatos en el
> mismo nivel no necesariamente ven la misma secuencia de preguntas."

### 3.2 El algoritmo adaptativo: tablas de transición de nivel

> "Mi parte fue el corazón funcional del sistema: el motor de examen
> adaptativo. RF-02 exige que el sistema ajuste la dificultad en tiempo
> real según las respuestas previas del candidato, y EaC-05 exige que ese
> ajuste tome menos de 2 segundos. El examen siempre **inicia en nivel
> Medio** — ninguna sesión arranca en Básico ni en Avanzado, para no
> penalizar ni favorecer de entrada a nadie. Después de cada respuesta, el
> nivel de la siguiente pregunta se calcula con dos tablas fijas:
>
> - **Si acierta:** Básico → Medio, Medio → Avanzado, Avanzado se mantiene
>   en Avanzado (ya es el techo).
> - **Si falla:** Medio → Básico, Avanzado → Medio, Básico se mantiene en
>   Básico (ya es el piso).
>
> Es decir, un acierto siempre sube (o te deja en el techo) y un fallo
> siempre baja (o te deja en el piso) — nunca se salta dos niveles de
> golpe. La lógica vive en `examen-service`, es síncrona y en memoria (dos
> objetos de mapeo, no un cálculo pesado), así que cumple el umbral de
> menos de 2 segundos en la práctica sin necesidad de infraestructura
> adicional como colas o cachés.
>
> Soy transparente sobre el alcance: esto **no es un modelo IRT calibrado**
> (Teoría de Respuesta al Ítem, con parámetros de discriminación,
> dificultad y adivinanza por pregunta) — es una máquina de estados de tres
> niveles. Calibrar un modelo IRT real requiere un banco de datos
> históricos de respuestas que un MVP de curso no tiene. Por eso el equipo
> diseñó el esquema de Mongo con un campo `metadatos: {}` vacío pero ya
> preparado para recibir esos parámetros el día que se calibre un modelo
> real — la decisión de usar MongoDB en vez de Postgres para el banco de
> preguntas, que implementó Javier, nace precisamente de esta necesidad de
> flexibilidad futura."

### 3.3 Ponderación por nivel y el umbral de aprobación

> "También implementé el cálculo de dictamen final al completar las 10
> preguntas de la sesión (`TOTAL_PREGUNTAS = 10`). Cada nivel de
> dificultad pesa distinto en el puntaje: **Básico vale 1 punto, Medio vale
> 2, Avanzado vale 3** — no todas las preguntas valen igual, porque no
> cuesta lo mismo acertar una pregunta fácil que una difícil. Sumo los
> puntos de las preguntas correctas (`puntaje`) contra el máximo posible
> según los niveles que realmente le tocaron al candidato (`maxPuntaje`,
> que varía persona por persona porque cada uno recorre un camino de
> niveles distinto), calculo el porcentaje, y si ese porcentaje es **mayor
> o igual a 60%, el dictamen es `Aprobado`**; si no, `Reprobado`.
>
> Este cálculo es la puerta de entrada al resto del flujo: solo se puede
> emitir un certificado — en cualquiera de las dos implementaciones, la de
> Oswaldo o la de Javier — de una sesión con `completado=true` y
> `dictamen='Aprobado'`; si no se cumple, el servicio de certificado
> responde 409. El dictamen también alimenta directamente el dashboard
> gerencial de Oswaldo, que cuenta cuántos candidatos aprobaron o
> reprobaron por universidad y carrera."

### 3.4 Un detalle de seguridad que también es mío: nunca exponer la respuesta correcta

> "Algo pequeño pero importante para EaC-03 (seguridad — rechazar
> alteración de calificación): la función que devuelve una pregunta al
> frontend (`ocultarRespuesta`) elimina explícitamente el campo
> `respuesta_correcta` (y el `_id` interno de Mongo) antes de enviarla. El
> candidato nunca recibe en la respuesta HTTP la clave de la pregunta que
> está respondiendo — la validación de si acertó o no se hace siempre en
> el servidor, comparando contra el documento completo que el backend trae
> de Mongo, nunca confiando en lo que el cliente diga que es correcto."

### 3.5 Preguntas probables sobre mi parte (Jencer)

| Pregunta probable | Respuesta corta y honesta |
|---|---|
| "¿Esto es un modelo IRT real?" | No, es una máquina de estados de 3 niveles (sube con acierto, baja con fallo). El esquema de Mongo ya tiene un campo `metadatos: {}` preparado para parámetros IRT reales a futuro, pero no se calibró ningún modelo en este MVP — calibrar IRT requiere datos históricos que no existen en un curso. |
| "¿Por qué inicia en nivel Medio y no en Básico?" | Para no asumir de entrada que el candidato es principiante ni avanzado; es un punto de partida neutral. |
| "¿Qué pasa si dos candidatos responden las mismas 10 preguntas?" | No necesariamente — `getPregunta` usa `$sample` para elegir al azar entre las preguntas disponibles de ese nivel, excluyendo las ya respondidas en la sesión. |
| "¿Por qué Básico/Medio/Avanzado valen distinto puntaje?" | Para que el puntaje refleje la dificultad real superada, no solo la cantidad de respuestas correctas — 1/2/3 puntos respectivamente. |
| "¿Cómo evitan que el candidato haga trampa viendo la respuesta correcta en la red?" | El backend nunca envía `respuesta_correcta` en la respuesta JSON de la pregunta; la validación de acierto siempre ocurre del lado del servidor contra el documento completo de Mongo. |
| "¿De dónde sale el umbral de 60% para aprobar?" | Es un umbral fijo configurado en el código (`porcentaje >= 60`), no calculado dinámicamente por área de certificación — una simplificación razonable para el MVP frente a lo que Fase 1 imaginaba (umbral configurable por período/competencia). |

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
