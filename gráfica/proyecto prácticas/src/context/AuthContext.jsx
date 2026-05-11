import { createContext, useContext, useEffect, useState } from 'react';

const API_BASE = 'http://localhost:9090';
const TOKEN_KEY = 'physiotrack_token';
const LAST_PATIENT_KEY = 'physiotrack_last_patient';

const AuthContext = createContext(null);

async function fetchPatients(token) {
  const res = await fetch(`${API_BASE}/api/patients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('401');
  if (!res.ok) throw new Error('No se pudo obtener la lista de pacientes.');
  return res.json();
}

function normalize(str) {
  return String(str ?? '').toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function resolvePatientFromUrl(patients) {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('patient');
  if (!raw) return null;

  const decoded = decodeURIComponent(raw);

  // Por ID numérico primero
  const byId = patients.find((p) => String(p.id) === decoded);
  if (byId) return byId;

  // Por nombre normalizado (legacy: links hardcodeados con nombre)
  return patients.find((p) => normalize(p.fullName) === normalize(decoded)) ?? null;
}

export function AuthProvider({ children }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setError('No hay sesión activa. Inicia sesión primero.');
      setLoading(false);
      return;
    }

    fetchPatients(token)
      .then((patients) => {
        const resolved = resolvePatientFromUrl(patients);
        if (!resolved) throw new Error('Paciente no encontrado o sin acceso desde tu cuenta.');
        localStorage.setItem(LAST_PATIENT_KEY, String(resolved.id));
        setPatient(resolved);
      })
      .catch((err) => {
        if (err.message === '401') {
          localStorage.removeItem(TOKEN_KEY);
          setError('Sesión expirada. Vuelve a iniciar sesión.');
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ patient, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
