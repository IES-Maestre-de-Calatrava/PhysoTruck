const BASE = 'http://localhost:9090/api';
const TOKEN_KEY = 'physiotrack_token';

async function apiFetch(path) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '../index.html';
    throw new Error('Sesión expirada');
  }
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export const apiGetPatients = () => apiFetch('/patients');
export const apiGetProgress = (id) => apiFetch(`/stats/progress/${id}`);
export const apiGetWeeklyStats = (id, week) => apiFetch(`/stats/weekly/${id}/${week}`);
export const apiGetSessions = (id, week) => apiFetch(`/patients/${id}/sessions/week/${week}`);
