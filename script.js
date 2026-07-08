// ==========================================================
// NAVBAR — Mobile menu toggle
// Why: Mobile screens pe saare nav links ek saath fit nahi hote,
// isliye hum unhe hamburger icon ke peeche chhupate hain,
// aur click hone par show/hide karte hain.
// ==========================================================

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Jab user kisi nav link pe click kare, menu automatically band ho jaye
// (Achi UX practice — user ko manually menu close nahi karna padta)
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// ==========================================================
// SCROLL FADE-IN ANIMATION
// Why IntersectionObserver: Yeh browser ka built-in tool hai
// jo batata hai "kab ek element screen pe visible hua". Isse
// hum scroll event ko manually track nahi karte (jo slow/heavy
// hota hai) — IntersectionObserver performance-friendly hai,
// yeh industry-standard tareeka hai scroll animations ke liye.
// ==========================================================

const fadeElements = document.querySelectorAll(".fade-in");

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Ek baar visible hone ke baad observe karna band kar do —
        // isse animation baar baar repeat nahi hogi scroll up/down pe
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15, // 15% element screen pe aate hi trigger ho jaye
  }
);

fadeElements.forEach((el) => fadeObserver.observe(el));