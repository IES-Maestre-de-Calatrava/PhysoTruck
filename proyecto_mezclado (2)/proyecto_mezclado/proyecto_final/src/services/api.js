// src/services/api.js
// ─────────────────────────────────────────────────────────────
// Capa de acceso a datos.
// Por defecto usa los datos mock locales.
// Para conectar con tu base de datos real, cambia USE_MOCK a false
// y configura BASE_URL con la URL de tu API.
// ─────────────────────────────────────────────────────────────

const USE_MOCK = true; // ← Cambia a false cuando tengas tu API lista
const BASE_URL = 'http://localhost:3001/api'; // ← URL de tu backend

// ── Importamos los datos mock como fallback ──────────────────
import { mockSesiones } from '../data/mockDailyData.js';

// ── Helper genérico para fetch ───────────────────────────────
async function apiFetch(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ── API pública ──────────────────────────────────────────────

/**
 * Devuelve todas las sesiones semanales del paciente.
 * Estructura esperada de la BD:
 * [
 *   {
 *     id: number,
 *     semana: number,
 *     sesiones: number,
 *     score: number,
 *     tiempo: number,
 *     dailyLogs: [
 *       {
 *         fecha: string,
 *         tiempo: number,
 *         sesiones: number,
 *         score: number,
 *         estabilidad: number,
 *         estado: string,
 *         eventos: { colisiones: number, aceleraciones: number, frenadas: number }
 *       }
 *     ]
 *   }
 * ]
 */
export async function getSesiones(pacienteId = 'alberto') {
  if (USE_MOCK) {
    // Simula latencia de red en desarrollo
    await new Promise((r) => setTimeout(r, 300));
    return mockSesiones;
  }
  return apiFetch(`/pacientes/${pacienteId}/sesiones`);
}

/**
 * Devuelve el detalle de una semana concreta.
 */
export async function getSemana(pacienteId = 'alberto', semanaId) {
  if (USE_MOCK) {
    const semana = mockSesiones.find((s) => s.id === semanaId);
    if (!semana) throw new Error(`Semana ${semanaId} no encontrada`);
    return semana;
  }
  return apiFetch(`/pacientes/${pacienteId}/sesiones/${semanaId}`);
}

/**
 * Exporta los datos como CSV (puede hacerse en el backend para datos grandes).
 */
export async function exportarCSV(pacienteId = 'alberto') {
  if (USE_MOCK) return null; // El ExportButton lo gestiona localmente en mock
  return apiFetch(`/pacientes/${pacienteId}/export/csv`);
}
