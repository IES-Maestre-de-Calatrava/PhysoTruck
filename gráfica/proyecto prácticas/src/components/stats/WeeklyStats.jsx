import React from 'react';

export const WeeklyStats = ({ data }) => {
  const totalTiempo = data.reduce((acc, curr) => acc + curr.tiempo, 0);
  const totalSesiones = data.reduce((acc, curr) => acc + curr.sesiones, 0);
  const scoreMedio = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / data.length);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Tiempo total</p>
        <h3 style={{ margin: '5px 0 0', fontSize: '20px' }}>{totalTiempo} min</h3>
      </div>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Nº Sesiones</p>
        <h3 style={{ margin: '5px 0 0', fontSize: '20px' }}>{totalSesiones}</h3>
      </div>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Score Medio</p>
        <h3 style={{ margin: '5px 0 0', fontSize: '20px' }}>{scoreMedio} / 100</h3>
      </div>
    </div>
  );
};