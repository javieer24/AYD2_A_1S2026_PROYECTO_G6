import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom"; 
import ConsoleLayout from "../../layouts/ConsoleLayout";
import MetricCard from "../../components/MetricCard";
import TraceCard from "../../components/TraceCard";
import { trazabilidadExamen } from "../../data/examenMock";
import "./ExamenPage.css";

function ExamenPage() {
  const [fase, setFase] = useState("inicio"); 
  const [sesionId, setSesionId] = useState(null);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [numeroPregunta, setNumeroPregunta] = useState(1);
  const [totalPreguntas, setTotalPreguntas] = useState(10);
  const [seleccion, setSeleccion] = useState("");
  const [historial, setHistorial] = useState([]);
  const [dictamen, setDictamen] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const token = localStorage.getItem("token");

  const progreso = Math.round((numeroPregunta / totalPreguntas) * 100);

  useEffect(() => {
    if (fase !== "examen" || !sesionId) return;

    async function reportarEvento(tipo_evento, metadatos = {}) {
      try {
        const res = await fetch("http://localhost/api/telemetria", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sesion_id: sesionId, tipo_evento, metadatos }),
        });
        const data = await res.json();
        if (data.suspendido) setFase("suspendido");
      } catch {
        console.error("Error enviando telemetría");
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") reportarEvento("CAMBIO_PESTANA");
    };
    const handleBlur  = () => reportarEvento("PERDIDA_FOCO");
    const handleCopy  = () => reportarEvento("COPIAR_PEGAR", { detalle: "copy" });
    const handlePaste = () => reportarEvento("COPIAR_PEGAR", { detalle: "paste" });

    const devtoolsInterval = setInterval(() => {
      if (
        window.outerWidth  - window.innerWidth  > 160 ||
        window.outerHeight - window.innerHeight > 160
      ) {
        reportarEvento("DEVTOOLS_DETECTADO");
      }
    }, 3000);

    const channel = new BroadcastChannel("prccd_examen");
    channel.postMessage("nueva_pestana");
    channel.onmessage = (e) => {
      if (e.data === "nueva_pestana") reportarEvento("MULTIPLES_PESTANAS");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy",  handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy",  handleCopy);
      document.removeEventListener("paste", handlePaste);
      clearInterval(devtoolsInterval);
      channel.close();
    };
  }, [fase, sesionId, token]);

  async function iniciarExamen() {
    setCargando(true);
    setError("");
    try {
      const res = await fetch("http://localhost/api/examen/iniciar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_candidato: usuario.id_candidato }),
      });

      const data = await res.json();

      if (res.ok) {
        setSesionId(data.sesion_id);
        setPreguntaActual(data.pregunta);
        setNumeroPregunta(data.numero);
        setTotalPreguntas(data.total);
        localStorage.setItem("ultima_sesion_id", String(data.sesion_id)); // ← CAMBIO 1
        setFase("examen");
      } else {
        setError(data.message || data.error || "No se pudo iniciar el examen");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  }

  async function responder() {
    if (!seleccion || cargando) return;
    setCargando(true);
    setError("");

    try {
      const res = await fetch("http://localhost/api/examen/responder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sesion_id:   sesionId,
          pregunta_id: preguntaActual.id,
          respuesta:   seleccion,
        }),
      });

      const data = await res.json();

      setHistorial((prev) => [
        ...prev,
        {
          numero:    numeroPregunta,
          nivel:     preguntaActual.nivel,
          respuesta: seleccion,
          correcto:  data.correcto,
        },
      ]);

      if (data.terminado) {
        setDictamen(data.dictamen);
        setFase("resultado");
      } else {
        setPreguntaActual(data.pregunta);
        setNumeroPregunta(data.numero);
        setSeleccion("");
      }
    } catch {
      setError("Error al enviar la respuesta");
    } finally {
      setCargando(false);
    }
  }

  function reiniciar() {
    setFase("inicio");
    setSesionId(null);
    setPreguntaActual(null);
    setNumeroPregunta(1);
    setSeleccion("");
    setHistorial([]);
    setDictamen(null);
    setError("");
  }

  const opciones = preguntaActual
    ? [
        { clave: "A", texto: preguntaActual.opcion_a },
        { clave: "B", texto: preguntaActual.opcion_b },
        { clave: "C", texto: preguntaActual.opcion_c },
        { clave: "D", texto: preguntaActual.opcion_d },
      ]
    : [];

  return (
    <ConsoleLayout
      title="Examen adaptativo de competencias"
      subtitle="Evaluación con dificultad adaptativa según respuesta inmediata anterior. Antifraude activo durante la sesión."
      badge="RF-02 · EaC-05 · UC-2.4"
    >

      {fase === "inicio" && (
        <section className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/70">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
            Evaluación de competencias digitales
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Bienvenido, {usuario.nombre || usuario.id_candidato}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {usuario.universidad} · {usuario.id_candidato}
          </p>

          <div className="mt-8 grid gap-3">
            <InfoItem label="Preguntas" value="10 preguntas de opción múltiple (A, B, C, D)" />
            <InfoItem label="Dificultad" value="Adaptativa — inicia en nivel Medio" />
            <InfoItem label="Aprobación" value="Puntaje mínimo según dictamen del sistema" />
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-600">Advertencia antifraude</span>
              <p className="mt-1 text-sm text-amber-800">
                No cambies de pestaña, copies texto ni abras DevTools durante el examen. Al acumular 5 eventos sospechosos el examen se suspende automáticamente.
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 font-semibold">{error}</p>
          )}

          <button
            onClick={iniciarExamen}
            disabled={cargando}
            className="mt-8 w-full h-14 rounded-2xl bg-indigo-700 text-sm font-black text-white shadow-lg shadow-indigo-900/15 transition hover:bg-indigo-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {cargando ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Iniciando...
              </>
            ) : (
              "Iniciar examen"
            )}
          </button>
        </section>
      )}

      {fase === "examen" && preguntaActual && (
        <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">

            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Candidato</span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {usuario.nombre || usuario.id_candidato}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {usuario.universidad} · Sesión #{sesionId}
                </p>
              </div>
              <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-right ring-1 ring-indigo-100">
                <span className="block text-xs font-black uppercase tracking-[0.16em] text-indigo-600">Sesión</span>
                <strong className="mt-1 block text-sm text-indigo-900">En progreso</strong>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-black text-slate-500">
                    Pregunta {numeroPregunta} de {totalPreguntas}
                  </span>
                  <h3 className="mt-1 text-lg font-black text-slate-950">
                    Dificultad actual: {normalizarNivel(preguntaActual.nivel)}
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                  Motor adaptativo
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-700 transition-all" style={{ width: `${progreso}%` }} />
              </div>
            </div>

            <section className="mt-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
              <h3 className="text-lg font-black leading-8 text-slate-950">
                {preguntaActual.pregunta}
              </h3>

              <div className="mt-5 grid gap-3">
                {opciones.map((opcion) => (
                  <button
                    key={opcion.clave}
                    type="button"
                    onClick={() => setSeleccion(opcion.clave)}
                    disabled={cargando}
                    className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      seleccion === opcion.clave
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-100"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/40"
                    }`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${
                      seleccion === opcion.clave ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {opcion.clave}
                    </span>
                    {opcion.texto}
                  </button>
                ))}
              </div>

              {error && <p className="mt-3 text-sm text-red-600 font-semibold">{error}</p>}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  La siguiente dificultad se calculará con base en esta respuesta.
                </p>
                <button
                  type="button"
                  onClick={responder}
                  disabled={!seleccion || cargando}
                  className="h-12 rounded-2xl bg-indigo-700 px-6 text-sm font-black text-white shadow-lg shadow-indigo-900/15 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none flex items-center gap-2"
                >
                  {cargando ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    "Enviar respuesta"
                  )}
                </button>
              </div>
            </section>
          </section>

          <aside className="grid gap-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Reglas del motor
              </span>
              <div className="mt-5 grid gap-3">
                <RuleItem label="Inicio" value="Pregunta 1 en Medio" />
                <RuleItem label="Respuesta correcta" value="Siguiente pregunta Avanzada" />
                <RuleItem label="Respuesta incorrecta" value="Siguiente pregunta Básica" />
                <RuleItem label="Cierre" value={`Dictamen al completar ${totalPreguntas} preguntas`} />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Historial de sesión
              </span>
              <div className="mt-5 grid gap-3">
                {historial.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-slate-950">Pregunta {item.numero}</strong>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${
                        item.correcto ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}>
                        {item.correcto ? "Correcta" : "Incorrecta"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      Nivel {normalizarNivel(item.nivel)} · Respuesta {item.respuesta}
                    </p>
                  </div>
                ))}
                {historial.length === 0 && (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                    El historial se llenará conforme respondas cada pregunta.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </section>
      )}

      {fase === "resultado" && dictamen && (
        <section className="max-w-2xl mx-auto rounded-3xl border border-emerald-200 bg-emerald-50 p-10 shadow-xl">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
            Dictamen emitido
          </span>
          <h3 className={`mt-2 text-4xl font-black tracking-tight ${
            dictamen.dictamen === "Aprobado" ? "text-emerald-950" : "text-red-800"
          }`}>
            {dictamen.dictamen}
          </h3>
          <p className="mt-2 text-sm text-emerald-800">
            Puntaje: {dictamen.puntaje} / {dictamen.maxPuntaje} · {dictamen.porcentaje}%
          </p>

          <div className="mt-6 grid gap-3">
            {historial.map((item, i) => (
              <div key={i} className="rounded-2xl border border-emerald-200 bg-white p-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Pregunta {item.numero} — {normalizarNivel(item.nivel)}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${
                  item.correcto ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}>
                  {item.correcto ? "Correcta" : "Incorrecta"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={reiniciar}
              className="h-12 rounded-2xl bg-slate-700 px-6 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Volver al inicio
            </button>

            {dictamen.dictamen === "Aprobado" && (
              <Link
                to="/certificado"
                state={{ sesion_id: sesionId, dictamen: dictamen }} // ← CAMBIO 2
                className="inline-flex h-12 items-center rounded-2xl bg-emerald-700 px-6 text-sm font-black text-white transition hover:bg-emerald-800 shadow-md shadow-emerald-700/15"
              >
                Continuar a certificado →
              </Link>
            )}
          </div>
        </section>
      )}

      {fase === "suspendido" && (
        <section className="max-w-2xl mx-auto rounded-3xl border border-red-200 bg-red-50 p-10 shadow-xl">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
            Sesión suspendida
          </span>
          <h3 className="mt-2 text-4xl font-black tracking-tight text-red-900">
            Examen suspendido
          </h3>
          <p className="mt-2 text-sm text-red-800">
            Se detectaron demasiados eventos sospechosos durante la sesión. El examen ha sido marcado como suspendido automáticamente.
          </p>
          <button
            onClick={reiniciar}
            className="mt-8 h-12 rounded-2xl bg-red-700 px-6 text-sm font-black text-white transition hover:bg-red-800"
          >
            Volver al inicio
          </button>
        </section>
      )}

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard value={`${historial.length}/${totalPreguntas}`} label="Preguntas respondidas" detail="Avance de la sesión adaptativa." />
        <MetricCard value={dictamen ? `${dictamen.porcentaje}%` : "—"} label="Porcentaje final" detail="Cálculo ponderado sobre respuestas registradas." />
        <MetricCard value={dictamen ? dictamen.dictamen : "Pendiente"} label="Dictamen" detail="Resultado final al terminar el bloque." />
        <MetricCard value={sesionId ? `#${sesionId}` : "—"} label="ID de sesión" detail="Identificador de esta sesión en el backend." />
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {trazabilidadExamen.map((item) => (
          <TraceCard key={item.codigo} code={item.codigo} title={item.titulo} text={item.descripcion} />
        ))}
      </section>

    </ConsoleLayout>
  );
}

function RuleItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="block text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <strong className="mt-2 block text-sm text-slate-950">{value}</strong>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <span className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</span>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function normalizarNivel(nivel) {
  if (nivel === "Medio") return "Intermedio";
  return nivel;
}

export default ExamenPage;