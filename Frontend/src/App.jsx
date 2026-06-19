import { useEffect, useMemo, useState } from 'react'
import './App.css'

const UNIVERSITY_COUNTRY = {
  USAC: 'Guatemala',
  UCR: 'Costa Rica',
  UES: 'El Salvador',
}

const SAMPLE_RECORDS = [
  { pais: 'Guatemala', universidad: 'USAC', carrera: 'Ingenieria en Sistemas', genero: 'Femenino', competencia: 'Programacion', evaluaciones: 46, aprobados: 38, certificados: 34, fecha: '2026-06-15' },
  { pais: 'Guatemala', universidad: 'USAC', carrera: 'Ingenieria Industrial', genero: 'Masculino', competencia: 'Datos', evaluaciones: 33, aprobados: 24, certificados: 20, fecha: '2026-06-16' },
  { pais: 'Costa Rica', universidad: 'UCR', carrera: 'Ingenieria en Sistemas', genero: 'Masculino', competencia: 'Ciberseguridad', evaluaciones: 41, aprobados: 31, certificados: 28, fecha: '2026-06-16' },
  { pais: 'Costa Rica', universidad: 'UCR', carrera: 'Administracion', genero: 'Femenino', competencia: 'Ofimatica', evaluaciones: 28, aprobados: 22, certificados: 18, fecha: '2026-06-17' },
  { pais: 'El Salvador', universidad: 'UES', carrera: 'Ingenieria en Sistemas', genero: 'No especificado', competencia: 'Redes', evaluaciones: 37, aprobados: 26, certificados: 24, fecha: '2026-06-17' },
  { pais: 'El Salvador', universidad: 'UES', carrera: 'Mercadeo', genero: 'Femenino', competencia: 'Analitica', evaluaciones: 21, aprobados: 17, certificados: 15, fecha: '2026-06-18' },
  { pais: 'Guatemala', universidad: 'USAC', carrera: 'Administracion', genero: 'Masculino', competencia: 'Ofimatica', evaluaciones: 24, aprobados: 18, certificados: 14, fecha: '2026-06-18' },
  { pais: 'Costa Rica', universidad: 'UCR', carrera: 'Ingenieria Industrial', genero: 'No especificado', competencia: 'Programacion', evaluaciones: 19, aprobados: 14, certificados: 12, fecha: '2026-06-19' },
  { pais: 'El Salvador', universidad: 'UES', carrera: 'Ingenieria en Sistemas', genero: 'Masculino', competencia: 'Ciberseguridad', evaluaciones: 29, aprobados: 19, certificados: 17, fecha: '2026-06-19' },
]

const INITIAL_FILTERS = {
  pais: 'Todos',
  carrera: 'Todas',
  genero: 'Todos',
  desde: '2026-06-15',
  hasta: '2026-06-19',
}

function App() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [apiStats, setApiStats] = useState(null)
  const [apiStatus, setApiStatus] = useState('local')

  useEffect(() => {
    const controller = new AbortController()
    const token = localStorage.getItem('prccd_token') || localStorage.getItem('token') || ''
    const params = new URLSearchParams()

    if (filters.carrera !== 'Todas') params.set('carrera', filters.carrera)
    if (filters.pais !== 'Todos') params.set('pais', filters.pais)
    if (filters.genero !== 'Todos') params.set('genero', filters.genero)
    if (filters.desde) params.set('desde', filters.desde)
    if (filters.hasta) params.set('hasta', filters.hasta)

    async function loadStats() {
      try {
        setApiStatus('loading')
        const response = await fetch(`/api/dashboard/stats?${params.toString()}`, {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        setApiStats(data.metricas)
        setApiStatus('connected')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setApiStats(null)
          setApiStatus('local')
        }
      }
    }

    loadStats()
    return () => controller.abort()
  }, [filters])

  const options = useMemo(() => buildOptions(SAMPLE_RECORDS), [])
  const filteredRecords = useMemo(() => {
    return SAMPLE_RECORDS.filter((item) => {
      const inCountry = filters.pais === 'Todos' || item.pais === filters.pais
      const inCareer = filters.carrera === 'Todas' || item.carrera === filters.carrera
      const inGender = filters.genero === 'Todos' || item.genero === filters.genero
      const inStart = !filters.desde || item.fecha >= filters.desde
      const inEnd = !filters.hasta || item.fecha <= filters.hasta
      return inCountry && inCareer && inGender && inStart && inEnd
    })
  }, [filters])

  const metrics = useMemo(() => buildMetrics(filteredRecords, apiStats), [filteredRecords, apiStats])
  const byCompetence = useMemo(() => aggregateBy(filteredRecords, 'competencia', 'aprobados'), [filteredRecords])
  const byCountry = useMemo(() => aggregateBy(filteredRecords, 'pais', 'certificados'), [filteredRecords])
  const byCareer = useMemo(() => aggregateBy(filteredRecords, 'carrera', 'evaluaciones'), [filteredRecords])
  const byGender = useMemo(() => aggregateBy(filteredRecords, 'genero', 'aprobados'), [filteredRecords])

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS)
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <span className="eyebrow">PRCCD / SICA</span>
          <h1>Dashboard gerencial</h1>
          <p>Competencias digitales por pais, carrera, genero y periodo del sprint.</p>
        </div>
        <div className={`status-pill ${apiStatus}`}>
          <span aria-hidden="true"></span>
          {apiStatus === 'connected' ? 'API conectada' : apiStatus === 'loading' ? 'Consultando API' : 'Vista local'}
        </div>
      </header>

      <section className="filters-band" aria-label="Filtros del dashboard">
        <SelectFilter label="Pais" value={filters.pais} options={options.paises} onChange={(value) => updateFilter('pais', value)} />
        <SelectFilter label="Carrera" value={filters.carrera} options={options.carreras} onChange={(value) => updateFilter('carrera', value)} />
        <SelectFilter label="Genero" value={filters.genero} options={options.generos} onChange={(value) => updateFilter('genero', value)} />
        <label className="filter-field">
          <span>Desde</span>
          <input type="date" value={filters.desde} onChange={(event) => updateFilter('desde', event.target.value)} />
        </label>
        <label className="filter-field">
          <span>Hasta</span>
          <input type="date" value={filters.hasta} onChange={(event) => updateFilter('hasta', event.target.value)} />
        </label>
        <button className="reset-button" type="button" onClick={resetFilters}>Limpiar</button>
      </section>

      <section className="metric-grid" aria-label="Indicadores principales">
        <MetricCard label="Evaluaciones" value={metrics.evaluaciones} detail="Sesiones registradas" tone="blue" />
        <MetricCard label="Aprobados" value={metrics.aprobados} detail={`${metrics.tasaAprobacion}% de aprobacion`} tone="green" />
        <MetricCard label="Certificados" value={metrics.certificados} detail="Credenciales emitidas" tone="violet" />
        <MetricCard label="Cobertura" value={metrics.cobertura} detail="Paises con actividad" tone="amber" />
      </section>

      <section className="chart-layout">
        <ChartPanel title="Competencias evaluadas" subtitle="Aprobados por competencia">
          <BarChart data={byCompetence} />
        </ChartPanel>

        <ChartPanel title="Certificados por pais" subtitle="Distribucion regional">
          <DonutChart data={byCountry} />
        </ChartPanel>

        <ChartPanel title="Carreras con mayor actividad" subtitle="Evaluaciones registradas">
          <HorizontalBars data={byCareer} />
        </ChartPanel>

        <ChartPanel title="Participacion por genero" subtitle="Aprobados anonimizados">
          <SegmentedChart data={byGender} />
        </ChartPanel>
      </section>

      <section className="table-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Detalle anonimo</span>
            <h2>Resumen filtrado</h2>
          </div>
          <strong>{filteredRecords.length} segmentos</strong>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pais</th>
                <th>Carrera</th>
                <th>Genero</th>
                <th>Competencia</th>
                <th>Evaluaciones</th>
                <th>Aprobados</th>
                <th>Certificados</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((item) => (
                <tr key={`${item.pais}-${item.carrera}-${item.genero}-${item.competencia}-${item.fecha}`}>
                  <td>{item.pais}</td>
                  <td>{item.carrera}</td>
                  <td>{item.genero}</td>
                  <td>{item.competencia}</td>
                  <td>{item.evaluaciones}</td>
                  <td>{item.aprobados}</td>
                  <td>{item.certificados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function MetricCard({ label, value, detail, tone }) {
  return (
    <article className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  )
}

function ChartPanel({ title, subtitle, children }) {
  return (
    <article className="chart-panel">
      <div className="chart-title">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {children}
    </article>
  )
}

function BarChart({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1)
  return (
    <div className="bar-chart">
      {data.map((item) => (
        <div className="bar-column" key={item.label}>
          <div className="bar-track">
            <span style={{ height: `${Math.max((item.value / max) * 100, 8)}%` }}></span>
          </div>
          <strong>{item.value}</strong>
          <small>{item.label}</small>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1
  let offset = 25

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 42 42" className="donut" role="img" aria-label="Distribucion por pais">
        <circle className="donut-bg" cx="21" cy="21" r="15.915" />
        {data.map((item, index) => {
          const dash = (item.value / total) * 100
          const circle = (
            <circle
              key={item.label}
              className={`donut-segment segment-${index}`}
              cx="21"
              cy="21"
              r="15.915"
              strokeDasharray={`${dash} ${100 - dash}`}
              strokeDashoffset={offset}
            />
          )
          offset -= dash
          return circle
        })}
        <text x="21" y="20" textAnchor="middle">{total}</text>
        <text x="21" y="24.5" textAnchor="middle" className="donut-caption">cert.</text>
      </svg>
      <div className="legend-list">
        {data.map((item, index) => (
          <div key={item.label}>
            <span className={`legend-dot segment-${index}`}></span>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function HorizontalBars({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1)
  return (
    <div className="horizontal-bars">
      {data.map((item) => (
        <div className="hbar-row" key={item.label}>
          <div className="hbar-label">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
          <div className="hbar-track">
            <span style={{ width: `${Math.max((item.value / max) * 100, 8)}%` }}></span>
          </div>
        </div>
      ))}
    </div>
  )
}

function SegmentedChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1
  return (
    <div className="segments">
      <div className="segment-track">
        {data.map((item, index) => (
          <span key={item.label} className={`segment-${index}`} style={{ width: `${(item.value / total) * 100}%` }}></span>
        ))}
      </div>
      <div className="legend-list compact">
        {data.map((item, index) => (
          <div key={item.label}>
            <span className={`legend-dot segment-${index}`}></span>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function buildOptions(records) {
  return {
    paises: ['Todos', ...unique(records.map((item) => item.pais))],
    carreras: ['Todas', ...unique(records.map((item) => item.carrera))],
    generos: ['Todos', ...unique(records.map((item) => item.genero))],
  }
}

function buildMetrics(records, apiStats) {
  const localEvaluaciones = records.reduce((sum, item) => sum + item.evaluaciones, 0)
  const localAprobados = records.reduce((sum, item) => sum + item.aprobados, 0)
  const localCertificados = records.reduce((sum, item) => sum + item.certificados, 0)
  const apiExamenes = apiStats?.examenes
  const apiCertificados = apiStats?.certificados

  const evaluaciones = Number(apiExamenes?.total_sesiones ?? localEvaluaciones)
  const aprobados = Number(apiExamenes?.aprobados ?? localAprobados)
  const certificados = Number(apiCertificados?.total_emitidos ?? localCertificados)
  const tasaAprobacion = evaluaciones ? Math.round((aprobados / evaluaciones) * 100) : 0
  const cobertura = unique(records.map((item) => item.pais)).length

  return { evaluaciones, aprobados, certificados, tasaAprobacion, cobertura }
}

function aggregateBy(records, key, valueKey) {
  const map = new Map()
  records.forEach((item) => {
    map.set(item[key], (map.get(item[key]) || 0) + item[valueKey])
  })
  return Array.from(map, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
}

function unique(items) {
  return Array.from(new Set(items)).sort((a, b) => a.localeCompare(b))
}

export default App
