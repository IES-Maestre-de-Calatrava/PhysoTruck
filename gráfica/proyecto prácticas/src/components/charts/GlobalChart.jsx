import {
  Area, Bar, CartesianGrid, ComposedChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useTokens } from '../../design/tokens';

function CustomTooltip({ active, payload, label, t }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: t.cardShadow,
        fontSize: '13px',
      }}
    >
      <div style={{ fontWeight: 700, color: t.text, marginBottom: '6px' }}>{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ color: entry.dataKey === 'score' ? '#6366F1' : '#14B8A6', fontWeight: 600, marginBottom: '2px' }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
}

export function GlobalChart({ data, onClick }) {
  const t = useTokens();

  if (!data?.length) {
    return <p style={{ textAlign: 'center', color: t.textMuted, padding: '40px 0', margin: 0 }}>Sin datos</p>;
  }

  const normalized = data.map((w) => ({
    name: `Sem ${w.semana}`,
    score: w.score ?? 0,
    sesiones: w.sesiones ?? 0,
  }));

  return (
    <div style={{ width: '100%', height: 300, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <ResponsiveContainer>
        <ComposedChart data={normalized} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="globalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.20} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.cardBorder} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: t.textMuted }} />
          <YAxis yAxisId="score" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: t.textMuted }} width={28} />
          <YAxis yAxisId="ses" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: t.textMuted }} width={24} />
          <Tooltip content={<CustomTooltip t={t} />} />
          <Bar yAxisId="ses" dataKey="sesiones" name="Sesiones" fill="#C7D2FE" radius={[6, 6, 0, 0]} barSize={16} />
          <Area
            yAxisId="score"
            type="monotone"
            dataKey="score"
            name="Score"
            stroke="#6366F1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#globalGrad)"
            dot={{ r: 4, fill: '#6366F1', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#6366F1' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
