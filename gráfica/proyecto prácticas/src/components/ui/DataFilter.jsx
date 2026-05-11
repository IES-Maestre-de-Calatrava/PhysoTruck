import { useTokens } from '../../design/tokens';

export function DataFilter({ semanas = [], value = 'todas', onFilterChange }) {
  const t = useTokens();
  const uniqueWeeks = [...new Set(semanas)].sort((a, b) => a - b);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          fontSize: '13px', color: t.textMuted, fontWeight: 500,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filtrar
      </div>
      <select
        value={value}
        onChange={(e) => onFilterChange(e.target.value)}
        style={{
          padding: '8px 32px 8px 12px',
          borderRadius: '10px',
          border: `1px solid ${t.inputBorder}`,
          background: t.inputBg,
          fontSize: '13px',
          color: t.text,
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          minWidth: '160px',
        }}
      >
        <option value="todas">Todas las semanas</option>
        {uniqueWeeks.map((week) => (
          <option key={week} value={String(week)}>
            Semana {week}
          </option>
        ))}
      </select>
    </div>
  );
}
