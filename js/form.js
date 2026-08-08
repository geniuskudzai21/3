/* ============================================================
   FORM — contact form validation
   No backend is wired up yet. handleSubmit() is the single
   place to connect a real endpoint or form service later.
   ============================================================ */

(function () {
  "use strict";

  const validators = {
    fName: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    fEmail: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address.",
    fPhone: (v) => (v.trim().length >= 7 ? "" : "Please enter a valid phone/WhatsApp number."),
    fType: (v) => (v ? "" : "Please select a project type."),
    fBudget: (v) => (v ? "" : "Please select a budget range."),
    fDesc: (v) => (v.trim().length >= 10 ? "" : "Tell us a little more about the project (10+ characters)."),
  };

  function validateField(field) {
    const validator = validators[field.id];
    if (!validator) return true;

    const errorEl = document.getElementById(`err-${field.id}`);
    const message = validator(field.value);

    field.closest(".form-field")?.classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message;

    return !message;
  }

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mljrgzgw";

  async function handleSubmit(form, noteEl) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }
    noteEl.textContent = "";
    noteEl.style.color = "";

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        noteEl.style.color = "#3dba6e";
        noteEl.textContent = "Thanks — your message has been sent. We'll be in touch soon.";
        form.reset();
      } else {
        noteEl.style.color = "#e2554f";
        noteEl.textContent = "Something went wrong sending your message. Please try again or email us directly.";
      }
    } catch (err) {
      noteEl.style.color = "#e2554f";
      noteEl.textContent = "Network error — please check your connection and try again.";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const noteEl = document.getElementById("formNote");
    const fields = Array.from(form.querySelectorAll("input, select, textarea"));

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".form-field")?.classList.contains("has-error")) {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      noteEl.textContent = "";

      const allValid = fields.map(validateField).every(Boolean);
      if (!allValid) {
        noteEl.style.color = "#e2554f";
        noteEl.textContent = "Please fix the highlighted fields.";
        form.querySelector(".has-error input, .has-error select, .has-error textarea")?.focus();
        return;
      }

      handleSubmit(form, noteEl);
    });
  });
})();
