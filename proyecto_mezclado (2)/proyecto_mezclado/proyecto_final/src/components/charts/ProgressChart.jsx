// src/components/charts/ProgressChart.jsx
// ─────────────────────────────────────────────────────────────
// Gráfica de área GMFM con gradiente — exactamente como en el
// proyecto original. Acepta prop `data` del modelo actualizado
// (array de { semana, score }) para conectar con la BD.
// ─────────────────────────────────────────────────────────────
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Dot,
} from 'recharts';

const getDotColor = (score) => {
  if (score < 40) return '#dc2626';
  if (score < 70) return '#f59e0b';
  return '#16a34a';
};

const CustomizedDot = ({ cx, cy, payload }) => {
  const fill = getDotColor(payload.puntos ?? payload.score);
  return <Dot cx={cx} cy={cy} r={6} stroke={fill} fill="#ffffff" strokeWidth={3} />;
};

/**
 * ProgressChart
 * @param {Array}  data   - Array [{ semana, score }] (de BD) o [{ name, puntos }] (legacy)
 * @param {string} title  - Título de la gráfica
 * @param {number} objetivo - Línea de referencia (default 70)
 */
export const ProgressChart = ({ data, title = 'Evolución GMFM', objetivo = 70 }) => {
  // Normaliza tanto el formato legacy (puntos) como el nuevo (score)
  const normalized = data?.map((d) => ({
    name: d.name ?? `Sem ${d.semana}`,
    puntos: d.puntos ?? d.score,
  })) ?? [
    { name: 'Sem 1', puntos: 40 },
    { name: 'Sem 2', puntos: 61 },
    { name: 'Sem 3', puntos: 55 },
    { name: 'Sem 4', puntos: 75 },
    { name: 'Sem 5', puntos: 82 },
  ];

  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e5e7eb',
      borderRadius: '16px', padding: '30px 20px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', marginTop: '10px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0, fontSize: '22px', color: '#111827', fontWeight: 700 }}>{title}</h2>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>Últimas {normalized.length} semanas</span>
      </div>

      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <AreaChart data={normalized} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPuntos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }} padding={{ left: 20, right: 20 }} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }} width={30} />
            <Tooltip
              contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '10px 15px' }}
              labelStyle={{ fontWeight: 700, marginBottom: '5px' }}
              cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <ReferenceLine
              y={objetivo} stroke="#fde68a" strokeDasharray="3 3"
              label={{ value: 'Objetivo', position: 'insideTopRight', fill: '#d97706', fontSize: 11 }}
            />
            <Area
              type="monotone" dataKey="puntos"
              stroke="#3b82f6" strokeWidth={3}
              fillOpacity={1} fill="url(#colorPuntos)"
              dot={<CustomizedDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
