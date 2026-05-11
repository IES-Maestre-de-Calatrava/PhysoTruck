import { useTheme } from '../../context/ThemeContext';

const NAV_ITEMS = [
  {
    key: 'resumen',
    label: 'Resumen',
    desc: 'Vista del paciente',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: 'estadisticas',
    label: 'Estadísticas',
    desc: 'Gráficas y datos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    key: 'informes',
    label: 'Informes',
    desc: 'Exportar datos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
];

export function Sidebar({ activeKey, onNavigate }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <aside
      style={{
        width: '240px',
        minHeight: '100vh',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: 'linear-gradient(180deg,#1E293B 0%,#0F172A 100%)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 10,
      }}
      className="sidebar-nav"
    >
      {/* Logo */}
      <div style={{ padding: '28px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg,#6366F1,#4F46E5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.3px', fontFamily: "'Space Grotesk', sans-serif" }}>
              PhysioTrack
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, marginTop: '1px' }}>
              Panel clínico
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 20px 16px' }} />

      {/* Nav section label */}
      <div style={{ padding: '0 20px 10px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
          Navegación
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                background: isActive ? 'rgba(99,102,241,0.18)' : 'transparent',
                color: isActive ? '#A5B4FC' : '#64748B',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                transition: 'all 0.18s ease',
                outline: 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                if (!isActive) e.currentTarget.style.color = '#94A3B8';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
                if (!isActive) e.currentTarget.style.color = '#64748B';
              }}
            >
              {/* Active left accent */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '60%',
                    background: 'linear-gradient(180deg,#818CF8,#6366F1)',
                    borderRadius: '0 2px 2px 0',
                  }}
                />
              )}
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', color: isActive ? '#818CF8' : 'currentColor' }}>
                {item.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ lineHeight: 1.2 }}>{item.label}</div>
                <div style={{ fontSize: '11px', color: isActive ? '#6366F1' : '#475569', marginTop: '1px', fontWeight: 400 }}>
                  {item.desc}
                </div>
              </div>
              {isActive && (
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#6366F1',
                    flexShrink: 0,
                    boxShadow: '0 0 6px rgba(99,102,241,0.6)',
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '16px 12px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '8px' }}>
        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            border: 'none',
            borderRadius: '10px',
            background: 'transparent',
            cursor: 'pointer',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '4px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94A3B8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
        >
          {isDark ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </button>

        {/* Back to patients */}
        <a
          href="../inicio.html"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 500,
            boxSizing: 'border-box',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94A3B8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver a pacientes
        </a>
      </div>
    </aside>
  );
}
