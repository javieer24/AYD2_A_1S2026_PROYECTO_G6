import { apiRequest } from "./apiClient";

export async function obtenerTrailAuditoria(sesionId) {
  return apiRequest(`/api/audit/trail?sesion_id=${encodeURIComponent(sesionId)}`);
}

export async function obtenerEventosTelemetria(sesionId) {
  return apiRequest(`/api/telemetria/${encodeURIComponent(sesionId)}`);
}

export async function registrarEventoAuditoria({
  sesionId,
  idCandidato,
  tipoEvento,
  metadatos,
}) {
  return apiRequest("/api/audit/trail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sesion_id: Number(sesionId),
      id_candidato: idCandidato,
      tipo_evento: tipoEvento,
      metadatos,
    }),
  });
}