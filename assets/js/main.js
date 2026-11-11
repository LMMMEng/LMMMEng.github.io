/* Meng Lou — academic homepage interactions */
(function () {
  "use strict";

  var root = document.documentElement;
  var header = document.querySelector(".site-header");
  var progressBar = document.querySelector(".progress span");
  var themeToggle = document.querySelector("[data-theme-toggle]");
  var nav = document.getElementById("site-nav");
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav > a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));

  /* ---------- Theme ---------- */
  function readStoredTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* storage may be unavailable */
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeToggle) {
      var isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  applyTheme(readStoredTheme() || root.dataset.theme || "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      storeTheme(next);
      applyTheme(next);
    });
  }

  var colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  if (colorSchemeQuery.addEventListener) {
    colorSchemeQuery.addEventListener("change", function (event) {
      if (!readStoredTheme()) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  }

  /* ---------- Header, progress, active nav ---------- */
  var ticking = false;

  function updateOnScroll() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle("is-scrolled", y > 12);
    }

    if (progressBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;
      progressBar.style.transform = "scaleX(" + progress + ")";
    }

    if (sections.length && navLinks.length) {
      var marker = y + (header ? header.offsetHeight : 0) + 130;
      var currentId = sections[0].id;

      sections.forEach(function (section) {
        if (section.offsetTop <= marker) {
          currentId = section.id;
        }
      });

      navLinks.forEach(function (link) {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === "#" + currentId
        );
      });
    }
  }

  function requestScrollUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateOnScroll);
    }
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  updateOnScroll();

  /* ---------- Mobile navigation ---------- */
  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeNav();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeNav();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        closeNav();
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function setStagger(selector, step) {
    document.querySelectorAll(selector).forEach(function (el, index) {
      el.style.setProperty("--delay", (index * step).toFixed(3) + "s");
    });
  }

  setStagger(".pubs .pub", 0.045);
  setStagger(".service-grid .service-card", 0.08);
  setStagger(".exp .exp-item", 0.08);

  var revealItems = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- News scrollbar ---------- */
  var newsPanel = document.querySelector(".news-panel");
  var newsBar = document.querySelector(".news-bar");
  var newsThumb = document.querySelector(".news-bar__thumb");

  if (newsPanel && newsBar && newsThumb) {
    var dragging = false;
    var dragStartY = 0;
    var dragStartScroll = 0;
    var maxThumbTop = 0;

    var updateThumb = function () {
      var trackHeight = newsBar.clientHeight;
      var visibleRatio = newsPanel.clientHeight / Math.max(newsPanel.scrollHeight, 1);
      var thumbHeight = Math.max(36, Math.round(trackHeight * visibleRatio));
      maxThumbTop = Math.max(0, trackHeight - thumbHeight);

      var maxScroll = newsPanel.scrollHeight - newsPanel.clientHeight;
      var top = maxScroll > 0 ? (newsPanel.scrollTop / maxScroll) * maxThumbTop : 0;

      newsThumb.style.height = thumbHeight + "px";
      newsThumb.style.transform = "translateY(" + top + "px)";
    };

    newsPanel.addEventListener("scroll", updateThumb, { passive: true });
    window.addEventListener("resize", updateThumb);

    if ("ResizeObserver" in window) {
      new ResizeObserver(updateThumb).observe(newsPanel.querySelector(".news-list"));
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateThumb);
    }
    updateThumb();

    newsThumb.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      dragging = true;
      dragStartY = event.clientY;
      dragStartScroll = newsPanel.scrollTop;
      newsThumb.classList.add("is-dragging");
      if (newsThumb.setPointerCapture) {
        newsThumb.setPointerCapture(event.pointerId);
      }
    });

    newsThumb.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      var maxScroll = newsPanel.scrollHeight - newsPanel.clientHeight;
      if (maxThumbTop <= 0 || maxScroll <= 0) return;
      var delta = event.clientY - dragStartY;
      newsPanel.scrollTop = dragStartScroll + (delta / maxThumbTop) * maxScroll;
    });

    var endDrag = function (event) {
      if (!dragging) return;
      dragging = false;
      newsThumb.classList.remove("is-dragging");
      if (newsThumb.releasePointerCapture && event.pointerId !== undefined) {
        try {
          newsThumb.releasePointerCapture(event.pointerId);
        } catch (error) {
          /* ignore */
        }
      }
    };

    newsThumb.addEventListener("pointerup", endDrag);
    newsThumb.addEventListener("pointercancel", endDrag);

    newsBar.addEventListener("pointerdown", function (event) {
      if (event.target === newsThumb) return;
      var rect = newsBar.getBoundingClientRect();
      var ratio = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      newsPanel.scrollTop = ratio * (newsPanel.scrollHeight - newsPanel.clientHeight);
    });
  }

  /* ---------- External links ---------- */
  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
})();
