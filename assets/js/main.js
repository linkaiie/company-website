document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".nav-mobile");
  const themeToggles = document.querySelectorAll(".theme-toggle");
  const root = document.body;

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("linkai-theme", theme);
    } catch {
      /* ignore storage issues */
    }
  };

  const storedTheme = (() => {
    try {
      return localStorage.getItem("linkai-theme");
    } catch {
      return null;
    }
  })();

  const hour = new Date().getHours();
  const initialTheme =
    storedTheme ||
    (hour >= 7 && hour < 19 ? "light" : "dark");
  applyTheme(initialTheme);

  if (themeToggles.length) {
    themeToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
      });
    });
  }

  if (menuToggle && mobileMenu) {
    mobileMenu.hidden = true;
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.hidden = expanded;
    });
  }

  const toast = document.createElement("div");
  toast.className = "early-access-toast";
  toast.hidden = true;
  toast.innerHTML = "<span>Early access launch coming soon.</span>";
  document.body.appendChild(toast);

  let toastTimer;
  const showToast = (message) => {
    toast.hidden = false;
    toast.querySelector("span").textContent = message || "Early access coming soon.";
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("visible");
      toast.hidden = true;
    }, 2600);
  };

  document.querySelectorAll("[data-early-access]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const msg = btn.getAttribute("data-early-access");
      showToast(msg || "Early access coming soon.");
    });
  });

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
