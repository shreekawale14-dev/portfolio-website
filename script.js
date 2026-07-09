// ==========================================================
// NAVBAR — Mobile menu toggle
// Why: Mobile screens pe saare nav links ek saath fit nahi hote,
// isliye hum unhe hamburger icon ke peeche chhupate hain,
// aur click hone par show/hide karte hain.
// ==========================================================

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  // Keep the accessible state in sync with the visual state — screen
  // readers announce "expanded"/"collapsed" based on this attribute
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Jab user kisi nav link pe click kare, menu automatically band ho jaye
// (Achi UX practice — user ko manually menu close nahi karna padta)
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
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

// ==========================================================
// COPY EMAIL TO CLIPBOARD
// Why: Visitor ko manually email select-copy karne mein
// friction hoti hai, especially mobile pe. Ek click se copy
// karna deta hai better user experience — small detail jo
// professional websites mein hamesha hoti hai.
// ==========================================================

const copyEmailBtn = document.getElementById("copyEmailBtn");
const emailValue = document.getElementById("emailValue");

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", () => {
    // Guard: navigator.clipboard doesn't exist in a few older browsers.
    // Without this check, clicking the button on those browsers would
    // throw a silent error and do nothing — confusing for the visitor.
    if (!navigator.clipboard) {
      copyEmailBtn.textContent = "Copy failed";
      setTimeout(() => (copyEmailBtn.textContent = "Copy"), 2000);
      return;
    }

    // navigator.clipboard is the modern browser API for copying text
    navigator.clipboard
      .writeText(emailValue.textContent)
      .then(() => {
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = "Copied!";

        // 2 second baad button apna original text wapas dikhaye
        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
        }, 2000);
      })
      .catch(() => {
        copyEmailBtn.textContent = "Copy failed";
        setTimeout(() => (copyEmailBtn.textContent = "Copy"), 2000);
      });
  });
}

// ==========================================================
// CONTACT FORM SUBMISSION
// Why: Abhi humare paas backend/server nahi hai jo form data
// ko kahin save kare ya email bheje. Isliye hum "frontend-only"
// simulation kar rahe hain — form ko reload hone se rokte hain
// aur user ko ek confirmation message dikhate hain.
// Real backend (jaise Formspree, EmailJS, ya apna server)
// baad mein connect karenge jab tum backend seekhoge.
// ==========================================================

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    // preventDefault rokta hai form ko page reload karne se —
    // by default HTML forms submit hote hi page refresh kar dete hain
    e.preventDefault();

    formStatus.textContent = "✓ Message sent! I'll get back to you soon.";
    contactForm.reset(); // saare input fields khaali kar do

    // 4 second baad confirmation message hata do
    setTimeout(() => {
      formStatus.textContent = "";
    }, 4000);
  });
}

// ==========================================================
// FOOTER — Dynamic Year
// Why: Hardcoded "2026" likhne se agle saal manually update
// karna padega. Yeh line automatically current year nikal
// leti hai JavaScript ke Date object se — ek baar likho,
// hamesha sahi rahega.
// ==========================================================

const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ==========================================================
// PRELOADER
// Why: "window load" event fires only after EVERYTHING —
// images, fonts, everything — has fully loaded. We wait for
// that, then fade the preloader out. This avoids showing the
// user a half-loaded, unstyled page for a split second.
// ==========================================================

const preloader = document.getElementById("preloader");

window.addEventListener("load", () => {
  preloader.classList.add("loaded");
});

// ==========================================================
// SCROLL PROGRESS BAR + SCROLL TO TOP BUTTON
// Why combined into one listener: Two separate "scroll" event
// listeners each run on every single scroll frame — that's wasted
// work. Combining them into one listener means the browser only
// has to fire one callback per scroll event instead of two.
//
// Why requestAnimationFrame: Scroll events can fire dozens of
// times per second. Wrapping our updates in rAF makes sure we
// only update the DOM once per actual browser repaint, instead
// of potentially several times between repaints — this is the
// standard technique for keeping scroll-linked effects smooth
// and avoiding "jank" on lower-end phones.
// ==========================================================

const scrollProgress = document.getElementById("scrollProgress");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const navbar = document.getElementById("navbar");

let scrollTicking = false;

function handleScrollEffects() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = `${percent}%`;

  scrollTopBtn.classList.toggle("show", scrollTop > 500);
  navbar.classList.toggle("scrolled", scrollTop > 20);

  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      requestAnimationFrame(handleScrollEffects);
      scrollTicking = true;
    }
  },
  { passive: true } // tells the browser we won't call preventDefault(),
  // letting it scroll immediately without waiting on our JS
);

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==========================================================
// ACTIVE NAVBAR LINK ON SCROLL ("Scroll Spy")
// Why: As the user scrolls through sections, the matching
// navbar link highlights — so they always have a sense of
// "where am I on this page" without reading section headings.
//
// How it works: IntersectionObserver watches every <section>.
// Whenever a section crosses the middle of the viewport, we
// find the nav link with a matching href (#section-id) and
// mark it "active", removing "active" from the others.
// ==========================================================

const sections = document.querySelectorAll("section[id]");
const allNavLinks = document.querySelectorAll(".nav-links a");

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        allNavLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  {
    // Triggers when a section occupies the vertical middle of the screen —
    // feels more natural than triggering the instant a section barely appears
    rootMargin: "-45% 0px -45% 0px",
  }
);

sections.forEach((section) => spyObserver.observe(section));

// ==========================================================
// DISABLED PLACEHOLDER LINKS
// Why: LinkedIn, Fiverr, Upwork, and Resume don't have real
// destinations yet (marked aria-disabled="true" in the HTML).
// Without this, clicking them would still jump the page to the
// top because their href is "#" — a confusing, broken-feeling
// bug. This stops that click from doing anything.
// ==========================================================

document.querySelectorAll('a[aria-disabled="true"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
  });
});