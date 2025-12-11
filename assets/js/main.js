document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector("header");
  const menuToggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".nav-mobile");
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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
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

  // Early Access Toast
  const toast = document.createElement("div");
  toast.className = "early-access-toast";
  toast.hidden = true;
  toast.innerHTML = "<span>Early access launch coming soon.</span>";
  document.body.appendChild(toast);

  let toastTimer;
  const showToast = (message) => {
    toast.hidden = false;
    // Small timeout to allow display:block to apply before opacity transition
    setTimeout(() => {
        toast.classList.add("visible");
    }, 10);
    toast.querySelector("span").textContent = message || "Early access coming soon.";
    
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => {
          toast.hidden = true;
      }, 300); // Wait for transition
    }, 2600);
  };

  document.querySelectorAll("[data-early-access]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const msg = btn.getAttribute("data-early-access");
      showToast(msg || "Early access coming soon.");
    });
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
