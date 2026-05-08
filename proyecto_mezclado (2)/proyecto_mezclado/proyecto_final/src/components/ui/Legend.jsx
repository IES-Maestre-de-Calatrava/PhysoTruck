// src/components/ui/Legend.jsx — del proyecto original
import React from 'react';

export const Legend = () => {
  const legendItems = [
    { label: 'Excelente', color: '#28a745' },
    { label: 'Media',     color: '#ffc107' },
    { label: 'Baja',      color: '#dc3545' },
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', margin: '10px 0', justifyContent: 'center', fontSize: '14px' }}>
      {legendItems.map((item) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '50%' }} />
          <span style={{ color: '#555' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
