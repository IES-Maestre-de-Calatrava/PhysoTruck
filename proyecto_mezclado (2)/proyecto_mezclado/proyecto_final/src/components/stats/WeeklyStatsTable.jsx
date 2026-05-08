// src/components/stats/WeeklyStatsTable.jsx
// ─────────────────────────────────────────────────────────────
// Tabla de historial semanal del proyecto original.
// Compatible con el modelo de datos de la BD.
// ─────────────────────────────────────────────────────────────
import React from 'react';

/**
 * WeeklyStatsTable
 * @param {Array} data - Array de semanas (de BD / mock)
 */
export const WeeklyStatsTable = ({ data }) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
    <h3 style={{ margin: '0 0 15px 0', color: '#1f2937' }}>Historial Semanal</h3>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #eee' }}>
          <th style={{ textAlign: 'left', padding: '10px', fontSize: '13px', color: '#6b7280' }}>Semana</th>
          <th style={{ textAlign: 'right', padding: '10px', fontSize: '13px', color: '#6b7280' }}>Score</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((item) => (
          <tr key={item.semana} style={{ borderBottom: '1px solid #f9f9f9' }}>
            <td style={{ padding: '10px', fontSize: '14px' }}>Semana {item.semana}</td>
            <td style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold', fontSize: '14px' }}>{item.score} / 100</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
