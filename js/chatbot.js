/* ============================================================
   CHATBOT — "See AI in Action" demo widget
   Two layers, kept deliberately separate:
     1. GeniusChatEngine  → decides WHAT to answer (swap this
        for a real API call later, e.g. fetch('/api/chat', ...))
     2. ChatUI             → decides HOW to render it (DOM only)
   ============================================================ */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. RESPONSE ENGINE (mock — replace with a real AI call)
     --------------------------------------------------------- */
  const GeniusChatEngine = {
    // Keyword → response map. Order matters: first match wins.
    rules: [
      {
        keywords: ["business", "build for my business", "what can you build"],
        response:
          "For businesses we usually build one of three things: a professional website to establish your presence, a custom web app if you have a specific workflow (bookings, dashboards, portals), or AI features layered on top of either. What are you running — and is it mainly about being found online, or automating something internally?",
      },
      {
        keywords: ["cost", "price", "pricing", "how much", "budget"],
        response:
          "Simple websites start from $50. More complete business sites start from $150. Anything with logins, databases, payments or AI integration is scoped individually since complexity varies a lot — happy to give you a real number once I know what you need.",
      },
      {
        keywords: ["ai", "chatbot", "automation", "intelligent"],
        response:
          "Yes — this chat is a small example. We add AI where it genuinely saves time: chatbots like this one, document processing, intelligent search, recommendations, or predictive features like the ones in Gradelytics. We won't bolt AI onto something that doesn't need it.",
      },
      {
        keywords: ["process", "development process", "how does", "how it works"],
        response:
          "It's five steps: we discuss what you're trying to build, plan the structure and requirements, build it, you review and request changes, then we launch. Most simple websites move through that in days, not months.",
      },
      {
        keywords: ["hello", "hi", "hey"],
        response: "Hey! Happy to help — are you looking for a website, a web app, or something AI-powered?",
      },
      {
        keywords: ["contact", "reach", "whatsapp", "email"],
        response:
          "Easiest way is the project form just below, or WhatsApp us directly using the button in the Contact section — we usually reply within a day.",
      },
    ],

    fallback:
      "Good question — I'm just a small demo of what we can build into your site, so I don't have every answer yet. For anything specific, the project form below goes straight to the team.",

    /**
     * Returns a response string for a given user message.
     * Swap the body of this function for a real API call, e.g.:
     *
     *   async getResponse(message) {
     *     const res = await fetch('/api/chat', {
     *       method: 'POST',
     *       headers: { 'Content-Type': 'application/json' },
     *       body: JSON.stringify({ message })
     *     });
     *     const data = await res.json();
     *     return data.reply;
     *   }
     */
    getResponse(message) {
      const normalized = message.toLowerCase();
      const matched = this.rules.find((rule) =>
        rule.keywords.some((kw) => normalized.includes(kw))
      );
      return matched ? matched.response : this.fallback;
    },
  };

  /* ---------------------------------------------------------
     2. UI CONTROLLER (DOM only — knows nothing about how
        responses are generated)
     --------------------------------------------------------- */
  const ChatUI = {
    init() {
      this.body = document.getElementById("chatBody");
      this.form = document.getElementById("chatForm");
      this.input = document.getElementById("chatInput");
      this.suggestions = document.getElementById("chatSuggestions");

      if (!this.body || !this.form || !this.input) return;

      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleUserMessage(this.input.value);
      });

      if (this.suggestions) {
        this.suggestions.addEventListener("click", (e) => {
          const chip = e.target.closest(".chip");
          if (!chip) return;
          this.handleUserMessage(chip.dataset.question || chip.textContent);
        });
      }
    },

    handleUserMessage(rawMessage) {
      const message = (rawMessage || "").trim();
      if (!message) return;

      this.appendMessage(message, "user");
      this.input.value = "";
      this.input.focus();

      const typingEl = this.showTyping();

      // Simulated latency so the demo feels like a real request.
      const delay = 500 + Math.random() * 500;
      setTimeout(() => {
        typingEl.remove();
        const reply = GeniusChatEngine.getResponse(message);
        this.appendMessage(reply, "ai");
      }, delay);
    },

    appendMessage(text, role) {
      const msg = document.createElement("div");
      msg.className = `chat-msg chat-msg--${role}`;
      const p = document.createElement("p");
      p.textContent = text;
      msg.appendChild(p);
      this.body.appendChild(msg);
      this.scrollToBottom();
    },

    showTyping() {
      const typing = document.createElement("div");
      typing.className = "chat-typing";
      typing.innerHTML = "<span></span><span></span><span></span>";
      this.body.appendChild(typing);
      this.scrollToBottom();
      return typing;
    },

    scrollToBottom() {
      this.body.scrollTop = this.body.scrollHeight;
    },
  };

  document.addEventListener("DOMContentLoaded", () => ChatUI.init());
})();
