// === DASHBOARD SCRIPT ===
const reportBtn = document.getElementById("reportBtn");
const formSection = document.getElementById("form-section");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("issueForm");
const category = document.getElementById("category");
const conditionalField = document.getElementById("conditionalField");
const reportList = document.getElementById("userReportList");
// === AUTH GUARD ===
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "student") {
  alert("⚠️ Unauthorized access! Please log in first.");
  window.location.href = "login.html";
}

// Open popup form
reportBtn.addEventListener("click", () => {
  formSection.classList.add("show");
});

// Close popup
cancelBtn.addEventListener("click", () => {
  formSection.classList.remove("show");
});

// Close when clicking outside the popup
formSection.addEventListener("click", (e) => {
  if (e.target === formSection) formSection.classList.remove("show");
});

// Toggle "Other" category input
category.addEventListener("change", () => {
  conditionalField.classList.toggle("hidden", category.value !== "Other");
});

// Load reports from backend (MySQL)
async function loadUserReports() {
  try {
    const res = await fetch("http://localhost:5050/issues");
    const issues = await res.json();

    // Update stats
    document.getElementById("totalReports").textContent = issues.length;
    document.getElementById("resolvedReports").textContent = issues.filter(
      (i) => i.status === "Resolved"
    ).length;
    document.getElementById("inProgressReports").textContent = issues.filter(
      (i) => i.status === "In Progress"
    ).length;

    // Populate report cards
    reportList.innerHTML = "";
    if (issues.length === 0) {
      reportList.innerHTML = "<p>No issues reported yet.</p>";
      return;
    }

    issues.forEach((issue) => {
      const card = document.createElement("div");
      card.classList.add("issue-card");
      card.innerHTML = `
        <h3>${issue.category}</h3>
        <p><strong>Campus:</strong> ${issue.campus}</p>
        <p><strong>Location:</strong> ${issue.location}</p>
        <p>${issue.description}</p>
        <span class="status ${issue.status.toLowerCase()}">${
        issue.status
      }</span>
      `;
      reportList.appendChild(card);
    });
  } catch (err) {
    console.error("⚠️ Failed to load reports:", err);
    reportList.innerHTML = "<p>⚠️ Unable to load reports. Check backend.</p>";
  }
}

// Submit new issue to backend
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newIssue = {
    name: document.getElementById("name").value,
    campus: document.getElementById("campus").value,
    location: document.getElementById("location").value,
    category: document.getElementById("category").value,
    description: document.getElementById("desc").value,
  };

  const res = await fetch("http://localhost:5050/add-issue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newIssue),
  });

  if (res.ok) {
    alert("✅ Issue submitted successfully!");
    form.reset();
    formSection.classList.remove("show");
    loadUserReports();
  } else {
    alert("❌ Error submitting issue!");
  }
});

// Initial load
loadUserReports();

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
