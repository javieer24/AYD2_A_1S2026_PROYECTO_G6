// Servicio de comunicación con el backend PRCCD
// Oswaldo: este archivo centraliza TODOS los llamados al backend.
// Si el backend cambia de URL, solo cambias BASE_URL aquí.

import axios from 'axios';

const BASE_URL = '/api'; // el proxy de Vite lo redirige a http://localhost:3000/api

const http = axios.create({ baseURL: BASE_URL });

// Interceptor: agrega el token JWT en cada request si existe en localStorage
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('prccd_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Interceptor: si el backend responde 401, limpia la sesión y redirige al login
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('prccd_token');
      localStorage.removeItem('prccd_usuario');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(username, password) {
  const { data } = await http.post('/auth/login', { username, password });
  return data; // { status, token, usuario }
}

export async function getMe() {
  const { data } = await http.get('/auth/me');
  return data; // { status, usuario }
}

// ─── Ingesta ──────────────────────────────────────────────────────────────────

/**
 * Envía un expediente al backend.
 * @param {File} archivo - El archivo CSV/JSON/XML seleccionado por el usuario
 * @param {string} universidad - "USAC" | "UCR" | "UES"
 * @returns {Promise<{status, procesados, exitosos, errores}>}
 */
export async function ingestarExpediente(archivo, universidad) {
  const form = new FormData();
  form.append('archivo', archivo);
  form.append('universidad', universidad);

  const { data } = await http.post('/ingest', form);
  return data;
}
