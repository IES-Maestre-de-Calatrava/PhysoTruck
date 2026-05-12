import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTokens } from '../../design/tokens';

/* ─── helpers ───────────────────────────────────────────────────── */

function slugify(v) {
  return String(v ?? 'paciente').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function weekdayName(iso) {
  if (!iso) return '';
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[new Date(iso + 'T12:00:00').getDay()];
}

function downloadBlob(content, type, filename) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ─── toRows: genera filas según modo ──────────────────────────── */

function toRowsByWeek(data) {
  const header = [
    'Semana', 'Score medio', 'Sesiones', 'Tiempo total (min)',
    'Días con datos', 'Estabilidad media',
    'Colisiones', 'Aceleraciones bruscas', 'Frenadas bruscas', 'Eventos totales',
  ];
  const rows = [header];
  data.forEach((w) => {
    const days = w.dailyLogs ?? [];
    const avgEstab = days.length
      ? Math.round(days.reduce((s, d) => s + (d.estabilidad ?? 0), 0) / days.length)
      : 0;
    const col = days.reduce((s, d) => s + (d.eventos?.colisiones ?? 0), 0);
    const acel = days.reduce((s, d) => s + (d.eventos?.aceleraciones ?? 0), 0);
    const fren = days.reduce((s, d) => s + (d.eventos?.frenadas ?? 0), 0);
    rows.push([
      `Semana ${w.semana}`, w.score, w.sesiones, w.tiempo,
      days.length, avgEstab, col, acel, fren, col + acel + fren,
    ]);
  });
  return rows;
}

function toRowsByDay(data) {
  const header = [
    'Semana', 'Día', 'Fecha', 'Score diario', 'Estabilidad (%)',
    'Tiempo (min)', 'Estado',
    'Colisiones', 'Aceleraciones bruscas', 'Frenadas bruscas', 'Eventos totales',
  ];
  const rows = [header];
  data.forEach((w) => {
    (w.dailyLogs ?? []).forEach((d) => {
      const col  = d.eventos?.colisiones ?? 0;
      const acel = d.eventos?.aceleraciones ?? 0;
      const fren = d.eventos?.frenadas ?? 0;
      rows.push([
        `Semana ${w.semana}`,
        weekdayName(d.fecha),
        fmtDate(d.fecha),
        d.score,
        d.estabilidad,
        d.tiempo,
        d.estado,
        col, acel, fren,
        col + acel + fren,
      ]);
    });
  });
  return rows;
}

/* ─── SVG charts para PDF ────────────────────────────────────────── */

function svgLineChart(points, { width = 680, height = 190, color = '#6366F1', id = 'a' } = {}) {
  if (!points.length) return '';
  const pad = { t: 24, r: 24, b: 48, l: 48 };
  const W = width - pad.l - pad.r;
  const H = height - pad.t - pad.b;
  const vals = points.map((p) => p.v);
  const maxV = Math.max(100, ...vals);
  const xOf  = (i) => pad.l + (points.length < 2 ? W / 2 : i * (W / (points.length - 1)));
  const yOf  = (v) => pad.t + H - (v / maxV) * H;
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yOf(p.v)}`).join(' ');
  const area = `${line} L${xOf(points.length - 1)},${pad.t + H} L${pad.l},${pad.t + H}Z`;
  const ticks = [0, 25, 50, 75, 100];
  const gridLines = ticks.map((v) =>
    `<line x1="${pad.l}" y1="${yOf(v)}" x2="${pad.l + W}" y2="${yOf(v)}" stroke="#E2E8F0" stroke-width="1"/><text x="${pad.l - 6}" y="${yOf(v) + 4}" text-anchor="end" font-size="10" fill="#94A3B8">${v}</text>`
  ).join('');
  const dots = points.map((p, i) =>
    `<circle cx="${xOf(i)}" cy="${yOf(p.v)}" r="3.5" fill="${color}" stroke="white" stroke-width="1.5"/>` +
    `<text x="${xOf(i)}" y="${yOf(p.v) - 9}" text-anchor="middle" font-size="9" fill="${color}" font-weight="bold">${p.v}</text>`
  ).join('');
  const xlabels = points.map((p, i) =>
    `<text x="${xOf(i)}" y="${pad.t + H + 20}" text-anchor="middle" font-size="9" fill="#64748B">${p.l}</text>`
  ).join('');
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
    </linearGradient></defs>
    ${gridLines}
    <path d="${area}" fill="url(#g${id})"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}${xlabels}
  </svg>`;
}

function svgBarChart(points, { width = 680, height = 170, colors = ['#EF4444', '#F59E0B', '#8B5CF6'] } = {}) {
  if (!points.length) return '';
  const pad = { t: 20, r: 24, b: 44, l: 48 };
  const W = width - pad.l - pad.r;
  const H = height - pad.t - pad.b;
  const allVals = points.flatMap((p) => p.cols);
  const maxV = Math.max(1, ...allVals);
  const groupW = W / points.length;
  const nCols  = colors.length;
  const barW   = Math.max(4, Math.min(groupW * 0.65 / nCols, 20));
  const totalBarW = barW * nCols;

  const bars = points.flatMap((p, gi) =>
    p.cols.map((v, ci) => {
      const bH = (v / maxV) * H;
      const x  = pad.l + gi * groupW + (groupW - totalBarW) / 2 + ci * barW;
      const y  = pad.t + H - bH;
      return `<rect x="${x}" y="${y}" width="${barW - 1.5}" height="${bH}" fill="${colors[ci]}" rx="2" opacity="0.85"/>
              <text x="${x + (barW - 1.5) / 2}" y="${y - 3}" text-anchor="middle" font-size="8" fill="${colors[ci]}">${v > 0 ? v : ''}</text>`;
    })
  ).join('');

  const xlabels = points.map((p, gi) => {
    const x = pad.l + gi * groupW + groupW / 2;
    return `<text x="${x}" y="${pad.t + H + 16}" text-anchor="middle" font-size="9" fill="#64748B">${p.l}</text>`;
  }).join('');

  const legend = colors.map((c, i) => {
    const labels = ['Colisiones', 'Aceleraciones', 'Frenadas'];
    return `<rect x="${pad.l + i * 130}" y="${height - 12}" width="10" height="10" fill="${c}" rx="2"/>
            <text x="${pad.l + i * 130 + 14}" y="${height - 3}" font-size="10" fill="#475569">${labels[i]}</text>`;
  }).join('');

  return `<svg viewBox="0 0 ${width} ${height + 14}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + 14}">
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${pad.t + H}" stroke="#E2E8F0" stroke-width="1"/>
    <line x1="${pad.l}" y1="${pad.t + H}" x2="${pad.l + W}" y2="${pad.t + H}" stroke="#E2E8F0" stroke-width="1"/>
    ${bars}${xlabels}${legend}
  </svg>`;
}

/* ─── exportaciones ──────────────────────────────────────────────── */

function exportExcel(rows, patientName, mode) {
  const isDay = mode !== 'semana';
  const headerColor = isDay ? '#4F46E5' : '#059669';

  const trs = rows.map((row, i) => {
    if (i === 0) {
      return `<tr>${row.map((c) =>
        `<th style="background:${headerColor};color:white;padding:8px 10px;font-size:12px;font-weight:bold;border:1px solid #ccc;">${c}</th>`
      ).join('')}</tr>`;
    }
    const bg = i % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
    return `<tr>${row.map((c, j) =>
      `<td style="background:${bg};padding:7px 10px;font-size:12px;border:1px solid #E2E8F0;${j === 3 ? 'font-weight:bold;color:#6366F1;' : ''}">${String(c ?? '')}</td>`
    ).join('')}</tr>`;
  }).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <style>
      body{font-family:Arial,sans-serif}
      h2{color:#0F172A;font-size:16px;margin-bottom:4px}
      .sub{color:#64748B;font-size:12px;margin-bottom:16px}
      table{border-collapse:collapse;width:100%}
    </style>
  </head><body>
    <h2>PhysioTrack — ${patientName}</h2>
    <div class="sub">Informe ${isDay ? 'por día' : 'por semana'} · ${new Date().toLocaleDateString('es-ES')}</div>
    <table>${trs}</table>
  </body></html>`;

  downloadBlob(html, 'application/vnd.ms-excel;charset=utf-8;', `physiotrack_${slugify(patientName)}.xls`);
}

function exportPdf(filteredData, rows, patientName, mode) {
  const isDay = mode !== 'semana';
  const now   = new Date().toLocaleDateString('es-ES', { dateStyle: 'long' });

  /* — datos para gráficas — */
  let scorePoints = [];
  let eventPoints = [];

  if (isDay) {
    filteredData.forEach((w) => {
      (w.dailyLogs ?? []).forEach((d) => {
        scorePoints.push({ l: `${weekdayName(d.fecha)} ${fmtDate(d.fecha)}`, v: d.score ?? 0 });
        eventPoints.push({
          l: fmtDate(d.fecha),
          cols: [d.eventos?.colisiones ?? 0, d.eventos?.aceleraciones ?? 0, d.eventos?.frenadas ?? 0],
        });
      });
    });
  } else {
    filteredData.forEach((w) => {
      scorePoints.push({ l: `Sem ${w.semana}`, v: w.score ?? 0 });
      const days = w.dailyLogs ?? [];
      const col  = days.reduce((s, d) => s + (d.eventos?.colisiones ?? 0), 0);
      const acel = days.reduce((s, d) => s + (d.eventos?.aceleraciones ?? 0), 0);
      const fren = days.reduce((s, d) => s + (d.eventos?.frenadas ?? 0), 0);
      eventPoints.push({ l: `Sem ${w.semana}`, cols: [col, acel, fren] });
    });
  }

  /* — resumen — */
  const totalSes  = filteredData.reduce((s, w) => s + w.sesiones, 0);
  const totalDays = filteredData.reduce((s, w) => s + (w.dailyLogs?.length ?? 0), 0);
  const avgScore  = scorePoints.length
    ? Math.round(scorePoints.reduce((s, p) => s + p.v, 0) / scorePoints.length)
    : 0;
  const totalCol  = eventPoints.reduce((s, p) => s + p.cols[0], 0);
  const totalAcel = eventPoints.reduce((s, p) => s + p.cols[1], 0);
  const totalFren = eventPoints.reduce((s, p) => s + p.cols[2], 0);

  /* — tabla — */
  const bodyRows = rows.slice(1).map((r, ri) => {
    const bg = ri % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
    return `<tr style="background:${bg}">${r.map((c, ci) =>
      `<td style="border:1px solid #E2E8F0;padding:6px 10px;font-size:11px;${ci === 3 ? 'font-weight:700;color:#6366F1;' : 'color:#334155;'}">${String(c ?? '')}</td>`
    ).join('')}</tr>`;
  }).join('');

  /* — SVGs — */
  const lineChart = svgLineChart(scorePoints, { id: 'lc' });
  const barChart  = svgBarChart(eventPoints);

  const win = window.open('', '_blank', 'width=1100,height=860');
  if (!win) { alert('Activa las ventanas emergentes para exportar el PDF.'); return; }

  const html = `<!doctype html><html>
  <head>
    <meta charset="utf-8"/>
    <title>Informe ${patientName}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Arial,sans-serif;color:#0F172A;background:#fff;padding:32px 40px}
      .toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #E2E8F0}
      .toolbar h1{font-size:20px;font-weight:800}
      .print-btn{padding:10px 22px;background:linear-gradient(135deg,#6366F1,#4F46E5);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px}
      .print-btn:hover{opacity:.9}
      .meta{font-size:12px;color:#64748B;margin-bottom:8px}
      .badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;margin-bottom:20px;background:#EEF2FF;color:#4338CA}
      .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
      .kpi{border-radius:12px;padding:14px 16px;border:1px solid #E2E8F0}
      .kpi-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}
      .kpi-val{font-size:26px;font-weight:800;line-height:1}
      .section{margin-bottom:28px}
      .section-title{font-size:13px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #E2E8F0}
      .chart-box{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;overflow:hidden}
      .chart-box svg{display:block;max-width:100%}
      table{border-collapse:collapse;width:100%;font-size:11px}
      thead th{background:#F1F5F9;color:#475569;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.05em;padding:8px 10px;border:1px solid #E2E8F0}
      tbody td{padding:6px 10px;border:1px solid #E2E8F0}
      @media print{
        .toolbar{display:flex}
        .print-btn{display:none!important}
        body{padding:20px 24px}
        .kpis{grid-template-columns:repeat(4,1fr)}
        .chart-box{break-inside:avoid}
      }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <div>
        <h1>PhysioTrack — ${patientName}</h1>
        <div class="meta">Informe ${isDay ? 'por día' : 'por semana'} &middot; ${now}</div>
      </div>
      <button class="print-btn" onclick="window.print()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Imprimir / Guardar PDF
      </button>
    </div>
    <span class="badge">${isDay ? `${totalDays} días analizados` : `${filteredData.length} semanas analizadas`}</span>

    <div class="kpis">
      <div class="kpi" style="border-color:#6366F130">
        <div class="kpi-label" style="color:#6366F1">Score medio</div>
        <div class="kpi-val" style="color:#6366F1">${avgScore}</div>
      </div>
      <div class="kpi" style="border-color:#0D948830">
        <div class="kpi-label" style="color:#0D9488">Sesiones</div>
        <div class="kpi-val" style="color:#0D9488">${totalSes}</div>
      </div>
      <div class="kpi" style="border-color:#EF444430">
        <div class="kpi-label" style="color:#EF4444">Colisiones</div>
        <div class="kpi-val" style="color:#EF4444">${totalCol}</div>
      </div>
      <div class="kpi" style="border-color:#F59E0B30">
        <div class="kpi-label" style="color:#F59E0B">Aceleraciones</div>
        <div class="kpi-val" style="color:#F59E0B">${totalAcel}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Evolución del score ${isDay ? 'por día' : 'por semana'}</div>
      <div class="chart-box">${lineChart || '<p style="color:#94A3B8;font-size:13px">Sin datos de score</p>'}</div>
    </div>

    <div class="section">
      <div class="section-title">Eventos ${isDay ? 'por día' : 'por semana'}</div>
      <div class="chart-box">${barChart || '<p style="color:#94A3B8;font-size:13px">Sin datos de eventos</p>'}</div>
    </div>

    <div class="section">
      <div class="section-title">Datos detallados</div>
      <table>
        <thead><tr>${rows[0].map((c) => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  </body></html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

/* ─── componente ─────────────────────────────────────────────────── */

export function InformesView({ weeks, patientName }) {
  const t = useTokens();

  const allWeekNums = useMemo(() => weeks.map((w) => w.semana), [weeks]);
  const allDates    = useMemo(() => {
    const d = [];
    weeks.forEach((w) => w.dailyLogs?.forEach((dl) => d.push(dl.fecha)));
    return [...new Set(d)].sort();
  }, [weeks]);

  const minWeek = allWeekNums[0] ?? 1;
  const maxWeek = allWeekNums.at(-1) ?? 1;
  const minDate = allDates[0] ?? '';
  const maxDate = allDates.at(-1) ?? '';

  /* modo: 'semana' | 'rango' | 'dia' */
  const [mode, setMode]         = useState('semana');
  const [singleWeek, setSingle] = useState(minWeek);
  const [fromWeek, setFromWeek] = useState(minWeek);
  const [toWeek, setToWeek]     = useState(maxWeek);
  const [fromDate, setFromDate] = useState(minDate);
  const [toDate, setToDate]     = useState(maxDate);

  const filteredData = useMemo(() => {
    if (mode === 'semana') return weeks.filter((w) => w.semana === singleWeek);
    if (mode === 'rango')  return weeks.filter((w) => w.semana >= fromWeek && w.semana <= toWeek);
    return weeks
      .map((w) => ({ ...w, dailyLogs: (w.dailyLogs ?? []).filter((d) => d.fecha >= fromDate && d.fecha <= toDate) }))
      .filter((w) => w.dailyLogs.length > 0);
  }, [weeks, mode, singleWeek, fromWeek, toWeek, fromDate, toDate]);

  const isDay      = mode === 'dia';
  const rows       = useMemo(() => isDay ? toRowsByDay(filteredData) : toRowsByWeek(filteredData), [filteredData, isDay]);
  const hasData    = rows.length > 1;
  const totalSes   = filteredData.reduce((s, w) => s + w.sesiones, 0);
  const totalDays  = filteredData.reduce((s, w) => s + (w.dailyLogs?.length ?? 0), 0);

  const inputStyle = {
    padding: '9px 14px', border: `1px solid ${t.inputBorder}`,
    borderRadius: '10px', fontSize: '14px', color: t.text,
    background: t.inputBg, outline: 'none', minWidth: '140px',
    fontFamily: 'inherit',
  };

  const segBtn = (active) => ({
    padding: '8px 18px', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit',
    background: active ? 'linear-gradient(135deg,#6366F1,#4F46E5)' : 'transparent',
    color: active ? '#ffffff' : t.textMuted,
    boxShadow: active ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
    transition: 'all 0.15s',
  });

  const SUMMARY = [
    { label: 'Semanas',        value: filteredData.length, color: t.primary,  bg: t.primaryBg  },
    { label: 'Sesiones',       value: totalSes,            color: t.teal,     bg: t.tealBg     },
    { label: 'Días con datos', value: totalDays,           color: t.success,  bg: t.successBg  },
    { label: 'Filas a exportar', value: Math.max(0, rows.length - 1), color: t.warning, bg: t.warningBg },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
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
      <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', padding: '28px', boxShadow: t.cardShadow, display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: t.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.primary }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
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
            Tipo de selección
          </div>
          <div style={{ display: 'inline-flex', background: t.cardBgAlt, border: `1px solid ${t.cardBorder}`, borderRadius: '12px', padding: '4px', gap: '2px' }}>
            <button style={segBtn(mode === 'semana')} onClick={() => setMode('semana')}>Una semana</button>
            <button style={segBtn(mode === 'rango')}  onClick={() => setMode('rango')}>Rango semanas</button>
            <button style={segBtn(mode === 'dia')}    onClick={() => setMode('dia')}>Por día</button>
          </div>
        </div>

        {/* Inputs */}
        {mode === 'semana' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: t.textSec }}>Semana</label>
            <select value={singleWeek} onChange={(e) => setSingle(Number(e.target.value))} style={inputStyle}>
              {allWeekNums.map((n) => <option key={n} value={n}>Semana {n}</option>)}
            </select>
          </div>
        )}

        {mode === 'rango' && (
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
        )}

        {mode === 'dia' && (
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: '12px' }}>
          {SUMMARY.map(({ label, value, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: '14px', padding: '14px 16px', border: `1px solid ${color}30` }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color, fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Export card */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', padding: '28px', boxShadow: t.cardShadow }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: t.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.success }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: t.text }}>Exportar informe</div>
            <div style={{ fontSize: '12px', color: t.textMuted }}>
              {isDay ? 'Vista diaria — detalle completo por día' : 'Vista semanal — resumen por semana'}
            </div>
          </div>
        </div>

        {!hasData && (
          <div style={{ padding: '14px 16px', borderRadius: '12px', background: t.warningBg, border: `1px solid ${t.warning}40`, fontSize: '13px', color: t.warningText, marginBottom: '16px', fontWeight: 500 }}>
            No hay datos en el rango seleccionado.
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {/* Excel */}
          <button
            disabled={!hasData}
            onClick={() => exportExcel(rows, patientName, mode)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 22px',
              background: hasData ? 'linear-gradient(135deg,#10B981,#059669)' : t.cardBgAlt,
              color: hasData ? '#ffffff' : t.textMuted,
              border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
              cursor: hasData ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
              boxShadow: hasData ? '0 4px 12px rgba(16,185,129,0.25)' : 'none',
              transition: 'all 0.15s',
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

          {/* PDF */}
          <button
            disabled={!hasData}
            onClick={() => exportPdf(filteredData, rows, patientName, mode)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 22px',
              background: hasData ? 'linear-gradient(135deg,#EF4444,#DC2626)' : t.cardBgAlt,
              color: hasData ? '#ffffff' : t.textMuted,
              border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
              cursor: hasData ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
              boxShadow: hasData ? '0 4px 12px rgba(239,68,68,0.25)' : 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { if (hasData) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>
            </svg>
            Exportar PDF + Gráficas
          </button>
        </div>
      </div>

      {/* Preview */}
      {hasData && (
        <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', padding: '24px', boxShadow: t.cardShadow, overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: t.tealBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.teal }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="9" x2="9" y2="21"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: t.text }}>Vista previa</div>
              <div style={{ fontSize: '12px', color: t.textMuted }}>Primeras 20 filas</div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', whiteSpace: 'nowrap' }}>
            <thead>
              <tr>
                {rows[0].map((col) => (
                  <th key={col} style={{ padding: '9px 12px', textAlign: 'left', background: t.cardBgAlt, borderBottom: `2px solid ${t.cardBorder}`, fontWeight: 700, color: t.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1, 21).map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${t.divider}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = t.cardBgAlt; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '9px 12px', color: j === 3 ? t.primary : t.text, fontWeight: j === 3 ? 700 : 400 }}>
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
