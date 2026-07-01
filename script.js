/* Cardinal Roofing & Exteriors. Nav, active state, reveal, form guard. */
(function () {
  "use strict";

  /* Mobile hamburger */
  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".hamburger");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      nav.classList.toggle("open");
      burger.classList.toggle("open");
      var expanded = nav.classList.contains("open");
      burger.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.classList.remove("open");
      });
    });
  }

  /* Active nav link from body[data-page] */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(".nav-links a[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) link.classList.add("is-active");
    });
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Carousels (reviews + gallery): scroll-snap track with prev/next + dots */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var viewport = root.querySelector(".carousel-viewport");
    var slides = root.querySelectorAll(".carousel-slide");
    var prev = root.querySelector(".carousel-prev");
    var next = root.querySelector(".carousel-next");
    var nav = root.querySelector(".carousel-nav");
    var dotsWrap = root.querySelector(".carousel-dots");
    if (!viewport || !slides.length) return;

    function pageWidth() { return viewport.clientWidth; }
    function pageCount() {
      var slideW = slides[0].getBoundingClientRect().width;
      var gap = 24;
      var per = Math.max(1, Math.round((pageWidth() + gap) / (slideW + gap)));
      return Math.max(1, Math.ceil(slides.length / per));
    }
    function currentPage() { return Math.round(viewport.scrollLeft / pageWidth()); }
    function maxScroll() { return viewport.scrollWidth - viewport.clientWidth; }

    var anim;
    function animateTo(target) {
      target = Math.max(0, Math.min(target, maxScroll()));
      if (anim) cancelAnimationFrame(anim);
      var startL = viewport.scrollLeft;
      var dist = target - startL;
      if (Math.abs(dist) < 1) { syncDots(); return; }
      var dur = 420, t0 = null;
      function ease(p) { return 0.5 - Math.cos(p * Math.PI) / 2; }
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        viewport.scrollLeft = startL + dist * ease(p);
        if (p < 1) { anim = requestAnimationFrame(frame); }
        else { syncDots(); }
      }
      anim = requestAnimationFrame(frame);
    }

    function syncDots() {
      if (!dotsWrap) return;
      var cur = currentPage();
      dotsWrap.querySelectorAll(".carousel-dot").forEach(function (d, i) {
        d.classList.toggle("active", i === cur);
      });
    }
    function buildDots() {
      var count = pageCount();
      if (nav) nav.hidden = count <= 1;
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (var i = 0; i < count; i++) {
        var dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", "Go to slide group " + (i + 1));
        (function (idx) {
          dot.addEventListener("click", function () { animateTo(idx * pageWidth()); });
        })(i);
        dotsWrap.appendChild(dot);
      }
      syncDots();
    }

    if (prev) prev.addEventListener("click", function () { animateTo(viewport.scrollLeft - pageWidth()); });
    if (next) next.addEventListener("click", function () { animateTo(viewport.scrollLeft + pageWidth()); });

    var raf;
    viewport.addEventListener("scroll", function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncDots);
    });
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(buildDots, 150); });
    window.addEventListener("load", buildDots);

    buildDots();
  });

  /* Lightweight form guard (native validation still applies) */
  var form = document.querySelector("form[data-estimate]");
  if (form) {
    form.addEventListener("submit", function (e) {
      var required = form.querySelectorAll("[required]");
      var ok = true;
      required.forEach(function (field) {
        if (!field.value.trim()) { ok = false; field.style.borderColor = "#a81e17"; }
        else { field.style.borderColor = ""; }
      });
      if (!ok) { e.preventDefault(); }
    });
  }
})();
