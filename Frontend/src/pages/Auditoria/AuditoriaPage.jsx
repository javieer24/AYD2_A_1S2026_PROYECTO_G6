import { useMemo, useState } from "react";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import {
  obtenerEventosTelemetria,
  obtenerTrailAuditoria,
  registrarEventoAuditoria,
} from "../../services/auditoriaApi";
import "./AuditoriaPage.css";

const tiposTelemetria = new Set([
  "CAMBIO_PESTANA",
  "PERDIDA_FOCO",
  "COPIAR_PEGAR",
  "DEVTOOLS_DETECTADO",
  "MULTIPLES_PESTANAS",
  "GRABACION_PANTALLA",
  "CAPTURA_EVENTO",
]);

const tiposEvidencia = new Set(["GRABACION_PANTALLA", "CAPTURA_EVENTO"]);

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";
  const fechaConvertida = new Date(fecha);
  if (Number.isNaN(fechaConvertida.getTime())) return fecha;
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(fechaConvertida);
}

function convertirMetadatos(metadatos) {
  if (!metadatos) return {};
  if (typeof metadatos === "object") return metadatos;
  try {
    return JSON.parse(metadatos);
  } catch {
    return { valor: metadatos };
  }
}

function obtenerSeveridad(tipoEvento) {
  return tiposTelemetria.has(tipoEvento) ? "ALERTA" : "INFORMACION";
}

// ── Modal de metadatos de evidencia ──────────────────────────────────────────
function ModalEvidencia({ evidencias, onCerrar }) {
  if (!evidencias) return null;

  return (
    <div
      className="auditoria-modal-overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-label="Metadatos de evidencia antifraude"
    >
      <div
        className="auditoria-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auditoria-modal-header">
          <div>
            <span className="auditoria-eyebrow">Evidencia antifraude</span>
            <h3>Metadatos de grabación</h3>
            <p>
              El archivo está cifrado con AES-256-GCM y almacenado en MinIO con
              Object Lock WORM. No es posible reproducirlo directamente desde el
              navegador.
            </p>
          </div>
          <button
            type="button"
            className="auditoria-modal-close"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="auditoria-modal-body">
          {evidencias.length === 0 ? (
            <p className="auditoria-modal-empty">
              No se encontraron registros de evidencia para esta sesión.
            </p>
          ) : (
            evidencias.map((ev, i) => (
              <div key={ev.id ?? i} className="auditoria-evidence-card">
                <div className="auditoria-evidence-card-header">
                  <span className="auditoria-evidence-badge">{ev.tipo}</span>
                  <span className="auditoria-evidence-date">
                    {formatearFecha(ev.creado_en)}
                  </span>
                </div>

                <div className="auditoria-evidence-grid">
                  <MetaFila label="ID" value={ev.id} />
                  <MetaFila label="Candidato" value={ev.id_candidato} />
                  <MetaFila label="Cifrado" value={ev.cifrado ?? "AES-256-GCM"} />
                  <MetaFila
                    label="Retención hasta"
                    value={formatearFecha(ev.retencion_hasta)}
                  />
                  <MetaFila
                    label="Objeto en MinIO"
                    value={ev.nombre_objeto}
                    mono
                    full
                  />
                  <MetaFila
                    label="Hash SHA-256"
                    value={ev.hash_integridad}
                    mono
                    full
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function MetaFila({ label, value, mono = false, full = false }) {
  return (
    <div className={`auditoria-meta-fila${full ? " full" : ""}`}>
      <span className="auditoria-meta-label">{label}</span>
      <span className={`auditoria-meta-value${mono ? " mono" : ""}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
function AuditoriaPage() {
  const [sesionId, setSesionId] = useState("");
  const [registros, setRegistros] = useState([]);
  const [eventosTelemetria, setEventosTelemetria] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formulario, setFormulario] = useState({
    idCandidato: "",
    tipoEvento: "",
    metadatos: "",
  });

  // Estado para el modal de evidencia
  const [modalEvidencias, setModalEvidencias] = useState(null); // null = cerrado
  const [cargandoEvidencia, setCargandoEvidencia] = useState(false);

  const token = localStorage.getItem("token");

  const eventosUnificados = useMemo(() => {
    const trailNormalizado = registros.map((registro) => ({
      id: `audit-${registro.id}`,
      fuente: "AUDITORIA",
      sesionId: registro.sesion_id,
      idCandidato: registro.id_candidato,
      tipoEvento: registro.tipo_evento,
      metadatos: convertirMetadatos(registro.metadatos),
      fechaRetencion: registro.fecha_retencion,
      creadoEn: registro.creado_en,
      severidad: obtenerSeveridad(registro.tipo_evento),
    }));

    const telemetriaNormalizada = eventosTelemetria.map((evento) => ({
      id: `telemetria-${evento.id}`,
      fuente: "TELEMETRIA",
      sesionId,
      idCandidato: "",
      tipoEvento: evento.tipo_evento,
      metadatos: convertirMetadatos(evento.metadatos),
      fechaRetencion: null,
      creadoEn: evento.creado_en,
      severidad: "ALERTA",
    }));

    const idsTelemetria = new Set(
      telemetriaNormalizada.map(
        (evento) =>
          `${evento.tipoEvento}-${evento.creadoEn}-${JSON.stringify(evento.metadatos)}`
      )
    );

    return [...trailNormalizado, ...telemetriaNormalizada]
      .filter((evento, indice, arreglo) => {
        if (evento.fuente !== "AUDITORIA") return true;
        const clave = `${evento.tipoEvento}-${evento.creadoEn}-${JSON.stringify(evento.metadatos)}`;
        if (!idsTelemetria.has(clave)) return true;
        return (
          arreglo.findIndex(
            (item) =>
              item.tipoEvento === evento.tipoEvento &&
              item.creadoEn === evento.creadoEn &&
              JSON.stringify(item.metadatos) === JSON.stringify(evento.metadatos)
          ) === indice
        );
      })
      .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));
  }, [eventosTelemetria, registros, sesionId]);

  async function buscarSesion(event) {
    event.preventDefault();
    if (!sesionId || Number(sesionId) <= 0) {
      setError("Ingrese un identificador de sesión válido.");
      return;
    }

    setCargando(true);
    setError("");
    setMensaje("");
    setRegistros([]);
    setEventosTelemetria([]);

    try {
      const [trailRespuesta, telemetriaRespuesta] = await Promise.all([
        obtenerTrailAuditoria(sesionId),
        obtenerEventosTelemetria(sesionId),
      ]);

      setRegistros(trailRespuesta.registros || []);
      setEventosTelemetria(telemetriaRespuesta.eventos || []);

      const total =
        (trailRespuesta.total || 0) + (telemetriaRespuesta.eventos?.length || 0);

      setMensaje(
        total === 0
          ? "La sesión existe, pero todavía no tiene eventos registrados."
          : `Consulta completada para la sesión ${sesionId}.`
      );
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible consultar la auditoría de la sesión."
      );
    } finally {
      setCargando(false);
    }
  }

  async function abrirEvidencia() {
    if (!sesionId || Number(sesionId) <= 0) return;

    setCargandoEvidencia(true);
    setError("");

    try {
      const res = await fetch(
        `/api/telemetria/evidencia/${sesionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Error ${res.status} al obtener evidencia`);
      }

      const data = await res.json();
      // Acepta { evidencias: [...] } o { evidencia: {...} } o array directo
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data.evidencias)
        ? data.evidencias
        : data.evidencia
        ? [data.evidencia]
        : [];

      setModalEvidencias(lista);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargandoEvidencia(false);
    }
  }

  function actualizarFormulario(event) {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  async function guardarEvento(event) {
    event.preventDefault();

    if (!sesionId || Number(sesionId) <= 0) {
      setError("Primero consulte una sesión válida.");
      return;
    }

    if (!formulario.idCandidato.trim() || !formulario.tipoEvento.trim()) {
      setError("El identificador del candidato y el tipo de evento son obligatorios.");
      return;
    }

    let metadatos = {};
    if (formulario.metadatos.trim()) {
      try {
        metadatos = JSON.parse(formulario.metadatos);
      } catch {
        setError("Los metadatos deben tener formato JSON válido.");
        return;
      }
    }

    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      await registrarEventoAuditoria({
        sesionId,
        idCandidato: formulario.idCandidato.trim(),
        tipoEvento: formulario.tipoEvento.trim(),
        metadatos,
      });

      setFormulario({ idCandidato: "", tipoEvento: "", metadatos: "" });
      setMostrarFormulario(false);
      setMensaje("Evento administrativo registrado correctamente.");

      const trailRespuesta = await obtenerTrailAuditoria(sesionId);
      setRegistros(trailRespuesta.registros || []);
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible registrar el evento administrativo."
      );
    } finally {
      setGuardando(false);
    }
  }

  const eventosEvidencia = eventosUnificados.filter((e) =>
    tiposEvidencia.has(e.tipoEvento)
  );

  const hayEvidencia = eventosEvidencia.length > 0;

  return (
    <ConsoleLayout
      title="Auditoría y trazabilidad"
      subtitle="Consulta de eventos de sesión y trazabilidad inmutable con retención mínima de cinco años."
      badge="Auditoría de sesiones"
    >
      <section className="auditoria-page">
        <div className="auditoria-header">
          <div>
            <span className="auditoria-eyebrow">Control de trazabilidad</span>
            <h2>Bitácora de auditoría por sesión</h2>
            <p>
              Consulte los registros operativos y los eventos de telemetría asociados a una
              sesión de examen.
            </p>
          </div>
          <div className="auditoria-retention">
            <span>Retención</span>
            <strong>5 años</strong>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="auditoria-search-card">
          <form className="auditoria-search-form" onSubmit={buscarSesion}>
            <label>
              Identificador de sesión
              <input
                type="number"
                min="1"
                value={sesionId}
                onChange={(event) => setSesionId(event.target.value)}
                placeholder="Ejemplo: 2"
              />
            </label>
            <button type="submit" disabled={cargando}>
              {cargando ? "Consultando..." : "Consultar sesión"}
            </button>
            <button
              type="button"
              className="auditoria-secondary-button"
              onClick={() => {
                setMostrarFormulario((actual) => !actual);
                setError("");
                setMensaje("");
              }}
            >
              Registrar evento
            </button>
            {/* Botón de evidencia — visible solo cuando hay registros de evidencia */}
            {hayEvidencia && (
              <button
                type="button"
                className="auditoria-evidence-button"
                onClick={abrirEvidencia}
                disabled={cargandoEvidencia}
              >
                {cargandoEvidencia ? (
                  "Cargando..."
                ) : (
                  <>
                    <span className="auditoria-evidence-dot" />
                    Ver evidencia ({eventosEvidencia.length})
                  </>
                )}
              </button>
            )}
          </form>

          {error   && <div className="auditoria-message error">{error}</div>}
          {mensaje && <div className="auditoria-message success">{mensaje}</div>}
        </div>

        {/* Formulario de registro administrativo */}
        {mostrarFormulario && (
          <div className="auditoria-form-card">
            <div className="auditoria-section-heading">
              <div>
                <span>Registro administrativo</span>
                <h3>Agregar evento a la bitácora</h3>
              </div>
            </div>

            <form className="auditoria-event-form" onSubmit={guardarEvento}>
              <label>
                Identificador del candidato
                <input
                  name="idCandidato"
                  type="text"
                  value={formulario.idCandidato}
                  onChange={actualizarFormulario}
                  placeholder="USAC-2024-001"
                />
              </label>
              <label>
                Tipo de evento
                <input
                  name="tipoEvento"
                  type="text"
                  value={formulario.tipoEvento}
                  onChange={actualizarFormulario}
                  placeholder="REVISION_ADMINISTRATIVA"
                />
              </label>
              <label className="auditoria-full-field">
                Metadatos en formato JSON
                <textarea
                  name="metadatos"
                  value={formulario.metadatos}
                  onChange={actualizarFormulario}
                  placeholder={'{"detalle":"Descripción del evento"}'}
                  rows="4"
                />
              </label>
              <div className="auditoria-form-actions">
                <button type="submit" disabled={guardando}>
                  {guardando ? "Registrando..." : "Guardar evento"}
                </button>
                <button
                  type="button"
                  className="auditoria-secondary-button"
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resumen */}
        <div className="auditoria-summary-grid">
          <article>
            <span>Registros de auditoría</span>
            <strong>{registros.length}</strong>
          </article>
          <article>
            <span>Alertas de telemetría</span>
            <strong>{eventosTelemetria.length}</strong>
          </article>
          <article>
            <span>Evidencia antifraude</span>
            <strong>{eventosEvidencia.length}</strong>
          </article>
          <article>
            <span>Total consolidado</span>
            <strong>{eventosUnificados.length}</strong>
          </article>
        </div>

        {/* Tabla */}
        <div className="auditoria-table-card">
          <div className="auditoria-section-heading">
            <div>
              <span>Historial consolidado</span>
              <h3>Eventos registrados</h3>
            </div>
            {sesionId && <strong>Sesión {sesionId}</strong>}
          </div>

          {cargando ? (
            <div className="auditoria-empty-state">Consultando registros de la sesión.</div>
          ) : eventosUnificados.length === 0 ? (
            <div className="auditoria-empty-state">
              Ingrese un identificador de sesión y realice una consulta para visualizar la
              trazabilidad.
            </div>
          ) : (
            <div className="auditoria-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Fuente</th>
                    <th>Evento</th>
                    <th>Candidato</th>
                    <th>Severidad</th>
                    <th>Metadatos</th>
                    <th>Retención</th>
                    <th>Evidencia</th>
                  </tr>
                </thead>
                <tbody>
                  {eventosUnificados.map((evento) => (
                    <tr key={evento.id}>
                      <td>{formatearFecha(evento.creadoEn)}</td>
                      <td>
                        <span className={`auditoria-source ${evento.fuente.toLowerCase()}`}>
                          {evento.fuente}
                        </span>
                      </td>
                      <td>
                        {tiposEvidencia.has(evento.tipoEvento) ? (
                          <span className="auditoria-evidence-badge">
                            {evento.tipoEvento}
                          </span>
                        ) : (
                          evento.tipoEvento
                        )}
                      </td>
                      <td>{evento.idCandidato || "No disponible"}</td>
                      <td>
                        <span className={`auditoria-severity ${evento.severidad.toLowerCase()}`}>
                          {evento.severidad}
                        </span>
                      </td>
                      <td>
                        <code>{JSON.stringify(evento.metadatos)}</code>
                      </td>
                      <td>
                        {evento.fechaRetencion
                          ? formatearFecha(evento.fechaRetencion)
                          : "Aplicada por servicio"}
                      </td>
                      <td>
                        {tiposEvidencia.has(evento.tipoEvento) ? (
                          <button
                            type="button"
                            className="auditoria-view-button"
                            onClick={abrirEvidencia}
                            disabled={cargandoEvidencia}
                            title="Ver metadatos de evidencia"
                          >
                            {cargandoEvidencia ? "…" : "Ver"}
                          </button>
                        ) : (
                          <span className="auditoria-no-evidence">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="auditoria-footnote">
          Los eventos de telemetría y la evidencia antifraude (grabación de pantalla,
          capturas de evento) se conservan cifrados con AES-256-GCM conforme a la política
          de retención del proyecto PRCCD/SICA — mínimo 5 años con Object Lock WORM.
        </p>
      </section>

      {/* Modal de metadatos de evidencia */}
      {modalEvidencias !== null && (
        <ModalEvidencia
          evidencias={modalEvidencias}
          onCerrar={() => setModalEvidencias(null)}
        />
      )}
    </ConsoleLayout>
  );
}

export default AuditoriaPage;