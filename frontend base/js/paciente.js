const MAX_WEEKS   = 12;
const MS_PER_MIN  = 60000;

let currentPatientId  = null;
let currentWeek       = 1;
let totalWeeksUsed    = 1;
let progressChart     = null;

document.addEventListener("DOMContentLoaded", () => {
  if (!requireAuth()) return;
  bindLogout();
  init();
});

async function init() {
  const defaultName = document.body.getAttribute("data-default-name");
  try {
    await loadSidebar();
    await loadPatient(defaultName);
  } catch (err) {
    showError(err.message || "Error cargando la página");
  }
}

/* ── Sidebar ────────────────────────────────────────── */
async function loadSidebar() {
  try {
    const user = await apiGetMe();
    const initials = getInitials(user.fullName);
    document.getElementById("sidebarAvatar").textContent = initials;
    document.getElementById("sidebarName").textContent   = user.fullName;
    document.getElementById("sidebarSescam").textContent = user.sescamId || "SESCAM";
  } catch (_) { /* no bloquea */ }
}

/* ── Paciente ───────────────────────────────────────── */
async function loadPatient(defaultName) {
  setLoading(true);
  const patients = await apiGetPatients();
  const patient  = patients.find(p =>
    p.fullName.toLowerCase().includes(defaultName.toLowerCase())
  );
  if (!patient) throw new Error(`Paciente "${defaultName}" no encontrado`);

  currentPatientId = patient.id;

  document.getElementById("patientName").textContent    = patient.fullName;
  document.getElementById("patientId").textContent      = patient.id;
  document.getElementById("levelBadge").textContent     = patient.currentLevel || "Sin nivel";
  document.getElementById("treatmentStart").textContent =
    patient.treatmentStart
      ? new Date(patient.treatmentStart).toLocaleDateString("es-ES")
      : "—";

  const progress = await apiGetProgress(patient.id);
  totalWeeksUsed = progress.weeks?.length || 1;

  buildTimeline(totalWeeksUsed);
  buildChart(progress.weeks || []);

  await loadWeekStats(patient.id, currentWeek);
  setLoading(false);
}

/* ── Timeline ───────────────────────────────────────── */
function buildTimeline(usedWeeks) {
  const container = document.getElementById("weekTimeline");
  container.innerHTML = "";

  for (let w = 1; w <= MAX_WEEKS; w++) {
    const pill = document.createElement("button");
    pill.className = "pt-week-pill";
    pill.textContent = w;

    if (w === currentWeek)  pill.classList.add("pt-week-active");
    if (w > usedWeeks)      pill.classList.add("pt-week-future");

    if (w <= usedWeeks) {
      pill.addEventListener("click", () => selectWeek(w));
    }
    container.appendChild(pill);
  }

  updateWeekLabel();
}

function selectWeek(week) {
  currentWeek = week;
  document.querySelectorAll(".pt-week-pill").forEach((pill, i) => {
    pill.classList.toggle("pt-week-active", i + 1 === week);
  });
  updateWeekLabel();
  loadWeekStats(currentPatientId, week);
}

function updateWeekLabel() {
  document.getElementById("weekLabel").textContent =
    `Semana ${currentWeek} de ${MAX_WEEKS}`;
}

/* ── Stats de semana ────────────────────────────────── */
async function loadWeekStats(patientId, week) {
  try {
    const s = await apiGetWeeklyStats(patientId, week);

    const totalMin = Math.round((s.totalMovementTime || 0) / MS_PER_MIN);
    const avgMin   = Math.round((s.averageMovementTime || 0) / MS_PER_MIN);
    const score    = Math.round(s.averageDrivingScore || 0);

    document.getElementById("statTotalTime").textContent  = formatMinutes(totalMin);
    document.getElementById("statTimesSub").textContent   = `${s.totalSessions || 0} sesiones`;
    document.getElementById("statAvgTime").textContent    = formatMinutes(avgMin);
    document.getElementById("statSessions").textContent   = s.totalSessions || 0;
    document.getElementById("statScore").textContent      = `${score}%`;

    const barPct = Math.min(100, Math.round(((s.totalSessions || 0) / 7) * 100));
    document.getElementById("statSessionsBar").style.width = `${barPct}%`;

    const scoreSub = document.getElementById("statScoreSub");
    if (score >= 75) {
      scoreSub.textContent = "Dentro del rango óptimo";
      scoreSub.className   = "pt-stat-sub pt-stat-sub-good";
    } else if (score >= 50) {
      scoreSub.textContent = "Progreso moderado";
      scoreSub.className   = "pt-stat-sub";
    } else {
      scoreSub.textContent = "Necesita mejora";
      scoreSub.className   = "pt-stat-sub";
      scoreSub.style.color = "#c0392b";
    }
  } catch (_) {
    ["statTotalTime","statAvgTime","statSessions","statScore"].forEach(id => {
      document.getElementById(id).textContent = "—";
    });
  }
}

/* ── Gráfica ────────────────────────────────────────── */
function buildChart(weeks) {
  const labels  = weeks.map(w => `Sem ${w.week}`);
  const scores  = weeks.map(w => Math.round(w.avgDrivingScore   || 0));
  const estab   = weeks.map(w => Math.round(w.avgStabilityScore || 0));

  const ctx = document.getElementById("progressChart").getContext("2d");
  if (progressChart) progressChart.destroy();

  progressChart = new Chart(ctx, {
    data: {
      labels,
      datasets: [
        {
          type: "bar",
          label: "Score conducción",
          data: scores,
          backgroundColor: "rgba(47,111,159,0.18)",
          borderColor: "#2f6f9f",
          borderWidth: 2,
          borderRadius: 6,
          yAxisID: "y",
        },
        {
          type: "line",
          label: "Estabilidad",
          data: estab,
          borderColor: "#0d8a73",
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: "#0d8a73",
          pointRadius: 4,
          yAxisID: "y",
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "white",
          borderColor: "#e2e8f0",
          borderWidth: 1,
          titleColor: "#0f172a",
          bodyColor: "#64748b",
          padding: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: "#f1f5f9" },
          ticks: { color: "#94a3b8", font: { size: 11 } },
          border: { display: false },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#94a3b8", font: { size: 11 } },
          border: { display: false },
        }
      }
    }
  });
}

/* ── Helpers ────────────────────────────────────────── */
function formatMinutes(min) {
  if (min <= 0) return "0 min";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[1][0]).toUpperCase();
}

function setLoading(on) {
  const main = document.getElementById("mainContent");
  const overlay = document.getElementById("loadingOverlay");
  if (on && !overlay) {
    const div = document.createElement("div");
    div.id = "loadingOverlay";
    div.className = "pt-loading-overlay";
    div.innerHTML = '<div class="pt-spinner"></div><span>Cargando datos...</span>';
    main.prepend(div);
  } else if (!on && overlay) {
    overlay.remove();
  }
}

function showError(msg) {
  const el = document.getElementById("pageError");
  el.textContent = msg;
  el.classList.remove("d-none");
  setLoading(false);
}
