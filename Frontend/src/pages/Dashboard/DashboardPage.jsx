import { useEffect, useMemo, useState } from "react";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import MetricCard from "../../components/MetricCard";
import TraceCard from "../../components/TraceCard";
import { obtenerEstadisticasDashboard } from "../../services/dashboardApi";
import "./DashboardPage.css";

function DashboardPage() {
  const [data, setData] = useState(null);
  const [carrera, setCarrera] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const metricas = data?.metricas || {};
  const candidatosStats = metricas.candidatos || {};
  const examenesStats = metricas.examenes || {};
  const certificadosStats = metricas.certificados || {};

  const candidatosPorUniversidad =
    candidatosStats.por_universidad ||
    metricas.candidatos_por_universidad ||
    [];

  const candidatosPorCarrera =
    candidatosStats.por_carrera ||
    metricas.candidatos_por_carrera ||
    [];

  const carrerasDisponibles = useMemo(() => {
    const carreras = candidatosPorCarrera.map((item) => item.carrera).filter(Boolean);
    return ["Todas", ...carreras];
  }, [candidatosPorCarrera]);

  const totalCandidatos = useMemo(() => {
    return numero(candidatosStats.total_candidatos) || sumar(candidatosPorUniversidad, "total");
  }, [candidatosStats.total_candidatos, candidatosPorUniversidad]);

  const candidatosActivos = numero(candidatosStats.activos);
  const candidatosInactivos = numero(candidatosStats.inactivos);
  const totalCarreras = candidatosPorCarrera.length;
  const totalSesiones = numero(examenesStats.total_sesiones);
  const completadas = numero(examenesStats.completadas);
  const aprobados = numero(examenesStats.aprobados);
  const reprobados = numero(examenesStats.reprobados);
  const suspendidos = numero(examenesStats.suspendidos);
  const enProgreso = numero(examenesStats.en_progreso);
  const totalCertificados = numero(certificadosStats.total_emitidos);
  const certificadosVigentes = numero(certificadosStats.vigentes);
  const tasaAprobacion =
    numero(examenesStats.porcentaje_aprobacion) ||
    (totalSesiones > 0 ? Math.round((aprobados / totalSesiones) * 100) : 0);

  const pipeline = [
    {
      ambiente: "Staging",
      estado: data?.status === "ok" ? "Disponible" : "Pendiente",
      detalle: "Validacion integrada contra /api/dashboard/stats.",
      tone: data?.status === "ok" ? "emerald" : "amber"
    },
    {
      ambiente: "Produccion",
      estado: "Pendiente de release",
      detalle: "Requiere merge aprobado, build y version final etiquetada.",
      tone: "slate"
    }
  ];

  async function cargarDashboard(filtroCarrera = carrera) {
    setLoading(true);
    setMensaje("");

    try {
      const response = await obtenerEstadisticasDashboard({ carrera: filtroCarrera });
      setData(response);
    } catch (error) {
      setMensaje(error.message || "No se pudieron cargar las metricas del dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDashboard("Todas");
  }, []);

  function aplicarCarrera(value) {
    setCarrera(value);
    cargarDashboard(value);
  }

  return (
    <ConsoleLayout
      title="Dashboard regional anonimizado"
      subtitle="Panel gerencial para consultar indicadores agregados de candidatos, examenes y certificados sin exponer datos personales identificables."
      badge="RF-08 - RF-09 - EaC-06"
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Inteligencia de negocio
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Metricas operativas del ecosistema PRCCD
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Los datos se consultan desde el servicio de dashboard y se presentan unicamente en forma agregada.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-800">Carrera</span>
              <select
                value={carrera}
                onChange={(event) => aplicarCarrera(event.target.value)}
                className="h-12 min-w-64 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none ring-indigo-600 transition focus:ring-2"
              >
                {carrerasDisponibles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => cargarDashboard(carrera)}
              className="h-12 rounded-2xl bg-indigo-700 px-5 text-sm font-black text-white shadow-lg shadow-indigo-900/15 transition hover:bg-indigo-800"
            >
              Refrescar datos
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <strong className="block text-sm font-black text-emerald-900">
            {data?.nota || "Datos agregados y anonimizados"}
          </strong>
          <p className="mt-1 text-sm leading-6 text-emerald-800">
            La vista no muestra nombres, identificadores de candidatos ni informacion individual.
          </p>
        </div>

        {mensaje && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            {mensaje}
          </div>
        )}
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          value={loading ? "..." : String(totalCandidatos)}
          label="Candidatos registrados"
          detail={`${candidatosActivos} activos / ${candidatosInactivos} inactivos.`}
        />
        <MetricCard
          value={loading ? "..." : String(totalSesiones)}
          label="Sesiones de examen"
          detail="Evaluaciones registradas en el motor adaptativo."
        />
        <MetricCard
          value={loading ? "..." : `${tasaAprobacion}%`}
          label="Tasa de aprobacion"
          detail="Porcentaje calculado por el endpoint interno de examenes."
        />
        <MetricCard
          value={loading ? "..." : String(totalCertificados)}
          label="Certificados emitidos"
          detail="Credenciales generadas por el sistema."
        />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Panel title="Candidatos por universidad" label="Segmentacion institucional">
          <BarList
            data={candidatosPorUniversidad}
            labelKey="universidad"
            valueKey="total"
            emptyText={loading ? "Cargando universidades..." : "No hay datos por universidad."}
          />
        </Panel>

        <Panel title="Candidatos por carrera" label="Segmentacion academica">
          <BarList
            data={candidatosPorCarrera}
            labelKey="carrera"
            valueKey="total"
            emptyText={loading ? "Cargando carreras..." : "El endpoint Fase 3 aun no expone desglose por carrera."}
          />
        </Panel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Panel title="Estado de examenes" label="Motor adaptativo">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatusBox label="Aprobados" value={aprobados} tone="emerald" />
            <StatusBox label="Reprobados" value={reprobados} tone="rose" />
            <StatusBox label="En progreso" value={enProgreso} tone="indigo" />
            <StatusBox label="Suspendidos" value={suspendidos} tone="amber" />
            <StatusBox label="Completadas" value={completadas} tone="slate" />
            <StatusBox label="Total sesiones" value={totalSesiones} tone="slate" />
          </div>
        </Panel>

        <Panel title="Estado de certificados" label="Credencial inmutable">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatusBox label="Emitidos" value={totalCertificados} tone="indigo" />
            <StatusBox label="Vigentes" value={certificadosVigentes} tone="emerald" />
            <StatusBox label="Carreras visibles" value={totalCarreras} tone="slate" />
            <StatusBox label="Filtro aplicado" value={carrera === "Todas" ? "General" : carrera} tone="slate" />
          </div>
        </Panel>
      </section>

      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              CI/CD
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Estado del pipeline por ambiente
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Indicador operativo para diferenciar la validacion en Staging del paso controlado hacia Produccion.
            </p>
          </div>
          <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
            Staging vs Produccion
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {pipeline.map((item) => (
            <PipelineBox key={item.ambiente} {...item} />
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Respuesta backend
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Resumen tecnico del servicio
            </h2>
          </div>
          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            {data?.status === "ok" ? "Respuesta 200 OK" : "Pendiente"}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full border-collapse bg-white text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-4 font-black">Indicador</th>
                <th className="px-4 py-4 font-black">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <ResumenRow label="status" value={data?.status || "Pendiente"} />
              <ResumenRow label="carrera_filtrada" value={carrera} />
              <ResumenRow label="candidatos_activos" value={candidatosActivos} />
              <ResumenRow label="candidatos_inactivos" value={candidatosInactivos} />
              <ResumenRow label="candidatos_total" value={totalCandidatos} />
              <ResumenRow label="total_sesiones" value={totalSesiones} />
              <ResumenRow label="completadas" value={completadas} />
              <ResumenRow label="aprobados" value={aprobados} />
              <ResumenRow label="reprobados" value={reprobados} />
              <ResumenRow label="suspendidos" value={suspendidos} />
              <ResumenRow label="en_progreso" value={enProgreso} />
              <ResumenRow label="certificados_emitidos" value={totalCertificados} />
              <ResumenRow label="certificados_vigentes" value={certificadosVigentes} />
              <ResumenRow label="pipeline_staging" value={pipeline[0].estado} />
              <ResumenRow label="pipeline_produccion" value={pipeline[1].estado} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TraceCard code="RF-08" title="Dashboards analiticos" text="Visualizacion de indicadores regionales sobre competencias digitales." />
        <TraceCard code="RF-09" title="Anonimizacion" text="Exposicion de datos agregados sin informacion personal identificable." />
        <TraceCard code="EaC-06" title="Privacidad" text="Proteccion de identidad individual en consultas gerenciales." />
        <TraceCard code="Dashboard Service" title="Microservicio BI" text="Consumo del endpoint /api/dashboard/stats mediante gateway." />
      </section>
    </ConsoleLayout>
  );
}

function Panel({ title, label, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
      <div className="mb-5">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">{label}</span>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function BarList({ data, labelKey, valueKey, emptyText }) {
  const max = Math.max(...data.map((item) => numero(item[valueKey])), 0);

  if (!data.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {data.map((item, index) => {
        const value = numero(item[valueKey]);
        const width = max > 0 ? Math.max(6, Math.round((value / max) * 100)) : 0;
        const label = item[labelKey] || item.universidad_origen || "Sin clasificar";

        return (
          <div key={`${label}-${value}-${index}`} className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-black text-slate-800">{label}</span>
              <span className="text-sm font-black text-indigo-700">{value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-indigo-700 transition-all" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBox({ label, value, tone }) {
  const tones = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rose: "border-rose-200 bg-rose-50 text-rose-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-800",
    slate: "border-slate-200 bg-slate-50 text-slate-800"
  };

  return (
    <article className={`rounded-2xl border p-5 ${tones[tone] || tones.slate}`}>
      <span className="block text-xs font-black uppercase tracking-[0.16em] opacity-70">{label}</span>
      <strong className="mt-2 block text-3xl font-black tracking-tight">{value}</strong>
    </article>
  );
}

function PipelineBox({ ambiente, estado, detalle, tone }) {
  const tones = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    slate: "border-slate-200 bg-slate-50 text-slate-900"
  };

  return (
    <article className={`rounded-2xl border p-5 ${tones[tone] || tones.slate}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.16em] opacity-70">{ambiente}</span>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black">{estado}</span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 opacity-80">{detalle}</p>
    </article>
  );
}

function ResumenRow({ label, value }) {
  return (
    <tr>
      <td className="px-4 py-4 font-black text-slate-700">{label}</td>
      <td className="px-4 py-4 text-slate-700">{String(value)}</td>
    </tr>
  );
}

function numero(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sumar(items = [], key) {
  return items.reduce((total, item) => total + numero(item[key]), 0);
}

export default DashboardPage;
