import { Link } from "react-router-dom";

function ModuleCard({ title, description, route, label, status }) {
  return (
    <Link className="module-card" to={route}>
      <div className="module-card__top">
        <span>{label}</span>
        <small>{status}</small>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}

export default ModuleCard;