// src/components/charts/GlobalChart.jsx
// ─────────────────────────────────────────────────────────────
// Gráfica de evolución global: VISUAL del proyecto original
// (recharts LineChart con puntos de color por nivel y tooltip
// personalizado) + MODELO del proyecto actualizado
// (acepta prop `data` normalizado desde la BD).
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

// Niveles de competencia (del original)
const NIVELES = [
  { nombre: 'Novato',             color: '#ef4444', min: 0  },
  { nombre: 'Principiante',       color: '#f97316', min: 20 },
  { nombre: 'Princ. perfeccionado', color: '#facc15', min: 40 },
  { nombre: 'Competente',         color: '#3b82f6', min: 60 },
  { nombre: 'Aventajado',         color: '#8b5cf6', min: 80 },
  { nombre: 'Experto',            color: '#10b981', min: 90 },
];

function getPointColor(score) {
  const nivel = [...NIVELES].reverse().find((n) => score >= n.min);
  return nivel ? nivel.color : '#ef4444';
}

// Tooltip personalizado del proyecto original
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { score, tiempo, semana } = payload[0].payload;
  return (
    <div style={{
      backgroundColor: '#fff', padding: '12px', borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '14px',
    }}>
      <p style={{ margin: '0 0 5px', fontWeight: 'bold', color: '#1f2937' }}>Semana {semana}</p>
      <div style={{ color: '#3b82f6', marginBottom: '4px' }}>
        <span style={{ fontWeight: 600 }}>Puntuación:</span> {score} pts
      </div>
      <div style={{ color: '#6b7280' }}>
        <span style={{ fontWeight: 600 }}>Uso total:</span> {tiempo} min
      </div>
    </div>
  );
}

// Leyenda de niveles del proyecto original
function LeyendaNiveles() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
      {NIVELES.map((n) => (
        <div key={n.nombre} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#6b7280' }}>
          <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: n.color }} />
          {n.nombre}
        </div>
      ))}
    </div>
  );
}

/**
 * GlobalChart
 * @param {Array}    data     - Array de semanas (viene de la BD vía getSesiones())
 * @param {Function} onClick  - Callback opcional al hacer clic (abre modal)
 */
export const GlobalChart = ({ data, onClick }) => (
  <div onClick={onClick} style={{ width: '100%', height: 350, cursor: onClick ? 'pointer' : 'default' }}>
    <LeyendaNiveles />
    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        <XAxis
          dataKey="semana"
          axisLine={false} tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <YAxis
          domain={[0, 100]}
          axisLine={false} tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#3b82f6"
          strokeWidth={4}
          dot={({ cx, cy, payload }) => (
            <circle
              key={`dot-${payload.semana}`}
              cx={cx} cy={cy} r={7}
              fill={getPointColor(payload.score)}
              stroke="white" strokeWidth={3}
            />
          )}
          activeDot={{ r: 9, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
    <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '10px' }}>Semanas</p>
  </div>
);
