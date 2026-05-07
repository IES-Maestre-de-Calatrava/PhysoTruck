// src/components/stats/WeeklyHistory.jsx
// ─────────────────────────────────────────────────────────────
// Historial semanal con acordeón:
// MODELO del proyecto actualizado (DayRow expandible, MiniBar,
// EventTag, tendencia, expandir todo)
// VISUAL de gráficas del original (WeekChart con recharts)
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { WeekChart } from '../charts/WeekChart';

const ESTADO = {
  'Muchos errores':  { bg: '#fff0f0', text: '#c0392b', dot: '#e74c3c' },
  'Día inestable':   { bg: '#fff8e6', text: '#b07d10', dot: '#f0a500' },
  'Buen progreso':   { bg: '#eafaf1', text: '#1e8449', dot: '#27ae60' },
  'Progreso claro':  { bg: '#eaf3ff', text: '#1a5fa8', dot: '#2980b9' },
};

const MiniBar = ({ value, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{ flex: 1, height: '5px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '3px' }} />
    </div>
    <span style={{ fontSize: '12px', fontWeight: 700, color: '#333', minWidth: '28px' }}>{value}</span>
  </div>
);

const EventTag = ({ label, value }) => {
  const zero = value === 0;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
      padding: '8px 12px', minWidth: '70px',
      background: zero ? '#f0faf5' : '#fff5f5',
      border: `1px solid ${zero ? '#a7f3d0' : '#fecaca'}`,
      borderRadius: '8px',
    }}>
      <span style={{ fontSize: '18px', fontWeight: 700, color: zero ? '#059669' : '#dc2626' }}>{value}</span>
      <span style={{ fontSize: '10px', color: '#777', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
    </div>
  );
};

const DayRow = ({ day }) => {
  const [open, setOpen] = useState(false);
  const est = ESTADO[day.estado] || ESTADO['Buen progreso'];

  return (
    <div style={{
      border: '1px solid #ebebeb', borderRadius: '10px', overflow: 'hidden',
      boxShadow: open ? '0 2px 12px rgba(0,0,0,0.06)' : 'none', transition: 'box-shadow 0.2s',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '10px 14px',
          background: open ? '#fafafa' : '#fff', border: 'none',
          cursor: 'pointer', textAlign: 'left', gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', minWidth: '84px' }}>{day.fecha}</span>
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
            background: est.bg, color: est.text, display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: est.dot, display: 'inline-block' }} />
            {day.estado}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>{day.tiempo} min</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', background: '#f4f4f4', padding: '2px 10px', borderRadius: '6px' }}>
            {day.score}
          </span>
          <span style={{
            fontSize: '16px', color: '#bbb', display: 'inline-block',
            transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s',
          }}>▾</span>
        </div>
      </button>

      {open && (
        <div style={{ padding: '14px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#999', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</div>
              <MiniBar value={day.score} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#999', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estabilidad</div>
              <MiniBar value={day.estabilidad} color="#10b981" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Eventos</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <EventTag label="Colisiones"    value={day.eventos.colisiones} />
              <EventTag label="Aceleraciones" value={day.eventos.aceleraciones} />
              <EventTag label="Frenadas"      value={day.eventos.frenadas} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SCORE_STYLE = (s) => {
  if (s >= 90) return { bg: '#eaf3ff', text: '#1a5fa8' };
  if (s >= 75) return { bg: '#eafaf1', text: '#1e8449' };
  if (s >= 60) return { bg: '#fff8e6', text: '#b07d10' };
  return { bg: '#fff0f0', text: '#c0392b' };
};

const WeekCard = ({ semana }) => {
  const [open, setOpen] = useState(false);
  const sc = SCORE_STYLE(semana.score);
  const trend = semana.dailyLogs[semana.dailyLogs.length - 1].score - semana.dailyLogs[0].score;

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden',
      boxShadow: open ? '0 4px 20px rgba(0,0,0,0.07)' : 'none', transition: 'box-shadow 0.25s',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', padding: '16px 20px',
          background: open ? '#fafafa' : '#fff', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: '16px', transition: 'background 0.15s',
        }}
      >
        <div style={{
          width: '42px', height: '42px', borderRadius: '10px', background: '#f4f4f4',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: '9px', color: '#aaa', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sem</span>
          <span style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{semana.semana}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', background: sc.bg, color: sc.text }}>
            Score {semana.score}
          </span>
          <span style={{ fontSize: '12px', color: '#1a1a1a' }}>{semana.tiempo} min</span>
          <span style={{ fontSize: '12px', color: '#1a1a1a' }}>{semana.sesiones} sesiones</span>
          {trend !== 0 && (
            <span style={{ fontSize: '11px', color: trend > 0 ? '#059669' : '#dc2626', fontWeight: 600 }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)} pts en la semana
            </span>
          )}
        </div>
        <span style={{
          fontSize: '18px', color: '#ccc', display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0,
        }}>▾</span>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #f0f0f0' }}>
          {/* WeekChart con recharts (visual del original) */}
          <div style={{ padding: '16px 20px 8px' }}>
            <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Rendimiento diario · semana {semana.semana}
            </p>
            <WeekChart dailyLogs={semana.dailyLogs} />
          </div>
          {/* Detalle por día */}
          <div style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              Detalle por día
            </p>
            {semana.dailyLogs.map((day, di) => (
              <DayRow key={di} day={day} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * WeeklyHistory
 * @param {Array} data - Array de semanas (de BD / mock)
 */
export const WeeklyHistory = ({ data }) => {
  if (!data?.length) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>Evaluación Semanal</h3>
        <span style={{ fontSize: '11px', color: '#aaa' }}>{data.length} semanas registradas</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.map((sem) => (
          <WeekCard key={sem.id} semana={sem} />
        ))}
      </div>
    </div>
  );
};
