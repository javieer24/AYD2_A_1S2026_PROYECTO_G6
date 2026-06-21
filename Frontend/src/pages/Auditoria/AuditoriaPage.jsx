import { useState } from "react";
import ConsoleLayout from "../../layouts/ConsoleLayout";

function AuditoriaPage() {
  const [sesionId, setSesionId] = useState("");
  const [buscando, setBuscando] = useState(false);

  // Datos simulados basados exactamente en los payloads del API_ENDPOINTS.md
  const [logs, setLogs] = useState([
    {
      timestamp: "2026-06-20 18:01:23",
      tipo: "AUTENTICACION",
      evento: "CONFIRMAR_IDENTIDAD",
      usuario: "USAC-2024-001",
      severidad: "INFO",
      metadatos: { universidad: "USAC" },
    },
    {
      timestamp: "2026-06-20 18:02:10",
      tipo: "EXAMEN",
      evento: "INICIAR_SESION",
      usuario: "USAC-2024-001",
      severidad: "INFO",
      metadatos: { sesion_id: 2, numero_pregunta: 1 },
    },
    {
      timestamp: "2026-06-20 18:04:15",
      tipo: "TELEMETRIA",
      evento: "CAMBIO_PESTANA",
      usuario: "USAC-2024-001",
      severidad: "WARNING",
      metadatos: { detalle: "El usuario alternó a navegador externo" },
    },
    {
      timestamp: "2026-06-20 18:05:40",
      tipo: "TELEMETRIA",
      evento: "DEVTOOLS_DETECTADO",
      usuario: "USAC-2024-001",
      severidad: "CRITICAL",
      metadatos: { detalle: "Consola F12 abierta" },
    },
    {
      timestamp: "2026-06-20 18:06:12",
      tipo: "EXAMEN",
      evento: "SESION_SUSPENDIDA",
      usuario: "SISTEMA",
      severidad: "CRITICAL",
      metadatos: { motivo: "Exceso de alertas antifraude (5/5)" },
    },
  ]);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (!sesionId) return;
    setBuscando(true);
    // Aquí conectarías con: GET /api/audit/trail?sesion_id=${sesionId}
    setTimeout(() => setBuscando(false), 600);
  };

  return (
    <ConsoleLayout
      title="Motor transaccional de examen adaptativo"
      subtitle="Simulación funcional del núcleo de evaluación del candidato, aplicando transición de dificultad según acierto o fallo inmediato anterior y registrando historial de sesión."
      badge="RF-02 · EaC-05 · UC-2.4"
    >
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Buscador de Pistas de Auditoría
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Filtre por ID de Sesión de Examen para reconstruir la cronología
            inmutable de eventos.
          </p>

          <form
            onSubmit={handleBuscar}
            className="mt-4 flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="number"
                value={sesionId}
                onChange={(e) => setSesionId(e.target.value)}
                placeholder="Ingrese el ID de Sesión (ej. 2)..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={buscando}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition flex items-center gap-2 justify-center disabled:opacity-50"
            >
              {buscando ? "Consultando Ledger..." : "Rastrear Flujo"}
            </button>
          </form>
        </div>

        {/* Visor de Logs Estilo Terminal */}
        <div className="bg-slate-950 text-slate-200 rounded-3xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
          {/* Encabezado del visor */}
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-400 ml-2 font-sans font-semibold text-sm">
                Registro de Eventos Seguro (Retención 5 años)
              </span>
            </div>
            <span className="text-slate-500 text-[11px]">
              IMMUTABLE_DB_ENG_V2
            </span>
          </div>

          {/* Tabla de Logs de Baja Densidad */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Servicio</th>
                  <th className="px-6 py-3">Acción / Evento</th>
                  <th className="px-6 py-3">Actor (ID)</th>
                  <th className="px-6 py-3">Severidad</th>
                  <th className="px-6 py-3">Metadatos (JSON)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {logs.map((log, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className="text-indigo-400 font-bold">
                        [{log.tipo}]
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-white font-semibold whitespace-nowrap">
                      {log.evento}
                    </td>
                    <td className="px-6 py-3.5 text-slate-300 font-bold whitespace-nowrap">
                      {log.usuario}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          log.severidad === "CRITICAL"
                            ? "bg-red-950 text-red-400 border border-red-800/50"
                            : log.severidad === "WARNING"
                              ? "bg-amber-950 text-amber-400 border border-amber-800/50"
                              : "bg-slate-900 text-slate-400"
                        }`}
                      >
                        {log.severidad}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-emerald-400 whitespace-pre-wrap max-w-xs xl:max-w-md">
                      {JSON.stringify(log.metadatos)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nota Informativa Legal */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3 items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1a1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong className="font-bold block mb-0.5">
              Aviso de Cumplimiento de Auditoría Regional
            </strong>
            Este visor despliega datos crudos que alimentan de forma interna el
            Ledger General. Modificar, truncar o depurar estas tablas mediante
            cualquier consola está estrictamente prohibido por los términos del
            convenio SICA de educación superior.
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
}

export default AuditoriaPage;
