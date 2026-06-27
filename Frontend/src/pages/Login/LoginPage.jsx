import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [modo, setModo] = useState("staff");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [idCandidato, setIdCandidato] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [universidad, setUniversidad] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL_API;

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      let res;
      if (modo === "staff") {
        res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
      } else {
        res = await fetch(`${API_URL}/api/auth/confirmar-identidad`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_candidato: idCandidato,
            nombre_completo: nombreCompleto,
            universidad_origen: universidad,
          }),
        });
      }

      const data = await res.json();

      if (data.status === "ok") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        const rol = data.usuario.rol;

        if (rol === "ADMIN" || rol === "EVALUADOR") {
          navigate("/dashboard");
        } else if (rol === "COORDINADOR") {
          navigate("/ingesta");
        } else if (rol === "ESTUDIANTE") {
          navigate("/examen");
        } else {
          navigate("/home");
        }
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen w-screen flex bg-slate-50 overflow-hidden font-sans antialiased">
      {/* Panel izquierdo */}
      <section className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-emerald-800 via-green-700 to-teal-900 text-white p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 uppercase tracking-[0.2em] text-emerald-200 font-semibold text-xs bg-emerald-900/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            PRCCD / SICA
          </span>

          <h1 className="text-5xl xl:text-6xl font-extrabold mt-12 leading-[1.15] tracking-tight text-white drop-shadow-sm">
            Sistema de
            <span className="block text-emerald-300 bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Certificación
            </span>
          </h1>

          <p className="mt-6 text-lg text-emerald-100/90 max-w-md leading-relaxed font-normal">
            Plataforma centralizada para la gestión, emisión y verificación
            auditable de certificaciones académicas en la región.
          </p>
        </div>

        <div className="relative z-10 border-t border-emerald-600/30 pt-6">
          <p className="text-emerald-200/70 text-xs tracking-wide">
            © 2026 Sistema de Certificación Académica. Todos los derechos
            reservados.
          </p>
        </div>
      </section>

      {/* Panel derecho */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-md bg-white lg:bg-transparent p-8 sm:p-10 lg:p-0 rounded-3xl shadow-xl shadow-slate-200/50 lg:shadow-none border border-slate-100 lg:border-none">
          {/* Volver */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Volver al inicio
            </Link>
          </div>

          {/* Título */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Ingresar al Sistema
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Por favor, introduce tus credenciales de acceso.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setModo("staff");
                setError("");
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                modo === "staff"
                  ? "bg-white shadow text-slate-800"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Staff / Admin
            </button>
            <button
              onClick={() => {
                setModo("candidato");
                setError("");
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                modo === "candidato"
                  ? "bg-white shadow text-slate-800"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Candidato
            </button>
          </div>

          {/* Formulario */}
          <div className="space-y-5">
            {/* Staff */}
            {modo === "staff" && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Usuario
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Contraseña
                    </label>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 text-sm"
                  />
                </div>
              </>
            )}

            {/* Candidato */}
            {modo === "candidato" && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    ID Candidato
                  </label>
                  <input
                    type="text"
                    value={idCandidato}
                    onChange={(e) => setIdCandidato(e.target.value)}
                    placeholder="USAC-2024-001"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    placeholder="Maria Lopez"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Universidad
                  </label>
                  <select
                    value={universidad}
                    onChange={(e) => setUniversidad(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 text-sm"
                  >
                    <option value="">Selecciona tu universidad</option>
                    <option value="USAC">USAC — Guatemala</option>
                    <option value="UCR">UCR — Costa Rica</option>
                    <option value="UES">UES — El Salvador</option>
                  </select>
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3.5 flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* Botón */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium text-sm shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Autenticando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
