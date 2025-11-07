document.querySelectorAll(".faq-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.style.display === "block";

    // close all
    document.querySelectorAll(".faq-answer").forEach((ans) => {
      ans.style.display = "none";
    });

    // toggle current
    answer.style.display = isOpen ? "none" : "block";
  });
});
