import { apiRequest } from "./apiClient";

export async function obtenerEstadisticasDashboard({ carrera } = {}) {
  const params = new URLSearchParams();

  if (carrera && carrera !== "Todas") {
    params.set("carrera", carrera);
  }

  const query = params.toString();

  return apiRequest(`/api/dashboard/stats${query ? `?${query}` : ""}`, {
    method: "GET"
  });
}