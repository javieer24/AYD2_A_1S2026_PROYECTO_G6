import { useState } from "react";
import ConsoleLayout from "../../layouts/ConsoleLayout";

function AuditoriaPage() {
  const [sesionId, setSesionId] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");

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

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!sesionId) return;
    setBuscando(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/audit/trail?sesion_id=${sesionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "ok") {
        setLogs(data.trail);
      } else {
        setError("No se encontraron registros para esa sesión.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setBuscando(false);
    }
  };

  const severidadColor = (s) => {
    if (s === "CRITICAL") return "bg-red-100 text-red-700";
    if (s === "WARNING")  return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-500";
  };

  const tipoColor = (t) => {
    if (t === "TELEMETRIA")   return "bg-orange-50 text-orange-600";
    if (t === "EXAMEN")       return "bg-indigo-50 text-indigo-600";
    if (t === "AUTENTICACION") return "bg-emerald-50 text-emerald-600";
    return "bg-gray-50 text-gray-500";
  };

  return (
    <ConsoleLayout
      title="Auditoría y trazabilidad"
      subtitle="Bitácora inmutable de eventos. Retención 5 años conforme al convenio SICA."
      badge="RF-03 · EaC-07"
    >
      <div className="space-y-4">

        {/* Buscador */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <form onSubmit={handleBuscar} className="flex gap-3">
            <input
              type="number"
              value={sesionId}
              onChange={(e) => setSesionId(e.target.value)}
              placeholder="ID de sesión (ej. 2)"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
            <button
              type="submit"
              disabled={buscando}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-50"
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Lista de eventos */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Eventos registrados</h3>
            <span className="text-xs text-gray-400">{logs.length} registros</span>
          </div>

          <div className="divide-y divide-gray-50">
            {logs.map((log, index) => (
              <div key={index} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition">

                {/* Tipo */}
                <span className={`mt-0.5 shrink-0 text-xs font-semibold px-2 py-1 rounded-lg ${tipoColor(log.tipo)}`}>
                  {log.tipo}
                </span>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-800">{log.evento}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severidadColor(log.severidad)}`}>
                      {log.severidad}
                    </span>
                  </div>
                  <div className="mt-1 flex gap-3 text-xs text-gray-400 flex-wrap">
                    <span>{log.timestamp}</span>
                    <span>·</span>
                    <span>{log.usuario}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 font-mono bg-gray-50 rounded-lg px-3 py-1.5">
                    {JSON.stringify(log.metadatos)}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Nota */}
        <p className="text-xs text-gray-400 text-center pb-2">
          Registros de solo lectura · Retención mínima 5 años · Convenio SICA de educación superior
        </p>

      </div>
    </ConsoleLayout>
  );
}

export default AuditoriaPage;