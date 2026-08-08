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

  function initFeaturedCarousel() {
    const root = document.getElementById("featuredCarousel");
    if (!root) return;

    const track = root.querySelector(".featured-carousel__track");
    const dotsWrap = root.querySelector(".featured-carousel__dots");
    const prevBtn = root.querySelector('[data-dir="prev"]');
    const nextBtn = root.querySelector('[data-dir="next"]');
    const slides = Array.from(track.children);
    if (slides.length < 2) return;

    const autoplay = root.dataset.autoplay === "true";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "featured-carousel__dot";
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", () => {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach((d, n) => {
        d.classList.toggle("is-active", n === index);
        d.setAttribute("aria-current", n === index ? "true" : "false");
      });
      slides.forEach((s, n) => {
        s.classList.toggle("is-active", n === index);
        s.setAttribute("aria-hidden", n === index ? "false" : "true");
      });
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function restart() {
      if (timer) { clearInterval(timer); timer = null; }
      if (autoplay && !reducedMotion && !root.dataset.paused) {
        timer = setInterval(next, 5000);
      }
    }

    prevBtn.addEventListener("click", () => { prev(); restart(); });
    nextBtn.addEventListener("click", () => { next(); restart(); });

    root.addEventListener("mouseenter", () => { root.dataset.paused = "true"; restart(); });
    root.addEventListener("mouseleave", () => { delete root.dataset.paused; restart(); });
    root.addEventListener("focusin", () => { root.dataset.paused = "true"; restart(); });
    root.addEventListener("focusout", () => { delete root.dataset.paused; restart(); });

    document.addEventListener("keydown", (e) => {
      const rect = root.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inViewport) return;
      if (e.key === "ArrowRight") { e.preventDefault(); next(); restart(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); restart(); }
    });

    goTo(0);
    restart();
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

      btn.addEventListener("click", () => {
        const isOpen = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initFeaturedCarousel();
    initHeroContacts();
    initFaq();
  });
})();
