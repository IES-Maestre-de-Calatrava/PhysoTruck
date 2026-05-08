export function DataFilter({ semanas = [], value = 'todas', onFilterChange }) {
  const uniqueWeeks = [...new Set(semanas)].sort((left, right) => left - right);

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13px',
        color: '#334155',
        fontWeight: 600,
      }}
    >
      Semana
      <select
        value={value}
        onChange={(event) => onFilterChange(event.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          background: '#ffffff',
          fontSize: '13px',
          color: '#0f172a',
          minWidth: '150px',
        }}
      >
        <option value="todas">Todas las semanas</option>
        {uniqueWeeks.map((week) => (
          <option key={week} value={String(week)}>
            Semana {week}
          </option>
        ))}
      </select>
    </label>
  );
}
