import React from 'react';

export const WeeklyHistory = ({ data }) => {
  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Historial Semanal</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>
            <th style={{ textAlign: 'left', padding: '12px' }}>Semana</th>
            <th style={{ textAlign: 'right', padding: '12px' }}>Score Medio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '12px' }}>Semana {row.semana}</td>
              <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{row.score} / 100</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};