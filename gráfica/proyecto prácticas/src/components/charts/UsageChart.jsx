import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Función para el color de los puntos (los círculos)
const getColorByScore = (score) => {
  if (score < 50) return '#ef4444'; // Rojo
  if (score < 80) return '#3b82f6'; // Azul
  return '#22c55e'; // Verde
};

export const UsageChart = ({ data, onClick }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: '320px', cursor: 'pointer' }} onClick={onClick}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
          <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
          <XAxis 
            dataKey="semana" 
            label={{ value: 'Semanas', position: 'insideBottom', offset: -15, fill: '#6b7280' }} 
            tick={{ fill: '#6b7280' }} 
          />
          <YAxis tick={{ fill: '#6b7280' }} />
          <Tooltip 
            contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} 
          />
          {/* Legend con espaciado para que no se corte */}
          <Legend wrapperStyle={{ paddingTop: '30px' }} />
          
          {/* Barras de sesiones */}
          <Bar dataKey="sesiones" name="Sesiones" barSize={30} fill="#f87171" opacity={0.6} />
          
          {/* LÍNEA AZUL FIJA (Garantizada) */}
          <Line 
            type="monotone" 
            dataKey="tiempo" 
            name="Tiempo (min)" 
            stroke="#3b82f6" 
            strokeWidth={4} 
            dot={({ cx, cy, payload }) => (
              <circle 
                key={`dot-${payload.semana}`} 
                cx={cx} cy={cy} r={6} 
                fill={getColorByScore(payload.score)} 
                stroke="#fff" 
                strokeWidth={2} 
              />
            )}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};