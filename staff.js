const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "staff") {
  alert("⚠️ Access denied. Staff only!");
  window.location.href = "login.html";
}

async function loadIssues() {
  const res = await fetch("http://localhost:5050/issues");
  const issues = await res.json();
  const list = document.getElementById("staffIssueList");
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
      <button onclick="updateStatus(${issue.id}, 'In Progress')">In Progress</button>
      <button onclick="updateStatus(${issue.id}, 'Resolved')">Resolved</button>
    `;
    list.appendChild(card);
  });
}

async function updateStatus(id, status) {
  await fetch(`http://localhost:5050/update-status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  alert("✅ Status updated!");
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
