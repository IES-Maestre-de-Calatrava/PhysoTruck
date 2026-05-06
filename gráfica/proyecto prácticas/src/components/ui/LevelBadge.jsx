import React from 'react';

export const LevelBadge = ({ score }) => {
  const getLevelInfo = (s) => {
    if (s < 50) return { label: 'En progreso', color: '#ef4444' }; // Rojo
    if (s < 80) return { label: 'Competente', color: '#3b82f6' }; // Azul
    return { label: 'Experto', color: '#22c55e' }; // Verde
  };

  const { label, color } = getLevelInfo(score);

  return (
    // He añadido marginTop aquí para separarlo del título de arriba
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      padding: '8px 16px', 
      borderRadius: '20px', 
      backgroundColor: `${color}15`, 
      border: `1px solid ${color}`,
      color: color,
      fontWeight: 'bold',
      fontSize: '14px',
      marginTop: '15px' // <--- ESTO ES LO NUEVO
    }}>
      <span style={{ 
        width: '8px', 
        height: '8px', 
        borderRadius: '50%', 
        backgroundColor: color, 
        marginRight: '8px' 
      }}></span>
      {label} ({score} pts)
    </div>
  );
};