import { NavLink } from "react-router-dom";

function ConsoleLayout({ title, subtitle, badge, children }) {
  const links = [
    { to: "/", label: "Inicio" },
    { to: "/ingesta", label: "Ingesta universitaria" },
    { to: "/examen", label: "Examen adaptativo" },
    { to: "/certificado", label: "Certificados" },
    { to: "/dashboard", label: "Dashboard regional" },
    { to: "/verificar", label: "Verificación pública" },
    { to: "/auditoria", label: "Auditoría" }
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="rounded-2xl bg-indigo-700 px-4 py-4 text-white shadow-lg shadow-indigo-900/15">
            <strong className="block text-lg tracking-tight">PRCCD</strong>
            <span className="mt-1 block text-sm text-indigo-100">Certificación Regional SICA</span>
          </div>

          <nav className="mt-6 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

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
              <span className="inline-flex w-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">
                {badge}
              </span>
            </div>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}

export default ConsoleLayout;