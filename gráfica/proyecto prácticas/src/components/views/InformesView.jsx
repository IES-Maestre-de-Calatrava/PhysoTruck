import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTokens } from '../../design/tokens';

/* ─── helpers ───────────────────────────────────────────────────── */

function slugify(v) {
  return String(v ?? 'paciente').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function toRows(data) {
  const header = ['Semana', 'Score semana', 'Día', 'Score diario', 'Estabilidad',
    'Tiempo (min)', 'Estado', 'Colisiones', 'Aceleraciones', 'Frenadas'];
  const rows = [header];
  data?.forEach((week) => {
    week.dailyLogs?.forEach((day) => {
      rows.push([
        `Semana ${week.semana}`, week.score, day.fecha,
        day.score, day.estabilidad, day.tiempo, day.estado,
        day.eventos.colisiones, day.eventos.aceleraciones, day.eventos.frenadas,
      ]);
    });
  });
  return rows;
}

function downloadBlob(content, type, filename) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function exportExcel(rows, patientName) {
  const trs = rows.map((row, i) => {
    const tag = i === 0 ? 'th' : 'td';
    return `<tr>${row.map((c) => `<${tag}>${String(c ?? '')}</${tag}>`).join('')}</tr>`;
  }).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><table>${trs}</table></body></html>`;
  downloadBlob(html, 'application/vnd.ms-excel;charset=utf-8;', `physiotrack_${slugify(patientName)}.xls`);
}

function exportPdf(rows, patientName) {
  const bodyRows = rows.slice(1)
    .map((r) => `<tr>${r.map((c) => `<td>${String(c ?? '')}</td>`).join('')}</tr>`).join('');
  const win = window.open('', '_blank', 'width=1100,height=760');
  if (!win) return;
  win.document.write(`<!doctype html><html>
    <head><meta charset="utf-8"/><title>Reporte ${patientName}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      body{font-family:'Inter',Arial,sans-serif;padding:32px;color:#0F172A;background:#FFFFFF}
      h1{font-size:20px;margin:0 0 6px;color:#0F172A;font-weight:800}
      .meta{font-size:12px;color:#64748B;margin-bottom:24px}
      .badge{display:inline-block;padding:4px 10px;background:#EEF2FF;color:#4338CA;border-radius:999px;font-size:11px;font-weight:700;margin-bottom:20px}
      table{border-collapse:collapse;width:100%;font-size:12px}
      th,td{border:1px solid #E2E8F0;padding:8px 12px;text-align:left}
      th{background:#F8FAFC;font-weight:700;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
      tr:nth-child(even) td{background:#F8FAFC}
      td:nth-child(2){font-weight:700;color:#6366F1}
    </style></head>
    <body>
      <h1>PhysioTrack</h1>
      <div class="meta">Informe de ${patientName} · Generado el ${new Date().toLocaleDateString('es-ES', { dateStyle: 'long' })}</div>
      <table>
        <thead><tr>${rows[0].map((c) => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </body></html>`);
  win.document.close(); win.focus(); win.print();
}

/* ─── componente ─────────────────────────────────────────────────── */

export function InformesView({ weeks, patientName }) {
  const t = useTokens();

  const allWeekNums = useMemo(() => weeks.map((w) => w.semana), [weeks]);
  const allDates = useMemo(() => {
    const dates = [];
    weeks.forEach((w) => w.dailyLogs?.forEach((d) => dates.push(d.fecha)));
    return [...new Set(dates)].sort();
  }, [weeks]);

  const minWeek = allWeekNums[0] ?? 1;
  const maxWeek = allWeekNums.at(-1) ?? 1;
  const minDate = allDates[0] ?? '';
  const maxDate = allDates.at(-1) ?? '';

  const [filterType, setFilterType] = useState('semana');
  const [fromWeek, setFromWeek]     = useState(minWeek);
  const [toWeek, setToWeek]         = useState(maxWeek);
  const [fromDate, setFromDate]     = useState(minDate);
  const [toDate, setToDate]         = useState(maxDate);

  const filteredData = useMemo(() => {
    if (filterType === 'semana') {
      return weeks.filter((w) => w.semana >= fromWeek && w.semana <= toWeek);
    }
    return weeks
      .map((w) => ({ ...w, dailyLogs: (w.dailyLogs ?? []).filter((d) => d.fecha >= fromDate && d.fecha <= toDate) }))
      .filter((w) => w.dailyLogs.length > 0);
  }, [weeks, filterType, fromWeek, toWeek, fromDate, toDate]);

  const totalSessions = filteredData.reduce((s, w) => s + w.sesiones, 0);
  const totalDays     = filteredData.reduce((s, w) => s + (w.dailyLogs?.length ?? 0), 0);
  const rows          = useMemo(() => toRows(filteredData), [filteredData]);
  const hasData       = rows.length > 1;

  const inputStyle = {
    padding: '9px 14px',
    border: `1px solid ${t.inputBorder}`,
    borderRadius: '10px',
    fontSize: '14px',
    color: t.text,
    background: t.inputBg,
    outline: 'none',
    minWidth: '130px',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease',
  };

  const segBtn = (active) => ({
    padding: '8px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '13px',
    fontFamily: 'inherit',
    background: active ? 'linear-gradient(135deg,#6366F1,#4F46E5)' : 'transparent',
    color: active ? '#ffffff' : t.textMuted,
    transition: 'all 0.15s ease',
    boxShadow: active ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
  });

  const SUMMARY_ITEMS = [
    { label: 'Semanas',       value: filteredData.length, color: t.primary,  bg: t.primaryBg  },
    { label: 'Sesiones',      value: totalSessions,        color: t.teal,     bg: t.tealBg     },
    { label: 'Días con datos',value: totalDays,            color: t.success,  bg: t.successBg  },
    { label: 'Filas a exportar', value: Math.max(0, rows.length - 1), color: t.warning, bg: t.warningBg },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      {/* Header */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
          Exportación de datos
        </div>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: t.text, letterSpacing: '-0.5px' }}>
          Informes
        </h1>
      </div>

      {/* Filter card */}
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: '20px',
          padding: '28px',
          boxShadow: t.cardShadow,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Section heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: t.primaryBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.primary,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: t.text }}>Rango de datos</div>
            <div style={{ fontSize: '12px', color: t.textMuted }}>Selecciona el período a incluir en el informe</div>
          </div>
        </div>

        {/* Segmented control */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: t.textMuted, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Tipo de rango
          </div>
          <div
            style={{
              display: 'inline-flex',
              background: t.cardBgAlt,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: '12px',
              padding: '4px',
              gap: '2px',
            }}
          >
            <button style={segBtn(filterType === 'semana')} onClick={() => setFilterType('semana')}>Por semana</button>
            <button style={segBtn(filterType === 'dia')}    onClick={() => setFilterType('dia')}>Por día</button>
          </div>
        </div>

        {/* Range inputs */}
        {filterType === 'semana' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: t.textSec }}>Desde semana</label>
              <select value={fromWeek} onChange={(e) => setFromWeek(Number(e.target.value))} style={inputStyle}>
                {allWeekNums.map((n) => <option key={n} value={n}>Semana {n}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: t.textSec }}>Hasta semana</label>
              <select value={toWeek} onChange={(e) => setToWeek(Number(e.target.value))} style={inputStyle}>
                {allWeekNums.filter((n) => n >= fromWeek).map((n) => <option key={n} value={n}>Semana {n}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: t.textSec }}>Desde fecha</label>
              <input type="date" value={fromDate} min={minDate} max={toDate} onChange={(e) => setFromDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: t.textSec }}>Hasta fecha</label>
              <input type="date" value={toDate} min={fromDate} max={maxDate} onChange={(e) => setToDate(e.target.value)} style={inputStyle} />
            </div>
          </div>
        )}

        {/* Summary chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          {SUMMARY_ITEMS.map(({ label, value, color, bg }) => (
            <div
              key={label}
              style={{
                background: bg,
                borderRadius: '14px',
                padding: '14px 16px',
                border: `1px solid ${color}30`,
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>
                {label}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export card */}
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: '20px',
          padding: '28px',
          boxShadow: t.cardShadow,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: t.successBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.success,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: t.text }}>Exportar informe</div>
            <div style={{ fontSize: '12px', color: t.textMuted }}>Solo incluye el rango seleccionado arriba</div>
          </div>
        </div>

        {!hasData && (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: t.warningBg,
              border: `1px solid ${t.warning}40`,
              fontSize: '13px',
              color: t.warningText,
              marginBottom: '16px',
              fontWeight: 500,
            }}
          >
            No hay datos en el rango seleccionado para exportar.
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            disabled={!hasData}
            onClick={() => exportExcel(rows, patientName)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 22px',
              background: hasData ? 'linear-gradient(135deg,#10B981,#059669)' : t.cardBgAlt,
              color: hasData ? '#ffffff' : t.textMuted,
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px', fontWeight: 700,
              cursor: hasData ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              boxShadow: hasData ? '0 4px 12px rgba(16,185,129,0.25)' : 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { if (hasData) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Exportar Excel
          </button>

          <button
            disabled={!hasData}
            onClick={() => exportPdf(rows, patientName)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 22px',
              background: hasData ? 'linear-gradient(135deg,#EF4444,#DC2626)' : t.cardBgAlt,
              color: hasData ? '#ffffff' : t.textMuted,
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px', fontWeight: 700,
              cursor: hasData ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              boxShadow: hasData ? '0 4px 12px rgba(239,68,68,0.25)' : 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { if (hasData) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>
            </svg>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Data preview */}
      {filteredData.length > 0 && (
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: '20px',
            padding: '24px',
            boxShadow: t.cardShadow,
            overflowX: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div
              style={{
                width: '32px', height: '32px', borderRadius: '9px',
                background: t.tealBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: t.teal,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/><line x1="15" y1="9" x2="15" y2="21"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: t.text }}>Vista previa</div>
              <div style={{ fontSize: '12px', color: t.textMuted }}>Primeras 20 filas del rango seleccionado</div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', whiteSpace: 'nowrap' }}>
            <thead>
              <tr>
                {rows[0].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '9px 12px',
                      textAlign: 'left',
                      background: t.cardBgAlt,
                      borderBottom: `2px solid ${t.cardBorder}`,
                      fontWeight: 700,
                      color: t.textMuted,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1, 21).map((row, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: `1px solid ${t.divider}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = t.cardBgAlt; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '9px 12px', color: j === 1 ? t.primary : t.text, fontWeight: j === 1 ? 700 : 400 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length > 21 && (
            <div style={{ padding: '10px 12px', fontSize: '12px', color: t.textMuted, borderTop: `1px solid ${t.divider}` }}>
              Mostrando 20 de {rows.length - 1} filas · El archivo exportado incluirá todas.
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
