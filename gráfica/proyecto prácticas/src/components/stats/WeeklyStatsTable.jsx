export function WeeklyStatsTable({ data }) {
  return (
    <div
      style={{
        background: '#ffffff',
        padding: '22px',
        borderRadius: '16px',
        boxShadow: '0 10px 20px rgba(15, 23, 42, 0.05)',
        border: '1px solid #dbe4f0',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 4px', color: '#10233c' }}>Resumen por semana</h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
          Vista rapida de score, sesiones y tiempo total.
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e7eef7' }}>
              <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px', color: '#64748b' }}>Semana</th>
              <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', color: '#64748b' }}>Score</th>
              <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', color: '#64748b' }}>Sesiones</th>
              <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', color: '#64748b' }}>Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.semana} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px', fontSize: '14px', color: '#10233c' }}>Semana {item.semana}</td>
                <td style={{ textAlign: 'right', padding: '10px', fontWeight: 700, fontSize: '14px', color: '#10233c' }}>
                  {item.score}
                </td>
                <td style={{ textAlign: 'right', padding: '10px', fontSize: '14px', color: '#334155' }}>
                  {item.sesiones}
                </td>
                <td style={{ textAlign: 'right', padding: '10px', fontSize: '14px', color: '#334155' }}>
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
