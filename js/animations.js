/* ============================================================
   ANIMATIONS — navbar scroll state + scroll-reveal
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Navbar background on scroll ---- */
  function initNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const setState = () => {
      navbar.setAttribute("data-scrolled", window.scrollY > 12 ? "true" : "false");
    };

    setState();
    window.addEventListener("scroll", setState, { passive: true });
  }

  /* ---- Scroll reveal for .reveal-on-scroll elements ---- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal-on-scroll");
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNavbarScroll();
    initScrollReveal();
  });
})();
