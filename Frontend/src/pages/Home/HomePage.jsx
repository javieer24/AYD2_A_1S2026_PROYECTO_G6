import { Link } from "react-router-dom";
import ModuleCard from "../../components/ModuleCard";
import MetricCard from "../../components/MetricCard";
import "./HomePage.css";

function HomePage() {
  const modules = [
    {
      title: "Ingesta universitaria",
      description:
        "Carga, transformación, normalización y persistencia de expedientes académicos provenientes de USAC, UCR y UES.",
      route: "/ingesta",
      label: "RF-06 · RF-07",
      status: "Integración",
    },
    {
      title: "Examen adaptativo",
      description:
        "Evaluación de competencias digitales con dificultad básica, intermedia y avanzada según la respuesta inmediata anterior.",
      route: "/examen",
      label: "RF-02 · EaC-05",
      status: "Core",
    },
    {
      title: "Credencial inmutable",
      description:
        "Emisión de certificado digital con hash SHA-256, firma criptográfica y registro inmutable para verificación posterior.",
      route: "/certificado",
      label: "RF-04 · RF-05",
      status: "Certificación",
    },
    {
      title: "Dashboard regional",
      description:
        "Indicadores agregados y anonimizados sobre competencias digitales por país, carrera universitaria y género.",
      route: "/dashboard",
      label: "RF-08 · RF-09",
      status: "Analítica",
    },
    {
      title: "Verificación pública",
      description:
        "Consulta externa de certificados mediante código, hash o QR sin exponer datos personales sensibles del candidato.",
      route: "/verificar",
      label: "RF-10",
      status: "Validación",
    },
    {
      title: "Auditoría y evidencia",
      description:
        "Bitácora inmutable, trazabilidad de eventos, retención de evidencia antifraude y verificación de integridad.",
      route: "/auditoria",
      label: "RF-03 · EaC-07",
      status: "Auditoría",
    },
  ];

  return (
    <main className="home-page">
      <section className="home-shell">
        <header className="home-header">
          <div className="home-brand">
            <strong>PRCCD</strong>
            <span>Certificación Regional SICA CALIFICACION FASE 3</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/verificar"
              className="text-sm text-green-700 font-semibold hover:underline px-3 py-2"
            >
              Verificar certificado
            </Link>
            <Link
              to="/login"
              className="text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2"
            >
              Iniciar sesión
            </Link>
          </div>
        </header>

        <section className="home-hero">
          <div className="home-hero__content">
            <span className="home-kicker">Producto Mínimo Viable · Fase 2</span>
            <h1>
              Plataforma Regional de Certificación de Competencias Digitales
            </h1>
            <p>
              MVP orientado a demostrar los flujos críticos del ecosistema
              PRCCD: ingesta universitaria heterogénea, examen adaptativo,
              evidencia antifraude, emisión de credenciales inmutables,
              analítica anonimizada y verificación pública de certificados.
            </p>

            <div className="home-actions">
              <Link className="home-button home-button--primary" to="/ingesta">
                Iniciar recorrido del MVP
              </Link>
              <Link className="home-button home-button--secondary" to="/examen">
                Ir al examen adaptativo
              </Link>
              <Link className="home-button home-button--secondary" to="/verificar">
                Verificar certificado
              </Link>
            </div>
          </div>

          <aside className="architecture-panel">
            <div className="architecture-panel__title">
              <span>Arquitectura definida</span>
              <strong>Microservicios con orientación a eventos</strong>
            </div>

            <div className="architecture-flow">
              <div>Universidades</div>
              <div>Capa de integración</div>
              <div>Motor adaptativo</div>
              <div>Certificación</div>
              <div>Auditoría inmutable</div>
            </div>

            <div className="architecture-stack">
              <span>Docker</span>
              <span>PostgreSQL</span>
              <span>MongoDB</span>
              <span>Kafka</span>
              <span>Hyperledger</span>
              <span>MinIO</span>
              <span>Keycloak</span>
            </div>
          </aside>
        </section>

        <section className="home-metrics">
          <MetricCard
            value="5"
            label="Flujos principales"
            detail="Ingesta, examen, antifraude, credencial y dashboard."
          />
          <MetricCard
            value="3"
            label="Universidades piloto"
            detail="USAC, UCR y UES como fuentes heterogéneas."
          />
          <MetricCard
            value="12"
            label="Drivers funcionales"
            detail="Trazabilidad directa con los requerimientos RF."
          />
          <MetricCard
            value="5 años"
            label="Retención"
            detail="Custodia de evidencia antifraude e integridad."
          />
        </section>

        {/* Banner de verificación pública */}
        <section className="home-verify-banner">
          <div className="home-verify-banner__content">
            <span>Verificación pública · Sin inicio de sesión</span>
            <h2>¿Recibiste un certificado PRCCD?</h2>
            <p>
              Consulta la autenticidad de cualquier credencial emitida por la
              plataforma ingresando su hash SHA-256. No requiere cuenta ni
              contraseña.
            </p>
          </div>
          <Link to="/verificar" className="home-verify-banner__btn">
            Verificar certificado →
          </Link>
        </section>

        <section className="home-section-title">
          <span>Módulos del MVP</span>
          <h2>Rutas principales de la implementación</h2>
        </section>

        <section className="home-modules">
          {modules.map((module) => (
            <ModuleCard
              key={module.route}
              title={module.title}
              description={module.description}
              route={module.route}
              label={module.label}
              status={module.status}
            />
          ))}
        </section>

        <section className="home-traceability">
          <div>
            <span>Trazabilidad arquitectónica</span>
            <h2>
              Esta pantalla no es decorativa: funciona como índice operativo del
              MVP
            </h2>
          </div>
          <p>
            Cada acceso lleva a un flujo exigido por la Fase 2 y respaldado por
            los requerimientos, atributos de calidad y restricciones definidos
            en la Fase 1.
          </p>
        </section>
      </section>
    </main>
  );
}

export default HomePage;