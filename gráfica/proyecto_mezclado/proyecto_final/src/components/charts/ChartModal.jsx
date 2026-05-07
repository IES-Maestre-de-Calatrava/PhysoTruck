// src/components/charts/ChartModal.jsx
// ─────────────────────────────────────────────────────────────
// Modal de gráfica expandida del proyecto original.
// Usa GlobalChart (recharts) en su interior.
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { GlobalChart } from './GlobalChart';

/**
 * ChartModal
 * @param {boolean}  isOpen  - Controla visibilidad
 * @param {Function} onClose - Callback para cerrar
 * @param {Array}    data    - Datos de sesiones (de BD o mock)
 */
export const ChartModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', padding: '40px',
          borderRadius: '20px', width: '85%', maxWidth: '900px',
          maxHeight: '80vh', overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#1f2937' }}>Evolución General — Detalle</h3>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6', border: 'none', borderRadius: '8px',
              padding: '8px 16px', cursor: 'pointer', fontWeight: 600, color: '#374151',
            }}
          >
            ✕ Cerrar
          </button>
        </div>
        <GlobalChart data={data} />
      </div>
    </div>
  );
};
