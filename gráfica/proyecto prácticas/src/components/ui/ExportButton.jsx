import React from 'react';

export const ExportButton = ({ data }) => {
  const exportToCSV = () => {
    const headers = ["Semana,Sesiones,Score,Tiempo"];
    const csvContent = data.map(d => `${d.semana},${d.sesiones},${d.score},${d.tiempo}`).join("\n");
    const blob = new Blob([headers + "\n" + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos_alberto.csv';
    a.click();
  };

  return (
    <button 
      onClick={exportToCSV}
      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: '500' }}
    >
      📄 Exportar CSV
    </button>
  );
};