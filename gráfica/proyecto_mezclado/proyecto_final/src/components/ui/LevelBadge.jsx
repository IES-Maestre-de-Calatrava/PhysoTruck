// src/components/ui/LevelBadge.jsx
// ─────────────────────────────────────────────────────────────
// Badge de nivel — modelo del actualizado (más niveles, iconos,
// score visible dentro del badge).
// ─────────────────────────────────────────────────────────────
import React from 'react';

export const LevelBadge = ({ score }) => {
  const getLevelInfo = (s) => {
    if (s >= 95) return { label: 'Nivel Élite',    icon: '🏆', color: '#b8860b', bg: '#fffbe6', border: '#e6c84a' };
    if (s >= 80) return { label: 'Nivel Avanzado', icon: '⭐', color: '#1a5fa8', bg: '#e8f2ff', border: '#7ab3f0' };
    if (s >= 65) return { label: 'En Progreso',    icon: '📈', color: '#2d7a4f', bg: '#eafaf1', border: '#6fcf97' };
    return       { label: 'Iniciando',             icon: '🌱', color: '#7c5c1e', bg: '#fef9ec', border: '#f0c97a' };
  };

  const level = getLevelInfo(score);

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '8px 20px', borderRadius: '999px',
      background: level.bg, border: `1.5px solid ${level.border}`,
      color: level.color, fontSize: '14px', fontWeight: 600, marginTop: '15px',
    }}>
      <span style={{ fontSize: '16px' }}>{level.icon}</span>
      {level.label}
      <span style={{
        background: level.border, color: level.color,
        borderRadius: '999px', padding: '1px 8px',
        fontSize: '12px', fontWeight: 700,
      }}>
        {score}
      </span>
    </div>
  );
};
