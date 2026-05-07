// src/App.jsx
// ─────────────────────────────────────────────────────────────
// App principal — mezcla de ambos proyectos:
//   · Visual de gráficas del ORIGINAL (recharts)
//   · Modelo de componentes del ACTUALIZADO (stats, badges)
//   · Capa de servicio lista para BD real (services/api.js)
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';

// UI
import { LevelBadge }      from './components/ui/LevelBadge';
import { ExportButton }    from './components/ui/ExportButton';
import { DataFilter }      from './components/ui/DataFilter';

// Stats
import { WeeklyStats }     from './components/stats/WeeklyStats';
import { WeeklyHistory }   from './components/stats/WeeklyHistory';

// Charts (visual del original con recharts)
import { GlobalChart }     from './components/charts/GlobalChart';
import { ChartModal }      from './components/charts/ChartModal';

// Servicio de datos (mock → BD real cambiando USE_MOCK en api.js)
import { getSesiones }     from './services/api';

function App() {
  const [sesiones, setSesiones]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtro, setFiltro]           = useState('todas');

  // ── Carga de datos (mock o BD real) ───────────────────────
  useEffect(() => {
    getSesiones('alberto')
      .then(setSesiones)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Filtrado dinámico ──────────────────────────────────────
  const datosFiltrados = filtro === 'todas'
    ? sesiones
    : sesiones.filter((s) => String(s.semana) === filtro);

  const ultimoScore = sesiones.length ? sesiones[sesiones.length - 1].score : 0;
  const semanas     = sesiones.map((s) => s.semana);

  // ── Estados de carga / error ───────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p style={{ fontSize: '16px' }}>Cargando datos…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fef2f2' }}>
        <div style={{ textAlign: 'center', color: '#dc2626', padding: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚠️</div>
          <h2>Error al cargar los datos</h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>{error}</p>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '12px' }}>
            Comprueba que tu API está activa en <code>src/services/api.js</code>
          </p>
        </div>
      </div>
    );
  }

  // ── Render principal ───────────────────────────────────────
  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#bbb', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Seguimiento de progreso
          </p>
          <h1 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: 300, color: '#1a1a1a' }}>
            Dashboard de <span style={{ color: '#3b82f6', fontStyle: 'italic' }}>Alberto</span>
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '10px', fontSize: '14px' }}>Tu progreso detallado</p>
          <LevelBadge score={ultimoScore} />
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <ExportButton data={sesiones} />
            <DataFilter semanas={semanas} onFilterChange={setFiltro} />
          </div>
        </header>

        {/* RESUMEN ESTADÍSTICAS */}
        <section>
          <WeeklyStats data={datosFiltrados} />
        </section>

        {/* GRÁFICA GLOBAL — visual del original (recharts LineChart) */}
        <section style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>Evolución General</h3>
          <GlobalChart data={datosFiltrados} onClick={() => setIsModalOpen(true)} />
        </section>

        {/* HISTORIAL SEMANAL — modelo actualizado + WeekChart recharts */}
        <section>
          <WeeklyHistory data={datosFiltrados} />
        </section>

      </div>

      {/* MODAL de gráfica expandida */}
      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={sesiones}
      />
    </div>
  );
}

export default App;
