document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const root = document.documentElement;
  const header = document.querySelector("header");
  const menuToggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".nav-mobile");

  const updateHeaderOffset = () => {
    if (!header) return;
    const height = Math.ceil(header.getBoundingClientRect().height);
    root.style.setProperty("--header-offset", `${height}px`);
  };
  updateHeaderOffset();
  window.addEventListener("resize", updateHeaderOffset, { passive: true });

  const closeMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
    mobileMenu.classList.remove("active");
    body.classList.remove("nav-open");
  };

  const openMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.hidden = false;
    mobileMenu.classList.add("active");
    body.classList.add("nav-open");
  };

  // Mobile Menu Toggle
  if (menuToggle && mobileMenu) {
    mobileMenu.hidden = true;

    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMobileMenu());
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMobileMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!mobileMenu.classList.contains("active")) return;
      const target = event.target;
      if (mobileMenu.contains(target) || menuToggle.contains(target)) return;
      closeMobileMenu();
    });
  }

  // Header scroll state
  if (header) {
    const handleScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // Toast (global)
  const toast = document.createElement("div");
  toast.className = "early-access-toast";
  toast.hidden = true;
  toast.innerHTML = "<span></span>";
  document.body.appendChild(toast);

  let toastTimer;
  const showToast = (message) => {
    toast.hidden = false;
    toast.querySelector("span").textContent = message || "";

    setTimeout(() => {
      toast.classList.add("visible");
    }, 10);

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => {
        toast.hidden = true;
      }, 260);
    }, 2600);
  };

  // Early access modal
  const EARLY_ACCESS_EMAIL = "info@linkai.ie";
  let earlyAccessModal = null;
  let earlyAccessContext = null;
  let earlyAccessLastFocused = null;
  let previousBodyOverflow = "";

  const closeEarlyAccessModal = () => {
    if (!earlyAccessModal || earlyAccessModal.hidden) return;
    earlyAccessModal.hidden = true;
    body.style.overflow = previousBodyOverflow;
    if (earlyAccessLastFocused && typeof earlyAccessLastFocused.focus === "function") {
      earlyAccessLastFocused.focus();
    }
  };

  const openEarlyAccessModal = (contextMessage) => {
    if (!earlyAccessModal) {
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.hidden = true;
      modal.innerHTML = `
        <div class="modal-backdrop" data-modal-close></div>
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="early-access-title">
          <button class="modal-close" type="button" data-modal-close aria-label="Close">✕</button>
          <div class="beta-pill">Early access</div>
          <h2 id="early-access-title">Request early access</h2>
          <p class="note" data-context hidden></p>
          <form class="early-access-form">
            <label>
              Work email
              <input name="email" type="email" autocomplete="email" placeholder="name@company.com" required />
            </label>
            <label>
              Company
              <input name="company" type="text" autocomplete="organization" placeholder="Company name" />
            </label>
            <label>
              What are you building?
              <textarea name="message" placeholder="Use case, regions, providers, volume…"></textarea>
            </label>
            <button class="btn btn-primary btn-form" type="submit">Send request</button>
          </form>
          <p class="note">We reply within 1 business day.</p>
        </div>
      `;
      document.body.appendChild(modal);
      earlyAccessModal = modal;
      earlyAccessContext = modal.querySelector("[data-context]");

      modal.addEventListener("click", (event) => {
        if (!event.target) return;
        const target = event.target;
        if (target instanceof Element && target.matches("[data-modal-close]")) {
          closeEarlyAccessModal();
        }
      });

      const form = modal.querySelector("form");
      if (form) {
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const formData = new FormData(form);
          const email = String(formData.get("email") || "").trim();
          const company = String(formData.get("company") || "").trim();
          const message = String(formData.get("message") || "").trim();

          const subject = "LinkAI Route — early access request";
          const lines = [];
          if (email) lines.push(`Email: ${email}`);
          if (company) lines.push(`Company: ${company}`);
          if (earlyAccessContext && !earlyAccessContext.hidden && earlyAccessContext.textContent) {
            lines.push(`Context: ${earlyAccessContext.textContent}`);
          }
          if (message) {
            lines.push("");
            lines.push(message);
          }

          const bodyText = lines.join("\n");
          const url = `mailto:${EARLY_ACCESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
          showToast("Opening your email client…");
          closeEarlyAccessModal();
          form.reset();
          window.location.href = url;
        });
      }
    }

    earlyAccessLastFocused = document.activeElement;
    earlyAccessModal.hidden = false;
    previousBodyOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    if (earlyAccessContext) {
      const cleaned = String(contextMessage || "").trim();
      if (cleaned) {
        earlyAccessContext.hidden = false;
        earlyAccessContext.textContent = cleaned;
      } else {
        earlyAccessContext.hidden = true;
        earlyAccessContext.textContent = "";
      }
    }

    const emailInput = earlyAccessModal.querySelector('input[name="email"]');
    if (emailInput && typeof emailInput.focus === "function") {
      emailInput.focus();
    }
  };

  document.querySelectorAll("[data-early-access]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      openEarlyAccessModal(btn.getAttribute("data-early-access"));
    });
  });

  document.querySelectorAll("[data-toast]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      showToast(btn.getAttribute("data-toast") || "");
    });
  });

  // Mailto forms (static sites)
  document.querySelectorAll("form[data-mailto]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const to = String(form.getAttribute("data-mailto") || "").trim();
      if (!to) {
        showToast("Missing mailto address.");
        return;
      }

      const subject = String(form.getAttribute("data-mailto-subject") || "Website inquiry").trim();
      const formData = new FormData(form);
      const lines = [];
      for (const [key, value] of formData.entries()) {
        const cleanKey = String(key || "").trim();
        const cleanValue = String(value || "").trim();
        if (!cleanKey || !cleanValue) continue;
        lines.push(`${cleanKey}: ${cleanValue}`);
      }

      const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      showToast("Opening your email client…");
      form.reset();
      window.location.href = url;
    });
  });

  // Esc closes overlays
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeMobileMenu();
    closeEarlyAccessModal();
  });

  // Email obfuscation
  document.querySelectorAll("[data-email-user]").forEach((node) => {
    const user = node.getAttribute("data-email-user");
    const domain = node.getAttribute("data-email-domain");
    if (!user || !domain) return;

    const text = `${user}[at]${domain}`;
    node.textContent = text;

    if (node.tagName === "A") {
      node.setAttribute("href", "#");
      node.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = `mailto:${user}@${domain}`;
      });
    }
  });
});
