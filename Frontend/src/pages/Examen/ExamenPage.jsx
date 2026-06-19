import { useMemo, useState } from "react";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import MetricCard from "../../components/MetricCard";
import TraceCard from "../../components/TraceCard";
import { bancoPreguntasMock, candidatoExamenMock, trazabilidadExamen } from "../../data/examenMock";
import "./ExamenPage.css";

const totalPreguntas = 5;

function ExamenPage() {
  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState("");
  const [historial, setHistorial] = useState([]);
  const [terminado, setTerminado] = useState(false);

  const preguntaActual = bancoPreguntasMock[indice];

  const puntaje = useMemo(() => {
    return historial.reduce((total, item) => total + (item.correcto ? item.peso : 0), 0);
  }, [historial]);

  const maxPuntaje = useMemo(() => {
    return historial.reduce((total, item) => total + item.peso, 0);
  }, [historial]);

  const porcentaje = maxPuntaje > 0 ? Math.round((puntaje / maxPuntaje) * 100) : 0;
  const dictamen = porcentaje >= 60 ? "Aprobado" : "Reprobado";

  const progreso = Math.round(((terminado ? totalPreguntas : indice + 1) / totalPreguntas) * 100);

  const responder = () => {
    if (!seleccion || terminado) return;

    const correcto = seleccion === preguntaActual.correcta;
    const peso = obtenerPeso(preguntaActual.nivel);

    const nuevoHistorial = [
      ...historial,
      {
        numero: indice + 1,
        pregunta_id: preguntaActual.id,
        nivel: preguntaActual.nivel,
        respuesta: seleccion,
        correcto,
        peso
      }
    ];

    setHistorial(nuevoHistorial);

    if (indice + 1 >= totalPreguntas) {
      setTerminado(true);
      return;
    }

    const siguienteNivel = correcto ? "Avanzado" : "Básico";
    const siguienteIndice = bancoPreguntasMock.findIndex(
      (pregunta, posicion) => posicion > indice && pregunta.nivel === siguienteNivel
    );

    setIndice(siguienteIndice === -1 ? indice + 1 : siguienteIndice);
    setSeleccion("");
  };

  const reiniciar = () => {
    setIndice(0);
    setSeleccion("");
    setHistorial([]);
    setTerminado(false);
  };

  return (
    <ConsoleLayout
      title="Motor transaccional de examen adaptativo"
      subtitle="Simulación funcional del núcleo de evaluación del candidato, aplicando transición de dificultad según acierto o fallo inmediato anterior y registrando historial de sesión."
      badge="RF-02 · EaC-05 · UC-2.4"
    >
      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Candidato
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {candidatoExamenMock.certificacion}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {candidatoExamenMock.nombre} · {candidatoExamenMock.universidad} · {candidatoExamenMock.carrera}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-right ring-1 ring-indigo-100">
              <span className="block text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
                Sesión
              </span>
              <strong className="mt-1 block text-sm text-indigo-900">
                {terminado ? "Completada" : "En progreso"}
              </strong>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-sm font-black text-slate-500">
                  Pregunta {terminado ? totalPreguntas : indice + 1} de {totalPreguntas}
                </span>
                <h3 className="mt-1 text-lg font-black text-slate-950">
                  Dificultad actual: {terminado ? "Finalizada" : normalizarNivel(preguntaActual.nivel)}
                </h3>
              </div>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                Motor IRT simulado
              </span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-indigo-700 transition-all" style={{ width: `${progreso}%` }} />
            </div>
          </div>

          {!terminado && (
            <section className="mt-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
              <h3 className="text-lg font-black leading-8 text-slate-950">{preguntaActual.pregunta}</h3>

              <div className="mt-5 grid gap-3">
                {preguntaActual.opciones.map((opcion) => (
                  <button
                    key={opcion.clave}
                    type="button"
                    onClick={() => setSeleccion(opcion.clave)}
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

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  La siguiente dificultad se calculará únicamente con base en esta respuesta.
                </p>
                <button
                  type="button"
                  onClick={responder}
                  disabled={!seleccion}
                  className="h-12 rounded-2xl bg-indigo-700 px-6 text-sm font-black text-white shadow-lg shadow-indigo-900/15 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  Enviar respuesta
                </button>
              </div>
            </section>
          )}

          {terminado && (
            <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                Dictamen emitido
              </span>
              <h3 className="mt-2 text-3xl font-black tracking-tight text-emerald-950">{dictamen}</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                Puntaje ponderado {puntaje} de {maxPuntaje}. Porcentaje final: {porcentaje}%.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={reiniciar}
                  className="h-12 rounded-2xl bg-emerald-700 px-6 text-sm font-black text-white transition hover:bg-emerald-800"
                >
                  Reiniciar simulación
                </button>
                <a
                  href="/certificado"
                  className="inline-flex h-12 items-center rounded-2xl border border-emerald-300 bg-white px-6 text-sm font-black text-emerald-800 transition hover:bg-emerald-50"
                >
                  Continuar a certificado
                </a>
              </div>
            </section>
          )}
        </section>

        <aside className="grid gap-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Reglas del motor
            </span>

            <div className="mt-5 grid gap-3">
              <RuleItem label="Inicio" value="Pregunta 1 en Intermedio" />
              <RuleItem label="Respuesta correcta" value="Siguiente pregunta Avanzada" />
              <RuleItem label="Respuesta incorrecta" value="Siguiente pregunta Básica" />
              <RuleItem label="Cierre MVP" value="Dictamen al completar 5 preguntas" />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Historial de sesión
            </span>

            <div className="mt-5 grid gap-3">
              {historial.map((item) => (
                <div key={`${item.pregunta_id}-${item.numero}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-sm text-slate-950">Pregunta {item.numero}</strong>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${
                      item.correcto ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}>
                      {item.correcto ? "Correcta" : "Incorrecta"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Nivel {normalizarNivel(item.nivel)} · Respuesta {item.respuesta} · Peso {item.peso}
                  </p>
                </div>
              ))}

              {historial.length === 0 && (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-500">
                  El historial se llenará conforme el candidato responda cada pregunta.
                </p>
              )}
            </div>
          </section>
        </aside>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard value={`${historial.length}/${totalPreguntas}`} label="Preguntas respondidas" detail="Avance de la sesión adaptativa." />
        <MetricCard value={`${porcentaje}%`} label="Porcentaje actual" detail="Cálculo ponderado sobre respuestas registradas." />
        <MetricCard value={terminado ? dictamen : "Pendiente"} label="Dictamen" detail="Resultado final al terminar el bloque." />
        <MetricCard value="< 2s" label="Meta EaC-05" detail="Tiempo objetivo para ajustar dificultad." />
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {trazabilidadExamen.map((item) => (
          <TraceCard key={item.codigo} code={item.codigo} title={item.titulo} text={item.descripcion} />
        ))}
      </section>

      <section className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5">
        <strong className="block text-sm font-black text-amber-900">Nota de integración backend</strong>
        <p className="mt-1 text-sm leading-6 text-amber-800">
          Esta pantalla todavía no consume el backend. La conexión posterior debe usar POST /api/examen/iniciar con id_candidato y POST /api/examen/responder con sesion_id, pregunta_id y respuesta.
        </p>
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

function obtenerPeso(nivel) {
  if (nivel === "Básico") return 1;
  if (nivel === "Medio") return 2;
  if (nivel === "Avanzado") return 3;
  return 1;
}

function normalizarNivel(nivel) {
  if (nivel === "Medio") return "Intermedio";
  return nivel;
}

export default ExamenPage;