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