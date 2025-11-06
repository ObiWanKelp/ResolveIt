const reportBtn = document.getElementById("reportBtn");
const formSection = document.getElementById("form-section");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("issueForm");
const category = document.getElementById("category");
const conditionalField = document.getElementById("conditionalField");

reportBtn.addEventListener("click", () => {
  formSection.classList.add("show");
});

cancelBtn.addEventListener("click", () => {
  formSection.classList.remove("show");
});

formSection.addEventListener("click", (e) => {
  if (e.target === formSection) {
    formSection.classList.remove("show");
  }
});

category.addEventListener("change", () => {
  if (category.value === "Other") {
    conditionalField.classList.remove("hidden");
  } else {
    conditionalField.classList.add("hidden");
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newIssue = {
    name: document.getElementById("name").value,
    campus: document.getElementById("campus").value,
    location: document.getElementById("location").value,
    category: document.getElementById("category").value,
    desc: document.getElementById("desc").value,
    date: new Date().toLocaleString(),
    status: "Open",
  };

  const issues = JSON.parse(localStorage.getItem("issues")) || [];
  issues.push(newIssue);
  localStorage.setItem("issues", JSON.stringify(issues));

  alert("Issue submitted successfully!");
  form.reset();
  formSection.classList.remove("show");
  loadIssues();
});

loadIssues();
