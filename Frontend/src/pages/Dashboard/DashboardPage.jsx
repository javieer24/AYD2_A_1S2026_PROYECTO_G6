import { useMemo, useState } from "react";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import "./DashboardPage.css";
import KpiCard from "../../components/kpiCard";
import certIcon from "../../assets/certificate-svgrepo-com.svg";
import userIcon from "../../assets/users-group-rounded-svgrepo-com.svg";
import aprovedIcon from "../../assets/approved-aproved-certificate-svgrepo-com.svg";
import examIcon from "../../assets/studying-exam-svgrepo-com.svg"

const SAMPLE_RECORDS = [
  {
    pais: "Guatemala",
    universidad: "USAC",
    carrera: "Ing. Sistemas",
    genero: "Femenino",
    competencia: "Programacion",
    evaluaciones: 46,
    aprobados: 38,
    certificados: 34,
    fecha: "2026-06-15",
  },
  {
    pais: "Guatemala",
    universidad: "USAC",
    carrera: "Ing. Industrial",
    genero: "Masculino",
    competencia: "Datos",
    evaluaciones: 33,
    aprobados: 24,
    certificados: 20,
    fecha: "2026-06-16",
  },
  {
    pais: "Costa Rica",
    universidad: "UCR",
    carrera: "Ing. Sistemas",
    genero: "Masculino",
    competencia: "Ciberseguridad",
    evaluaciones: 41,
    aprobados: 31,
    certificados: 28,
    fecha: "2026-06-16",
  },
  {
    pais: "Costa Rica",
    universidad: "UCR",
    carrera: "Administracion",
    genero: "Femenino",
    competencia: "Ofimatica",
    evaluaciones: 28,
    aprobados: 22,
    certificados: 18,
    fecha: "2026-06-17",
  },
  {
    pais: "El Salvador",
    universidad: "UES",
    carrera: "Ing. Sistemas",
    genero: "No especificado",
    competencia: "Redes",
    evaluaciones: 37,
    aprobados: 26,
    certificados: 24,
    fecha: "2026-06-17",
  },
  {
    pais: "El Salvador",
    universidad: "UES",
    carrera: "Mercadeo",
    genero: "Femenino",
    competencia: "Analitica",
    evaluaciones: 21,
    aprobados: 17,
    certificados: 15,
    fecha: "2026-06-18",
  },
  {
    pais: "Guatemala",
    universidad: "USAC",
    carrera: "Administracion",
    genero: "Masculino",
    competencia: "Ofimatica",
    evaluaciones: 24,
    aprobados: 18,
    certificados: 14,
    fecha: "2026-06-18",
  },
  {
    pais: "Costa Rica",
    universidad: "UCR",
    carrera: "Ing. Industrial",
    genero: "No especificado",
    competencia: "Programacion",
    evaluaciones: 19,
    aprobados: 14,
    certificados: 12,
    fecha: "2026-06-19",
  },
  {
    pais: "El Salvador",
    universidad: "UES",
    carrera: "Ing. Sistemas",
    genero: "Masculino",
    competencia: "Ciberseguridad",
    evaluaciones: 29,
    aprobados: 19,
    certificados: 17,
    fecha: "2026-06-19",
  },
];

const INITIAL_FILTERS = {
  pais: "Todos",
  carrera: "Todas",
  genero: "Todos",
  desde: "2026-06-15",
  hasta: "2026-06-19",
};

const margin = { top: 10, bottom: 30, left: 50, right: 24 };

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="flex flex-col text-xs text-gray-500 gap-1">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-2 py-1 text-sm text-gray-700 bg-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function unique(items) {
  return Array.from(new Set(items)).sort((a, b) => a.localeCompare(b));
}

function aggregateBy(records, key, valueKey) {
  const map = new Map();
  records.forEach((item) => {
    map.set(item[key], (map.get(item[key]) || 0) + item[valueKey]);
  });
  return Array.from(map, ([label, value]) => ({ label, value })).sort(
    (a, b) => b.value - a.value,
  );
}

function buildOptions(records) {
  return {
    paises: ["Todos", ...unique(records.map((r) => r.pais))],
    carreras: ["Todas", ...unique(records.map((r) => r.carrera))],
    generos: ["Todos", ...unique(records.map((r) => r.genero))],
  };
}

function DashboardPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const options = useMemo(() => buildOptions(SAMPLE_RECORDS), []);

  const filteredRecords = useMemo(() => {
    return SAMPLE_RECORDS.filter((item) => {
      return (
        (filters.pais === "Todos" || item.pais === filters.pais) &&
        (filters.carrera === "Todas" || item.carrera === filters.carrera) &&
        (filters.genero === "Todos" || item.genero === filters.genero) &&
        (!filters.desde || item.fecha >= filters.desde) &&
        (!filters.hasta || item.fecha <= filters.hasta)
      );
    });
  }, [filters]);

  const metrics = useMemo(() => {
    const evaluaciones = filteredRecords.reduce(
      (s, r) => s + r.evaluaciones,
      0,
    );
    const aprobados = filteredRecords.reduce((s, r) => s + r.aprobados, 0);
    const certificados = filteredRecords.reduce(
      (s, r) => s + r.certificados,
      0,
    );
    const tasaAprobacion = evaluaciones
      ? Math.round((aprobados / evaluaciones) * 100)
      : 0;
    return { evaluaciones, aprobados, certificados, tasaAprobacion };
  }, [filteredRecords]);

  const byCompetence = useMemo(
    () => aggregateBy(filteredRecords, "competencia", "aprobados"),
    [filteredRecords],
  );
  const byCountry = useMemo(
    () => aggregateBy(filteredRecords, "pais", "certificados"),
    [filteredRecords],
  );
  const byCareer = useMemo(
    () => aggregateBy(filteredRecords, "carrera", "evaluaciones"),
    [filteredRecords],
  );
  const byGender = useMemo(
    () => aggregateBy(filteredRecords, "genero", "aprobados"),
    [filteredRecords]
  )
  const byDate = useMemo(() => {
    const map = new Map();
    filteredRecords.forEach((r) => {
      map.set(r.fecha, (map.get(r.fecha) || 0) + r.certificados);
    });
    const sorted = Array.from(map, ([fecha, value]) => ({ fecha, value })).sort(
      (a, b) => a.fecha.localeCompare(b.fecha),
    );
    return {
      labels: sorted.map((r) => r.fecha.slice(5)),
      data: sorted.map((r) => r.value),
    };
  }, [filteredRecords]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS);
  }

  const kpis = [
    {
      label: "Evaluaciones aprobadas",
      value: metrics.aprobados,
      icon:examIcon,
      color: "bg-red-100"
    },
    {
      label: "Certificaciones emitidas",
      value: metrics.certificados,
      icon: certIcon,
      color: "bg-green-100",
    },
    {
      label: "Candidatos evaluados",
      value: metrics.evaluaciones,
      icon: userIcon,
      color: "bg-blue-100",
    },
    {
      label: "Tasa de aprobación",
      value: `${metrics.tasaAprobacion}%`,
      icon: aprovedIcon,
      color: "bg-yellow-100",
    },
  ];

  return (
    <main>
      <ConsoleLayout title="Dashboard">
        <div className="flex flex-wrap gap-3 mb-4">
          <SelectFilter
            label="País"
            value={filters.pais}
            options={options.paises}
            onChange={(v) => updateFilter("pais", v)}
          />
          <SelectFilter
            label="Carrera"
            value={filters.carrera}
            options={options.carreras}
            onChange={(v) => updateFilter("carrera", v)}
          />
          <SelectFilter
            label="Género"
            value={filters.genero}
            options={options.generos}
            onChange={(v) => updateFilter("genero", v)}
          />
          <label className="flex flex-col text-xs text-gray-500 gap-1">
            Desde
            <input
              type="date"
              value={filters.desde}
              onChange={(e) => updateFilter("desde", e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm text-gray-700"
            />
          </label>
          <label className="flex flex-col text-xs text-gray-500 gap-1">
            Hasta
            <input
              type="date"
              value={filters.hasta}
              onChange={(e) => updateFilter("hasta", e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm text-gray-700"
            />
          </label>
          <button
            onClick={resetFilters}
            className="self-end border rounded-lg px-4 py-1 text-sm text-gray-500 hover:bg-gray-50"
          >
            Limpiar
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {kpis.map((kpi, i) => (
            <KpiCard key={i} {...kpi} />
          ))}
        </div>

        <div className="flex gap-3 w-full mb-4">
          <div className="flex-1 bg-white border rounded-xl p-4 min-w-0">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Certificaciones por fecha
            </h2>
            <Box sx={{ width: "100%", height: 260 }}>
              <LineChart
                series={[{ data: byDate.data, label: "Certificados" }]}
                xAxis={[
                  { scaleType: "point", data: byDate.labels, height: 28 },
                ]}
                yAxis={[{ width: 40 }]}
                margin={margin}
              />
            </Box>
          </div>

          <div className="flex-1 bg-white border rounded-xl p-4 min-w-0">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Aprobados por competencia
            </h2>
            <Box sx={{ width: "100%", height: 260 }}>
              <BarChart
                series={[
                  {
                    data: byCompetence.map((r) => r.value),
                    label: "Aprobados",
                  },
                ]}
                xAxis={[
                  {
                    data: byCompetence.map((r) => r.label),
                    scaleType: "band",
                    height: 28,
                  },
                ]}
                yAxis={[{ width: 40 }]}
                margin={margin}
              />
            </Box>
          </div>
        </div>

        <div className="flex gap-3 w-full mb-4">
          <div className="flex-1 bg-white border rounded-xl p-4 min-w-0">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Certificados por país
            </h2>
            <Box sx={{ width: "100%", height: 240 }}>
              <BarChart
                series={[
                  {
                    data: byCountry.map((r) => r.value),
                    label: "Certificados",
                  },
                ]}
                xAxis={[
                  {
                    data: byCountry.map((r) => r.label),
                    scaleType: "band",
                    height: 28,
                  },
                ]}
                yAxis={[{ width: 40 }]}
                margin={margin}
              />
            </Box>
          </div>

          <div className="flex-1 bg-white border rounded-xl p-4 min-w-0">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Evaluaciones por carrera
            </h2>
            <div className="flex flex-col gap-3 mt-2">
              {byCareer.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-32 truncate">
                    {item.label}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{
                        width: `${(item.value / byCareer[0].value) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-6 text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full mb-4">
          <div className="flex-1 bg-white border rounded-xl p-4 min-w-0">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Participacion por género
            </h2>
            <Box sx={{width:'100%', height:240}}>
              <PieChart
                series={[
                  {
                    data: byGender.map((r, i) => ({
                      id: i,
                      value: r.value,
                      label: r.label,
                    })),
                    innerRadius: 50,
                    outerRadius: 90,
                    paddingAngle: 3,
                    cornerRadius: 4,
                  },
                ]}
                margin={margin}
              />
            </Box>
          </div>
          <div className="flex-1 bg-white border rounded-xl p-4 min-w-0">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Distribucion por pais
            </h2>
                        <Box sx={{width:'100%', height:240}}>
              <PieChart
                series={[
                  {
                    data: byCountry.map((r, i) => ({
                      id: i,
                      value: r.value,
                      label: r.label,
                    })),
                    innerRadius: 50,
                    outerRadius: 90,
                    paddingAngle: 3,
                    cornerRadius: 4,
                  },
                ]}
                margin={margin}
              />
            </Box>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Resumen filtrado
            </h2>
            <span className="text-xs text-gray-400">
              {filteredRecords.length} segmentos
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b">
                  <th className="pb-2 font-medium">País</th>
                  <th className="pb-2 font-medium">Carrera</th>
                  <th className="pb-2 font-medium">Género</th>
                  <th className="pb-2 font-medium">Competencia</th>
                  <th className="pb-2 font-medium text-right">Evaluaciones</th>
                  <th className="pb-2 font-medium text-right">Aprobados</th>
                  <th className="pb-2 font-medium text-right">Certificados</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2 text-gray-700">{item.pais}</td>
                    <td className="py-2 text-gray-700">{item.carrera}</td>
                    <td className="py-2 text-gray-700">{item.genero}</td>
                    <td className="py-2 text-gray-700">{item.competencia}</td>
                    <td className="py-2 text-gray-700 text-right">
                      {item.evaluaciones}
                    </td>
                    <td className="py-2 text-gray-700 text-right">
                      {item.aprobados}
                    </td>
                    <td className="py-2 text-gray-700 text-right">
                      {item.certificados}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ConsoleLayout>
    </main>
  );
}

export default DashboardPage;
