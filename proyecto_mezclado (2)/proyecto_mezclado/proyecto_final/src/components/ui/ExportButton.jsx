// src/components/ui/ExportButton.jsx
// ─────────────────────────────────────────────────────────────
// Exportación CSV — modelo del actualizado (incluye dailyLogs
// con todos los campos de la BD).
// ─────────────────────────────────────────────────────────────
import React from 'react';

/**
 * ExportButton
 * @param {Array} data - Array de semanas (de BD / mock)
 */
export const ExportButton = ({ data }) => {
  const exportToCSV = () => {
    const rows = [['Semana', 'Score semana', 'Día', 'Score', 'Estabilidad', 'Tiempo (min)', 'Estado', 'Colisiones', 'Aceleraciones', 'Frenadas']];
    data?.forEach((sem) => {
      sem.dailyLogs?.forEach((d) => {
        rows.push([
          `Semana ${sem.semana}`, sem.score, d.fecha, d.score,
          d.estabilidad, d.tiempo, d.estado,
          d.eventos.colisiones, d.eventos.aceleraciones, d.eventos.frenadas,
        ]);
      });
    });
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'alberto_progreso.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportToCSV}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '8px 18px', background: '#1f2937', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '13px',
        fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s',
      }}
    >
      ↓ Exportar CSV
    </button>
  );
};
