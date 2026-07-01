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
