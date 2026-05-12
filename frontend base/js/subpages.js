document.addEventListener("DOMContentLoaded", async () => {
  if (!requireAuth()) return;
  bindLogout();

  const patientName = document.body.getAttribute("data-patient-name") || "";
  const baseTitle   = document.getElementById("pageTitle")?.getAttribute("data-base-title") || "";
  if (baseTitle) document.getElementById("pageTitle").textContent = `${baseTitle} — ${patientName}`;

  const weekSelect = document.getElementById("weekSelect");
  const content    = document.getElementById("content");

  let patientId = null;

  try {
    const patients = await apiGetPatients();
    const patient  = patients.find(p =>
      p.fullName.toLowerCase().includes(patientName.toLowerCase())
    );
    if (!patient) throw new Error("Paciente no encontrado");
    patientId = patient.id;
  } catch (err) {
    if (content) content.innerHTML = `<div class="error-msg">${err.message}</div>`;
    return;
  }

  async function renderWeek(week) {
    if (!content) return;
    content.innerHTML = '<div class="spinner-wrap"><div class="spinner-border text-primary" role="status"></div></div>';
    try {
      const s = await apiGetWeeklyStats(patientId, week);
      const totalMin = Math.round((s.totalMovementTime  || 0) / 60000);
      const avgMin   = Math.round((s.averageMovementTime || 0) / 60000);
      const score    = Math.round(s.averageDrivingScore  || 0);
      const sessions = s.totalSessions || 0;

      const scoreColor = score >= 75 ? "#16a34a" : score >= 50 ? "#2563eb" : "#b91c1c";
      const scoreLabel = score >= 75 ? "Óptimo" : score >= 50 ? "Moderado" : "Necesita mejora";

      content.innerHTML = `
        <div class="stat-grid">
          <div class="stat-tile">
            <div class="tile-value">${formatMin(totalMin)}</div>
            <div class="tile-label">Tiempo total</div>
          </div>
          <div class="stat-tile">
            <div class="tile-value">${formatMin(avgMin)}</div>
            <div class="tile-label">Tiempo medio</div>
          </div>
          <div class="stat-tile">
            <div class="tile-value">${sessions}</div>
            <div class="tile-label">Sesiones</div>
          </div>
          <div class="stat-tile">
            <div class="tile-value" style="color:${scoreColor}">${score}%</div>
            <div class="tile-label">Score — ${scoreLabel}</div>
          </div>
        </div>
      `;
    } catch (_) {
      content.innerHTML = '<div class="error-msg">No hay datos para esta semana.</div>';
    }
  }

  const currentWeek = weekSelect ? parseInt(weekSelect.value, 10) : 1;
  await renderWeek(currentWeek);

  if (weekSelect) {
    weekSelect.addEventListener("change", () => renderWeek(parseInt(weekSelect.value, 10)));
  }
});

function formatMin(min) {
  if (min <= 0) return "0 min";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
