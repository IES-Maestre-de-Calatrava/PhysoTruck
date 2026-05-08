import { useState } from 'react';
import { WeekChart } from '../charts/WeekChart';

const STATUS_STYLES = {
  'Muchos errores': { bg: '#fff1f2', text: '#be123c', dot: '#e11d48' },
  'Dia inestable': { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
  'Buen progreso': { bg: '#ecfeff', text: '#0f766e', dot: '#14b8a6' },
  'Progreso claro': { bg: '#eff6ff', text: '#1d4ed8', dot: '#2563eb' },
};

function MiniBar({ value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          flex: 1,
          height: '6px',
          background: '#e5edf6',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            height: '100%',
            background: color,
            borderRadius: '999px',
          }}
        />
      </div>
      <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', minWidth: '30px' }}>
        {value}
      </span>
    </div>
  );
}

function EventTag({ label, value }) {
  const zero = value === 0;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        padding: '8px 12px',
        minWidth: '74px',
        background: zero ? '#f0fdf4' : '#fff1f2',
        border: `1px solid ${zero ? '#bbf7d0' : '#fecdd3'}`,
        borderRadius: '10px',
      }}
    >
      <span style={{ fontSize: '18px', fontWeight: 700, color: zero ? '#059669' : '#e11d48' }}>
        {value}
      </span>
      <span style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', lineHeight: 1.2 }}>
        {label}
      </span>
    </div>
  );
}

function DayRow({ day }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_STYLES[day.estado] ?? STATUS_STYLES['Buen progreso'];

  return (
    <div
      style={{
        border: '1px solid #e5edf6',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: open ? '0 10px 25px rgba(15, 23, 42, 0.08)' : 'none',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: open ? '#f8fbff' : '#ffffff',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#10233c', minWidth: '90px' }}>
            {day.fecha}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              background: status.bg,
              color: status.text,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: status.dot,
                display: 'inline-block',
              }}
            />
            {day.estado}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{day.tiempo} min</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#10233c',
              background: '#eff6ff',
              padding: '4px 10px',
              borderRadius: '8px',
            }}
          >
            {day.score}
          </span>
          <span
            style={{
              fontSize: '16px',
              color: '#94a3b8',
              display: 'inline-block',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.25s ease',
            }}
          >
            ▾
          </span>
        </div>
      </button>

      {open ? (
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid #edf2f7',
            background: '#f8fbff',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#94a3b8',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Score
              </div>
              <MiniBar value={day.score} color="#2563eb" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#94a3b8',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Estabilidad
              </div>
              <MiniBar value={day.estabilidad} color="#14b8a6" />
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '11px',
                color: '#94a3b8',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Eventos
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <EventTag label="Colisiones" value={day.eventos.colisiones} />
              <EventTag label="Aceleraciones" value={day.eventos.aceleraciones} />
              <EventTag label="Frenadas" value={day.eventos.frenadas} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getScoreStyle(score) {
  if (score >= 90) {
    return { bg: '#eff6ff', text: '#1d4ed8' };
  }
  if (score >= 75) {
    return { bg: '#ecfeff', text: '#0f766e' };
  }
  if (score >= 60) {
    return { bg: '#fff7ed', text: '#c2410c' };
  }
  return { bg: '#fff1f2', text: '#be123c' };
}

function WeekCard({ week }) {
  const [open, setOpen] = useState(false);
  const scoreStyle = getScoreStyle(week.score);
  const firstScore = week.dailyLogs[0]?.score ?? week.score;
  const lastScore = week.dailyLogs.at(-1)?.score ?? week.score;
  const trend = lastScore - firstScore;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #dbe4f0',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: open ? '0 12px 28px rgba(15, 23, 42, 0.08)' : '0 4px 10px rgba(15, 23, 42, 0.03)',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          background: open ? '#f8fbff' : '#ffffff',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#eff6ff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Sem
          </span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#10233c', lineHeight: 1 }}>
            {week.semana}
          </span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '999px',
              background: scoreStyle.bg,
              color: scoreStyle.text,
            }}
          >
            Score {week.score}
          </span>
          <span style={{ fontSize: '12px', color: '#334155' }}>{week.tiempo} min</span>
          <span style={{ fontSize: '12px', color: '#334155' }}>{week.sesiones} sesiones</span>
          {trend !== 0 ? (
            <span
              style={{
                fontSize: '11px',
                color: trend > 0 ? '#059669' : '#e11d48',
                fontWeight: 700,
              }}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)} pts
            </span>
          ) : null}
        </div>
        <span
          style={{
            fontSize: '18px',
            color: '#94a3b8',
            display: 'inline-block',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.25s ease',
            flexShrink: 0,
          }}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div style={{ borderTop: '1px solid #edf2f7' }}>
          <div style={{ padding: '16px 20px 8px' }}>
            <p
              style={{
                fontSize: '11px',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: '0 0 10px',
              }}
            >
              Rendimiento diario
            </p>
            <WeekChart dailyLogs={week.dailyLogs} />
          </div>
          <div style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p
              style={{
                fontSize: '11px',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: '0 0 2px',
              }}
            >
              Detalle por dia
            </p>
            {week.dailyLogs.map((day, index) => (
              <DayRow key={`${week.id}-${day.fecha}-${index}`} day={day} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function WeeklyHistory({ data }) {
  if (!data?.length) {
    return null;
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#10233c' }}>Historial semanal</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
            Despliega cada semana para ver el detalle diario.
          </p>
        </div>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{data.length} semanas registradas</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.map((week) => (
          <WeekCard key={week.id} week={week} />
        ))}
      </div>
    </div>
  );
}
