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

  function initHeroContacts() {
    const rail = document.querySelector(".hero__contacts");
    if (!rail) return;

    const onScroll = () => {
      rail.classList.toggle("is-hidden", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initFaq() {
    const items = document.querySelectorAll(".faq__item");
    if (!items.length) return;

    items.forEach((item) => {
      const btn = item.querySelector(".faq__question");
      if (!btn) return;

      btn.addEventListener("click", (event) => {
        if (!event.target.closest(".faq__icon")) return;
        const isOpen = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initHeroContacts();
    initFaq();
  });
})();
