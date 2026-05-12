import {
  Area, AreaChart, CartesianGrid, Dot,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useTokens } from '../../design/tokens';

function getDotColor(score) {
  if (score < 40) return '#EF4444';
  if (score < 70) return '#F59E0B';
  return '#10B981';
}

function CustomizedDot({ cx, cy, payload }) {
  const fill = getDotColor(payload.puntos ?? payload.score);
  return <Dot cx={cx} cy={cy} r={5} stroke={fill} fill="#ffffff" strokeWidth={2.5} />;
}

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
      <div style={{ fontWeight: 700, color: t.text, marginBottom: '4px' }}>{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ color: '#6366F1', fontWeight: 600 }}>
          Score: {entry.value}
        </div>
      ))}
    </div>
  );
}

export function ProgressChart({ data, title = 'Evolución del score', objective = 70 }) {
  const t = useTokens();

  const normalized = data?.map((e) => ({
    name: e.name ?? `Sem ${e.semana}`,
    puntos: e.puntos ?? e.score,
  })) ?? [];

  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: '20px',
        padding: '24px',
        boxShadow: t.cardShadow,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: t.text }}>
            {title}
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: t.textMuted }}>
            {normalized.length > 0 ? `${normalized.length} semanas` : 'Sin datos'}
          </p>
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 10px',
            background: t.warningBg,
            borderRadius: '8px',
            fontSize: '12px',
            color: t.warningText,
            fontWeight: 600,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" strokeDasharray="4 2" />
          </svg>
          Objetivo {objective}
        </div>
      </div>

      {normalized.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: t.textMuted }}>Sin datos</div>
      ) : (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={normalized} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.cardBorder} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: t.textMuted }} padding={{ left: 16, right: 16 }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: t.textMuted }} width={28} />
              <Tooltip content={<CustomTooltip t={t} />} cursor={{ stroke: t.cardBorder, strokeWidth: 1, strokeDasharray: '3 3' }} />
              <ReferenceLine
                y={objective}
                stroke="#F59E0B"
                strokeDasharray="4 3"
                label={{ value: 'Objetivo', position: 'insideTopRight', fill: '#D97706', fontSize: 11, fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="puntos"
                stroke="#6366F1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scoreGrad)"
                dot={<CustomizedDot />}
                activeDot={{ r: 6, fill: '#6366F1', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
