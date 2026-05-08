import {
  Area,
  AreaChart,
  CartesianGrid,
  Dot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function getDotColor(score) {
  if (score < 40) {
    return '#dc2626';
  }
  if (score < 70) {
    return '#f59e0b';
  }
  return '#16a34a';
}

function CustomizedDot({ cx, cy, payload }) {
  const fill = getDotColor(payload.puntos ?? payload.score);
  return <Dot cx={cx} cy={cy} r={6} stroke={fill} fill="#ffffff" strokeWidth={3} />;
}

export function ProgressChart({
  data,
  title = 'Evolucion del score',
  objective = 70,
}) {
  const normalized = data?.map((entry) => ({
    name: entry.name ?? `Sem ${entry.semana}`,
    puntos: entry.puntos ?? entry.score,
  })) ?? [];

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #dbe4f0',
        borderRadius: '16px',
        padding: '28px 20px',
        boxShadow: '0 10px 20px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#10233c', fontWeight: 700 }}>
          {title}
        </h2>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          {normalized.length > 0 ? `${normalized.length} semanas` : 'Sin datos'}
        </span>
      </div>

      {normalized.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0', margin: 0 }}>
          Sin datos de progreso
        </p>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={normalized} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eef7" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  border: '1px solid #dbe4f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 20px rgba(15, 23, 42, 0.12)',
                  padding: '10px 14px',
                }}
                labelStyle={{ fontWeight: 700, color: '#10233c', marginBottom: '4px' }}
                itemStyle={{ color: '#1e3a8a' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <ReferenceLine
                y={objective}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                label={{
                  value: 'Objetivo',
                  position: 'insideTopRight',
                  fill: '#b45309',
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="puntos"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreAreaGradient)"
                dot={<CustomizedDot />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
