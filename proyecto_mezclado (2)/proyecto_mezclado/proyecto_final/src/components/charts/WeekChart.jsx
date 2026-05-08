// src/components/charts/WeekChart.jsx
// ─────────────────────────────────────────────────────────────
// Gráfica diaria dentro de cada semana:
// VISUAL del original (recharts BarChart con colores por estado)
// + MODELO del actualizado (acepta dailyLogs del schema de la BD).
// ─────────────────────────────────────────────────────────────
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend,
} from 'recharts';

// Paleta de colores por estado
const ESTADO_COLOR = {
  'Muchos errores': '#ef4444',
  'Día inestable':  '#f59e0b',
  'Buen progreso':  '#34d399',
  'Progreso claro': '#3b82f6',
};

function getBarColor(estado) {
  return ESTADO_COLOR[estado] || '#6b7280';
}

// Tooltip personalizado con score + estabilidad
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: '#fff', padding: '10px 14px', borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)', fontSize: '13px',
    }}>
      <p style={{ fontWeight: 700, marginBottom: '6px', color: '#1f2937' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: '3px' }}>
          <span style={{ fontWeight: 600 }}>{p.name}:</span> {p.value}
        </div>
      ))}
      {d?.estado && (
        <div style={{
          marginTop: '6px', padding: '2px 8px', borderRadius: '8px',
          background: `${getBarColor(d.estado)}20`, color: getBarColor(d.estado),
          fontSize: '11px', fontWeight: 600,
        }}>
          {d.estado}
        </div>
      )}
    </div>
  );
}

/**
 * WeekChart
 * @param {Array} dailyLogs - Logs diarios de una semana (de la BD / mock)
 */
export const WeekChart = ({ dailyLogs }) => {
  if (!dailyLogs?.length) return null;

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyLogs} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            formatter={(v) => v === 'score' ? 'Score' : 'Estabilidad'}
          />
          <Bar dataKey="score" name="Score" radius={[6, 6, 0, 0]}>
            {dailyLogs.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={getBarColor(entry.estado)} />
            ))}
          </Bar>
          <Bar dataKey="estabilidad" name="Estabilidad" fill="#c4b5fd" radius={[6, 6, 0, 0]} opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * WeekLineChart — variante línea para el modal expandido
 * @param {Array} dailyLogs
 */
export const WeekLineChart = ({ dailyLogs }) => {
  if (!dailyLogs?.length) return null;

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={dailyLogs} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(v) => v === 'score' ? 'Score' : 'Estabilidad'} />
          <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} />
          <Line type="monotone" dataKey="estabilidad" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
