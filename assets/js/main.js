document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const header = document.querySelector("header");
  const menuToggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".nav-mobile");

  const updateHeaderOffset = () => {
    if (!header) return;
    root.style.setProperty(
      "--header-offset",
      `${Math.ceil(header.getBoundingClientRect().height)}px`
    );
  };
  updateHeaderOffset();
  window.addEventListener("resize", updateHeaderOffset, { passive: true });

  // Mobile menu toggle
  if (menuToggle && mobileMenu) {
    mobileMenu.hidden = true;

    const close = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
      mobileMenu.classList.remove("active");
    };
    const open = () => {
      menuToggle.setAttribute("aria-expanded", "true");
      mobileMenu.hidden = false;
      mobileMenu.classList.add("active");
    };

    menuToggle.addEventListener("click", () => {
      menuToggle.getAttribute("aria-expanded") === "true" ? close() : open();
    });

    mobileMenu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", close)
    );

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // Header hairline on scroll
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mailto forms (static site — opens the visitor's email client)
  document.querySelectorAll("form[data-mailto]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const to = String(form.getAttribute("data-mailto") || "").trim();
      if (!to) return;
      const subject = String(form.getAttribute("data-mailto-subject") || "Website inquiry").trim();
      const lines = [];
      for (const [key, value] of new FormData(form).entries()) {
        const k = String(key || "").trim();
        const v = String(value || "").trim();
        if (k && v) lines.push(`${k}: ${v}`);
      }
      const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      form.reset();
      window.location.href = url;
    });
  });

  // Email obfuscation — assembled at runtime so scrapers don't see the address
  document.querySelectorAll("[data-email-user]").forEach((node) => {
    const user = node.getAttribute("data-email-user");
    const domain = node.getAttribute("data-email-domain");
    if (!user || !domain) return;
    node.textContent = `${user}[at]${domain}`;
    if (node.tagName === "A") {
      node.setAttribute("href", "#");
      node.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = `mailto:${user}@${domain}`;
      });
    }
  });
});
