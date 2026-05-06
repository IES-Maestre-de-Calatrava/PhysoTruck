import React from 'react';

export const WeeklyStatsTable = ({ data }) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
    <h3 style={{ margin: '0 0 15px 0' }}>Historial Semanal</h3>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #eee' }}>
          <th style={{ textAlign: 'left', padding: '10px' }}>Semana</th>
          <th style={{ textAlign: 'right', padding: '10px' }}>Score Medio</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.semana} style={{ borderBottom: '1px solid #f9f9f9' }}>
            <td style={{ padding: '10px' }}>Semana {item.semana}</td>
            <td style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold' }}>{item.scoreMedio} / 100</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);