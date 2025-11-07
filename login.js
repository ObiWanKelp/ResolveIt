localStorage.removeItem("user");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const currentUser = JSON.parse(localStorage.getItem("user"));
if (currentUser && window.location.pathname.endsWith("login.html")) {
  if (currentUser.role === "student") window.location.href = "index.html";
  else if (currentUser.role === "staff") window.location.href = "staff.html";
  else if (currentUser.role === "admin") window.location.href = "admin.html";
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  // Basic validation
  if (!email.endsWith("@mail.jiit.ac.in")) {
    return showError(
      "❌ Please use a valid JIIT email (ends with @mail.jiit.ac.in)"
    );
  }
  if (!password) return showError("❌ Password required");
  if (!role) return showError("❌ Please select a role");

  // Call backend
  try {
    const res = await fetch("http://localhost:5050/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();
    if (!data.success) {
      showError("❌ " + data.message);
      return;
    }

    // ✅ Store user session
    localStorage.setItem("user", JSON.stringify({ email, role }));

    // Redirect based on role
    if (role === "student") {
      window.location.href = "index.html";
    } else if (role === "staff") {
      window.location.href = "staff.html";
    } else if (role === "admin") {
      window.location.href = "admin.html";
    }
  } catch (err) {
    showError("⚠️ Server not reachable!");
    console.error(err);
  }
});

function showError(msg) {
  loginError.textContent = msg;
  loginError.classList.remove("hidden");
  loginError.style.animation = "shake 0.3s ease";
  setTimeout(() => (loginError.style.animation = ""), 300);
}
