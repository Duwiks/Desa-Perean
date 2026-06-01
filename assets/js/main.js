/**
 * main.js — Desa Wisata Penglipuran
 * Handles: Component loader, active nav links, mobile menu, scroll effects
 */

// ─── Component Loader ───────────────────────────────────────────────────────

async function loadComponent(placeholderId, componentPath) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  try {
    const response = await fetch(componentPath);
    if (!response.ok)
      throw new Error(`Failed to load ${componentPath}: ${response.status}`);
    const html = await response.text();
    placeholder.innerHTML = html;
  } catch (error) {
    console.error(`[ComponentLoader] ${error.message}`);
  }
}

// ─── Active Navigation Indicator ────────────────────────────────────────────

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const navLinks = document.querySelectorAll(".nav-link[data-page]");
  navLinks.forEach((link) => {
    const page = link.getAttribute("data-page");
    if (page === currentPage || (currentPage === "" && page === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ─── Mobile Menu Toggle ──────────────────────────────────────────────────────

function initMobileMenu() {
  const btn = document.getElementById("hamburger-btn");
  const menu = document.getElementById("mobile-menu");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.style.maxHeight && menu.style.maxHeight !== "0px";

    if (isOpen) {
      menu.style.maxHeight = "0px";
      btn.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    } else {
      menu.style.maxHeight = menu.scrollHeight + "px";
      btn.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  // Close menu when a mobile link is clicked
  menu.addEventListener("click", (e) => {
    if (e.target.closest(".mobile-nav-link")) {
      menu.style.maxHeight = "0px";
      btn.classList.remove("open");
    }
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.style.maxHeight = "0px";
      btn.classList.remove("open");
    }
  });
}

// ─── Header Scroll Effect ────────────────────────────────────────────────────

function initHeaderScroll() {
  const header = document.getElementById("main-header");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // Run on init
}

// ─── Smooth Scroll for Anchor Links ─────────────────────────────────────────

function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const offset = 80; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
}

// ─── AOS Reinit (after dynamic content loads) ────────────────────────────────

function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }
}

// ─── Main Init ───────────────────────────────────────────────────────────────

async function init() {
  // Load components in parallel
  await Promise.all([
    loadComponent("header-placeholder", "layout/header.html"),
    loadComponent("footer-placeholder", "layout/footer.html"),
  ]);

  // After components are injected into DOM
  setActiveNavLink();
  initMobileMenu();
  initHeaderScroll();
  initSmoothScroll();

  // Re-init AOS after all content loaded
  setTimeout(initAOS, 100);
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ========================================================
// SCRIPT PELACAK VERCEL WEB ANALYTICS
// ========================================================
function initVercelAnalytics() {
  window.va =
    window.va ||
    function () {
      (window.vaq = window.vaq || []).push(arguments);
    };
  const scriptTag = document.createElement("script");
  scriptTag.src = "/_vercel/insights/script.js";
  scriptTag.defer = true;
  document.head.appendChild(scriptTag);
}

// Jalankan tracking otomatis saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", initVercelAnalytics);
