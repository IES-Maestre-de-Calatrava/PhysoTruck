function getLevelInfo(score) {
  if (score < 60) {
    return { label: 'Necesita apoyo', color: '#ef4444' };
  }
  if (score < 80) {
    return { label: 'En progreso', color: '#3b82f6' };
  }
  if (score < 90) {
    return { label: 'Buen avance', color: '#14b8a6' };
  }
  return { label: 'Alto rendimiento', color: '#22c55e' };
}

export function LevelBadge({ score = 0 }) {
  const { label, color } = getLevelInfo(score);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 14px',
        borderRadius: '999px',
        backgroundColor: `${color}16`,
        border: `1px solid ${color}55`,
        color,
        fontWeight: 700,
        fontSize: '13px',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          marginRight: '8px',
        }}
      />
      {label} ({score} pts)
    </div>
  );
}
