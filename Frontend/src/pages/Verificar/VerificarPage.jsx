import { useState } from "react";
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
      setError(requestError.message || "No fue posible verificar el certificado.");
    } finally {
      setCargando(false);
    }
  }

  const certificado = resultado?.certificado;
  const valido = resultado?.valido === true;

  return (
    <main className="verificar-page">
      <section className="verificar-shell">
        <header className="verificar-topbar">
          <div>
            <strong>PRCCD</strong>
            <span>Portal público de verificación</span>
          </div>
          <span className="verificar-access">Consulta pública</span>
        </header>

        <section className="verificar-hero">
          <span className="verificar-eyebrow">Validación de certificado</span>
          <h1>Verificar autenticidad de una credencial PRCCD</h1>
          <p>
            Ingrese el hash público del certificado para consultar su validez sin iniciar sesión.
          </p>

          <form className="verificar-form" onSubmit={buscarCertificado}>
            <input
              type="text"
              value={hash}
              onChange={(event) => setHash(event.target.value)}
              placeholder="Hash SHA-256 del certificado"
            />
            <button type="submit" disabled={cargando}>
              {cargando ? "Verificando..." : "Verificar"}
            </button>
          </form>

          {error && <div className="verificar-alert verificar-alert-error">{error}</div>}
        </section>

        {resultado && (
          <section className="verificar-result">
            <div className={`verificar-status-card ${valido ? "valid" : "invalid"}`}>
              <span>{valido ? "Certificado válido" : "Certificado no válido"}</span>
              <h2>{valido ? "Autenticidad confirmada" : "No se pudo confirmar la validez"}</h2>
              <p>
                Resultado obtenido desde el endpoint público de verificación por hash.
              </p>
            </div>

            <div className="verificar-grid">
              <article className="verificar-card verificar-main-card">
                <div className="verificar-card-header">
                  <div>
                    <span>Certificado</span>
                    <h3>{certificado?.id || "No disponible"}</h3>
                  </div>
                  <strong>{certificado?.estado || "No disponible"}</strong>
                </div>

                <div className="verificar-details">
                  <Detail label="ID candidato" value={certificado?.id_candidato} />
                  <Detail label="Sesión de examen" value={certificado?.sesion_id} />
                  <Detail label="Fecha de emisión" value={formatearFecha(certificado?.emitido_en)} />
                  <Detail label="Estado" value={certificado?.estado} />
                </div>
              </article>

              <article className="verificar-card">
                <div className="verificar-card-header">
                  <div>
                    <span>Hash público</span>
                    <h3>Integridad del certificado</h3>
                  </div>
                </div>

                <div className="verificar-hashes">
                  <HashBlock label="Hash certificado" value={certificado?.hash_certificado} />
                </div>
              </article>
            </div>

            <article className="verificar-card">
              <div className="verificar-card-header">
                <div>
                  <span>Respuesta técnica</span>
                  <h3>Payload de verificación</h3>
                </div>
              </div>

              <pre>{JSON.stringify(resultado, null, 2)}</pre>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{String(value || "No disponible")}</strong>
    </div>
  );
}

function HashBlock({ label, value }) {
  return (
    <div className="verificar-hash-block">
      <span>{label}</span>
      <code>{value || "No disponible"}</code>
    </div>
  );
}

function formatearFecha(value) {
  if (!value) return "No disponible";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

export default VerificarPage;