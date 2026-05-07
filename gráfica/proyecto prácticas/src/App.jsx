import React, { useState, useEffect } from 'react';
import { LevelBadge } from './components/ui/LevelBadge';
import { ExportButton } from './components/ui/ExportButton';
import { WeeklyStats } from './components/stats/WeeklyStats';
import { WeeklyHistory } from './components/stats/WeeklyHistory';
import { RecentSessions } from './components/stats/RecentSessions';
import { UsageChart } from './components/charts/UsageChart';
import { ChartModal } from './components/charts/ChartModal';
import { ProgressChart } from './components/charts/ProgressChart';
import { WeeklyStatsTable } from './components/charts/WeeklyStatsTable';
import { apiGetPatients, apiGetProgress, apiGetSessions } from './api';

function getParamPatient() {
  return new URLSearchParams(window.location.search).get('patient') || 'Paciente';
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekData, setWeekData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [patientName, setPatientName] = useState(getParamPatient());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const name = getParamPatient();
    setPatientName(name);
    loadData(name);
  }, []);

  async function loadData(name) {
    try {
      const patients = await apiGetPatients();
      const patient = patients.find(p =>
        p.fullName.toLowerCase().includes(name.toLowerCase())
      );
      if (!patient) throw new Error(`Paciente "${name}" no encontrado`);

      const progress = await apiGetProgress(patient.id);
      const weeks = progress.weeks || [];

      const mapped = weeks.map(w => ({
        id: w.week,
        semana: w.week,
        sesiones: w.totalSessions || 0,
        score: Math.round(w.avgDrivingScore || 0),
        tiempo: Math.round((w.avgMovementTime || 0) / 60000),
      }));

      const chartMapped = weeks.map(w => ({
        name: `Sem ${w.week}`,
        puntos: Math.round(w.avgDrivingScore || 0),
      }));

      setWeekData(mapped);
      setProgressData(chartMapped);

      // Cargar sesiones de la última semana disponible
      if (weeks.length > 0) {
        const lastWeek = weeks[weeks.length - 1].week;
        try {
          const sessions = await apiGetSessions(patient.id, lastWeek);
          const mappedSessions = sessions.map(s => ({
            id: s.id,
            tipo: s.drivingLevel || 'Sesión',
            semana: s.weekNumber || lastWeek,
            fecha: s.startedAt
              ? new Date(s.startedAt).toLocaleDateString('es-ES')
              : '—',
          }));
          setRecentSessions(mappedSessions);
        } catch (_) {
          setRecentSessions([]);
        }
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const ultimoScore = weekData.length > 0 ? weekData[weekData.length - 1].score : 0;

  const tableData = weekData.map(w => ({ semana: w.semana, scoreMedio: w.score }));

  const pageStyle = {
    padding: '40px 20px',
    backgroundColor: '#f0f4f9',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  };

  const cardStyle = {
    background: '#fff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)',
    border: '1px solid #e8eef5',
    marginBottom: '24px',
  };

  if (loading) {
    return (
      <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#8fa3bc' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
          <p style={{ margin: 0 }}>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px',
          padding: '24px 32px', color: '#b91c1c', textAlign: 'center', maxWidth: '400px',
        }}>
          <p style={{ margin: '0 0 12px', fontWeight: '600' }}>Error: {error}</p>
          <a href="../index.html" style={{ color: '#1a56a0', fontSize: '14px' }}>← Volver al inicio</a>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <header style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.75rem', fontWeight: '800', color: '#0d1b2e', letterSpacing: '-0.3px' }}>
              {patientName}
            </h1>
            <p style={{ margin: '0 0 10px', color: '#8fa3bc', fontSize: '0.9rem' }}>Dashboard de progreso</p>
            <LevelBadge score={ultimoScore} />
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <ExportButton data={weekData} patientName={patientName} />
            <a
              href="javascript:history.back()"
              style={{
                background: '#1a56a0', color: 'white', borderRadius: '8px',
                padding: '8px 16px', fontSize: '14px', fontWeight: '600',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              ← Volver
            </a>
          </div>
        </header>

        {/* ── Tiles de estadísticas ── */}
        <section style={{ marginBottom: '24px' }}>
          <WeeklyStats data={weekData} />
        </section>

        {/* ── Evolución del score (AreaChart) ── */}
        <section>
          <ProgressChart data={progressData} />
        </section>

        {/* ── Evolución de sesiones y tiempo (ComposedChart) ── */}
        <section style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#0d1b2e', fontWeight: '700' }}>Evolución de sesiones y tiempo</h3>
            <span style={{ fontSize: '12px', color: '#8fa3bc' }}>Clic para ampliar</span>
          </div>
          <UsageChart data={weekData} onClick={() => setIsModalOpen(true)} />
        </section>

        {/* ── Dos columnas: tabla historial + sesiones recientes ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <section>
            <WeeklyStatsTable data={tableData} />
          </section>
          <section>
            {recentSessions.length > 0
              ? <RecentSessions sessions={recentSessions} />
              : (
                <div style={{ ...cardStyle, marginBottom: 0 }}>
                  <h3 style={{ margin: '0 0 12px', color: '#0d1b2e', fontWeight: '700' }}>Sesiones recientes</h3>
                  <p style={{ color: '#8fa3bc', fontSize: '14px', margin: 0 }}>No hay sesiones registradas</p>
                </div>
              )
            }
          </section>
        </div>

        {/* ── Historial semanal completo ── */}
        <section style={{ marginBottom: '24px' }}>
          <WeeklyHistory data={weekData} />
        </section>

      </div>

      <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={weekData} />
    </div>
  );
}

export default App;
