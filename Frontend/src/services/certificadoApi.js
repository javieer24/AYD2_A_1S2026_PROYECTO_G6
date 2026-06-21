import { apiRequest } from "./apiClient";

export async function emitirCertificado({
  idCandidato,
  sesionId,
  datosCertificado,
}) {
  return apiRequest("/api/certificate/issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_candidato: idCandidato,
      sesion_id: Number(sesionId),
      datos_certificado: datosCertificado,
    }),
  });
}

export async function verificarCertificadoPublico(hash) {
  return apiRequest(
    `/api/certificate/verify?hash=${encodeURIComponent(hash)}`
  );
}