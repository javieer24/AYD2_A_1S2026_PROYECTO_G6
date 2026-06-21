import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import { emitirCertificado, verificarCertificadoPublico } from "../../services/certificadoApi";

function CertificadoPage() {
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const sesionIdAuto =
    location.state?.sesion_id ||
    localStorage.getItem("ultima_sesion_id") ||
    null;

  const dictamenAuto = location.state?.dictamen || null;

  const [certificadosEmitidos, setCertificadosEmitidos] = useState([]);
  const [hashVerificacion, setHashVerificacion] = useState("");
  const [resultadoVerificacion, setResultadoVerificacion] = useState(null);
  const [loadingIssue, setLoadingIssue] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (dictamenAuto && dictamenAuto.dictamen !== "Aprobado") {
      setError("Tu examen no fue aprobado. No es posible emitir un certificado.");
    }
  }, [dictamenAuto]);

  async function handleEmitir() {
    if (!sesionIdAuto) {
      setError("No se encontró una sesión de examen aprobada. Completa el examen primero.");
      return;
    }

    if (!usuario.id_candidato) {
      setError("No se encontró tu ID de candidato. Vuelve a iniciar sesión.");
      return;
    }

    setLoadingIssue(true);
    setError("");
    setMensaje("");

    try {
      const response = await emitirCertificado({
        idCandidato: usuario.id_candidato,
        sesionId: sesionIdAuto,
        datosCertificado: {
          nota: dictamenAuto?.porcentaje || "100",
        },
      });

      const nuevoCertificado = {
        id: response.certificado.id,
        id_candidato: usuario.id_candidato,
        sesion_id: sesionIdAuto,
        hash: response.certificado.hash,
        emitido_en: response.certificado.emitido_en,
        estado: "EMITIDO",
      };

      setCertificadosEmitidos((actuales) => [nuevoCertificado, ...actuales]);
      setHashVerificacion(response.certificado.hash);
      setMensaje("¡Certificado emitido correctamente!");
      localStorage.removeItem("ultima_sesion_id");
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
  const puedeEmitir = sesionIdAuto && (!dictamenAuto || dictamenAuto.dictamen === "Aprobado");

  return (
    <ConsoleLayout
      title="Certificados emitidos"
      subtitle="Emisión protegida de certificados y verificación pública por hash criptográfico."
      badge="RF-certificación · EaC-integridad"
    >
      <div className="space-y-8">

        {/* KPIs */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Candidato</span>
            <strong className="mt-2 block text-xl font-bold text-slate-800">
              {usuario.nombre || usuario.id_candidato || "—"}
            </strong>
            <p className="mt-1 text-xs text-slate-500">{usuario.universidad || "—"}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sesión detectada</span>
            <strong className={`mt-2 block text-xl font-bold ${sesionIdAuto ? "text-emerald-700" : "text-rose-600"}`}>
              {sesionIdAuto ? `#${sesionIdAuto}` : "Sin sesión"}
            </strong>
            <p className="mt-1 text-xs text-slate-500">
              {sesionIdAuto ? "Lista para emitir certificado" : "Completa el examen primero"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Emitidos esta sesión</span>
            <strong className="mt-2 block text-2xl font-black text-slate-800">
              {certificadosEmitidos.length}
            </strong>
            <p className="mt-1 text-xs text-slate-500">Certificados generados ahora.</p>
          </div>
        </section>

        {/* Resultado del examen */}
        {dictamenAuto && (
          <div className={`rounded-2xl border p-5 ${
            dictamenAuto.dictamen === "Aprobado"
              ? "border-emerald-200 bg-emerald-50"
              : "border-rose-200 bg-rose-50"
          }`}>
            <span className={`text-xs font-black uppercase tracking-wider ${
              dictamenAuto.dictamen === "Aprobado" ? "text-emerald-700" : "text-rose-700"
            }`}>
              Resultado del examen
            </span>
            <p className={`mt-1 text-lg font-black ${
              dictamenAuto.dictamen === "Aprobado" ? "text-emerald-900" : "text-rose-900"
            }`}>
              {dictamenAuto.dictamen} — {dictamenAuto.porcentaje}%
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Puntaje: {dictamenAuto.puntaje} / {dictamenAuto.maxPuntaje}
            </p>
          </div>
        )}

        {/* Mensajes */}
        {(mensaje || error) && (
          <div className={`rounded-2xl border p-4 text-sm font-semibold ${
            error
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}>
            {error || mensaje}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">

          {/* Emisión automática */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Emisión de certificado
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Generar credencial verificable
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Los datos se detectan automáticamente desde tu sesión de examen.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">ID Candidato</span>
                <div className="h-12 rounded-2xl border border-slate-100 bg-slate-50 px-4 flex items-center text-sm text-slate-600">
                  {usuario.id_candidato || "No disponible"}
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">ID de Sesión</span>
                <div className="h-12 rounded-2xl border border-slate-100 bg-slate-50 px-4 flex items-center text-sm text-slate-600">
                  {sesionIdAuto ? `#${sesionIdAuto}` : "Sin sesión detectada"}
                </div>
              </div>

              {dictamenAuto && (
                <div className="grid gap-2">
                  <span className="text-sm font-bold text-slate-700">Puntaje obtenido</span>
                  <div className="h-12 rounded-2xl border border-slate-100 bg-slate-50 px-4 flex items-center text-sm text-slate-600">
                    {dictamenAuto.porcentaje}% — {dictamenAuto.puntaje}/{dictamenAuto.maxPuntaje}
                  </div>
                </div>
              )}

              {!puedeEmitir && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs text-amber-800 font-medium">
                    Para emitir un certificado debes completar y aprobar el examen adaptativo primero.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleEmitir}
                disabled={loadingIssue || !puedeEmitir}
                className="h-12 rounded-2xl bg-indigo-700 px-5 text-sm font-black text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300 flex items-center justify-center gap-2"
              >
                {loadingIssue ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Emitiendo...
                  </>
                ) : (
                  "Emitir certificado"
                )}
              </button>
            </div>
          </div>

          {/* Verificación */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                Verificación pública
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Validar hash de certificado
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Consume GET /api/certificate/verify?hash=
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
              <div className={`mt-5 rounded-2xl border p-4 ${
                valido ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
              }`}>
                <span className={`text-xs font-black uppercase tracking-[0.18em] ${
                  valido ? "text-emerald-700" : "text-rose-700"
                }`}>
                  {valido ? "Certificado válido" : "Certificado no válido"}
                </span>
                <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                  {JSON.stringify(resultadoVerificacion, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* Tabla */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Certificados emitidos durante esta sesión
              </h3>
              <p className="text-sm text-slate-500">
                Se muestran los certificados generados desde esta pantalla.
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
                    <td className="px-6 py-4">{certificado.sesion_id}</td>
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