import { useEffect, useState } from 'react';
import { GlobalChart } from './components/charts/GlobalChart';
import { ChartModal } from './components/charts/ChartModal';
import { ProgressChart } from './components/charts/ProgressChart';
import { WeeklyHistory } from './components/stats/WeeklyHistory';
import { WeeklyStats } from './components/stats/WeeklyStats';
import { WeeklyStatsTable } from './components/stats/WeeklyStatsTable';
import { DataFilter } from './components/ui/DataFilter';
import { ExportButton } from './components/ui/ExportButton';
import { LevelBadge } from './components/ui/LevelBadge';
import { useAuth } from './context/AuthContext';
import { getSesiones } from './services/api';

const pageStyle = {
  padding: '40px 20px',
  background: 'linear-gradient(180deg, #f7faff 0%, #f4f7fa 100%)',
  minHeight: '100vh',
  boxSizing: 'border-box',
};

const shellStyle = {
  maxWidth: '1120px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #d6e0ef',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 82, 204, 0.05)',
};

function LoadingView(message) {
  return (
    <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>Cargando...</div>
        <p style={{ margin: 0 }}>{message}</p>
      </div>
    </div>
  );
}

function ErrorView({ message }) {
  return (
    <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #fecaca',
          borderRadius: '16px',
          padding: '26px 32px',
          color: '#991b1b',
          textAlign: 'center',
          maxWidth: '440px',
          boxShadow: '0 16px 30px rgba(127, 29, 29, 0.08)',
        }}
      >
        <p style={{ margin: '0 0 12px', fontWeight: 700 }}>No se pudo abrir el dashboard</p>
        <p style={{ margin: '0 0 18px', lineHeight: 1.5 }}>{message}</p>
        <a href="../inicio.html" style={{ color: '#1d4ed8', fontSize: '14px', fontWeight: 700 }}>
          Volver al listado de pacientes
        </a>
      </div>
    </div>
  );
}

function EmptyView() {
  return (
    <div style={{ ...cardStyle, padding: '28px', textAlign: 'center' }}>
      <h3 style={{ margin: '0 0 8px', color: '#10233c' }}>Sin sesiones registradas</h3>
      <p style={{ margin: 0, color: '#64748b' }}>
        Este paciente todavia no tiene actividad suficiente para mostrar estadisticas.
      </p>
    </div>
  );
}

export default function App() {
  const { patient, loading: authLoading, error: authError } = useAuth();
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!patient?.id) {
      return undefined;
    }

    let isCancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        const dashboardWeeks = await getSesiones(patient.id);
        if (!isCancelled) {
          setWeeks(dashboardWeeks);
          setError(null);
        }
      } catch (currentError) {
        if (!isCancelled) {
          setError(currentError.message);
          setWeeks([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, [patient?.id]);

  if (authLoading) {
    return LoadingView('Resolviendo paciente y sesion activa...');
  }

  if (authError) {
    return <ErrorView message={authError} />;
  }

  if (loading) {
    return LoadingView('Cargando sesiones y estadisticas semanales...');
  }

  if (error) {
    return <ErrorView message={error} />;
  }

  const filteredWeeks = selectedWeek === 'todas'
    ? weeks
    : weeks.filter((week) => String(week.semana) === selectedWeek);

  const latestScore = weeks.at(-1)?.score ?? 0;
  const patientName = patient?.fullName ?? 'Paciente';

  return (
    <div style={pageStyle} className="app-enter">
      <div style={shellStyle}>
        <header
          style={{
            ...cardStyle,
            padding: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#6b83ab',
                fontWeight: 700,
              }}
            >
              PhysioTrack
            </p>
            <h1
              style={{
                margin: '0 0 6px',
                fontSize: '2rem',
                fontWeight: 800,
                color: '#172b4d',
                letterSpacing: '-0.03em',
              }}
            >
              {patientName}
            </h1>
            <p style={{ margin: '0 0 14px', color: '#5c7194', fontSize: '14px' }}>
              Dashboard de progreso diario y semanal
            </p>
            <LevelBadge score={latestScore} />
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <ExportButton data={filteredWeeks} patientName={patientName} />
            <DataFilter
              semanas={weeks.map((week) => week.semana)}
              value={selectedWeek}
              onFilterChange={setSelectedWeek}
            />
            <a
              href="../inicio.html"
              style={{
                background: '#e9f1ff',
                color: '#0052cc',
                borderRadius: '10px',
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #c6d8f8',
              }}
            >
              Volver
            </a>
          </div>
        </header>

        {filteredWeeks.length === 0 ? <EmptyView /> : (
          <>
            <section className="app-stagger" style={{ animationDelay: '0.06s' }}>
              <WeeklyStats data={filteredWeeks} />
            </section>

            <section
              className="app-stagger"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
                animationDelay: '0.12s',
              }}
            >
              <ProgressChart data={filteredWeeks} />
              <WeeklyStatsTable data={filteredWeeks} />
            </section>

            <section className="app-stagger" style={{ ...cardStyle, padding: '24px', animationDelay: '0.2s' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '18px',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 4px', color: '#172b4d' }}>Evolucion global</h3>
                  <p style={{ margin: 0, color: '#5c7194', fontSize: '13px' }}>
                    Tendencia del score por semana. Pulsa para ampliar.
                  </p>
                </div>
                <span style={{ fontSize: '12px', color: '#6b83ab' }}>Vista interactiva</span>
              </div>
              <GlobalChart data={filteredWeeks} onClick={() => setIsModalOpen(true)} />
            </section>

            <section className="app-stagger" style={{ animationDelay: '0.28s' }}>
              <WeeklyHistory data={filteredWeeks} />
            </section>
          </>
        )}
      </div>

      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={filteredWeeks}
      />
    </div>
  );
}
