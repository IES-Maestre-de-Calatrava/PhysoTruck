import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { getSesiones } from './services/api';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ResumenView } from './components/views/ResumenView';
import { EstadisticasView } from './components/views/EstadisticasView';
import { InformesView } from './components/views/InformesView';
import { LevelBadge } from './components/ui/LevelBadge';
import { PatientAvatar } from './components/ui/PatientAvatar';

/* ─── loading ───────────────────────────────────────────────────── */

function LoadingView({ message }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F0F4F8' }}>
      <div style={{ textAlign: 'center', maxWidth: '320px' }}>
        <div
          style={{
            width: '44px', height: '44px',
            border: '3px solid #E2E8F0',
            borderTopColor: '#6366F1',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', marginBottom: '6px', fontFamily: "'Space Grotesk', sans-serif" }}>
          Cargando…
        </div>
        <div style={{ fontSize: '13px', color: '#94A3B8' }}>{message}</div>
      </div>
    </div>
  );
}

/* ─── error ─────────────────────────────────────────────────────── */

function ErrorView({ message }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F0F4F8', padding: '20px' }}>
      <div
        style={{
          maxWidth: '440px', width: '100%',
          background: '#ffffff',
          border: '1px solid #FECACA',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(239,68,68,0.08)',
        }}
      >
        <div
          style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: '#FEF2F2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div style={{ fontWeight: 800, fontSize: '17px', color: '#0F172A', marginBottom: '8px', fontFamily: "'Space Grotesk', sans-serif" }}>
          No se pudo cargar
        </div>
        <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748B', lineHeight: 1.6 }}>{message}</p>
        <a
          href="../inicio.html"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '11px 22px',
            background: 'linear-gradient(135deg,#6366F1,#4F46E5)',
            color: '#ffffff',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}
        >
          Volver a pacientes
        </a>
      </div>
    </div>
  );
}

/* ─── app ────────────────────────────────────────────────────────── */

export default function App() {
  const { patient, loading: authLoading, error: authError } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [weeks, setWeeks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [navKey, setNavKey]   = useState('resumen');

  useEffect(() => {
    if (!patient?.id) return undefined;
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await getSesiones(patient.id);
        if (!cancelled) { setWeeks(data); setError(null); }
      } catch (err) {
        if (!cancelled) { setError(err.message); setWeeks([]); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [patient?.id]);

  if (authLoading) return <LoadingView message="Resolviendo sesión activa…" />;
  if (authError)   return <ErrorView message={authError} />;
  if (loading)     return <LoadingView message="Cargando sesiones y estadísticas…" />;
  if (error)       return <ErrorView message={error} />;

  const patientName = patient?.fullName ?? 'Paciente';
  const lastScore   = weeks.at(-1)?.score ?? 0;
  const totalSes    = weeks.reduce((s, w) => s + w.sesiones, 0);

  const pageBg     = isDark ? '#0B1120' : '#F0F4F8';
  const headerBg   = isDark ? '#1E293B' : '#FFFFFF';
  const headerBdr  = isDark ? '#334155' : '#E2E8F0';
  const textMain   = isDark ? '#F1F5F9' : '#0F172A';
  const textMuted  = isDark ? '#64748B' : '#94A3B8';
  const chipBg     = isDark ? '#0F172A' : '#F8FAFC';
  const chipBdr    = isDark ? '#334155' : '#E2E8F0';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: pageBg }}>
      <Sidebar activeKey={navKey} onNavigate={setNavKey} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top header */}
        <header
          style={{
            background: headerBg,
            borderBottom: `1px solid ${headerBdr}`,
            padding: '0 28px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexShrink: 0,
            boxShadow: isDark
              ? '0 1px 0 rgba(255,255,255,0.04)'
              : '0 1px 3px rgba(15,23,42,0.04)',
          }}
        >
          {/* Patient info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
            <PatientAvatar patientId={patient?.id} size={36} borderRadius="10px" />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                Paciente activo
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: textMain, lineHeight: 1, fontFamily: "'Space Grotesk',sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {patientName}
              </div>
            </div>
            <LevelBadge score={lastScore} />
          </div>

          {/* Stats chips */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px',
                background: chipBg,
                border: `1px solid ${chipBdr}`,
                borderRadius: '8px',
                fontSize: '13px', fontWeight: 600, color: textMain,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {weeks.length} semanas
            </div>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px',
                background: chipBg,
                border: `1px solid ${chipBdr}`,
                borderRadius: '8px',
                fontSize: '13px', fontWeight: 600, color: textMain,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              {totalSes} sesiones
            </div>
          </div>
        </header>

        {/* Main content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={navKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {navKey === 'resumen' && (
                <ResumenView patient={patient} weeks={weeks} />
              )}
              {navKey === 'estadisticas' && (
                <EstadisticasView weeks={weeks} />
              )}
              {navKey === 'informes' && (
                <InformesView weeks={weeks} patientName={patientName} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
