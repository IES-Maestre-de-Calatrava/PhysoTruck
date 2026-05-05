import React, { useState } from 'react';
import { LevelBadge } from './components/ui/LevelBadge';
import { WeeklyStats } from './components/stats/WeeklyStats';
import { WeeklyHistory } from './components/stats/WeeklyHistory';
import { UsageChart } from './components/charts/UsageChart';
import { ChartModal } from './components/charts/ChartModal';

const sesiones = [
  { id: 1, semana: 1, sesiones: 2, score: 25, tiempo: 30 },
  { id: 2, semana: 2, sesiones: 3, score: 55, tiempo: 45 },
  { id: 3, semana: 3, sesiones: 4, score: 85, tiempo: 60 },
  { id: 4, semana: 4, sesiones: 5, score: 92, tiempo: 90 },
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ultimoScore = sesiones.length > 0 ? sesiones[sesiones.length - 1].score : 0;

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '10px' }}>Dashboard de Alberto</h1>
          <p style={{ color: '#6b7280', marginBottom: '10px' }}>Tu progreso detallado</p>
          <LevelBadge score={ultimoScore} />
        </header>

        <section style={{ marginBottom: '30px' }}>
          <WeeklyStats data={sesiones} />
        </section>

        <section>
          <WeeklyHistory data={sesiones} />
        </section>

        <section style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px' }}>Evolución de sesiones y tiempo</h3>
          <UsageChart data={sesiones} onClick={() => setIsModalOpen(true)} />
        </section>

        <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={sesiones} />
      </div>
    </div>
  );
}

export default App;