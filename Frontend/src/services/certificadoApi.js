import { apiRequest } from "./apiClient";

const API_BASE_URL = "http://localhost";

async function publicRequest(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export async function emitirCertificado({ idCandidato, sesionId, datosCertificado }) {
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
  return publicRequest(`/api/certificate/verify?hash=${encodeURIComponent(hash)}`);
}