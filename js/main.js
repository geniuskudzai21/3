/* ============================================================
   MAIN — mobile navigation + misc page wiring
   ============================================================ */

(function () {
  "use strict";

  function initMobileNav() {
    const toggle = document.getElementById("navToggle");
    const mobileNav = document.getElementById("mobileNav");
    if (!toggle || !mobileNav) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mobileNav.dataset.state = open ? "open" : "closed";
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    // Close on link click
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
  });
})();
