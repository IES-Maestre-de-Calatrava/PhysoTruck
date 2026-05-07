// src/components/stats/WeeklyStats.jsx
// ─────────────────────────────────────────────────────────────
// Tarjetas de resumen global — modelo del actualizado
// (5 métricas con acento de color y tendencia).
// ─────────────────────────────────────────────────────────────
import React from 'react';

const StatCard = ({ label, value, accent }) => (
  <div style={{
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px',
    padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '4px',
    borderTop: `3px solid ${accent || '#c8c8c8'}`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
  }}>
    <span style={{ fontSize: '11px', fontWeight: 600, color: '#a0a0a0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {label}
    </span>
    <span style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.1 }}>
      {value}
    </span>
  </div>
);

/**
 * WeeklyStats
 * @param {Array} data - Array de semanas (de BD / mock)
 */
export const WeeklyStats = ({ data }) => {
  if (!data?.length) return null;

  const totalMin  = data.reduce((a, s) => a + s.tiempo, 0);
  const avgScore  = Math.round(data.reduce((a, s) => a + s.score, 0) / data.length);
  const bestScore = Math.max(...data.map((s) => s.score));
  const totalSess = data.reduce((a, s) => a + s.sesiones, 0);
  const lastScore = data[data.length - 1].score;
  const prevScore = data[data.length - 2]?.score ?? lastScore;
  const trend     = lastScore - prevScore;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
      <StatCard label="Score actual"  value={`${lastScore} ${trend >= 0 ? `▲${trend}` : `▼${Math.abs(trend)}`}`} accent="#4f8ef7" />
      <StatCard label="Score medio"   value={avgScore}     accent="#a78bfa" />
      <StatCard label="Mejor score"   value={bestScore}    accent="#f59e0b" />
      <StatCard label="Tiempo total"  value={`${totalMin}m`} accent="#34d399" />
      <StatCard label="Sesiones"      value={totalSess}    accent="#fb7185" />
    </div>
  );
};
