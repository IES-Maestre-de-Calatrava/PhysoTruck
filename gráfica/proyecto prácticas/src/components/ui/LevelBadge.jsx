function getLevelInfo(score) {
  if (score < 60) return { label: 'Necesita apoyo', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' };
  if (score < 80) return { label: 'En progreso',    color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE' };
  if (score < 90) return { label: 'Buen avance',    color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4' };
  return              { label: 'Alto rendimiento', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' };
}

export function LevelBadge({ score = 0 }) {
  const { label, color, bg, border } = getLevelInfo(score);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        borderRadius: '999px',
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontWeight: 700,
        fontSize: '12px',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          boxShadow: `0 0 4px ${color}80`,
        }}
      />
      {label}
    </div>
  );
}
