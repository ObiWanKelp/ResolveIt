// === COMMON LOGOUT HANDLER ===
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      }
    });
  }
});

// === UNIVERSAL AUTH GUARD ===
function checkAuth(role) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("⚠️ Please log in first!");
    window.location.href = "login.html";
    return;
  }
  if (role && user.role !== role) {
    alert(`⚠️ Access denied! ${role.toUpperCase()}s only.`);
    window.location.href = "login.html";
  }
}
