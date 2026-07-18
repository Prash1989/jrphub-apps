
(function () {
  "use strict";

  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var themeIcon = themeToggle ? themeToggle.querySelector(".theme-icon") : null;
  var menuToggle = document.getElementById("menuToggle");
  var mainNav = document.getElementById("mainNav");
  var searchInput = document.getElementById("appSearch");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".app-card"));
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var emptyState = document.getElementById("emptyState");
  var activeFilter = "all";

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("jrp-theme", theme); } catch (e) {}
    if (themeIcon) themeIcon.textContent = theme === "light" ? "☀" : "☾";
  }

  var savedTheme = "dark";
  try { savedTheme = localStorage.getItem("jrp-theme") || "dark"; } catch (e) {}
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".main-nav a"), function (link) {
    link.addEventListener("click", function () {
      if (mainNav) mainNav.classList.remove("open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mainNav && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.focus();
      }
    }
  });

  function applyFilters() {
    var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    var visible = 0;

    cards.forEach(function (card) {
      var name = card.getAttribute("data-name") || "";
      var category = card.getAttribute("data-category") || "";
      var categoryTokens = category.split(/\s+/);
      var matchesQuery = query === "" || name.indexOf(query) !== -1 || category.indexOf(query) !== -1;
      var matchesFilter = activeFilter === "all" || categoryTokens.indexOf(activeFilter) !== -1;
      var show = matchesQuery && matchesFilter;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (emptyState) emptyState.style.display = visible === 0 ? "block" : "none";
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
    searchInput.addEventListener("search", applyFilters);
  }

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      filters.forEach(function (item) {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      activeFilter = button.getAttribute("data-filter") || "all";
      applyFilters();
    });
  });

  cards.forEach(function (card) {
    function openCard(event) {
      if (event.target.closest("a")) return;
      var href = card.getAttribute("data-href");
      if (href) window.location.href = href;
    }
    card.addEventListener("click", openCard);
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCard(event);
      }
    });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) { observer.observe(el); });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) { el.classList.add("visible"); });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  applyFilters();
})();
