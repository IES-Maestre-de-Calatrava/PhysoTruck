import React from 'react';
import { UsageChart } from './UsageChart';

export const ChartModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', width: '80%', height: '60%' }} onClick={e => e.stopPropagation()}>
        <UsageChart data={data} />
        <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>Cerrar</button>
      </div>
    </div>
  );
};