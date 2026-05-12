const loginForm = document.getElementById("loginForm");
const userInput = document.getElementById("user");
const passInput = document.getElementById("pass");
const rememberInput = document.getElementById("remember");
const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

document.addEventListener("DOMContentLoaded", () => {
  const rememberedUser = getRememberedUser();
  if (rememberedUser) {
    userInput.value = rememberedUser;
    rememberInput.checked = true;
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = userInput.value.trim();
  const password = passInput.value;

  if (!email || !password) {
    renderMessage("Completa usuario y contrasena", "danger");
    return;
  }

  setLoading(true);
  renderMessage("Validando credenciales...", "secondary");

  try {
    const token = await apiLogin(email, password);
    saveAuth(token, email, rememberInput.checked);
    renderMessage("Acceso correcto. Preparando dashboard...", "success");
    document.body.classList.add("login-success");
    await delay(650);
    window.location.href = "inicio.html";
  } catch (error) {
    renderMessage(error.message || "No se pudo iniciar sesion", "danger");
    document.body.classList.remove("login-shake");
    void loginForm.offsetWidth;
    document.body.classList.add("login-shake");
    setTimeout(() => document.body.classList.remove("login-shake"), 420);
  } finally {
    setLoading(false);
  }
});

function renderMessage(text, type) {
  msg.className = `text-center mt-3 mb-0 text-${type} is-visible`;
  msg.textContent = text;
}

function setLoading(isLoading) {
  loginBtn.disabled = isLoading;
  loginBtn.textContent = isLoading ? "Validando..." : "Acceder al sistema";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
