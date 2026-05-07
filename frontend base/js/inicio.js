const grid        = document.getElementById("patientsGrid");
const msg         = document.getElementById("msg");
const searchInput = document.getElementById("searchInput");
const searchCount = document.getElementById("searchCount");

let allPatients = [];

if (requireAuth()) {
  bindLogout();
  loadUserInfo();
  loadPatients();
}

searchInput.addEventListener("input", () => filterCards(searchInput.value));

async function loadUserInfo() {
  try {
    const response = await apiRequest("/api/auth/me");
    const user = await response.json();
    const badge = document.getElementById("userBadge");
    if (badge && user?.fullName) badge.textContent = user.fullName;
  } catch (_) { /* silencioso */ }
}

async function loadPatients() {
  try {
    allPatients = await apiGetPatients() || [];
    renderPatients(allPatients);
  } catch (error) {
    grid.innerHTML = `<div class="pt-error">${error.message || "No se pudo cargar la lista de pacientes"}</div>`;
  }
}

function renderPatients(patients) {
  if (!patients.length) {
    grid.innerHTML = '<div class="pt-empty">No hay pacientes disponibles</div>';
    updateCount(0, 0);
    return;
  }

  grid.innerHTML = patients.map((patient, index) => buildCard(patient, index)).join("");

  grid.querySelectorAll(".pt-card").forEach((card) => {
    card.addEventListener("click", () => navigateToPatient(card.dataset.id, card.dataset.name));
  });

  updateCount(patients.length, patients.length);
}

function filterCards(query) {
  const term = normalize(query);

  if (!term) {
    grid.querySelectorAll(".pt-card").forEach((card) => card.classList.remove("hidden"));
    updateCount(allPatients.length, allPatients.length);
    msg.textContent = "";
    return;
  }

  let visible = 0;
  grid.querySelectorAll(".pt-card").forEach((card) => {
    const name      = normalize(card.dataset.name);
    const diagnosis = normalize(card.dataset.diagnosis);
    const level     = normalize(card.dataset.level);
    const matches   = name.includes(term) || diagnosis.includes(term) || level.includes(term);
    card.classList.toggle("hidden", !matches);
    if (matches) visible++;
  });

  updateCount(visible, allPatients.length);

  if (visible === 0) {
    msg.className = "pt-msg text-warning";
    msg.textContent = `No se encontraron pacientes con "${query}"`;
  } else {
    msg.textContent = "";
  }
}

function updateCount(visible, total) {
  searchCount.textContent = total > 0 ? `${visible} / ${total}` : "";
}

function normalize(str) {
  return (str ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function buildCard(patient, index) {
  const colorClass    = `pt-color-${index % 6}`;
  const initials      = getInitials(patient.fullName);
  const treatmentDate = patient.treatmentStart
    ? new Date(patient.treatmentStart).toLocaleDateString("es-ES") : "—";
  const levelVal = patient.currentLevel
    ? `<span class="pt-level-val">${escapeHtml(patient.currentLevel)}</span>` : "—";
  const statusHtml = !patient.active
    ? `<span class="pt-badge-inactive">Inactivo</span>` : "";

  return `
    <div class="pt-card ${colorClass}"
         data-id="${patient.id}"
         data-name="${escapeAttr(patient.fullName)}"
         data-diagnosis="${escapeAttr(patient.diagnosis || "")}"
         data-level="${escapeAttr(patient.currentLevel || "")}"
         style="animation-delay: ${index * 0.1}s">
      <div class="pt-card-header">
        <div class="pt-card-header-logo">⚕</div>
        <div class="pt-card-header-text">
          <h4>PhysioTrack</h4>
          <p>SESCAM · Fisioterapia Infantil</p>
        </div>
      </div>
      <div class="pt-card-body">
        <div class="pt-photo-box">
          <span class="pt-avatar-initials">${initials}</span>
        </div>
        <div class="pt-card-data">
          <p><strong>Nombre:</strong> ${escapeHtml(patient.fullName)} ${statusHtml}</p>
          <p><strong>ID Paciente:</strong> ${patient.id}</p>
          <p><strong>Diagnóstico:</strong> ${escapeHtml(patient.diagnosis || "Sin registrar")}</p>
          <p><strong>Nivel actual:</strong> ${levelVal}</p>
          <p><strong>Inicio trat.:</strong> ${treatmentDate}</p>
        </div>
      </div>
      <div class="pt-card-footer">Tarjeta de seguimiento fisioterapéutico</div>
    </div>`;
}

function navigateToPatient(id, name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("alberto")) { window.location.href = "alberto.html"; return; }
  if (normalized.includes("alonso"))  { window.location.href = "alonso.html";  return; }
  msg.className = "pt-msg text-warning";
  msg.textContent = `Página de detalle para "${name}" aún no disponible`;
}

function getInitials(fullName) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return (str ?? "").replace(/"/g, "&quot;");
}
