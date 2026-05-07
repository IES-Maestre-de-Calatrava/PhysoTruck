import React from 'react';

export const ExportButton = ({ data, patientName = 'paciente' }) => {
  const exportToCSV = () => {
    const headers = ["Semana,Sesiones,Score,Tiempo"];
    const csvContent = data.map(d => `${d.semana},${d.sesiones},${d.score},${d.tiempo}`).join("\n");
    const blob = new Blob([headers + "\n" + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datos_${patientName.toLowerCase()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportToCSV}
      style={{
        padding: '8px 16px', borderRadius: '8px',
        border: '1px solid #ccd4e4', background: '#fff',
        cursor: 'pointer', fontWeight: '500', fontSize: '14px',
        color: '#2d4163', transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.target.style.background = '#f0f4f9'}
      onMouseLeave={e => e.target.style.background = '#fff'}
    >
      📄 Exportar CSV
    </button>
  );
};
