import { useState } from 'react';
import { WeekChart } from '../charts/WeekChart';
import { useTokens } from '../../design/tokens';

const STATUS_STYLES = {
  'Muchos errores': { color: '#EF4444', bg: '#FEF2F2', dot: '#EF4444' },
  'Dia inestable':  { color: '#F59E0B', bg: '#FFFBEB', dot: '#F59E0B' },
  'Buen progreso':  { color: '#0D9488', bg: '#F0FDFA', dot: '#14B8A6' },
  'Progreso claro': { color: '#6366F1', bg: '#EEF2FF', dot: '#818CF8' },
};

function getScoreColor(score) {
  if (score >= 90) return { color: '#10B981', bg: '#ECFDF5' };
  if (score >= 75) return { color: '#0D9488', bg: '#F0FDFA' };
  if (score >= 60) return { color: '#F59E0B', bg: '#FFFBEB' };
  return               { color: '#EF4444', bg: '#FEF2F2' };
}

function MiniBar({ value, color, t }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '6px', background: t.divider, borderRadius: '999px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            height: '100%',
            background: color,
            borderRadius: '999px',
          }}
        />
      </div>
      <span style={{ fontSize: '12px', fontWeight: 700, color: t.text, minWidth: '32px', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}

function EventTag({ label, value, t }) {
  const zero = value === 0;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3px',
        padding: '9px 14px',
        minWidth: '80px',
        background: zero ? '#ECFDF5' : '#FEF2F2',
        border: `1px solid ${zero ? '#A7F3D0' : '#FECACA'}`,
        borderRadius: '12px',
      }}
    >
      <span style={{ fontSize: '18px', fontWeight: 800, color: zero ? '#10B981' : '#EF4444', fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}
      </span>
      <span style={{ fontSize: '10px', color: t.textMuted, textAlign: 'center', lineHeight: 1.2, fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}

function DayRow({ day, t }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_STYLES[day.estado] ?? STATUS_STYLES['Buen progreso'];
  const sc = getScoreColor(day.score);

  return (
    <div
      style={{
        border: `1px solid ${t.cardBorder}`,
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: open ? t.cardShadow : 'none',
        transition: 'box-shadow 0.2s ease',
        background: t.cardBg,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: t.text, minWidth: '90px', fontFamily: "'Space Grotesk', sans-serif" }}>
            {day.fecha}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              background: status.bg,
              color: status.color,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.dot, display: 'inline-block' }} />
            {day.estado}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{ fontSize: '12px', color: t.textMuted }}>{day.tiempo} min</span>
          <span
            style={{
              fontSize: '13px', fontWeight: 700,
              color: sc.color,
              background: sc.bg,
              padding: '4px 10px',
              borderRadius: '8px',
            }}
          >
            {day.score}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2.5"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div
          style={{
            padding: '16px',
            borderTop: `1px solid ${t.cardBorder}`,
            background: t.cardBgAlt,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: t.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                Score
              </div>
              <MiniBar value={day.score} color="#6366F1" t={t} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: t.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                Estabilidad
              </div>
              <MiniBar value={day.estabilidad} color="#14B8A6" t={t} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: t.textMuted, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Eventos
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <EventTag label="Colisiones"     value={day.eventos.colisiones}     t={t} />
              <EventTag label="Aceleraciones"  value={day.eventos.aceleraciones}  t={t} />
              <EventTag label="Frenadas"       value={day.eventos.frenadas}       t={t} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WeekCard({ week, t }) {
  const [open, setOpen] = useState(false);
  const sc = getScoreColor(week.score);
  const firstScore = week.dailyLogs[0]?.score ?? week.score;
  const lastScore  = week.dailyLogs.at(-1)?.score ?? week.score;
  const trend = lastScore - firstScore;

  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: open ? t.cardShadow : 'none',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '18px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '16px',
        }}
      >
        {/* Week number bubble */}
        <div
          style={{
            width: '48px', height: '48px',
            borderRadius: '14px',
            background: open ? 'linear-gradient(135deg,#6366F1,#4F46E5)' : t.primaryBg,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s ease',
          }}
        >
          <span style={{ fontSize: '9px', color: open ? 'rgba(255,255,255,0.7)' : t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Sem
          </span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: open ? '#fff' : t.primary, lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
            {week.semana}
          </span>
        </div>

        {/* Info */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', background: sc.bg, color: sc.color }}>
            Score {week.score}
          </span>
          <span style={{ fontSize: '13px', color: t.textSec, fontWeight: 500 }}>{week.tiempo} min</span>
          <span style={{ fontSize: '13px', color: t.textSec, fontWeight: 500 }}>{week.sesiones} ses.</span>
          {trend !== 0 && (
            <span style={{ fontSize: '12px', fontWeight: 700, color: trend > 0 ? '#10B981' : '#EF4444' }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)} pts
            </span>
          )}
        </div>

        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${t.cardBorder}` }}>
          <div style={{ padding: '16px 20px 8px' }}>
            <p style={{ fontSize: '11px', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 12px', fontWeight: 600 }}>
              Rendimiento diario
            </p>
            <WeekChart dailyLogs={week.dailyLogs} />
          </div>
          <div style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '11px', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px', fontWeight: 600 }}>
              Detalle por día
            </p>
            {week.dailyLogs.map((day, i) => (
              <DayRow key={`${week.id}-${day.fecha}-${i}`} day={day} t={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function WeeklyHistory({ data }) {
  const t = useTokens();

  if (!data?.length) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '17px', color: t.text, fontFamily: "'Space Grotesk', sans-serif" }}>
            Historial semanal
          </h3>
          <p style={{ margin: 0, color: t.textMuted, fontSize: '13px' }}>
            Despliega cada semana para ver el detalle diario.
          </p>
        </div>
        <span
          style={{
            fontSize: '12px', fontWeight: 600,
            padding: '5px 12px',
            borderRadius: '999px',
            background: t.primaryBg,
            color: t.primaryText,
          }}
        >
          {data.length} semanas
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.map((week) => (
          <WeekCard key={week.id} week={week} t={t} />
        ))}
      </div>
    </div>
  );
}
