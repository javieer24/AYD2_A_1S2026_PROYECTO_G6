import { useMemo, useState } from "react";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import MetricCard from "../../components/MetricCard";
import PipelineStep from "../../components/PipelineStep";
import TraceCard from "../../components/TraceCard";
import {
  expedienteNormalizadoMock,
  institucionesIngesta,
  pipelineIngesta,
  trazabilidadIngesta
} from "../../data/ingestaMock";
import "./IngestaPage.css";

function IngestaPage() {
  const [universidad, setUniversidad] = useState("USAC");
  const [archivo, setArchivo] = useState(null);
  const [procesado, setProcesado] = useState(false);

  const institucion = useMemo(
    () => institucionesIngesta.find((item) => item.id === universidad),
    [universidad]
  );

  const registros = useMemo(
    () => (procesado ? expedienteNormalizadoMock[universidad] : []),
    [procesado, universidad]
  );

  const cursosTotales = registros.reduce((total, registro) => total + registro.cursos_aprobados.length, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    setProcesado(true);
  };

  const handleUniversidadChange = (event) => {
    setUniversidad(event.target.value);
    setArchivo(null);
    setProcesado(false);
  };

  return (
    <ConsoleLayout
      title="Homologación e ingesta universitaria"
      subtitle="Módulo de carga, transformación, normalización y preparación de persistencia de expedientes académicos provenientes de universidades con formatos y protocolos heterogéneos."
      badge="RF-06 · RF-07 · EaC-04"
    >
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Entrada institucional</span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Carga de expediente académico</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Seleccione la universidad origen y cargue el archivo correspondiente al adaptador definido para el MVP.
              </p>
            </div>
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              Maqueta funcional
            </span>
          </div>

          <div className="mt-6 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-800">Universidad origen</span>
              <select
                value={universidad}
                onChange={handleUniversidadChange}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none ring-indigo-600 transition focus:ring-2"
              >
                {institucionesIngesta.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} · {item.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-800">Archivo académico</span>
              <input
                key={universidad}
                type="file"
                accept=".csv,.json,.xml"
                onChange={(event) => setArchivo(event.target.files[0] || null)}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-indigo-700"
              />
            </label>

            <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/70 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-700">Archivo seleccionado</span>
                  <strong className="mt-2 block text-lg text-slate-950">
                    {archivo ? archivo.name : `Esperando archivo ${institucion.formato}`}
                  </strong>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {archivo
                      ? `${Math.max(1, Math.round(archivo.size / 1024))} KB preparados para simulación de procesamiento`
                      : `Para ${institucion.id}, el adaptador esperado es ${institucion.adaptador}.`}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!archivo}
                  className="h-12 rounded-2xl bg-indigo-700 px-5 text-sm font-black text-white shadow-lg shadow-indigo-900/15 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  Procesar expediente
                </button>
              </div>
            </div>
          </div>
        </form>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="border-b border-slate-100 pb-5">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Adaptador institucional</span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{institucion.id}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{institucion.nombre}</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <AdapterValue label="País" value={institucion.pais} />
            <AdapterValue label="Estado" value={institucion.estado} />
            <AdapterValue label="Protocolo" value={institucion.protocolo} />
            <AdapterValue label="Formato" value={institucion.formato} />
            <AdapterValue label="Adaptador" value={institucion.adaptador} wide />
            <AdapterValue label="Destino" value="Esquema canónico PRCCD" wide />
          </div>
        </aside>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard value={procesado ? "1" : "0"} label="Registros recibidos" detail="Expedientes detectados en el lote cargado." />
        <MetricCard value={procesado ? "1" : "0"} label="Registros normalizados" detail="Expedientes convertidos al modelo canónico." />
        <MetricCard value={procesado ? String(cursosTotales) : "0"} label="Cursos homologados" detail="Cursos aprobados con código oficial y nota final." />
        <MetricCard value={procesado ? "VÁLIDO" : "EN ESPERA"} label="Estado del lote" detail="Resultado previo a la persistencia definitiva." />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="mb-5">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Pipeline técnico</span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Flujo de homologación</h2>
          </div>

          <div className="grid gap-3">
            {pipelineIngesta.map((step) => (
              <PipelineStep key={step.numero} number={step.numero} title={step.titulo} text={step.texto} />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Modelo canónico</span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Resultado de normalización</h2>
            </div>
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              {procesado ? "Lote procesado" : "Pendiente"}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full border-collapse bg-white text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-4 font-black">id_candidato</th>
                    <th className="px-4 py-4 font-black">nombre_completo</th>
                    <th className="px-4 py-4 font-black">universidad_origen</th>
                    <th className="px-4 py-4 font-black">carrera</th>
                    <th className="px-4 py-4 font-black">cursos_aprobados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registros.map((registro) => (
                    <tr key={registro.id_candidato} className="align-top">
                      <td className="px-4 py-4 font-bold text-indigo-700">{registro.id_candidato}</td>
                      <td className="px-4 py-4 text-slate-800">{registro.nombre_completo}</td>
                      <td className="px-4 py-4 text-slate-800">{registro.universidad_origen}</td>
                      <td className="px-4 py-4 text-slate-800">{registro.carrera}</td>
                      <td className="px-4 py-4 text-slate-700">
                        <div className="flex flex-wrap gap-2">
                          {registro.cursos_aprobados.map((curso) => (
                            <span key={curso.codigo} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                              {curso.codigo}: {curso.nota}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!procesado && (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
                        Seleccione la universidad, cargue un archivo compatible y procese el expediente para visualizar la estructura normalizada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <strong className="block text-sm font-black text-amber-900">Nota de integración</strong>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              Esta pantalla no consume todavía el backend. La estructura queda lista para conectar posteriormente con POST /api/ingest enviando multipart/form-data con archivo y universidad.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {trazabilidadIngesta.map((item) => (
          <TraceCard key={item.codigo} code={item.codigo} title={item.titulo} text={item.descripcion} />
        ))}
      </section>
    </ConsoleLayout>
  );
}

function AdapterValue({ label, value, wide }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="block text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <strong className="mt-2 block text-sm text-slate-950">{value}</strong>
    </div>
  );
}

export default IngestaPage;