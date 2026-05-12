import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { PatientAvatar } from '../ui/PatientAvatar';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function ResumenView({ patient, weeks }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const NOTES_KEY = `physiotrack_notes_${patient?.id ?? 'default'}`;
  const [notes, setNotes]             = useState(() => localStorage.getItem(NOTES_KEY) ?? '');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    setNotes(localStorage.getItem(NOTES_KEY) ?? '');
  }, [NOTES_KEY]);

  function saveNotes() {
    localStorage.setItem(NOTES_KEY, notes);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1600);
  }

  const totalSessions  = weeks.reduce((s, w) => s + w.sesiones, 0);
  const totalMinutes   = weeks.reduce((s, w) => s + w.tiempo, 0);
  const avgEstabilidad = useMemo(() => {
    const days = weeks.flatMap((w) => w.dailyLogs ?? []);
    if (!days.length) return 0;
    return Math.round(days.reduce((s, d) => s + (d.estabilidad ?? 0), 0) / days.length);
  }, [weeks]);
  const lastScore = weeks.at(-1)?.score ?? 0;

  /* tokens */
  const pageBg    = isDark ? '#0B1120'                  : '#F0F4F8';
  const cardBg    = isDark ? 'rgba(30,41,59,0.9)'       : '#FFFFFF';
  const boxBg     = isDark ? '#0F172A'                  : '#F8FAFC';
  const boxBorder = isDark ? '#1E293B'                  : '#E2E8F0';
  const textColor = isDark ? '#F1F5F9'                  : '#0F172A';
  const mutedText = isDark ? '#475569'                  : '#94A3B8';
  const labelClr  = isDark ? '#64748B'                  : '#64748B';
  const divider   = isDark ? 'rgba(255,255,255,0.06)'   : '#E2E8F0';

  const active = patient?.active !== false;

  const statItems = [
    { label: 'Código paciente',     value: patient?.id ? `#${String(patient.id).padStart(4, '0')}` : '—', color: '#6366F1' },
    { label: 'Inicio tratamiento',  value: formatDate(patient?.treatmentStart),                            color: '#0D9488' },
    { label: 'Sesiones totales',    value: totalSessions,                                                  color: '#8B5CF6' },
    { label: 'Estabilidad media',   value: avgEstabilidad ? `${avgEstabilidad}%` : '—',                   color: '#F59E0B' },
    { label: 'Tiempo total',        value: `${totalMinutes} min`,                                          color: '#10B981' },
    { label: 'Score actual',        value: `${lastScore} / 100`,                                           color: '#6366F1' },
    ...(patient?.birthDate
      ? [{ label: 'Nacimiento', value: formatDate(patient.birthDate), color: '#EC4899' }]
      : []),
    { label: 'Semanas registradas', value: weeks.length,                                                   color: '#0D9488' },
  ];

  return (
    <div
      style={{
        margin: '-28px',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        background: pageBg,
        overflow: 'hidden',
      }}
    >
      {/* ── Patient banner ─────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg,#6366F1 0%,#4F46E5 100%)',
          padding: '18px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          flexShrink: 0,
        }}
      >
        {/* Avatar */}
        <PatientAvatar
          patientId={patient?.id}
          size={56}
          borderRadius="16px"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
        />

        {/* Name + diagnosis */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'white', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {patient?.fullName ?? '—'}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.72)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {patient?.diagnosis ?? 'Sin diagnóstico registrado'}
          </div>
        </div>

        {/* Level + score pill */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <div
            style={{
              padding: '6px 14px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.18)',
              fontSize: '12px', fontWeight: 700, color: 'white',
              letterSpacing: '0.02em',
            }}
          >
            {patient?.currentLevel ?? '—'}
          </div>
          <div
            style={{
              padding: '6px 14px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              fontSize: '12px', fontWeight: 700, color: 'white',
            }}
          >
            {lastScore} / 100
          </div>
        </div>

        {/* Status */}
        <div
          style={{
            padding: '6px 14px', borderRadius: '999px',
            background: active ? 'rgba(16,185,129,0.22)' : 'rgba(239,68,68,0.22)',
            border: `1px solid ${active ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
            fontSize: '12px', fontWeight: 700,
            color: active ? '#6EE7B7' : '#FCA5A5',
            flexShrink: 0,
          }}
        >
          {active ? 'Activo' : 'Inactivo'}
        </div>
      </div>

      {/* ── Body: stats + notes side by side ──────────── */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0',
          overflow: 'hidden',
        }}
      >

        {/* Left — stat grid */}
        <div
          style={{
            padding: '20px 20px 20px 24px',
            borderRight: `1px solid ${divider}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 700, color: mutedText, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
            Datos del paciente
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              flex: 1,
              alignContent: 'start',
            }}
          >
            {statItems.map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  background: boxBg,
                  border: `1px solid ${boxBorder}`,
                  borderRadius: '14px',
                  padding: '12px 15px',
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: labelClr, marginBottom: '5px', fontWeight: 600 }}>
                  {label}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: textColor, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.3px' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — notes */}
        <div
          style={{
            padding: '20px 24px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div
              style={{
                width: '26px', height: '26px', borderRadius: '8px',
                background: isDark ? 'rgba(99,102,241,0.18)' : '#EEF2FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6366F1', flexShrink: 0,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: mutedText, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Observaciones clínicas
            </div>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escribe aquí tus observaciones clínicas sobre este paciente…"
            style={{
              flex: 1,
              resize: 'none',
              border: `1px solid ${boxBorder}`,
              borderRadius: '14px',
              padding: '14px 16px',
              fontSize: '14px',
              lineHeight: 1.65,
              background: boxBg,
              color: textColor,
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#6366F1'; }}
            onBlur={(e)  => { e.target.style.borderColor = boxBorder;  }}
          />

          <button
            onClick={saveNotes}
            style={{
              marginTop: '12px',
              border: 'none',
              padding: '11px 0',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              color: 'white',
              fontSize: '14px',
              fontFamily: "'Space Grotesk', sans-serif",
              background: savedFeedback
                ? 'linear-gradient(135deg,#10B981,#059669)'
                : 'linear-gradient(135deg,#6366F1,#4F46E5)',
              boxShadow: savedFeedback
                ? '0 4px 12px rgba(16,185,129,0.28)'
                : '0 4px 12px rgba(99,102,241,0.28)',
              transition: 'all 0.22s ease',
              width: '100%',
            }}
            onMouseEnter={(e) => { if (!savedFeedback) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {savedFeedback ? 'Guardado' : 'Guardar observaciones'}
          </button>
        </div>
      </div>
    </div>
  );
}
