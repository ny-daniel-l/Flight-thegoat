/* script.js */
const cards = document.querySelectorAll(".card, .info-card, .scoreboard");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

cards.forEach((card) => {
  card.classList.add("hidden");
  observer.observe(card);
});

const style = document.createElement("style");
style.innerHTML = `
  .hidden {
    opacity: 0;
    transform: translateY(25px);
    transition: 0.6s ease;
  }

  .show {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
