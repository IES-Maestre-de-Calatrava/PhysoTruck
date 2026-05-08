import { useMemo } from 'react';

function escapeCsv(value) {
  const normalized = String(value ?? '');
  if (normalized.includes(',') || normalized.includes('"') || normalized.includes('\n')) {
    return `"${normalized.replaceAll('"', '""')}"`;
  }
  return normalized;
}

function slugify(value) {
  return String(value ?? 'paciente')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function toRows(data) {
  const rows = [[
    'Semana',
    'Score semana',
    'Dia',
    'Score diario',
    'Estabilidad',
    'Tiempo (min)',
    'Estado',
    'Colisiones',
    'Aceleraciones',
    'Frenadas',
  ]];

  data?.forEach((week) => {
    week.dailyLogs?.forEach((day) => {
      rows.push([
        `Semana ${week.semana}`,
        week.score,
        day.fecha,
        day.score,
        day.estabilidad,
        day.tiempo,
        day.estado,
        day.eventos.colisiones,
        day.eventos.aceleraciones,
        day.eventos.frenadas,
      ]);
    });
  });

  return rows;
}

function downloadBlob(content, type, filename) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExportButton({ data, patientName = 'paciente' }) {
  const rows = useMemo(() => toRows(data), [data]);

  function exportToCsv() {
    const csv = rows
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n');
    downloadBlob(csv, 'text/csv;charset=utf-8;', `physiotrack_${slugify(patientName)}.csv`);
  }

  function exportToExcel() {
    const tableRows = rows
      .map((row, index) => {
        const tag = index === 0 ? 'th' : 'td';
        return `<tr>${row.map((cell) => `<${tag}>${String(cell ?? '')}</${tag}>`).join('')}</tr>`;
      })
      .join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body><table>${tableRows}</table></body></html>`;
    downloadBlob(
      html,
      'application/vnd.ms-excel;charset=utf-8;',
      `physiotrack_${slugify(patientName)}.xls`,
    );
  }

  function exportToPdf() {
    const printableRows = rows
      .slice(1)
      .map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '')}</td>`).join('')}</tr>`)
      .join('');
    const printable = window.open('', '_blank', 'width=1100,height=760');
    if (!printable) {
      return;
    }

    printable.document.write(`<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Reporte ${patientName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; color: #0f172a; }
          h1 { font-size: 18px; margin: 0 0 12px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
          th { background: #f1f5f9; }
        </style>
      </head>
      <body>
        <h1>PhysioTrack - ${patientName}</h1>
        <table>
          <thead><tr>${rows[0].map((cell) => `<th>${cell}</th>`).join('')}</tr></thead>
          <tbody>${printableRows}</tbody>
        </table>
      </body>
      </html>`);
    printable.document.close();
    printable.focus();
    printable.print();
  }

  return (
    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={exportToCsv}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 16px',
          background: '#10233c',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Exportar CSV
      </button>
      <button
        onClick={exportToExcel}
        style={{
          padding: '9px 12px',
          background: '#14532d',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Excel
      </button>
      <button
        onClick={exportToPdf}
        style={{
          padding: '9px 12px',
          background: '#7c2d12',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        PDF
      </button>
    </div>
  );
}
