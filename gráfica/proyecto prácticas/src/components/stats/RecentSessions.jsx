// src/components/stats/RecentSessions.jsx
export const RecentSessions = ({ sessions }) => {
    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ marginTop: '0', marginBottom: '20px' }}>Historial reciente</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
                {sessions.map((session) => (
                    <div key={session.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '1px solid #f3f4f6'
                    }}>
                        <div>
                            <span style={{ display: 'block', fontWeight: '600' }}>{session.tipo}</span>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Semana {session.semana} - {session.fecha}</span>
                        </div>
                        <span style={{
                            fontSize: '12px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: '#dcfce7',
                            color: '#065f46',
                            fontWeight: 'bold',
                            alignSelf: 'center'
                        }}>
                            Completado
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};