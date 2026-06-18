import "./index.css";

function App() {
  return (
    <main className="app">
      <section className="hero">
        <nav className="topbar">
          <div>
            <strong>PRCCD</strong>
            <span>Certificación Regional SICA</span>
          </div>
          <span className="badge">MVP Fase 2</span>
        </nav>

        <div className="heroContent">
          <p className="eyebrow">Plataforma Regional de Certificación de Competencias Digitales</p>
          <h1>Arquitectura PRCCD materializada en un MVP funcional</h1>
          <p className="description">
            Prototipo de implementación para validar ingesta universitaria, examen adaptativo,
            evidencia antifraude, emisión de credenciales inmutables, analítica anonimizada
            y verificación pública de certificados.
          </p>

          <div className="actions">
            <a href="/examen" className="primary">Iniciar examen adaptativo</a>
            <a href="/dashboard" className="secondary">Ver dashboard regional</a>
          </div>
        </div>
      </section>

      <section className="modules">
        <Module
          title="Ingesta universitaria"
          route="/ingesta"
          tag="USAC · UCR · UES"
          text="Carga de expedientes académicos en CSV, JSON o XML hacia el modelo canónico interno."
        />
        <Module
          title="Examen adaptativo"
          route="/examen"
          tag="Motor IRT activo"
          text="Flujo de evaluación con dificultad básica, intermedia y avanzada según la respuesta previa."
        />
        <Module
          title="Evidencia antifraude"
          route="/auditoria"
          tag="Retención 5 años"
          text="Simulación de telemetría, hashes de integridad y bitácora de auditoría."
        />
        <Module
          title="Credencial inmutable"
          route="/certificado"
          tag="PKI + Hyperledger"
          text="Emisión de certificado con SHA-256, firma digital y registro inmutable."
        />
        <Module
          title="Dashboard regional"
          route="/dashboard"
          tag="Datos anonimizados"
          text="Indicadores agregados por país, carrera universitaria y género."
        />
        <Module
          title="Verificación pública"
          route="/verificar"
          tag="QR / Hash"
          text="Validación externa de certificados sin exponer datos personales sensibles."
        />
      </section>
    </main>
  );
}

function Module({ title, route, tag, text }) {
  return (
    <a className="card" href={route}>
      <span>{tag}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </a>
  );
}

export default App;