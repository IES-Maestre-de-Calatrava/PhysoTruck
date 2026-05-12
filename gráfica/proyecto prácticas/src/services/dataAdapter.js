const EMPTY_EVENTS = Object.freeze({
  colisiones: 0,
  aceleraciones: 0,
  frenadas: 0,
});

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function average(values) {
  const valid = values.map(toNumber);
  if (!valid.length) {
    return 0;
  }
  const total = valid.reduce((sum, value) => sum + value, 0);
  return total / valid.length;
}

function round(value) {
  return Math.round(toNumber(value));
}

function toMinutes(milliseconds) {
  const numeric = toNumber(milliseconds);
  if (numeric <= 0) {
    return 0;
  }

  const minutes = numeric / 60000;
  if (minutes > 0 && minutes < 1) {
    return 1;
  }
  return Math.round(minutes);
}

function getStatusFromScore(score) {
  if (score < 60) {
    return 'Muchos errores';
  }
  if (score < 70) {
    return 'Dia inestable';
  }
  if (score < 85) {
    return 'Buen progreso';
  }
  return 'Progreso claro';
}

function capitalize(value) {
  if (!value) {
    return '';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDayLabel(date) {
  return capitalize(
    new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date),
  );
}

function normalizeEventType(eventType = '') {
  const normalized = String(eventType).toLowerCase();
  if (normalized.includes('colis')) {
    return 'colisiones';
  }
  if (normalized.includes('aceler') || normalized.includes('acceler')) {
    return 'aceleraciones';
  }
  if (
    normalized.includes('fren')
    || normalized.includes('brak')
    || normalized.includes('stop')
    || normalized.includes('parad')
  ) {
    return 'frenadas';
  }
  return null;
}

function extractEvents(session) {
  if (session?.eventos) {
    return {
      colisiones: toNumber(session.eventos.colisiones),
      aceleraciones: toNumber(session.eventos.aceleraciones),
      frenadas: toNumber(session.eventos.frenadas),
    };
  }

  if (!Array.isArray(session?.sessionEvents)) {
    return { ...EMPTY_EVENTS };
  }

  return session.sessionEvents.reduce(
    (accumulator, event) => {
      const key = normalizeEventType(event?.eventType);
      if (!key) {
        return accumulator;
      }

      return {
        ...accumulator,
        [key]: accumulator[key] + toNumber(event?.count),
      };
    },
    { ...EMPTY_EVENTS },
  );
}

function buildFallbackDay(progressWeek) {
  const score = round(progressWeek?.avgDrivingScore);
  return {
    fecha: 'Sin detalle',
    tiempo: 0,
    sesiones: progressWeek?.sessionCount ?? 0,
    score,
    estabilidad: round(progressWeek?.avgStabilityScore),
    estado: getStatusFromScore(score),
    eventos: { ...EMPTY_EVENTS },
  };
}

function buildDailyLogs(sessions = []) {
  const days = new Map();

  sessions.forEach((session) => {
    if (!session) {
      return;
    }

    const sessionDate = session.startedAt ? new Date(session.startedAt) : null;
    const key = sessionDate && !Number.isNaN(sessionDate.getTime())
      ? getLocalDateKey(sessionDate)
      : `session-${session.id ?? Math.random()}`;

    if (!days.has(key)) {
      days.set(key, {
        key,
        date: sessionDate,
        sessions: [],
      });
    }

    days.get(key).sessions.push(session);
  });

  return [...days.values()]
    .sort((left, right) => {
      if (!left.date && !right.date) {
        return 0;
      }
      if (!left.date) {
        return 1;
      }
      if (!right.date) {
        return -1;
      }
      return left.date.getTime() - right.date.getTime();
    })
    .map((day) => {
      const totalMovementTime = day.sessions.reduce(
        (sum, session) => sum + toNumber(session.movementTime),
        0,
      );
      const score = round(average(day.sessions.map((session) => session.drivingScore)));
      const estabilidad = round(
        average(day.sessions.map((session) => session.stabilityScore)),
      );
      const eventos = day.sessions.reduce(
        (accumulator, session) => {
          const current = extractEvents(session);
          return {
            colisiones: accumulator.colisiones + current.colisiones,
            aceleraciones: accumulator.aceleraciones + current.aceleraciones,
            frenadas: accumulator.frenadas + current.frenadas,
          };
        },
        { ...EMPTY_EVENTS },
      );

      return {
        fecha: day.date ? getDayLabel(day.date) : 'Sin fecha',
        tiempo: toMinutes(totalMovementTime),
        sesiones: day.sessions.length,
        score,
        estabilidad,
        estado: getStatusFromScore(score),
        eventos,
      };
    });
}

export function adaptSessionsToWeeklyLogs(sessionsByWeek = [], progressWeeks = []) {
  const progressByWeek = new Map(
    progressWeeks.map((week) => [week.week, week]),
  );
  const sessionsMap = new Map(
    sessionsByWeek.map((entry) => [entry.week, Array.isArray(entry.sessions) ? entry.sessions : []]),
  );

  const allWeeks = [...new Set([
    ...progressWeeks.map((week) => week.week),
    ...sessionsByWeek.map((entry) => entry.week),
  ])]
    .filter((week) => Number.isFinite(Number(week)))
    .sort((left, right) => left - right);

  return allWeeks.map((week) => {
    const progressWeek = progressByWeek.get(week);
    const sessions = sessionsMap.get(week) ?? [];
    const dailyLogs = buildDailyLogs(sessions);
    const fallbackLogs = dailyLogs.length
      ? dailyLogs
      : [buildFallbackDay(progressWeek)];

    const totalTimeMs = sessions.reduce(
      (sum, session) => sum + toNumber(session.movementTime),
      0,
    );
    const weeklyScore = round(
      progressWeek?.avgDrivingScore ?? average(sessions.map((session) => session.drivingScore)),
    );
    const weeklyStability = round(
      progressWeek?.avgStabilityScore
        ?? average(sessions.map((session) => session.stabilityScore)),
    );

    return {
      id: week,
      semana: week,
      sesiones: progressWeek?.sessionCount ?? sessions.length,
      score: weeklyScore,
      tiempo: toMinutes(totalTimeMs),
      estabilidad: weeklyStability,
      level: progressWeek?.level ?? sessions.at(-1)?.drivingLevel ?? null,
      dailyLogs: fallbackLogs,
    };
  });
}
