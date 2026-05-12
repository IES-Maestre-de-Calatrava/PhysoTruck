const grid        = document.getElementById("patientsGrid");
const msg         = document.getElementById("msg");
const searchInput = document.getElementById("searchInput");
const searchCount = document.getElementById("searchCount");
const clearBtn    = document.getElementById("clearSearch");
const openStatsBtn = document.getElementById("openStatsBtn");
const LAST_PATIENT_KEY = "physiotrack_last_patient";

let allPatients = [];
let selectedPatientId = null;

if (requireAuth()) {
  bindLogout();
  loadUserInfo();
  loadPatients();
}

searchInput.addEventListener("input", () => {
  const val = searchInput.value;
  filterCards(val);
  clearBtn.classList.toggle("visible", val.length > 0);
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterCards("");
  clearBtn.classList.remove("visible");
  searchCount.classList.remove("visible");
  searchInput.focus();
});

openStatsBtn?.addEventListener("click", openStatsDashboard);

async function loadUserInfo() {
  try {
    const user = await apiGetMe();
    const badge  = document.getElementById("userBadge");
    const avatar = document.getElementById("userAvatar");
    if (user?.fullName) {
      if (badge)  badge.textContent  = user.fullName;
      if (avatar) avatar.textContent = getInitials(user.fullName);
    }
  } catch (_) {}
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
    grid.innerHTML = `
      <div class="pt-empty">
        <div class="pt-empty-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>
        No hay pacientes disponibles
      </div>`;
    updateCount(0, 0);
    return;
  }

  grid.innerHTML = patients.map((patient, index) => buildCard(patient, index)).join("");

  grid.querySelectorAll(".pt-card").forEach((card) => {
    card.addEventListener("click", () => navigateToPatient(card.dataset.id, card.dataset.name));
  });

  grid.querySelectorAll(".pt-photo-box").forEach((box) => {
    box.addEventListener("click", (e) => {
      e.stopPropagation();
      const patientId = box.dataset.patientId;
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const base64 = ev.target.result;
          localStorage.setItem(`physiotrack_photo_${patientId}`, base64);
          const img = box.querySelector("img");
          const svg = box.querySelector("svg");
          if (img) {
            img.src = base64;
          } else {
            if (svg) svg.remove();
            const newImg = document.createElement("img");
            newImg.src = base64;
            newImg.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:inherit;";
            box.appendChild(newImg);
          }
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  });

  updateCount(patients.length, patients.length);
}

function filterCards(query) {
  const term = normalize(query);

  if (!term) {
    grid.querySelectorAll(".pt-card").forEach((card) => card.classList.remove("hidden"));
    updateCount(allPatients.length, allPatients.length);
    searchCount.classList.remove("visible");
    msg.textContent = "";
    return;
  }

  let visible = 0;
  grid.querySelectorAll(".pt-card").forEach((card) => {
    const name      = normalize(card.dataset.name);
    const diagnosis = normalize(card.dataset.diagnosis);
    const level     = normalize(card.dataset.level);
    const dni       = normalize(card.dataset.dni);
    const matches   = name.includes(term) || diagnosis.includes(term) || level.includes(term) || dni.includes(term);
    card.classList.toggle("hidden", !matches);
    if (matches) visible++;
  });

  updateCount(visible, allPatients.length);
  searchCount.classList.toggle("visible", true);

  if (visible === 0) {
    msg.className = "pt-msg";
    msg.textContent = `Sin resultados para "${query}"`;
  } else {
    msg.textContent = "";
  }
}

function updateCount(visible, total) {
  if (total === 0) { searchCount.textContent = ""; return; }
  searchCount.textContent = `${visible} / ${total}`;
}

function normalize(str) {
  return (str ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function buildCard(patient, index) {
  const colorClass   = `pt-color-${index % 6}`;
  const initials     = getInitials(patient.fullName);
  const treatmentDate = patient.treatmentStart
    ? new Date(patient.treatmentStart).toLocaleDateString("es-ES") : "—";
  const levelHtml = patient.currentLevel
    ? `<span class="pt-level-val">${escapeHtml(patient.currentLevel)}</span>` : "—";
  const inactiveHtml = !patient.active
    ? `<span class="pt-badge-inactive">Inactivo</span>` : "";

  const dniValue = patient.dni ?? patient.id ?? "—";

  return `
    <div class="pt-card ${colorClass}"
         data-id="${patient.id}"
         data-name="${escapeAttr(patient.fullName)}"
         data-diagnosis="${escapeAttr(patient.diagnosis || "")}"
         data-level="${escapeAttr(patient.currentLevel || "")}"
         data-dni="${escapeAttr(String(dniValue))}"
         style="animation-delay: ${index * 0.06}s">

      <div class="pt-card-header">
        <div class="pt-card-header-logo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div class="pt-card-header-text">
          <h4>PhysioTrack</h4>
          <p>Seguimiento fisioterapéutico</p>
        </div>
      </div>

      <div class="pt-card-body">
        <div class="pt-photo-box" data-patient-id="${patient.id}" title="Cambiar foto de perfil" style="cursor:pointer;position:relative;">
          ${getPatientPhotoHtml(patient.id)}
          <div style="position:absolute;bottom:4px;right:4px;width:18px;height:18px;background:rgba(0,0,0,0.45);border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:none;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
        </div>
        <div class="pt-card-data">
          <div class="pt-card-data-row">
            <span class="pt-card-data-label">Nombre</span>
            <span class="pt-card-data-value">${escapeHtml(patient.fullName)} ${inactiveHtml}</span>
          </div>
          <div class="pt-card-data-row">
            <span class="pt-card-data-label">DNI / ID</span>
            <span class="pt-card-data-value">${escapeHtml(String(dniValue))}</span>
          </div>
          <div class="pt-card-data-row">
            <span class="pt-card-data-label">Diagnóstico</span>
            <span class="pt-card-data-value">${escapeHtml(patient.diagnosis || "Sin registrar")}</span>
          </div>
          <div class="pt-card-data-row">
            <span class="pt-card-data-label">Nivel</span>
            <span class="pt-card-data-value">${levelHtml}</span>
          </div>
          <div class="pt-card-data-row">
            <span class="pt-card-data-label">Inicio tratamiento</span>
            <span class="pt-card-data-value">${treatmentDate}</span>
          </div>
        </div>
      </div>

      <div class="pt-card-footer">
        <span class="pt-card-footer-text">Carnet de seguimiento</span>
        <span class="pt-card-action">
          Ver paciente
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </span>
      </div>
    </div>`;
}

function navigateToPatient(id, name) {
  if (!id) {
    msg.className = "pt-msg";
    msg.textContent = `No se pudo abrir el dashboard de "${name}" porque falta el ID del paciente`;
    return;
  }

  selectedPatientId = String(id);
  localStorage.setItem(LAST_PATIENT_KEY, selectedPatientId);
  window.location.href = `charts/?patient=${encodeURIComponent(id)}`;
}

function openStatsDashboard() {
  const rememberedId = localStorage.getItem(LAST_PATIENT_KEY);
  const fallbackId = selectedPatientId
    || rememberedId
    || (allPatients[0] ? String(allPatients[0].id) : null);

  if (!fallbackId) {
    msg.className = "pt-msg";
    msg.textContent = "No hay pacientes disponibles para abrir el dashboard.";
    return;
  }

  localStorage.setItem(LAST_PATIENT_KEY, fallbackId);
  window.location.href = `charts/?patient=${encodeURIComponent(fallbackId)}`;
}

function getPatientPhotoHtml(patientId) {
  const photo = localStorage.getItem(`physiotrack_photo_${patientId}`);
  if (photo) {
    return `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" alt="Foto de perfil">`;
  }
  return `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.9)"/>
    <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.9)"/>
  </svg>`;
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
