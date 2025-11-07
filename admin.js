const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") {
  alert("⚠️ Admin access only!");
  window.location.href = "login.html";
}

async function loadIssues() {
  const res = await fetch("http://localhost:5050/issues");
  const issues = await res.json();
  const list = document.getElementById("adminIssueList");
  list.innerHTML = "";

  issues.forEach((issue) => {
    const card = document.createElement("div");
    card.classList.add("issue-card");
    card.innerHTML = `
      <h3>${issue.category}</h3>
      <p><strong>Campus:</strong> ${issue.campus}</p>
      <p><strong>Location:</strong> ${issue.location}</p>
      <p>${issue.description}</p>
      <p><strong>Status:</strong> ${issue.status}</p>
      <button onclick="deleteIssue(${issue.id})">🗑️ Delete</button>
    `;
    list.appendChild(card);
  });
}

async function deleteIssue(id) {
  if (!confirm("Are you sure you want to delete this issue?")) return;
  await fetch(`http://localhost:5050/delete-issue/${id}`, { method: "DELETE" });
  alert("🗑️ Issue deleted successfully!");
  loadIssues();
}

loadIssues();

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
