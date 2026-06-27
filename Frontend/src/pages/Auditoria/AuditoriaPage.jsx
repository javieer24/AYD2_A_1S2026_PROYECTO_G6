import { useMemo, useState, useEffect } from "react";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import {
  obtenerEventosTelemetria,
  obtenerTrailAuditoria,
  registrarEventoAuditoria,
} from "../../services/auditoriaApi";
import "./AuditoriaPage.css";

// ─── Constantes ──────────────────────────────────────────────────────────────
const tiposTelemetria = new Set([
  "CAMBIO_PESTANA",
  "PERDIDA_FOCO",
  "COPIAR_PEGAR",
  "DEVTOOLS_DETECTADO",
  "MULTIPLES_PESTANAS",
  "GRABACION_PANTALLA",
  "CAPTURA_EVENTO",
]);

// Tipos de evidencia según el documento de integración
const tiposEvidencia = new Set(["VIDEO", "CAPTURA_PANTALLA", "OTRO", "LOG_TECLEO"]);
const API_URL = import.meta.env.VITE_BACKEND_URL_API ?? "http://localhost";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function formatFileSize(bytes) {
  if (!bytes) return "—";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

function getTipoIcon(tipo) {
  const icons = {
    'VIDEO': '🎬',
    'CAPTURA_PANTALLA': '🖼️',
    'OTRO': '🎤',
    'LOG_TECLEO': '📝'
  };
  return icons[tipo] || '📄';
}

function getTipoLabel(tipo) {
  const labels = {
    'VIDEO': 'Video',
    'CAPTURA_PANTALLA': 'Captura de pantalla',
    'OTRO': 'Audio (voz)',
    'LOG_TECLEO': 'Log de tecleo'
  };
  return labels[tipo] || tipo;
}

// ─── Modal de evidencia ──────────────────────────────────────────────────────

function ModalEvidencia({ evidencias, sesionId, onCerrar, token }) {
  const [descargando, setDescargando] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState("");
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCerrar]);

  async function descargarEvidencia(evidenciaId, tipo) {
    setDescargando(true);
    setErrorDescarga("");
    setEvidenciaSeleccionada(evidenciaId);

    try {
      const response = await fetch(
        `${API_URL}/api/telemetria/evidencia/descargar/${evidenciaId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 409 = archivo corrupto o manipulado
      if (response.status === 409) {
        setErrorDescarga("❌ Evidencia corrupta o manipulada — integridad no verificada");
        setDescargando(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Abrir según el tipo de evidencia
      abrirVisualizador(url, tipo, evidenciaId, blob);

      // Limpiar URL después de un tiempo
      setTimeout(() => URL.revokeObjectURL(url), 60000);

    } catch (error) {
      setErrorDescarga(`❌ Error al descargar: ${error.message}`);
    } finally {
      setDescargando(false);
      setEvidenciaSeleccionada(null);
    }
  }

  function abrirVisualizador(url, tipo, id, blob) {
    const ventana = window.open("", "_blank", "width=900,height=700,resizable=yes");
    
    if (!ventana) {
      // Si no se puede abrir ventana, forzar descarga
      const a = document.createElement("a");
      a.href = url;
      a.download = `evidencia_${id}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    let contenido = "";
    let titulo = getTipoLabel(tipo);

    switch (tipo) {
      case "VIDEO":
        contenido = `
          <div class="container">
            <h2>🎬 Video de evidencia</h2>
            <video controls autoplay>
              <source src="${url}" type="video/webm">
              <source src="${url}" type="video/mp4">
              Tu navegador no soporta reproducción de video.
            </video>
            <p class="hint">ID: ${id}</p>
          </div>
        `;
        break;

      case "CAPTURA_PANTALLA":
        contenido = `
          <div class="container">
            <h2>🖼️ Captura de pantalla</h2>
            <img src="${url}" alt="Captura de pantalla de evidencia" />
            <p class="hint">ID: ${id}</p>
          </div>
        `;
        break;

      case "OTRO":
        contenido = `
          <div class="container">
            <h2>🎤 Audio de respuesta por voz</h2>
            <audio controls autoplay>
              <source src="${url}" type="audio/webm">
              <source src="${url}" type="audio/ogg">
              <source src="${url}" type="audio/mp3">
              Tu navegador no soporta reproducción de audio.
            </audio>
            <p class="hint">ID: ${id}</p>
          </div>
        `;
        break;

      case "LOG_TECLEO":
        // Leer el blob como texto (sin await porque ya tenemos el blob)
        try {
          const reader = new FileReader();
          reader.onload = function(e) {
            try {
              const data = JSON.parse(e.target.result);
              actualizarVentanaLog(ventana, data, id);
            } catch {
              actualizarVentanaLog(ventana, null, id, true);
            }
          };
          reader.readAsText(blob);
          // Mostrar loading mientras se lee
          ventana.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Log de tecleo - Evidencia antifraude</title>
                <style>
                  body { background: #0f0f1a; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: sans-serif; }
                  .container { max-width: 90vw; max-height: 90vh; background: #1a1a2e; border-radius: 16px; padding: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.8); border: 1px solid #2d2d44; }
                  h2 { color: #e0e0ff; text-align: center; }
                  .loading { color: #888; text-align: center; padding: 40px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>📝 Log de tecleo</h2>
                  <div class="loading">⏳ Cargando log...</div>
                </div>
              </body>
            </html>
          `);
          return;
        } catch {
          contenido = `
            <div class="container">
              <h2>📝 Log de tecleo</h2>
              <p class="error">No se pudo leer el contenido del log</p>
              <p class="hint">ID: ${id}</p>
            </div>
          `;
        }
        break;

      default:
        contenido = `
          <div class="container">
            <h2>📄 Archivo de evidencia</h2>
            <p>No se puede visualizar este tipo de archivo directamente.</p>
            <a href="${url}" download="evidencia_${id}.webm" class="download-btn">
              📥 Descargar archivo
            </a>
            <p class="hint">ID: ${id}</p>
          </div>
        `;
    }

    // Si no es LOG_TECLEO, escribir directamente
    if (tipo !== "LOG_TECLEO") {
      ventana.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${titulo} - Evidencia antifraude</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                background: #0f0f1a; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px;
              }
              .container {
                max-width: 90vw;
                max-height: 90vh;
                background: #1a1a2e;
                border-radius: 16px;
                padding: 30px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.8);
                border: 1px solid #2d2d44;
              }
              h2 { 
                color: #e0e0ff; 
                font-size: 1.5rem; 
                margin-bottom: 20px;
                text-align: center;
              }
              video, audio, img {
                max-width: 100%;
                max-height: 70vh;
                border-radius: 8px;
                display: block;
                margin: 0 auto;
                background: #000;
              }
              .hint {
                color: #666;
                font-size: 0.75rem;
                text-align: center;
                margin-top: 15px;
                font-family: monospace;
              }
              .error {
                color: #ff6b6b;
                text-align: center;
                padding: 20px;
              }
              .download-btn {
                display: inline-block;
                background: #4a6cf7;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                margin-top: 15px;
                transition: background 0.3s;
              }
              .download-btn:hover {
                background: #3a5ce5;
              }
            </style>
          </head>
          <body>
            ${contenido}
          </body>
        </html>
      `);
      ventana.document.close();
    }
  }

  function actualizarVentanaLog(ventana, data, id, error = false) {
    if (!ventana || ventana.closed) return;
    
    const contenido = error ? `
      <div class="container">
        <h2>📝 Log de tecleo</h2>
        <p class="error">No se pudo parsear el contenido del log</p>
        <p class="hint">ID: ${id}</p>
      </div>
    ` : `
      <div class="container">
        <h2>📝 Log de tecleo</h2>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <p class="hint">ID: ${id}</p>
      </div>
    `;

    ventana.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Log de tecleo - Evidencia antifraude</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              background: #0f0f1a; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
            }
            .container {
              max-width: 90vw;
              max-height: 90vh;
              background: #1a1a2e;
              border-radius: 16px;
              padding: 30px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.8);
              border: 1px solid #2d2d44;
            }
            h2 { 
              color: #e0e0ff; 
              font-size: 1.5rem; 
              margin-bottom: 20px;
              text-align: center;
            }
            pre {
              background: #0f0f1a;
              color: #b0b0dd;
              padding: 20px;
              border-radius: 8px;
              overflow: auto;
              max-height: 60vh;
              font-size: 0.85rem;
              border: 1px solid #2d2d44;
              white-space: pre-wrap;
              word-break: break-all;
            }
            .hint {
              color: #666;
              font-size: 0.75rem;
              text-align: center;
              margin-top: 15px;
              font-family: monospace;
            }
            .error {
              color: #ff6b6b;
              text-align: center;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          ${contenido}
        </body>
      </html>
    `);
    ventana.document.close();
  }

  if (!evidencias || evidencias.length === 0) {
    return (
      <div className="auditoria-modal-overlay" onClick={onCerrar}>
        <div className="auditoria-modal" onClick={(e) => e.stopPropagation()}>
          <div className="auditoria-modal-header">
            <div>
              <span className="auditoria-eyebrow">Evidencia antifraude</span>
              <h3>Sin evidencia registrada</h3>
            </div>
            <button className="auditoria-modal-close" onClick={onCerrar}>✕</button>
          </div>
          <div className="auditoria-modal-body">
            <p>No se encontraron registros de evidencia para la sesión {sesionId}.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auditoria-modal-overlay" onClick={onCerrar}>
      <div className="auditoria-modal auditoria-modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="auditoria-modal-header">
          <div>
            <span className="auditoria-eyebrow">Evidencia antifraude</span>
            <h3>Evidencia de la sesión {sesionId}</h3>
            <p>
              Los archivos están cifrados con AES-256-GCM y almacenados en MinIO con
              Object Lock WORM. Haz clic en "Ver" para reproducir la evidencia.
            </p>
          </div>
          <button className="auditoria-modal-close" onClick={onCerrar}>✕</button>
        </div>

        <div className="auditoria-modal-body">
          {errorDescarga && (
            <div className="auditoria-message error">{errorDescarga}</div>
          )}

          <div className="auditoria-evidence-list">
            {evidencias.map((ev, index) => (
              <div key={ev.id || index} className="auditoria-evidence-card">
                <div className="auditoria-evidence-card-header">
                  <div className="auditoria-evidence-header-left">
                    <span className={`auditoria-evidence-badge ${ev.tipo?.toLowerCase() || 'default'}`}>
                      {getTipoIcon(ev.tipo)} {ev.tipo || "EVIDENCIA"}
                    </span>
                    <span className="auditoria-evidence-index">#{index + 1}</span>
                  </div>
                  <span className="auditoria-evidence-date">
                    {formatearFecha(ev.timestamp_captura || ev.creado_en)}
                  </span>
                </div>

                <div className="auditoria-evidence-grid">
                  <MetaFila label="ID" value={ev.id} mono />
                  <MetaFila label="Tipo" value={getTipoLabel(ev.tipo)} />
                  <MetaFila label="Tamaño" value={formatFileSize(ev.size_bytes)} />
                  <MetaFila label="Cifrado" value={ev.cifrado ? "✅ AES-256-GCM" : "No"} />
                  <MetaFila
                    label="Retención hasta"
                    value={formatearFecha(ev.retencion_hasta)}
                  />
                  <MetaFila
                    label="Hash SHA-256"
                    value={ev.hash_archivo || ev.hash_integridad}
                    mono
                    full
                  />
                </div>

                <div className="auditoria-evidence-actions">
                  <button
                    className="auditoria-evidence-view-btn"
                    onClick={() => descargarEvidencia(ev.id, ev.tipo)}
                    disabled={descargando}
                  >
                    {descargando && evidenciaSeleccionada === ev.id ? (
                      "⏳ Cargando..."
                    ) : (
                      `▶ Ver ${getTipoLabel(ev.tipo)}`
                    )}
                  </button>
                  <span className="auditoria-evidence-type-hint">
                    {getTipoIcon(ev.tipo)} {getTipoLabel(ev.tipo)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componente MetaFila ──────────────────────────────────────────────────────

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

// ─── Componente principal ──────────────────────────────────────────────────────

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
  const [modalEvidencias, setModalEvidencias] = useState(null);
  const [cargandoEvidencia, setCargandoEvidencia] = useState(false);

  const token = localStorage.getItem("token");

  // ── Memo: eventos unificados ──────────────────────────────────────────────

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

  // ── Buscar sesión ──────────────────────────────────────────────────────────

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

  // ── Abrir evidencia ────────────────────────────────────────────────────────

  async function abrirEvidencia() {
    if (!sesionId || Number(sesionId) <= 0) {
      setError("Primero consulte una sesión válida.");
      return;
    }

    setCargandoEvidencia(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost/api/telemetria/evidencia/${sesionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Error ${res.status} al obtener evidencia`);
      }

      const data = await res.json();
      
      // Normalizar la respuesta
      let lista = [];
      if (Array.isArray(data)) {
        lista = data;
      } else if (Array.isArray(data.evidencias)) {
        lista = data.evidencias;
      } else if (data.evidencia) {
        lista = Array.isArray(data.evidencia) ? data.evidencia : [data.evidencia];
      } else if (data.data && Array.isArray(data.data)) {
        lista = data.data;
      } else {
        // Si es un objeto único con campos de evidencia
        if (data.id && data.tipo) {
          lista = [data];
        }
      }

      if (lista.length === 0) {
        setMensaje(`No se encontró evidencia para la sesión ${sesionId}.`);
        setModalEvidencias([]);
      } else {
        setModalEvidencias(lista);
      }
    } catch (e) {
      setError(e.message || "Error al obtener la evidencia");
    } finally {
      setCargandoEvidencia(false);
    }
  }

  // ── Guardar evento ──────────────────────────────────────────────────────────

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

  // ── Verificar si hay eventos de evidencia ──────────────────────────────────

  const eventosEvidencia = eventosUnificados.filter((e) =>
    tiposEvidencia.has(e.tipoEvento)
  );

  const hayEvidencia = eventosEvidencia.length > 0;

  // ── Render ──────────────────────────────────────────────────────────────────

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
                placeholder="Ejemplo: 42"
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
            {/* Botón de evidencia - siempre visible */}
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
                  Ver evidencia {hayEvidencia ? `(${eventosEvidencia.length})` : ""}
                </>
              )}
            </button>
          </form>

          {error && <div className="auditoria-message error">{error}</div>}
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
                          <span className={`auditoria-evidence-badge ${evento.tipoEvento.toLowerCase()}`}>
                            {getTipoIcon(evento.tipoEvento)} {evento.tipoEvento}
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

      {/* Modal de evidencia */}
      {modalEvidencias !== null && (
        <ModalEvidencia
          evidencias={modalEvidencias}
          sesionId={sesionId}
          onCerrar={() => setModalEvidencias(null)}
          token={token}
        />
      )}
    </ConsoleLayout>
  );
}

export default AuditoriaPage;