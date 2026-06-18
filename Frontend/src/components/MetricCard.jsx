function MetricCard({ value, label, detail }) {
  return (
    <article className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
      <p>{detail}</p>
    </article>
  );
}

export default MetricCard;