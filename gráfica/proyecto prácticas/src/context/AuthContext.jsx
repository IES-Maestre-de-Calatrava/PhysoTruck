import { createContext, useContext, useEffect, useState } from 'react';
import { getPatients, TOKEN_KEY, USE_MOCK } from '../services/api';

const AuthContext = createContext(null);
const LAST_PATIENT_KEY = 'physiotrack_last_patient';

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function resolvePatientFromParam(patients, rawParam) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return null;
  }

  if (!rawParam) {
    return patients.find((patient) => patient.active) ?? patients[0] ?? null;
  }

  const numericId = Number(rawParam);
  if (Number.isInteger(numericId)) {
    const byId = patients.find((patient) => Number(patient.id) === numericId);
    if (byId) {
      return byId;
    }
  }

  const normalizedParam = normalizeText(rawParam);
  return (
    patients.find((patient) => normalizeText(patient.fullName) === normalizedParam)
    ?? patients.find((patient) => normalizeText(patient.fullName).includes(normalizedParam))
    ?? null
  );
}

function buildMockPatient(rawParam) {
  const numericId = Number(rawParam);
  const id = Number.isInteger(numericId) && numericId > 0 ? numericId : 1;
  const fullName = rawParam && !Number.isInteger(numericId)
    ? rawParam
    : 'Paciente demo';

  return {
    id,
    fullName,
    currentLevel: 'Competente',
    active: true,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const rawParam = new URLSearchParams(window.location.search).get('patient');
    const rememberedPatient = localStorage.getItem(LAST_PATIENT_KEY);
    const patientQuery = rawParam ?? rememberedPatient;

    if (USE_MOCK) {
      setPatient(buildMockPatient(rawParam));
      setError(null);
      setLoading(false);
      return;
    }

    if (!token) {
      setError('No hay una sesion activa. Vuelve al inicio e inicia sesion.');
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function resolvePatient() {
      try {
        const patients = await getPatients();
        const resolvedPatient = resolvePatientFromParam(patients, patientQuery);

        if (!resolvedPatient) {
          throw new Error(
            patientQuery
              ? `No se ha encontrado el paciente "${patientQuery}".`
              : 'No hay pacientes disponibles para abrir el dashboard.',
          );
        }

        if (!isCancelled) {
          setPatient(resolvedPatient);
          localStorage.setItem(LAST_PATIENT_KEY, String(resolvedPatient.id));
          setError(null);
        }
      } catch (currentError) {
        if (!isCancelled) {
          setError(currentError.message);
          setPatient(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    resolvePatient();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        patient,
        patientId: patient?.id ?? null,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }
  return context;
}
