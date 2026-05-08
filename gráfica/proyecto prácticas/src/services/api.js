import { adaptSessionsToWeeklyLogs } from './dataAdapter';
import { mockSesiones } from '../data/mockDailyData';

export const TOKEN_KEY = 'physiotrack_token';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9090/api';

async function delay(milliseconds) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    Accept: 'application/json',
    ...(options.headers ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    throw new Error(`Sesion no autorizada para ${path}. Vuelve a iniciar sesion.`);
  }

  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar ${path}.`);
  }

  return response.json();
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function getPatients() {
  if (USE_MOCK) {
    await delay(150);
    return [
      {
        id: 1,
        fullName: 'Paciente demo',
        currentLevel: 'Competente',
        active: true,
      },
    ];
  }

  return apiFetch('/patients');
}

export async function getPatient(patientId) {
  if (USE_MOCK) {
    await delay(100);
    return {
      id: Number(patientId) || 1,
      fullName: 'Paciente demo',
      currentLevel: 'Competente',
      active: true,
    };
  }

  return apiFetch(`/patients/${patientId}`);
}

export async function getProgress(patientId) {
  if (USE_MOCK) {
    await delay(100);
    return {
      patientId,
      weeks: mockSesiones.map((week) => ({
        week: week.semana,
        sessionCount: week.sesiones,
        avgDrivingScore: week.score,
        avgStabilityScore: week.estabilidad ?? 0,
        level: week.level ?? null,
      })),
    };
  }

  return apiFetch(`/stats/progress/${patientId}`);
}

export async function getWeeklySessions(patientId, week) {
  if (USE_MOCK) {
    await delay(100);
    const selectedWeek = mockSesiones.find((entry) => entry.semana === week);
    return selectedWeek?.dailyLogs ?? [];
  }

  return apiFetch(`/patients/${patientId}/sessions/week/${week}`);
}

export async function getSesiones(patientId) {
  if (!patientId && !USE_MOCK) {
    throw new Error('No se ha recibido un paciente valido para cargar el dashboard.');
  }

  if (USE_MOCK) {
    await delay(250);
    return mockSesiones;
  }

  const [patient, progress] = await Promise.all([
    getPatient(patientId),
    getProgress(patientId),
  ]);

  const weeks = Array.isArray(progress?.weeks) ? progress.weeks : [];
  const sessionsByWeek = await Promise.all(
    weeks.map(async (week) => {
      try {
        const sessions = await getWeeklySessions(patient.id, week.week);
        return { week: week.week, sessions };
      } catch (_) {
        return { week: week.week, sessions: [] };
      }
    }),
  );

  return adaptSessionsToWeeklyLogs(sessionsByWeek, weeks, patient?.treatmentStart);
}
