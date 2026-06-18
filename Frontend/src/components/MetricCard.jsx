function MetricCard({ value, label, detail }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <strong className="block text-3xl font-black tracking-tight text-indigo-700">{value}</strong>
      <span className="mt-2 block text-sm font-black text-slate-950">{label}</span>
      <p className="mt-1 text-sm leading-5 text-slate-500">{detail}</p>
    </article>
  );
}

export default MetricCard;