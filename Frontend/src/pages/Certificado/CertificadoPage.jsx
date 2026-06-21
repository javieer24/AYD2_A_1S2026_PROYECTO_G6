import ConsoleLayout from "../../layouts/ConsoleLayout";

import { useState } from "react";

function CertificadosPage() {
  // Simulación de estados para la UI basados en los endpoints de tu servicio
  const [certificadosEmitidos, setCertificadosEmitidos] = useState([
    {
      id: "CERT-USAC-9941",
      estudiante: "Maria Lopez",
      universidad: "USAC",
      fecha: "2026-06-15",
      bloque: 12,
      estado: "EMITIDO",
    },
    {
      id: "CERT-UCR-0024",
      estudiante: "Carlos Alvarado",
      universidad: "UCR",
      fecha: "2026-06-18",
      bloque: 13,
      estado: "EMITIDO",
    },
  ]);

  const [cadenaIntegra, setCadenaIntegra] = useState(true);
  const [loadingVerify, setLoadingVerify] = useState(false);

  return (
    <main>
      <ConsoleLayout
        title="Certificados emitidos"
        subtitle="Certificados emitidos por el candidato"
        badge="RF-02 · EaC-05 · UC-2.4"
      >
        <div className="space-y-8 animate-fadeIn">
          {/* Tarjetas de Resumen de Criptografía */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Estado de Infraestructura
              </span>
              <div className="mt-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <strong className="text-xl font-bold text-slate-800">
                  PKI Activa (F2-18)
                </strong>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Claves criptográficas regionales validadas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Integridad de Cadena
              </span>
              <div className="mt-2 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-emerald-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <strong className="text-xl font-bold text-emerald-700">
                  Log Inmutable Verificado
                </strong>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Todos los bloques están íntegros.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Registros WORM
              </span>
              <div className="mt-2">
                <strong className="text-2xl font-black text-slate-800">
                  {certificadosEmitidos.length + 45} Bloques
                </strong>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Retención inalterable obligatoria de 5 años.
              </p>
            </div>
          </div>

          {/* Sección principal: Tabla de emisión */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Historial de Certificados Firmados
                </h3>
                <p className="text-sm text-slate-500">
                  Trazabilidad técnica de credenciales emitidas vía criptografía
                  simétrica AES-256-GCM.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition">
                Verificar Cadena Completa
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">ID Certificado</th>
                    <th className="px-6 py-4">Estudiante</th>
                    <th className="px-6 py-4">Universidad</th>
                    <th className="px-6 py-4">Fecha Emisión</th>
                    <th className="px-6 py-4">Índice de Bloque</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {certificadosEmitidos.map((cert) => (
                    <tr
                      key={cert.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">
                        {cert.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {cert.estudiante}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                            cert.universidad === "USAC"
                              ? "bg-blue-50 text-blue-700"
                              : cert.universidad === "UCR"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {cert.universidad}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{cert.fecha}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        # {cert.bloque}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {cert.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-900 transition">
                          Ver Recibo SHA
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Herramienta de Auditoría Pública / Verificación manual simulada */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-indigo-950/20">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]"></div>
            <div className="relative z-10 max-w-xl">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">
                Herramienta Forense
              </span>
              <h4 className="text-2xl font-black tracking-tight mt-2 text-white">
                Verificación Rápida de Hash
              </h4>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                Inspecciona de forma manual cualquier Hash criptográfico, ID de
                bloque o firma digital del ecosistema SICA para auditar su
                validez matemática instantáneamente.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Ingrese el hash del documento o certificado..."
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all text-white"
                />
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-3 rounded-xl transition shadow-md shadow-indigo-600/10">
                  Validar Firma
                </button>
              </div>
            </div>
          </div>
        </div>
      </ConsoleLayout>
    </main>
  );
}

export default CertificadosPage;
