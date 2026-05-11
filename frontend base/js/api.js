const API_BASE_URL = "http://localhost:9090";
const TOKEN_STORAGE_KEY = "physiotrack_token";
const USER_STORAGE_KEY = "physiotrack_user_email";

async function apiLogin(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error("Usuario o contrasena incorrectos");
  }

  const data = await response.json();
  if (!data?.token) {
    throw new Error("Respuesta de login invalida");
  }

  return data.token;
}

function saveAuth(token, email, rememberUser) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  if (rememberUser) {
    localStorage.setItem(USER_STORAGE_KEY, email);
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

function getRememberedUser() {
  return localStorage.getItem(USER_STORAGE_KEY) || "";
}

function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function clearAuth() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    clearAuth();
    throw new Error("Sesion expirada. Inicia sesion de nuevo.");
  }

  if (!response.ok) {
    throw new Error("Error al consultar el backend");
  }

  return response;
}

async function apiGetPatients() {
  const response = await apiRequest("/api/patients");
  return response.json();
}

async function apiGetPatientById(id) {
  const response = await apiRequest(`/api/patients/${id}`);
  return response.json();
}

async function apiGetWeeklyStats(patientId, week) {
  const response = await apiRequest(`/api/stats/weekly/${patientId}/${week}`);
  return response.json();
}

async function apiGetProgress(patientId) {
  const response = await apiRequest(`/api/stats/progress/${patientId}`);
  return response.json();
}

async function apiGetWeeklySessions(patientId, week) {
  const response = await apiRequest(`/api/patients/${patientId}/sessions/week/${week}`);
  return response.json();
}

async function apiGetMe() {
  const response = await apiRequest("/api/auth/me");
  return response.json();
}
