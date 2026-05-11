import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function WeekChart({ dailyLogs }) {
  if (!dailyLogs?.length) {
    return (
      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '16px 0', margin: 0 }}>
        Sin datos diarios
      </p>
    );
  }

  const data = dailyLogs.map((day) => ({
    name: day.fecha.slice(5),
    score: day.score,
    estabilidad: day.estabilidad,
  }));

  return (
    <div style={{ width: '100%', height: 120 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eef7" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <Tooltip
            contentStyle={{
              border: '1px solid #dbe4f0',
              borderRadius: '8px',
              fontSize: '12px',
              padding: '6px 10px',
            }}
            itemStyle={{ color: '#10233c' }}
          />
          <Line
            type="monotone"
            dataKey="score"
            name="Score"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="estabilidad"
            name="Estabilidad"
            stroke="#14b8a6"
            strokeWidth={2}
            dot={{ r: 3, fill: '#14b8a6', strokeWidth: 0 }}
            strokeDasharray="4 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
