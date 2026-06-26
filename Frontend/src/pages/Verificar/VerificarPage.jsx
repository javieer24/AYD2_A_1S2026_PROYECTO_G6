import { useState } from "react";
import ConsoleLayout from "../../layouts/ConsoleLayout";
import { verificarCertificadoPublico } from "../../services/certificadoApi";
import "./VerificarPage.css";

function VerificarPage() {
  const [hash, setHash] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function buscarCertificado(event) {
    event.preventDefault();

    if (!hash.trim()) {
      setError("Ingrese el hash público del certificado.");
      return;
    }

    setCargando(true);
    setError("");
    setResultado(null);

    try {
      const data = await verificarCertificadoPublico(hash.trim());
      setResultado(data);
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible verificar el certificado.",
      );
    } finally {
      setCargando(false);
    }
  }

  const certificado = resultado?.certificado;
  const valido = resultado?.valido === true;

  return (
    <main className="verificar-page">
      <ConsoleLayout>
        <div className="verificar-container">
          {/* Hero Section */}
          <section className="verificar-hero">
            <h1>Verificar autenticidad de una <br />credencial PRCCD</h1>
            <form className="verificar-form" onSubmit={buscarCertificado}>
              <div className="verificar-input-group">
                <input
                  type="text"
                  value={hash}
                  onChange={(event) => setHash(event.target.value)}
                  placeholder="Ingrese el hash SHA-256 del certificado"
                  className={error ? "input-error" : ""}
                />
                <button type="submit" disabled={cargando}>
                  {cargando ? (
                    <>
                      <span className="spinner"></span>
                      Verificando...
                    </>
                  ) : (
                    "Verificar"
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="verificar-alert verificar-alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </section>

          {/* Resultados */}
          {resultado && (
            <section className="verificar-result">
              {/* Status Card */}
              <div
                className={`verificar-status-card ${
                  valido ? "status-valid" : "status-invalid"
                }`}
              >
                <div className="status-icon">
                  {valido ? "✅" : "❌"}
                </div>
                <div className="status-content">
                  <span className="status-label">
                    {valido ? "Certificado legal y auténtico" : "Certificado inválido o inexistente"}
                  </span>
                  <h2>
                    {valido
                      ? "La credencial se encuentra registrada en PRCCD"
                      : "No se pudo confirmar la validez del certificado"}
                  </h2>
                  <p className="status-meta">
                    Resultado obtenido desde el servicio público de verificación
                  </p>
                </div>
              </div>

              {/* Grid de detalles */}
              <div className="verificar-grid">
                <article className="verificar-card verificar-main-card">
                  <div className="verificar-card-header">
                    <div className="card-title">
                      <span>📄 Certificado</span>
                      <h3>
                        {valido ? "Certificado Verificado" : "No encontrado"}
                      </h3>
                    </div>
                    <div className="card-badge">
                      <strong className={valido ? "badge-valid" : "badge-invalid"}>
                        {certificado?.estado || "No disponible"}
                      </strong>
                    </div>
                  </div>

                  <div className="verificar-details">
                    <div className="detail-item">
                      <span className="detail-label">ID candidato</span>
                      <strong className="detail-value">
                        {certificado?.id_candidato || "No disponible"}
                      </strong>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estado</span>
                      <strong className="detail-value">
                        {certificado?.estado || "No disponible"}
                      </strong>
                    </div>
                  </div>
                </article>

                <article className="verificar-card">
                  <div className="verificar-card-header">
                    <div className="card-title">
                      <span>🔑 Hash público</span>
                      <h3>Integridad del certificado</h3>
                    </div>
                  </div>

                  <div className="verificar-hash-block">
                    <span className="hash-label">Hash consultado</span>
                    <code className="hash-value">{hash}</code>
                  </div>
                </article>
              </div>

              {/* Payload JSON */}
              <article className="verificar-card verificar-payload">
                <div className="verificar-card-header">
                  <div className="card-title">
                    <span>📦 Respuesta técnica</span>
                    <h3>Payload de verificación</h3>
                  </div>
                  <button 
                    className="copy-button"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(resultado, null, 2));
                    }}
                  >
                    📋 Copiar
                  </button>
                </div>
                <pre className="verificar-json">{JSON.stringify(resultado, null, 2)}</pre>
              </article>
            </section>
          )}
        </div>
      </ConsoleLayout>
    </main>
  );
}

export default VerificarPage;