// src/data/mockDailyData.js
// ─────────────────────────────────────────────────────────────
// Datos mock para desarrollo. Cuando conectes la BD real,
// estos datos dejarán de usarse (USE_MOCK = false en api.js).
//
// Estructura exactamente igual a lo que devolverá tu API,
// así el cambio a producción será transparente.
// ─────────────────────────────────────────────────────────────

export const mockSesiones = [
  {
    id: 1,
    semana: 1,
    sesiones: 5,
    score: 74,
    tiempo: 155,
    dailyLogs: [
      { fecha: 'Lunes',     tiempo: 30, sesiones: 1, score: 62, estabilidad: 70, estado: 'Día inestable',  eventos: { colisiones: 6, aceleraciones: 4, frenadas: 2 } },
      { fecha: 'Martes',    tiempo: 35, sesiones: 1, score: 75, estabilidad: 80, estado: 'Buen progreso',  eventos: { colisiones: 2, aceleraciones: 1, frenadas: 1 } },
      { fecha: 'Miércoles', tiempo: 25, sesiones: 1, score: 68, estabilidad: 75, estado: 'Buen progreso',  eventos: { colisiones: 3, aceleraciones: 2, frenadas: 2 } },
      { fecha: 'Jueves',    tiempo: 40, sesiones: 1, score: 82, estabilidad: 85, estado: 'Progreso claro', eventos: { colisiones: 1, aceleraciones: 1, frenadas: 0 } },
      { fecha: 'Viernes',   tiempo: 25, sesiones: 1, score: 85, estabilidad: 88, estado: 'Progreso claro', eventos: { colisiones: 0, aceleraciones: 1, frenadas: 1 } },
    ],
  },
  {
    id: 2,
    semana: 2,
    sesiones: 5,
    score: 58,
    tiempo: 85,
    dailyLogs: [
      { fecha: 'Lunes',     tiempo: 15, sesiones: 1, score: 50, estabilidad: 60, estado: 'Muchos errores', eventos: { colisiones: 8, aceleraciones: 5, frenadas: 4 } },
      { fecha: 'Martes',    tiempo: 15, sesiones: 1, score: 55, estabilidad: 65, estado: 'Día inestable',  eventos: { colisiones: 5, aceleraciones: 3, frenadas: 2 } },
      { fecha: 'Miércoles', tiempo: 15, sesiones: 1, score: 60, estabilidad: 70, estado: 'Buen progreso',  eventos: { colisiones: 2, aceleraciones: 2, frenadas: 1 } },
      { fecha: 'Jueves',    tiempo: 20, sesiones: 1, score: 62, estabilidad: 72, estado: 'Buen progreso',  eventos: { colisiones: 2, aceleraciones: 1, frenadas: 1 } },
      { fecha: 'Viernes',   tiempo: 20, sesiones: 1, score: 65, estabilidad: 75, estado: 'Buen progreso',  eventos: { colisiones: 1, aceleraciones: 1, frenadas: 1 } },
    ],
  },
  {
    id: 3,
    semana: 3,
    sesiones: 5,
    score: 88,
    tiempo: 210,
    dailyLogs: [
      { fecha: 'Lunes',     tiempo: 40, sesiones: 1, score: 82, estabilidad: 85, estado: 'Progreso claro', eventos: { colisiones: 1, aceleraciones: 1, frenadas: 0 } },
      { fecha: 'Martes',    tiempo: 45, sesiones: 1, score: 85, estabilidad: 87, estado: 'Progreso claro', eventos: { colisiones: 0, aceleraciones: 1, frenadas: 1 } },
      { fecha: 'Miércoles', tiempo: 35, sesiones: 1, score: 90, estabilidad: 92, estado: 'Progreso claro', eventos: { colisiones: 0, aceleraciones: 0, frenadas: 0 } },
      { fecha: 'Jueves',    tiempo: 50, sesiones: 1, score: 92, estabilidad: 94, estado: 'Progreso claro', eventos: { colisiones: 0, aceleraciones: 0, frenadas: 0 } },
      { fecha: 'Viernes',   tiempo: 40, sesiones: 1, score: 91, estabilidad: 93, estado: 'Progreso claro', eventos: { colisiones: 1, aceleraciones: 0, frenadas: 0 } },
    ],
  },
  {
    id: 4,
    semana: 4,
    sesiones: 5,
    score: 96,
    tiempo: 250,
    dailyLogs: [
      { fecha: 'Lunes',     tiempo: 50, sesiones: 1, score: 94, estabilidad: 95,  estado: 'Progreso claro', eventos: { colisiones: 0, aceleraciones: 0, frenadas: 0 } },
      { fecha: 'Martes',    tiempo: 50, sesiones: 1, score: 95, estabilidad: 96,  estado: 'Progreso claro', eventos: { colisiones: 0, aceleraciones: 0, frenadas: 0 } },
      { fecha: 'Miércoles', tiempo: 50, sesiones: 1, score: 97, estabilidad: 98,  estado: 'Progreso claro', eventos: { colisiones: 0, aceleraciones: 0, frenadas: 0 } },
      { fecha: 'Jueves',    tiempo: 50, sesiones: 1, score: 98, estabilidad: 99,  estado: 'Progreso claro', eventos: { colisiones: 0, aceleraciones: 0, frenadas: 0 } },
      { fecha: 'Viernes',   tiempo: 50, sesiones: 1, score: 99, estabilidad: 100, estado: 'Progreso claro', eventos: { colisiones: 0, aceleraciones: 0, frenadas: 0 } },
    ],
  },
];

// Alias de compatibilidad con código antiguo
export const mockDailyData = mockSesiones.reduce((acc, sem) => {
  acc[String(sem.id)] = sem.dailyLogs;
  return acc;
}, {});
