import { AnimatePresence, motion } from 'framer-motion';
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
import { Sidebar } from './components/Sidebar/Sidebar';

function LoadingView(message) {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center py-24">
        <div className="pt-card p-8 text-center dark:border-slate-700 dark:bg-slate-800">
          <div className="text-2xl font-extrabold font-display">Cargando…</div>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{message}</p>
        </div>
      </div>
    </div>
  );
}

function ErrorView({ message }) {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center py-24">
        <div className="max-w-[520px] rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl dark:border-red-400/30 dark:bg-slate-800">
          <div className="text-lg font-extrabold font-display text-red-600">No se pudo abrir el dashboard</div>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{message}</p>
          <a href="../inicio.html" className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-blue-700">
            Volver a pacientes
          </a>
        </div>
      </div>
    </div>
  );
}

function EmptyView() {
  return (
    <div className="pt-card p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h3 className="font-display text-lg font-extrabold">Sin sesiones registradas</h3>
      <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        Este paciente todavía no tiene actividad suficiente para mostrar estadísticas.
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
  const [navKey, setNavKey] = useState('dashboard');

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

  const filteredWeeks = selectedWeek === 'todas'
    ? weeks
    : weeks.filter((week) => String(week.semana) === selectedWeek);

  const latestScore = weeks.at(-1)?.score ?? 0;
  const patientName = patient?.fullName ?? 'Paciente';

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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex max-w-[1400px]">
        <Sidebar activeKey={navKey} onNavigate={setNavKey} />

        <main className="flex-1 px-4 py-8 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={navKey}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <header className="pt-card dark:bg-dark-surface dark:border-dark-border p-6 md:p-7">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="min-w-[220px]">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
                      PhysioTrack
                    </div>
                    <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
                      {patientName}
                    </h1>
                    <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Deep Ocean & Cyan · Dashboard de progreso
                    </p>
                    <div className="mt-4">
                      <LevelBadge score={latestScore} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <ExportButton data={filteredWeeks} patientName={patientName} />
                    <DataFilter
                      semanas={weeks.map((week) => week.semana)}
                      value={selectedWeek}
                      onFilterChange={setSelectedWeek}
                    />
                    <a href="../inicio.html" className="pt-btn-primary">
                      Volver
                    </a>
                  </div>
                </div>
              </header>

              <div className="mt-6">
                {filteredWeeks.length === 0 ? <EmptyView /> : (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1, transition: { staggerChildren: 0.08 } },
                    }}
                    className="flex flex-col gap-6"
                  >
                    <motion.section variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}>
                      <WeeklyStats data={filteredWeeks} />
                    </motion.section>

                    <motion.section
                      variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                      className="grid grid-cols-1 gap-6 lg:grid-cols-2"
                    >
                      <ProgressChart data={filteredWeeks} />
                      <WeeklyStatsTable data={filteredWeeks} />
                    </motion.section>

                    <motion.section
                      variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                      className="pt-card p-6 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg font-extrabold">Evolución general</h3>
                          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            Tendencia del score por semana. Pulsa para ampliar.
                          </p>
                        </div>
                        <span className="pt-chip dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Vista interactiva
                        </span>
                      </div>
                      <GlobalChart data={filteredWeeks} onClick={() => setIsModalOpen(true)} />
                    </motion.section>

                    <motion.section variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}>
                      <WeeklyHistory data={filteredWeeks} />
                    </motion.section>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={filteredWeeks}
      />
    </div>
  );
}
