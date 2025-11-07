// === DOM ELEMENTS ===
const reportBtn = document.getElementById("reportBtn");
const formSection = document.getElementById("form-section");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("issueForm");
const category = document.getElementById("category");
const conditionalField = document.getElementById("conditionalField");
const issueList = document.getElementById("issueList");
const searchBar = document.getElementById("searchBar");
// === AUTH GUARD ===
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "student") {
  alert("⚠️ Please log in first!");
  window.location.href = "login.html";
}

// === POPUP CONTROLS ===
reportBtn.addEventListener("click", () => formSection.classList.add("show"));
cancelBtn.addEventListener("click", () => formSection.classList.remove("show"));
formSection.addEventListener("click", (e) => {
  if (e.target === formSection) formSection.classList.remove("show");
});

// === CONDITIONAL FIELD LOGIC ===
category.addEventListener("change", () =>
  conditionalField.classList.toggle("hidden", category.value !== "Other")
);

// === LOAD ISSUES FROM BACKEND ===
async function loadIssues(filter = "") {
  try {
    const res = await fetch("http://localhost:5050/issues");
    if (!res.ok) throw new Error("Server response error");

    const issues = await res.json();
    issueList.innerHTML = "";

    const filtered = issues.filter((i) =>
      (i.category + i.description + i.location + i.campus + i.status)
        .toLowerCase()
        .includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
      issueList.innerHTML = "<p>No issues found.</p>";
      return;
    }

    filtered.forEach((issue) => {
      const card = document.createElement("div");
      card.classList.add("issue-card");
      card.innerHTML = `
        <h3>${issue.category}</h3>
        <p><strong>By:</strong> ${issue.name || "Anonymous"}</p>
        <p><strong>Campus:</strong> ${issue.campus}</p>
        <p><strong>Location:</strong> ${issue.location}</p>
        <p>${issue.description}</p>
        <span class="status ${issue.status.toLowerCase()}">${
        issue.status
      }</span>
      `;
      issueList.appendChild(card);
    });
  } catch (err) {
    issueList.innerHTML =
      "<p>⚠️ Unable to load issues. Make sure backend is running on port 5050!</p>";
    console.error(err);
  }
}

// === SEARCH BAR HANDLER ===
searchBar.addEventListener("input", (e) => loadIssues(e.target.value));

// === SUBMIT NEW ISSUE ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  const newIssue = {
    email: user.email, // auto link logged-in user's email
    campus: document.getElementById("campus").value,
    location: document.getElementById("location").value,
    category: document.getElementById("category").value,
    description: document.getElementById("desc").value,
  };

  try {
    const res = await fetch("http://localhost:5050/add-issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIssue),
    });

    if (res.ok) {
      alert("✅ Issue submitted successfully!");
      form.reset();
      formSection.classList.remove("show");
      loadIssues();
    } else {
      alert("❌ Failed to submit issue!");
    }
  } catch (error) {
    alert("⚠️ Backend not reachable. Make sure `node server.js` is running!");
    console.error(error);
  }
});

// === INITIAL LOAD ===
loadIssues();

// === UNIVERSAL LOGOUT HANDLER ===
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("user"); // clear login session
        window.location.href = "login.html"; // redirect
      }
    });
  }
});
