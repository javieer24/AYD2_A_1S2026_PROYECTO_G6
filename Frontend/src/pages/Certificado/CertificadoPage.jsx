import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import { emitirCertificado, verificarCertificadoPublico } from "../../services/certificadoApi";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFDownloadLink,
  Font
} from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v1/helvetica.woff2' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    flex: 1,
  },
  border1: {
    border: '4px solid #4f46e5',
    padding: 16,
    flex: 1,
  },
  border2: {
    border: '2px solid #818cf8',
    padding: 16,
    flex: 1,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e7ff',
    borderRadius: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  logoText: {
    fontSize: 30,
    textAlign: 'center',
  },
  institucion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3730a3',
    textAlign: 'center',
  },
  institucionSub: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4338ca',
    textAlign: 'center',
    marginVertical: 4,
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'center',
    marginVertical: 2,
  },
  details: {
    marginTop: 16,
    paddingTop: 12,
    borderTop: '2px solid #e2e8f0',
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  hashContainer: {
    marginTop: 4,
    padding: 6,
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
  },
  hashText: {
    fontSize: 7,
    fontFamily: 'Courier',
    color: '#1e293b',
  },
  footer: {
    marginTop: 12,
    paddingTop: 8,
    borderTop: '1px solid #e2e8f0',
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

const CertificadoPDF = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.border1}>
        <View style={styles.border2}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>🎓</Text>
              </View>
              <Text style={styles.institucion}>PRCCD</Text>
              <Text style={styles.institucionSub}>Programa de Certificación</Text>
            </View>

            <Text style={styles.title}>CERTIFICADO</Text>
            <Text style={styles.subtitle}>de aprobación del examen de certificación</Text>

            <Text style={styles.label}>Se certifica que</Text>
            <Text style={styles.name}>{data.nombre}</Text>
            <Text style={styles.label}>
              con ID de candidato <Text style={{ fontWeight: 'bold' }}>{data.id_candidato}</Text>
            </Text>
            <Text style={[styles.label, { marginTop: 8 }]}>
              ha aprobado el examen con un puntaje de
            </Text>
            <Text style={styles.score}>{data.nota}%</Text>
            <Text style={{ fontSize: 10, color: '#64748b', textAlign: 'center' }}>
              ({data.puntaje} de {data.maxPuntaje} puntos)
            </Text>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>UNIVERSIDAD</Text>
                <Text style={styles.detailValue}>{data.universidad}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>SESIÓN</Text>
                <Text style={styles.detailValue}>#{data.sesion_id}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>FECHA DE EMISIÓN</Text>
                <Text style={styles.detailValue}>{formatearFecha(data.emitido_en)}</Text>
              </View>
              <View style={styles.hashContainer}>
                <Text style={[styles.detailLabel, { marginBottom: 2 }]}>HASH DE VERIFICACIÓN</Text>
                <Text style={styles.hashText}>{data.hash}</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Certificado digital emitido por PRCCD · Verificable en línea
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

function CertificadoPage() {
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const sesionIdAuto =
    location.state?.sesion_id ||
    localStorage.getItem("ultima_sesion_id") ||
    null;

  const dictamenAuto = location.state?.dictamen || null;

  const [certificadoEmitido, setCertificadoEmitido] = useState(null);
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
          puntaje: dictamenAuto?.puntaje || 0,
          maxPuntaje: dictamenAuto?.maxPuntaje || 0,
        },
      });

      const nuevoCertificado = {
        id: response.certificado.id,
        id_candidato: usuario.id_candidato,
        sesion_id: sesionIdAuto,
        hash: response.certificado.hash,
        emitido_en: response.certificado.emitido_en,
        estado: "EMITIDO",
        nombre: usuario.nombre || "Estudiante",
        universidad: usuario.universidad || "Universidad",
        nota: dictamenAuto?.porcentaje || "100",
        puntaje: dictamenAuto?.puntaje || 0,
        maxPuntaje: dictamenAuto?.maxPuntaje || 0,
      };

      setCertificadoEmitido(nuevoCertificado);
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
      title="Certificación de examen"
      subtitle="Genera tu certificado de aprobación y verifícalo públicamente"
      badge="RF-certificación · EaC-integridad"
    >
      <div className="space-y-8">
        {/* Estado del examen */}
        {dictamenAuto && (
          <div className={`rounded-2xl border p-6 ${
            dictamenAuto.dictamen === "Aprobado"
              ? "border-emerald-200 bg-emerald-50"
              : "border-rose-200 bg-rose-50"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs font-black uppercase tracking-wider ${
                  dictamenAuto.dictamen === "Aprobado" ? "text-emerald-700" : "text-rose-700"
                }`}>
                  Resultado del examen
                </span>
                <p className={`mt-1 text-2xl font-black ${
                  dictamenAuto.dictamen === "Aprobado" ? "text-emerald-900" : "text-rose-900"
                }`}>
                  {dictamenAuto.dictamen} — {dictamenAuto.porcentaje}%
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Puntaje: {dictamenAuto.puntaje} / {dictamenAuto.maxPuntaje}
                </p>
              </div>
              <div className="text-5xl">
                {dictamenAuto.dictamen === "Aprobado" ? "🎉" : "📚"}
              </div>
            </div>
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Generación de certificado */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Generar certificado
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Obtén tu certificado digital
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Genera un certificado verificable de tu aprobación.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-500">Estudiante</span>
                  <p className="font-semibold text-slate-900">{usuario.nombre || "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500">ID candidato</span>
                  <p className="font-semibold text-slate-900">{usuario.id_candidato || "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500">Universidad</span>
                  <p className="font-semibold text-slate-900">{usuario.universidad || "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500">Estado</span>
                  <p className="font-semibold text-emerald-600">
                    {dictamenAuto?.dictamen === "Aprobado" ? "✅ Aprobado" : "⏳ Pendiente"}
                  </p>
                </div>
                {/* Número de sesión — fila completa */}
                <div className="col-span-2 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-500">Número de sesión</span>
                  <span className="text-sm font-black text-indigo-900">
                    {sesionIdAuto ? `#${sesionIdAuto}` : "—"}
                  </span>
                </div>
              </div>

              {!puedeEmitir && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                  <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                    ⚠️ Para emitir un certificado debes completar y aprobar el examen adaptativo primero.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleEmitir}
                disabled={loadingIssue || !puedeEmitir || certificadoEmitido}
                className="w-full h-14 rounded-2xl bg-indigo-700 px-5 text-base font-black text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300 flex items-center justify-center gap-2"
              >
                {loadingIssue ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generando certificado...
                  </>
                ) : certificadoEmitido ? (
                  "✅ Certificado generado"
                ) : (
                  "Generar certificado"
                )}
              </button>

              {certificadoEmitido && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-sm font-semibold text-emerald-800">
                    🎉 Certificado generado exitosamente
                  </p>
                  <div className="mt-2">
                    <span className="text-xs font-bold text-slate-500">Hash del certificado:</span>
                    <code className="block mt-1 text-xs bg-slate-100 p-2 rounded font-mono break-all">
                      {certificadoEmitido.hash}
                    </code>
                  </div>

                  <PDFDownloadLink
                    document={<CertificadoPDF data={certificadoEmitido} />}
                    fileName={`certificado-${usuario.id_candidato || 'estudiante'}.pdf`}
                    className="mt-3 w-full h-12 rounded-xl bg-emerald-600 text-white font-bold transition hover:bg-emerald-700 flex items-center justify-center gap-2"
                  >
                    {({ loading }) => (
                      <>
                        {loading ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Generando PDF...
                          </>
                        ) : (
                          <>📄 Descargar certificado PDF</>
                        )}
                      </>
                    )}
                  </PDFDownloadLink>
                </div>
              )}
            </div>
          </div>

          {/* Verificación */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                Verificación pública
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Validar certificado
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Ingresa el hash para verificar la autenticidad del certificado.
              </p>
            </div>

            <form onSubmit={handleVerificar} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Hash del certificado
                </label>
                <input
                  value={hashVerificacion}
                  onChange={(event) => setHashVerificacion(event.target.value)}
                  placeholder="Ingresa el hash SHA-256"
                  className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={loadingVerify}
                className="w-full h-12 rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loadingVerify ? "Verificando..." : "Verificar hash"}
              </button>
            </form>

            {resultadoVerificacion && (
              <div className={`mt-5 rounded-2xl border p-4 ${
                valido ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{valido ? "✅" : "❌"}</span>
                  <div>
                    <span className={`text-sm font-black uppercase tracking-[0.18em] ${
                      valido ? "text-emerald-700" : "text-rose-700"
                    }`}>
                      {valido ? "Certificado válido" : "Certificado no válido"}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {valido
                        ? "El certificado existe y es auténtico"
                        : "No se encontró el certificado"}
                    </p>
                  </div>
                </div>
                <pre className="mt-3 max-h-60 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                  {JSON.stringify(resultadoVerificacion, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
}

function formatearFecha(value) {
  if (!value) return "No disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default CertificadoPage;