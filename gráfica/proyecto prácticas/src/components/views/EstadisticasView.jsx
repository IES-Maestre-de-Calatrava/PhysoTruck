import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTokens } from '../../design/tokens';
import { GlobalChart } from '../charts/GlobalChart';
import { ChartModal } from '../charts/ChartModal';
import { ProgressChart } from '../charts/ProgressChart';
import { WeeklyStatsTable } from '../charts/WeeklyStatsTable';
import { WeeklyHistory } from '../stats/WeeklyHistory';
import { WeeklyStats } from '../stats/WeeklyStats';
import { DataFilter } from '../ui/DataFilter';

export function EstadisticasView({ weeks }) {
  const t = useTokens();
  const [selectedWeek, setSelectedWeek] = useState('todas');
  const [isModalOpen, setIsModalOpen]   = useState(false);

  const filtered = selectedWeek === 'todas'
    ? weeks
    : weeks.filter((w) => String(w.semana) === selectedWeek);

  if (!weeks.length) {
    return (
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: '20px',
          padding: '56px 40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: t.primaryBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <div style={{ fontWeight: 700, fontSize: '16px', color: t.text, marginBottom: '8px', fontFamily: "'Space Grotesk', sans-serif" }}>
          Sin sesiones registradas
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: t.textMuted }}>
          Este paciente todavía no tiene actividad suficiente para mostrar estadísticas.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
              Análisis clínico
            </div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: t.text, letterSpacing: '-0.5px' }}>
              Estadísticas
            </h1>
          </div>
          <DataFilter semanas={weeks.map((w) => w.semana)} value={selectedWeek} onFilterChange={setSelectedWeek} />
        </div>

        {/* KPI cards */}
        <WeeklyStats data={filtered} />

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <ProgressChart data={filtered} />
          <WeeklyStatsTable data={filtered} />
        </div>

        {/* Global chart */}
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: '20px',
            padding: '24px',
            boxShadow: t.cardShadow,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: 700, color: t.text }}>
                Evolución general
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: t.textMuted }}>
                Score y sesiones por semana · pulsa para ampliar
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px',
                border: `1px solid ${t.cardBorder}`,
                borderRadius: '10px',
                background: t.cardBgAlt,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                color: t.textSec,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = t.primaryBg; e.currentTarget.style.color = t.primaryText; e.currentTarget.style.borderColor = t.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = t.cardBgAlt; e.currentTarget.style.color = t.textSec; e.currentTarget.style.borderColor = t.cardBorder; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              Pantalla completa
            </button>
          </div>
          <GlobalChart data={filtered} onClick={() => setIsModalOpen(true)} />
        </div>

        {/* Weekly history */}
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: '20px',
            padding: '24px',
            boxShadow: t.cardShadow,
          }}
        >
          <WeeklyHistory data={filtered} />
        </div>
      </motion.div>

      <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={filtered} />
    </>
  );
}
