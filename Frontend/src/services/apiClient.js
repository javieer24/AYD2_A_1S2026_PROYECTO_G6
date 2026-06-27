const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_API ?? "http://localhost";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

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