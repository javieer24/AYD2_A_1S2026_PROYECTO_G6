import { useState } from "react";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import { emitirCertificado, verificarCertificadoPublico } from "../../services/certificadoApi";

function CertificadoPage() {
  const [idCandidato, setIdCandidato] = useState("");
  const [sesionId, setSesionId] = useState("");
  const [nota, setNota] = useState("");
  const [certificadosEmitidos, setCertificadosEmitidos] = useState([]);
  const [hashVerificacion, setHashVerificacion] = useState("");
  const [resultadoVerificacion, setResultadoVerificacion] = useState(null);
  const [loadingIssue, setLoadingIssue] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function handleEmitir(event) {
    event.preventDefault();

    if (!idCandidato.trim() || !sesionId.trim()) {
      setError("Debe ingresar id_candidato y sesion_id.");
      setMensaje("");
      return;
    }

    setLoadingIssue(true);
    setError("");
    setMensaje("");

    try {
      const response = await emitirCertificado({
        idCandidato: idCandidato.trim(),
        sesionId: sesionId.trim(),
        datosCertificado: {
          nota: nota.trim() || "No especificada",
        },
      });

      const nuevoCertificado = {
        id: response.certificado.id,
        id_candidato: idCandidato.trim(),
        sesion_id: sesionId.trim(),
        hash: response.certificado.hash,
        emitido_en: response.certificado.emitido_en,
        estado: "EMITIDO",
      };

      setCertificadosEmitidos((actuales) => [nuevoCertificado, ...actuales]);
      setHashVerificacion(response.certificado.hash);
      setMensaje(response.message || "Certificado emitido correctamente.");
      setIdCandidato("");
      setSesionId("");
      setNota("");
    } catch (requestError) {
      setError(requestError.message || "No fue posible emitir el certificado.");
    } finally {
      setLoadingIssue(false);
    }
  }

  async function handleVerificar(event) {
    event.preventDefault();

    if (!hashVerificacion.trim()) {
      setError("Debe ingresar el hash público del certificado.");
      setMensaje("");
      return;
    }

    setLoadingVerify(true);
    setError("");
    setMensaje("");
    setResultadoVerificacion(null);

    try {
      const response = await verificarCertificadoPublico(hashVerificacion.trim());
      setResultadoVerificacion(response);
      setMensaje("Verificación pública realizada correctamente.");
    } catch (requestError) {
      setError(requestError.message || "No fue posible verificar el certificado.");
    } finally {
      setLoadingVerify(false);
    }
  }

  const valido = resultadoVerificacion?.valido === true;

  return (
    <ConsoleLayout
      title="Certificados emitidos"
      subtitle="Emisión protegida de certificados y verificación pública por hash criptográfico."
      badge="RF-certificación · EaC-integridad"
    >
      <div className="space-y-8">
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Emisión
            </span>
            <strong className="mt-2 block text-xl font-bold text-slate-800">
              Protegida con JWT
            </strong>
            <p className="mt-1 text-xs text-slate-500">
              La ruta de emisión requiere sesión activa.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verificación
            </span>
            <strong className="mt-2 block text-xl font-bold text-emerald-700">
              Pública por hash
            </strong>
            <p className="mt-1 text-xs text-slate-500">
              No requiere iniciar sesión.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Emitidos en esta sesión
            </span>
            <strong className="mt-2 block text-2xl font-black text-slate-800">
              {certificadosEmitidos.length}
            </strong>
            <p className="mt-1 text-xs text-slate-500">
              El backend actual no expone listado histórico.
            </p>
          </div>
        </section>

        {(mensaje || error) && (
          <div
            className={`rounded-2xl border p-4 text-sm font-semibold ${
              error
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {error || mensaje}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Emisión de certificado
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Generar credencial verificable
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Esta acción consume POST /api/certificate/issue.
              </p>
            </div>

            <form onSubmit={handleEmitir} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                id_candidato
                <input
                  value={idCandidato}
                  onChange={(event) => setIdCandidato(event.target.value)}
                  placeholder="USAC-2024-001"
                  className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700">
                sesion_id
                <input
                  type="number"
                  min="1"
                  value={sesionId}
                  onChange={(event) => setSesionId(event.target.value)}
                  placeholder="2"
                  className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700">
                nota
                <input
                  value={nota}
                  onChange={(event) => setNota(event.target.value)}
                  placeholder="100"
                  className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </label>

              <button
                type="submit"
                disabled={loadingIssue}
                className="h-12 rounded-2xl bg-indigo-700 px-5 text-sm font-black text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loadingIssue ? "Emitiendo..." : "Emitir certificado"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                Verificación pública
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Validar hash de certificado
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Esta acción consume GET /api/certificate/verify?hash=.
              </p>
            </div>

            <form onSubmit={handleVerificar} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Hash público
                <input
                  value={hashVerificacion}
                  onChange={(event) => setHashVerificacion(event.target.value)}
                  placeholder="Hash SHA-256 del certificado"
                  className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </label>

              <button
                type="submit"
                disabled={loadingVerify}
                className="h-12 rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loadingVerify ? "Verificando..." : "Verificar hash"}
              </button>
            </form>

            {resultadoVerificacion && (
              <div
                className={`mt-5 rounded-2xl border p-4 ${
                  valido
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-rose-200 bg-rose-50"
                }`}
              >
                <span
                  className={`text-xs font-black uppercase tracking-[0.18em] ${
                    valido ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {valido ? "Certificado válido" : "Certificado no válido"}
                </span>
                <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                  {JSON.stringify(resultadoVerificacion, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Certificados emitidos durante esta sesión
              </h3>
              <p className="text-sm text-slate-500">
                Se muestran los certificados generados desde esta pantalla mientras no exista endpoint de listado.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Candidato</th>
                  <th className="px-6 py-4">Sesión</th>
                  <th className="px-6 py-4">Hash</th>
                  <th className="px-6 py-4">Fecha emisión</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {certificadosEmitidos.map((certificado) => (
                  <tr key={`${certificado.id}-${certificado.hash}`} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">
                      {certificado.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {certificado.id_candidato}
                    </td>
                    <td className="px-6 py-4">
                      {certificado.sesion_id}
                    </td>
                    <td className="max-w-[280px] truncate px-6 py-4 font-mono text-xs text-slate-500">
                      {certificado.hash}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatearFecha(certificado.emitido_en)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        {certificado.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setHashVerificacion(certificado.hash)}
                        className="text-xs font-bold text-indigo-600 transition hover:text-indigo-900"
                      >
                        Usar hash
                      </button>
                    </td>
                  </tr>
                ))}

                {certificadosEmitidos.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-sm font-semibold text-slate-500">
                      Todavía no se han emitido certificados desde esta pantalla.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ConsoleLayout>
  );
}

function formatearFecha(value) {
  if (!value) return "No disponible";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

export default CertificadoPage;