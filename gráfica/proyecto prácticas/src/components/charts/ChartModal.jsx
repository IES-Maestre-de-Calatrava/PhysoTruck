import { GlobalChart } from './GlobalChart';

export function ChartModal({ isOpen, onClose, data }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          background: '#ffffff',
          padding: '32px',
          borderRadius: '20px',
          width: 'min(920px, 100%)',
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px rgba(15, 23, 42, 0.24)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '20px', color: '#10233c' }}>
              Evolucion general
            </h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
              Vista ampliada de la progresion semanal.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
              padding: '8px 14px',
              cursor: 'pointer',
              fontWeight: 700,
              color: '#1d4ed8',
            }}
          >
            Cerrar
          </button>
        </div>
        <GlobalChart data={data} />
      </div>
    </div>
  );
}
