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
]);

function formatearFecha(fecha) {
  if (!fecha) {
    return "Sin fecha";
  }

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return fecha;
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(fechaConvertida);
}

function convertirMetadatos(metadatos) {
  if (!metadatos) {
    return {};
  }

  if (typeof metadatos === "object") {
    return metadatos;
  }

  try {
    return JSON.parse(metadatos);
  } catch {
    return { valor: metadatos };
  }
}

function obtenerSeveridad(tipoEvento) {
  if (tiposTelemetria.has(tipoEvento)) {
    return "ALERTA";
  }

  return "INFORMACION";
}

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
        if (evento.fuente !== "AUDITORIA") {
          return true;
        }

        const clave = `${evento.tipoEvento}-${evento.creadoEn}-${JSON.stringify(
          evento.metadatos
        )}`;

        if (!idsTelemetria.has(clave)) {
          return true;
        }

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

      const total = (trailRespuesta.total || 0) + (telemetriaRespuesta.eventos?.length || 0);

      if (total === 0) {
        setMensaje("La sesión existe, pero todavía no tiene eventos registrados.");
      } else {
        setMensaje(`Consulta completada para la sesión ${sesionId}.`);
      }
    } catch (requestError) {
      setError(requestError.message || "No fue posible consultar la auditoría de la sesión.");
    } finally {
      setCargando(false);
    }
  }

  function actualizarFormulario(event) {
    const { name, value } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
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

      setFormulario({
        idCandidato: "",
        tipoEvento: "",
        metadatos: "",
      });

      setMostrarFormulario(false);
      setMensaje("Evento administrativo registrado correctamente.");

      const trailRespuesta = await obtenerTrailAuditoria(sesionId);
      setRegistros(trailRespuesta.registros || []);
    } catch (requestError) {
      setError(requestError.message || "No fue posible registrar el evento administrativo.");
    } finally {
      setGuardando(false);
    }
  }

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
              Consulte los registros operativos y los eventos de telemetría asociados a una sesión de examen.
            </p>
          </div>

          <div className="auditoria-retention">
            <span>Retención</span>
            <strong>5 años</strong>
          </div>
        </div>

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
          </form>

          {error && <div className="auditoria-message error">{error}</div>}
          {mensaje && <div className="auditoria-message success">{mensaje}</div>}
        </div>

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
            <span>Total consolidado</span>
            <strong>{eventosUnificados.length}</strong>
          </article>
        </div>

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
              Ingrese un identificador de sesión y realice una consulta para visualizar la trazabilidad.
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
                      <td>{evento.tipoEvento}</td>
                      <td>{evento.idCandidato || "No disponible"}</td>
                      <td>
                        <span className={`auditoria-severity ${evento.severidad.toLowerCase()}`}>
                          {evento.severidad}
                        </span>
                      </td>
                      <td>
                        <code>{JSON.stringify(evento.metadatos)}</code>
                      </td>
                      <td>{evento.fechaRetencion ? formatearFecha(evento.fechaRetencion) : "Aplicada por servicio"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="auditoria-footnote">
          Los eventos de telemetría se registran en la misma bitácora de auditoría y se conservan conforme a la política de retención del proyecto.
        </p>
      </section>
    </ConsoleLayout>
  );
}

export default AuditoriaPage;