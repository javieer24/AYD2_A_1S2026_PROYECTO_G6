import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import MetricCard from "../../components/MetricCard";
import TraceCard from "../../components/TraceCard";
import { trazabilidadExamen } from "../../data/examenMock";
import "./ExamenPage.css";

// ─── Grabación de pantalla ────────────────────────────────────────────────────
// Puerto: 3005 · campo tipo: "VIDEO" (manual §2)

async function iniciarCaptura() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: 5, width: { max: 1280 }, height: { max: 720 } },
    audio: false,
  });
  return stream;
}

function iniciarGrabacionPantalla(stream, chunksRef) {
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";
  const recorder = new MediaRecorder(stream, { mimeType });
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
  };
  recorder.start(10_000); // chunk cada 10 s
  return recorder;
}

function detenerGrabacionPantalla(recorder, chunksRef) {
  return new Promise((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
      chunksRef.current = [];
      resolve(blob);
    };
    recorder.stop();
  });
}

async function subirEvidenciaPantalla(blob, sesionId, token) {
  const formData = new FormData();
  formData.append("archivo", blob, `grabacion_sesion_${sesionId}.webm`);
  formData.append("sesion_id", String(sesionId)); // string, no número (manual §2)
  formData.append("tipo", "VIDEO");               // ← valor correcto según manual

  // URL directa con puerto 3005 (manual §2)
  const res = await fetch("http://localhost:3005/api/telemetria/evidencia", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status} al subir evidencia`);
  }
  return res.json(); // { status:'ok', evidencia:{ id, tipo, hash_archivo, ... } }
}

// ─── Grabación de voz (micrófono, solo móvil) ────────────────────────────────
// Puerto: 3009 · endpoint: POST /api/voz/responder (manual §1.2)
// El voz-service ya llama al examen-service internamente — no hay que
// hacer una segunda llamada a /api/examen/responder.

async function abrirMicrofono() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : "audio/webm";
  const recorder = new MediaRecorder(stream, { mimeType });
  return { recorder, stream };
}

function detenerMicrofono(recorder, stream, audioChunksRef) {
  return new Promise((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
      stream.getTracks().forEach((t) => t.stop());
      resolve(blob);
    };
    recorder.stop();
  });
}

async function enviarRespuestaVoz(audioBlob, sesionId, preguntaId, token) {
  // Paso 1 — transcribir + responder al examen (manual §1.2)
  const formVoz = new FormData();
  formVoz.append("audio", audioBlob, "respuesta.webm");
  formVoz.append("sesion_id", String(sesionId));
  formVoz.append("pregunta_id", String(preguntaId));

  const resVoz = await fetch("http://localhost:3009/api/voz/responder", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formVoz,
  });

  if (!resVoz.ok) {
    const err = await resVoz.json().catch(() => ({}));
    // 422 = texto no empieza con A/B/C/D
    const msg = resVoz.status === 422
      ? 'No se detectó A, B, C o D. Di la letra al inicio: "B", "La B" o "Respuesta B".'
      : err.message || `Error ${resVoz.status} al procesar voz`;
    throw new Error(msg);
  }

  const dataVoz = await resVoz.json();
  // { status, texto_transcrito, respuesta_enviada, resultado_examen }

  // Paso 2 — guardar el audio como evidencia para el auditor (manual §5)
  try {
    const formEv = new FormData();
    formEv.append("archivo", audioBlob, `audio_pregunta_${preguntaId}.webm`);
    formEv.append("sesion_id", String(sesionId));
    formEv.append("tipo", "OTRO");
    await fetch("http://localhost:3005/api/telemetria/evidencia", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formEv,
    });
  } catch {
    // No bloquear el flujo si falla el guardado del audio
    console.warn("No se pudo guardar el audio de voz como evidencia");
  }

  return dataVoz;
}

// ─── Componente principal ─────────────────────────────────────────────────────

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

  // Pantalla
  const capturaStreamRef = useRef(null);
  const pantallaRecorderRef = useRef(null);
  const pantallaChunksRef = useRef([]);
  const [grabandoPantalla, setGrabandoPantalla] = useState(false);
  const [errorGrabacion, setErrorGrabacion] = useState("");

  // Voz (solo móvil)
  const vozRecorderRef  = useRef(null);
  const vozStreamRef    = useRef(null);
  const audioChunksRef  = useRef([]);
  const [grabandoVoz, setGrabandoVoz]       = useState(false);
  const [enviandoVoz, setEnviandoVoz]       = useState(false);
  const [textoTranscrito, setTextoTranscrito] = useState("");
  const [errorVoz, setErrorVoz]             = useState("");

  const usuario  = JSON.parse(localStorage.getItem("usuario") || "{}");
  const token    = localStorage.getItem("token");
  const progreso = Math.round((numeroPregunta / totalPreguntas) * 100);

  // ── Antifraude ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (fase !== "examen" || !sesionId) return;

    async function reportarEvento(tipo_evento, metadatos = {}) {
      try {
        // Puerto 3005 (manual §3)
        const res = await fetch("http://localhost:3005/api/telemetria", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sesion_id: sesionId, tipo_evento, metadatos }),
        });
        const data = await res.json();
        if (data.suspendido) {
          finalizarPantalla(sesionId).then(() => setFase("suspendido"));
        }
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
      ) reportarEvento("DEVTOOLS_DETECTADO");
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

  // ── Pantalla helpers ───────────────────────────────────────────────────────

  async function arrancarPantalla() {
    try {
      const stream = await iniciarCaptura();
      capturaStreamRef.current = stream;
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setGrabandoPantalla(false);
        setErrorGrabacion("Compartir pantalla cancelado.");
      });
      pantallaRecorderRef.current = iniciarGrabacionPantalla(stream, pantallaChunksRef);
      setGrabandoPantalla(true);
    } catch (e) {
      setErrorGrabacion(
        e.name === "NotAllowedError"
          ? "Permiso de pantalla denegado. El examen requiere compartir la pantalla."
          : "No se pudo iniciar la grabación de pantalla."
      );
    }
  }

  async function finalizarPantalla(sid) {
    if (!pantallaRecorderRef.current || !grabandoPantalla) return;
    try {
      const blob = await detenerGrabacionPantalla(pantallaRecorderRef.current, pantallaChunksRef);
      capturaStreamRef.current?.getTracks().forEach((t) => t.stop());
      setGrabandoPantalla(false);
      await subirEvidenciaPantalla(blob, sid ?? sesionId, token);
    } catch (e) {
      console.error("Error subiendo evidencia de pantalla:", e);
    }
  }

  // ── Voz helpers ────────────────────────────────────────────────────────────

  async function iniciarVoz() {
    setErrorVoz("");
    setTextoTranscrito("");
    audioChunksRef.current = [];
    try {
      const { recorder, stream } = await abrirMicrofono();
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.start();
      vozRecorderRef.current = recorder;
      vozStreamRef.current   = stream;
      setGrabandoVoz(true);
    } catch (e) {
      setErrorVoz(
        e.name === "NotAllowedError"
          ? "Permiso de micrófono denegado."
          : "No se pudo acceder al micrófono."
      );
    }
  }

  async function detenerYEnviarVoz() {
    if (!vozRecorderRef.current || !grabandoVoz) return;
    setGrabandoVoz(false);
    setEnviandoVoz(true);
    setErrorVoz("");

    try {
      const blob = await detenerMicrofono(
        vozRecorderRef.current,
        vozStreamRef.current,
        audioChunksRef
      );

      const data = await enviarRespuestaVoz(
        blob, sesionId, preguntaActual.id, token
      );

      setTextoTranscrito(data.texto_transcrito || "");

      // El voz-service ya procesó la respuesta en el examen-service
      // resultado_examen tiene la misma forma que /api/examen/responder
      const resultado = data.resultado_examen;

      setHistorial((prev) => [
        ...prev,
        {
          numero:    numeroPregunta,
          nivel:     preguntaActual.nivel,
          respuesta: data.respuesta_enviada,
          correcto:  resultado.correcto,
          porVoz:    true,
          transcrito: data.texto_transcrito,
        },
      ]);

      if (resultado.terminado) {
        await finalizarPantalla(sesionId);
        setDictamen(resultado.dictamen);
        setFase("resultado");
      } else {
        setPreguntaActual(resultado.pregunta);
        setNumeroPregunta(resultado.numero);
        setSeleccion("");
        setTextoTranscrito("");
      }
    } catch (e) {
      setErrorVoz(e.message || "Error al procesar la respuesta por voz.");
    } finally {
      setEnviandoVoz(false);
    }
  }

  // ── Iniciar examen ─────────────────────────────────────────────────────────

  async function iniciarExamen() {
    setCargando(true);
    setError("");
    setErrorGrabacion("");

    try {
      await arrancarPantalla();

      if (!capturaStreamRef.current) {
        setCargando(false);
        return;
      }

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
        localStorage.setItem("ultima_sesion_id", String(data.sesion_id));
        setFase("examen");
      } else {
        capturaStreamRef.current?.getTracks().forEach((t) => t.stop());
        pantallaRecorderRef.current?.stop();
        setGrabandoPantalla(false);
        setError(data.message || data.error || "No se pudo iniciar el examen");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  }

  // ── Responder (clic / teclado) ─────────────────────────────────────────────

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
          porVoz:    false,
        },
      ]);

      if (data.terminado) {
        await finalizarPantalla(sesionId);
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

  // ── Reiniciar ──────────────────────────────────────────────────────────────

  function reiniciar() {
    setFase("inicio");
    setSesionId(null);
    setPreguntaActual(null);
    setNumeroPregunta(1);
    setSeleccion("");
    setHistorial([]);
    setDictamen(null);
    setError("");
    setErrorGrabacion("");
    setGrabandoPantalla(false);
    setGrabandoVoz(false);
    setTextoTranscrito("");
    setErrorVoz("");
  }

  const opciones = preguntaActual
    ? [
        { clave: "A", texto: preguntaActual.opcion_a },
        { clave: "B", texto: preguntaActual.opcion_b },
        { clave: "C", texto: preguntaActual.opcion_c },
        { clave: "D", texto: preguntaActual.opcion_d },
      ]
    : [];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ConsoleLayout
      title="Examen adaptativo de competencias"
      subtitle="Evaluación con dificultad adaptativa según respuesta inmediata anterior. Antifraude activo durante la sesión."
      badge="RF-02 · EaC-05 · UC-2.4"
    >

      {/* ── FASE: inicio ── */}
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
                No cambies de pestaña, copies texto ni abras DevTools durante el examen.
                Al acumular 5 eventos sospechosos el examen se suspende automáticamente.
              </p>
            </div>
            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600">Grabación de pantalla</span>
              <p className="mt-1 text-sm text-indigo-800">
                Al iniciar el examen se te pedirá compartir tu pantalla. La grabación se
                almacena cifrada como evidencia antifraude y se conserva por 5 años conforme
                a la normativa SICA.
              </p>
            </div>
          </div>

          {error         && <p className="mt-4 text-sm text-red-600 font-semibold">{error}</p>}
          {errorGrabacion && <p className="mt-2 text-sm text-red-600 font-semibold">{errorGrabacion}</p>}

          <button
            onClick={iniciarExamen}
            disabled={cargando}
            className="mt-8 w-full h-14 rounded-2xl bg-indigo-700 text-sm font-black text-white shadow-lg shadow-indigo-900/15 transition hover:bg-indigo-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {cargando ? <><Spinner />Iniciando...</> : "Iniciar examen"}
          </button>
        </section>
      )}

      {/* ── FASE: examen ── */}
      {fase === "examen" && preguntaActual && (
        <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">

            {/* Cabecera */}
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
              <div className="flex flex-col items-end gap-2">
                <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-right ring-1 ring-indigo-100">
                  <span className="block text-xs font-black uppercase tracking-[0.16em] text-indigo-600">Sesión</span>
                  <strong className="mt-1 block text-sm text-indigo-900">En progreso</strong>
                </div>
                {grabandoPantalla && (
                  <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 ring-1 ring-red-100">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-black text-red-600">Grabando pantalla</span>
                  </div>
                )}
                {/* Indicador de voz — solo visible en móvil */}
                {grabandoVoz && (
                  <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 ring-1 ring-blue-100 sm:hidden">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-black text-blue-600">Grabando voz...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progreso */}
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
                <div
                  className="h-full rounded-full bg-indigo-700 transition-all"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>

            {/* Pregunta */}
            <section className="mt-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
              <h3 className="text-lg font-black leading-8 text-slate-950">
                {preguntaActual.pregunta}
              </h3>

              {/* Opciones */}
              <div className="mt-5 grid gap-3">
                {opciones.map((opcion) => (
                  <button
                    key={opcion.clave}
                    type="button"
                    onClick={() => setSeleccion(opcion.clave)}
                    disabled={cargando || grabandoVoz || enviandoVoz}
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

              {/* ── Panel de voz — solo en móvil (sm:hidden) ── */}
              <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 sm:hidden">
                <p className="mb-3 text-xs font-black uppercase tracking-wider text-indigo-600">
                  Respuesta por voz
                </p>

                {!grabandoVoz && !enviandoVoz && (
                  <button
                    type="button"
                    onClick={iniciarVoz}
                    disabled={cargando}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-black text-white shadow-md disabled:opacity-50"
                  >
                    <MicIcon />
                    Grabar respuesta por voz
                  </button>
                )}

                {grabandoVoz && (
                  <button
                    type="button"
                    onClick={detenerYEnviarVoz}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-md animate-pulse"
                  >
                    <span className="h-3 w-3 rounded-full bg-white" />
                    Detener y enviar
                  </button>
                )}

                {enviandoVoz && (
                  <div className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-100 px-4 py-3">
                    <Spinner />
                    <span className="text-sm font-semibold text-indigo-700">Transcribiendo audio...</span>
                  </div>
                )}

                {textoTranscrito && !enviandoVoz && (
                  <div className="mt-3 rounded-xl border border-indigo-100 bg-white px-3 py-2">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-500">Escuché</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">"{textoTranscrito}"</p>
                  </div>
                )}

                {errorVoz && (
                  <p className="mt-2 text-xs font-semibold text-red-600">{errorVoz}</p>
                )}

                {!grabandoVoz && !enviandoVoz && (
                  <p className="mt-2 text-xs text-indigo-400">
                    Di la letra directamente: "B", "La B" o "Respuesta B".
                  </p>
                )}
              </div>

              {error && <p className="mt-3 text-sm text-red-600 font-semibold">{error}</p>}

              {/* Botón enviar (clic) */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  La siguiente dificultad se calculará con base en esta respuesta.
                </p>
                <button
                  type="button"
                  onClick={responder}
                  disabled={!seleccion || cargando || grabandoVoz || enviandoVoz}
                  className="h-12 rounded-2xl bg-indigo-700 px-6 text-sm font-black text-white shadow-lg shadow-indigo-900/15 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none flex items-center gap-2"
                >
                  {cargando ? <><Spinner />Enviando...</> : "Enviar respuesta"}
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
              <div className="mt-5 grid gap-3 max-h-80 overflow-y-auto">
                {historial.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-slate-950">Pregunta {item.numero}</strong>
                      <div className="flex items-center gap-2">
                        {item.porVoz && (
                          <span className="text-xs text-blue-500" title="Respondida por voz">🎤</span>
                        )}
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${
                          item.correcto ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        }`}>
                          {item.correcto ? "Correcta" : "Incorrecta"}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      Nivel {normalizarNivel(item.nivel)} · Respuesta {item.respuesta}
                    </p>
                    {item.transcrito && (
                      <p className="mt-1 text-xs text-slate-400 italic">"{item.transcrito}"</p>
                    )}
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

      {/* ── FASE: resultado ── */}
      {fase === "resultado" && dictamen && (
        <section className="max-w-2xl mx-auto rounded-3xl border border-emerald-200 bg-emerald-50 p-10 shadow-xl">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Dictamen emitido</span>
          <h3 className={`mt-2 text-4xl font-black tracking-tight ${
            dictamen.dictamen === "Aprobado" ? "text-emerald-950" : "text-red-800"
          }`}>
            {dictamen.dictamen}
          </h3>
          <p className="mt-2 text-sm text-emerald-800">
            Puntaje: {dictamen.puntaje} / {dictamen.maxPuntaje} · {dictamen.porcentaje}%
          </p>

          <div className="mt-6 grid gap-3 max-h-80 overflow-y-auto">
            {historial.map((item, i) => (
              <div key={i} className="rounded-2xl border border-emerald-200 bg-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Pregunta {item.numero} — {normalizarNivel(item.nivel)}
                  </span>
                  {item.porVoz && <span className="text-xs text-blue-500">🎤</span>}
                </div>
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
                state={{ sesion_id: sesionId, dictamen: dictamen }}
                className="inline-flex h-12 items-center rounded-2xl bg-emerald-700 px-6 text-sm font-black text-white transition hover:bg-emerald-800 shadow-md shadow-emerald-700/15"
              >
                Continuar a certificado →
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── FASE: suspendido ── */}
      {fase === "suspendido" && (
        <section className="max-w-2xl mx-auto rounded-3xl border border-red-200 bg-red-50 p-10 shadow-xl">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Sesión suspendida</span>
          <h3 className="mt-2 text-4xl font-black tracking-tight text-red-900">Examen suspendido</h3>
          <p className="mt-2 text-sm text-red-800">
            Se detectaron demasiados eventos sospechosos durante la sesión. El examen ha sido
            marcado como suspendido automáticamente y la evidencia ha sido enviada al sistema.
          </p>
          <button
            onClick={reiniciar}
            className="mt-8 h-12 rounded-2xl bg-red-700 px-6 text-sm font-black text-white transition hover:bg-red-800"
          >
            Volver al inicio
          </button>
        </section>
      )}

      {/* ── Métricas ── */}
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

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
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