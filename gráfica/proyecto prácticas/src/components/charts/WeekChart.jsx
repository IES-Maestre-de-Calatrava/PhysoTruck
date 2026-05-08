import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const STATUS_COLOR = {
  'Muchos errores': '#ef4444',
  'Dia inestable': '#f59e0b',
  'Buen progreso': '#34d399',
  'Progreso claro': '#3b82f6',
};

function getBarColor(status) {
  return STATUS_COLOR[status] ?? '#64748b';
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const currentDay = payload[0]?.payload;
  return (
    <div
      style={{
        background: '#ffffff',
        padding: '10px 14px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
        fontSize: '13px',
        border: '1px solid #dbe4f0',
      }}
    >
      <p style={{ fontWeight: 700, margin: '0 0 6px', color: '#10233c' }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ color: entry.color, marginBottom: '3px' }}>
          <span style={{ fontWeight: 600 }}>{entry.name}:</span> {entry.value}
        </div>
      ))}
      {currentDay?.estado ? (
        <div
          style={{
            marginTop: '6px',
            padding: '3px 8px',
            borderRadius: '999px',
            background: `${getBarColor(currentDay.estado)}18`,
            color: getBarColor(currentDay.estado),
            fontSize: '11px',
            fontWeight: 700,
            display: 'inline-block',
          }}
        >
          {currentDay.estado}
        </div>
      ) : null}
    </div>
  );
}

export function WeekChart({ dailyLogs }) {
  if (!dailyLogs?.length) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyLogs} margin={{ top: 10, right: 20, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eef7" />
          <XAxis
            dataKey="fecha"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            formatter={(value) => (value === 'score' ? 'Score' : 'Estabilidad')}
          />
          <Bar dataKey="score" name="Score" radius={[6, 6, 0, 0]}>
            {dailyLogs.map((entry, index) => (
              <Cell key={`score-${entry.fecha}-${index}`} fill={getBarColor(entry.estado)} />
            ))}
          </Bar>
          <Bar
            dataKey="estabilidad"
            name="Estabilidad"
            fill="#c4b5fd"
            radius={[6, 6, 0, 0]}
            opacity={0.75}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
