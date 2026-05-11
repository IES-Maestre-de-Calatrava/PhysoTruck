import { useTokens } from '../../design/tokens';

function ScoreBadge({ score, t }) {
  let color, bg;
  if (score >= 90)      { color = '#10B981'; bg = '#ECFDF5'; }
  else if (score >= 75) { color = '#0D9488'; bg = '#F0FDFA'; }
  else if (score >= 60) { color = '#F59E0B'; bg = '#FFFBEB'; }
  else                  { color = '#EF4444'; bg = '#FEF2F2'; }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '999px',
        background: bg,
        color,
        fontWeight: 700,
        fontSize: '13px',
      }}
    >
      {score}
    </span>
  );
}

export function WeeklyStatsTable({ data }) {
  const t = useTokens();

  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: '20px',
        padding: '24px',
        boxShadow: t.cardShadow,
        overflow: 'hidden',
      }}
    >
      <div style={{ marginBottom: '18px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: t.text, margin: 0 }}>
          Resumen semanal
        </h3>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: t.textMuted }}>
          Score por semana
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Semana', 'Score', 'Sesiones', 'Tiempo'].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: '8px 12px',
                    textAlign: col === 'Semana' ? 'left' : 'right',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: t.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    borderBottom: `2px solid ${t.cardBorder}`,
                    background: 'transparent',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={item.semana}
                style={{ borderBottom: i < data.length - 1 ? `1px solid ${t.divider}` : 'none' }}
              >
                <td style={{ padding: '10px 12px', color: t.textSec, fontSize: '14px', fontWeight: 600 }}>
                  Sem {item.semana}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                  <ScoreBadge score={item.score} t={t} />
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '14px', color: t.text, fontWeight: 600 }}>
                  {item.sesiones}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', color: t.textMuted }}>
                  {item.tiempo} min
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
