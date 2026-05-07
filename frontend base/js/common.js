const LOGIN_PAGE = "index.html";

function requireAuth() {
  if (!getToken()) {
    window.location.href = LOGIN_PAGE;
    return false;
  }
  return true;
}

function bindLogout(buttonId = "logoutBtn") {
  const logoutButton = document.getElementById(buttonId);
  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener("click", () => {
    clearAuth();
    window.location.href = LOGIN_PAGE;
  });
}
