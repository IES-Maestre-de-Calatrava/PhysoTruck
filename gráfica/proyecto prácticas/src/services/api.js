const API_BASE = 'http://localhost:9090';
const TOKEN_KEY = 'physiotrack_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function apiFetch(path) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    throw new Error('Sesión expirada. Inicia sesión de nuevo.');
  }
  if (!res.ok) {
    throw new Error(`Error al consultar el backend (${res.status})`);
  }
  return res.json();
}

function getEstado(score, totalEvents) {
  if (score < 50 || totalEvents > 8) return 'Muchos errores';
  if (score < 65 || totalEvents > 4) return 'Dia inestable';
  if (score < 80) return 'Buen progreso';
  return 'Progreso claro';
}

function buildDailyLogs(sessions) {
  const byDate = new Map();

  for (const session of sessions) {
    const date = session.startedAt ? session.startedAt.split('T')[0] : 'desconocido';
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(session);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, daySessions]) => {
      const scores = daySessions.map((s) => s.drivingScore ?? 0);
      const stabilities = daySessions.map((s) => s.stabilityScore ?? 0);
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const avgEstabilidad = Math.round(stabilities.reduce((a, b) => a + b, 0) / stabilities.length);
      const totalMs = daySessions.reduce((sum, s) => sum + (s.movementTime ?? 0), 0);
      const tiempoMin = Math.max(1, Math.round(totalMs / 60000));

      const colisiones = daySessions.reduce((sum, s) => {
        const ev = s.sessionEvents?.find((e) => e.eventType === 'COLLISIONS');
        return sum + (ev?.count ?? 0);
      }, 0);
      const aceleraciones = daySessions.reduce((sum, s) => {
        const ev = s.sessionEvents?.find((e) => e.eventType === 'HARSH_ACCELERATIONS');
        return sum + (ev?.count ?? 0);
      }, 0);
      const frenadas = daySessions.reduce((sum, s) => {
        const ev = s.sessionEvents?.find((e) => e.eventType === 'HARSH_STOPS');
        return sum + (ev?.count ?? 0);
      }, 0);

      return {
        fecha: date,
        score: avgScore,
        estabilidad: avgEstabilidad,
        tiempo: tiempoMin,
        estado: getEstado(avgScore, colisiones + aceleraciones + frenadas),
        eventos: { colisiones, aceleraciones, frenadas },
      };
    });
}

export async function getSesiones(patientId) {
  const progress = await apiFetch(`/api/stats/progress/${patientId}`);
  const weekNumbers = (progress.weeks ?? []).map((w) => w.week);

  const weekResults = await Promise.all(
    weekNumbers.map(async (weekNum) => {
      const sessions = await apiFetch(`/api/patients/${patientId}/sessions/week/${weekNum}`);
      const dailyLogs = buildDailyLogs(sessions);

      const totalMs = sessions.reduce((sum, s) => sum + (s.movementTime ?? 0), 0);
      const scores = sessions.map((s) => s.drivingScore ?? 0);
      const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      return {
        id: `week-${weekNum}`,
        semana: weekNum,
        score: avgScore,
        tiempo: Math.max(1, Math.round(totalMs / 60000)),
        sesiones: sessions.length,
        dailyLogs,
      };
    }),
  );

  return weekResults.sort((a, b) => a.semana - b.semana);
}
