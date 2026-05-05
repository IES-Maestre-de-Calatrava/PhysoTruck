import React from 'react';

export const StatsSummary = ({ data = [] }) => {
  const totalSesiones = data.length;
  const tiempoTotal = data.reduce((acc, curr) => acc + curr.tiempo, 0);
  const mediaScore = totalSesiones > 0 ? Math.round(data.reduce((a, b) => a + b.score, 0) / totalSesiones) : 0;

  const cardStyle = { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
      <div style={cardStyle}><div>Tiempo total</div><div style={{fontWeight: 'bold', fontSize: '20px'}}>{tiempoTotal} min</div></div>
      <div style={cardStyle}><div>Nº Sesiones</div><div style={{fontWeight: 'bold', fontSize: '20px'}}>{totalSesiones}</div></div>
      <div style={cardStyle}><div>Score Medio</div><div style={{fontWeight: 'bold', fontSize: '20px'}}>{mediaScore} / 100</div></div>
    </div>
  );
};