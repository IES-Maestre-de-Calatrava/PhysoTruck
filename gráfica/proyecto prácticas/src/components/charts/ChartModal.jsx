import { GlobalChart } from './GlobalChart';
import { useTokens } from '../../design/tokens';

export function ChartModal({ isOpen, onClose, data }) {
  const t = useTokens();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(15,23,42,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="scale-in"
        style={{
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: '24px',
          padding: '32px',
          width: 'min(960px, 100%)',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 60px rgba(15,23,42,0.28)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '20px', color: t.text, fontFamily: "'Space Grotesk', sans-serif" }}>
              Evolución general
            </h3>
            <p style={{ margin: 0, color: t.textMuted, fontSize: '14px' }}>
              Vista ampliada de la progresión semanal
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px',
              background: t.cardBgAlt,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: '10px',
              cursor: 'pointer',
              color: t.textSec,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = t.dangerBg; e.currentTarget.style.color = t.danger; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = t.cardBgAlt; e.currentTarget.style.color = t.textSec; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <GlobalChart data={data} />
      </div>
    </div>
  );
}
