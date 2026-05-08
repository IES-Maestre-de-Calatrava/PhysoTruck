function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #dbe4f0',
        borderRadius: '16px',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        borderTop: `4px solid ${accent}`,
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#94a3b8',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: '26px', fontWeight: 800, color: '#10233c', lineHeight: 1.1 }}>
        {value}
      </span>
    </div>
  );
}

export function WeeklyStats({ data }) {
  if (!data?.length) {
    return null;
  }

  const totalMinutes = data.reduce((sum, week) => sum + week.tiempo, 0);
  const averageScore = Math.round(
    data.reduce((sum, week) => sum + week.score, 0) / data.length,
  );
  const bestScore = Math.max(...data.map((week) => week.score));
  const totalSessions = data.reduce((sum, week) => sum + week.sesiones, 0);
  const lastScore = data[data.length - 1].score;
  const previousScore = data[data.length - 2]?.score ?? lastScore;
  const trend = lastScore - previousScore;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '12px',
      }}
    >
      <StatCard
        label="Score actual"
        value={`${lastScore} ${trend >= 0 ? `▲${trend}` : `▼${Math.abs(trend)}`}`}
        accent="#2563eb"
      />
      <StatCard label="Score medio" value={averageScore} accent="#8b5cf6" />
      <StatCard label="Mejor score" value={bestScore} accent="#f59e0b" />
      <StatCard label="Tiempo total" value={`${totalMinutes}m`} accent="#14b8a6" />
      <StatCard label="Sesiones" value={totalSessions} accent="#f43f5e" />
    </div>
  );
}
