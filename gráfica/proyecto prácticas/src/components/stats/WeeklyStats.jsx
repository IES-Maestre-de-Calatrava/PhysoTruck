import { useTokens } from '../../design/tokens';

const STATS_CONFIG = [
  {
    key: 'score',
    label: 'Score actual',
    grad: 'linear-gradient(135deg,#6366F1,#4F46E5)',
    iconBg: 'rgba(99,102,241,0.12)',
    iconColor: '#6366F1',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    key: 'avg',
    label: 'Score medio',
    grad: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
    iconBg: 'rgba(139,92,246,0.12)',
    iconColor: '#8B5CF6',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    key: 'best',
    label: 'Mejor score',
    grad: 'linear-gradient(135deg,#F59E0B,#D97706)',
    iconBg: 'rgba(245,158,11,0.12)',
    iconColor: '#F59E0B',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    key: 'time',
    label: 'Tiempo total',
    grad: 'linear-gradient(135deg,#14B8A6,#0D9488)',
    iconBg: 'rgba(20,184,166,0.12)',
    iconColor: '#14B8A6',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    key: 'sessions',
    label: 'Sesiones',
    grad: 'linear-gradient(135deg,#F43F5E,#E11D48)',
    iconBg: 'rgba(244,63,94,0.12)',
    iconColor: '#F43F5E',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export function WeeklyStats({ data }) {
  const t = useTokens();

  if (!data?.length) return null;

  const lastScore    = data.at(-1).score;
  const prevScore    = data.at(-2)?.score ?? lastScore;
  const trend        = lastScore - prevScore;
  const avgScore     = Math.round(data.reduce((s, w) => s + w.score, 0) / data.length);
  const bestScore    = Math.max(...data.map((w) => w.score));
  const totalMin     = data.reduce((s, w) => s + w.tiempo, 0);
  const totalSes     = data.reduce((s, w) => s + w.sesiones, 0);

  const values = {
    score:    `${lastScore}${trend !== 0 ? (trend > 0 ? ` ▲${trend}` : ` ▼${Math.abs(trend)}`) : ''}`,
    avg:      avgScore,
    best:     bestScore,
    time:     `${totalMin} min`,
    sessions: totalSes,
  };

  const trendColors = {
    score: trend > 0 ? '#10B981' : trend < 0 ? '#EF4444' : t.textMuted,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
      {STATS_CONFIG.map((cfg, i) => (
        <div
          key={cfg.key}
          className={`slide-up stagger-${i + 1}`}
          style={{
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: '20px',
            padding: '20px',
            boxShadow: t.cardShadow,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'default',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = t.cardShadowHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = t.cardShadow;
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {cfg.label}
            </span>
            <div
              style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: cfg.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: cfg.iconColor,
                flexShrink: 0,
              }}
            >
              {cfg.icon}
            </div>
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: cfg.key === 'score' && trend !== 0 ? trendColors.score : t.text,
              lineHeight: 1,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.5px',
            }}
          >
            {values[cfg.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
