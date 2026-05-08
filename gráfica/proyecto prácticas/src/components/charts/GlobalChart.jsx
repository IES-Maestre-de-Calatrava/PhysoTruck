import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const LEVELS = [
  { name: 'Necesita apoyo', color: '#ef4444', min: 0 },
  { name: 'En progreso', color: '#f97316', min: 40 },
  { name: 'Buen avance', color: '#3b82f6', min: 70 },
  { name: 'Alto rendimiento', color: '#10b981', min: 90 },
];

function getPointColor(score) {
  const selected = [...LEVELS].reverse().find((level) => score >= level.min);
  return selected?.color ?? '#ef4444';
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const { score, tiempo, semana, sesiones } = payload[0].payload;
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '12px 14px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
        fontSize: '13px',
        border: '1px solid #dbe4f0',
      }}
    >
      <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#10233c' }}>
        Semana {semana}
      </p>
      <p style={{ margin: '0 0 4px', color: '#1d4ed8' }}>Score: {score}</p>
      <p style={{ margin: '0 0 4px', color: '#334155' }}>Tiempo: {tiempo} min</p>
      <p style={{ margin: 0, color: '#334155' }}>Sesiones: {sesiones}</p>
    </div>
  );
}

function LegendLevels() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '18px',
        flexWrap: 'wrap',
      }}
    >
      {LEVELS.map((level) => (
        <div
          key={level.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#64748b',
          }}
        >
          <div
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: level.color,
            }}
          />
          {level.name}
        </div>
      ))}
    </div>
  );
}

export function GlobalChart({ data, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100%',
        height: 340,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <LegendLevels />
      <ResponsiveContainer width="100%" height="82%">
        <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eef7" />
          <XAxis
            dataKey="semana"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
            dot={({ cx, cy, payload }) => (
              <circle
                key={`point-${payload.semana}`}
                cx={cx}
                cy={cy}
                r={6}
                fill={getPointColor(payload.score)}
                stroke="#ffffff"
                strokeWidth={3}
              />
            )}
            activeDot={{ r: 8, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>
        Evolucion semanal del score
      </p>
    </div>
  );
}
