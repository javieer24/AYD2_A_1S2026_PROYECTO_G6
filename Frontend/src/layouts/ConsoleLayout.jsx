import { NavLink } from "react-router-dom";

function ConsoleLayout({ title, subtitle, badge, children }) {
  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  
  const userRol = usuario?.rol || "PUBLICO"; // ← CAMBIO: sin sesión = PUBLICO

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  const links = [
    { 
      to: "/ingesta", 
      label: "Ingesta universitaria", 
      rolesPermitidos: ["ADMIN", "COORDINADOR"],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    { 
      to: "/examen", 
      label: "Examen adaptativo", 
      rolesPermitidos: ["ESTUDIANTE"],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.263 15.918a9 9 0 1 0 15.474 0M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v6.75M4.263 15.918a9.003 9.003 0 0 1 3.427-4.845m12.047 4.845a9.003 9.003 0 0 0-3.427-4.845M12 18.75h.008v.008H12v-.008Z" />
        </svg>
      )
    },
    { 
      to: "/certificado", 
      label: "Certificados", 
      rolesPermitidos: ["ADMIN", "EVALUADOR", "ESTUDIANTE"],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A5.905 5.905 0 0 1 1.75 5.153a48.221 48.221 0 0 1 20.5 0 5.906 5.906 0 0 1 4.102 4.18c-.965.234-1.851.507-2.658.814m-15.482 0A4.471 4.471 0 0 1 5.75 14h12.5a4.47 4.47 0 0 1 3.864-4.413m-15.482 0a51.986 51.986 0 0 1 7.732-1.004 51.987 51.987 0 0 1 7.732 1.004M12 4.5v3" />
        </svg>
      )
    },
    { 
      to: "/dashboard", 
      label: "Dashboard regional", 
      rolesPermitidos: ["ADMIN", "EVALUADOR", "COORDINADOR"],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
        </svg>
      )
    },
    { 
      to: "/auditoria", 
      label: "Auditoría", 
      rolesPermitidos: ["ADMIN", "EVALUADOR"],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.732 2.076 1.704m-5.8 0a48.555 48.555 0 0 1 5.8 0M4.105 6.108V16.5a2.25 2.25 0 0 0 2.25 2.25h1.395M4.105 6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 1.123-.08M4.105 6.108a48.55 48.55 0 0 1 5.8 0" />
        </svg>
      )
    },

    // ── Links solo para usuarios sin sesión (página de verificación pública) ──
    { 
      to: "/", 
      label: "Ir a inicio", 
      rolesPermitidos: ["PUBLICO"],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    { 
      to: "/login", 
      label: "Iniciar sesión", 
      rolesPermitidos: ["PUBLICO"],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
      )
    },

    // ── Cerrar sesión solo para usuarios con sesión activa ──
    { 
      to: "/", 
      label: "Cerrar Sesión", 
      rolesPermitidos: ["ADMIN", "EVALUADOR", "COORDINADOR", "ESTUDIANTE"],
      isLogout: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>
      )
    }
  ];

  const linksFiltrados = links.filter(link => link.rolesPermitidos.includes(userRol));

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 font-sans antialiased">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block flex flex-col justify-between">
          <div>
            <div className="rounded-2xl bg-indigo-700 px-4 py-4 text-white shadow-lg shadow-indigo-900/15">
              <strong className="block text-lg tracking-tight">PRCCD</strong>
              <span className="mt-1 block text-sm text-indigo-100">Certificación Regional SICA</span>
              
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-indigo-800/60 px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-indigo-200 border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {userRol === "PUBLICO" ? "Visitante" : userRol}
              </div>
            </div>

            <nav className="mt-6 space-y-1">
              {linksFiltrados.map((link) => {
                if (link.isLogout) {
                  return (
                    <NavLink
                      key={link.label}
                      to={link.to}
                      onClick={handleLogout}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition text-rose-600 hover:bg-rose-50"
                    >
                      {link.icon}
                      {link.label}
                    </NavLink>
                  );
                }

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`
                    }
                  >
                    {link.icon}
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Arquitectura</span>
            <strong className="mt-2 block text-sm text-slate-900">Microservicios + eventos</strong>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Adaptadores institucionales, normalización canónica y trazabilidad técnica.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-5 py-6 lg:px-8">
          <header className="mb-6 rounded-3xl border border-white/70 bg-white/85 px-6 py-5 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-600">MVP Fase 2</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{subtitle}</p>
              </div>
              
              {badge && (
                <span className="inline-flex w-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-200 whitespace-nowrap">
                  {badge}
                </span>
              )}
            </div>
          </header>

          {children}
        </section>

      </div>
    </main>
  );
}

export default ConsoleLayout;