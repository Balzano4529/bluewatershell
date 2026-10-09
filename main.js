(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var dotsWrap = document.querySelector(".dots");
  var index = 0;
  var timer = null;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Photograph " + (i + 1));
    dot.addEventListener("click", function () { show(i); });
    dotsWrap.appendChild(dot);
  });

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var on = i === index;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
    });
    Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  function queue() {
    if (reduce) return;
    clearInterval(timer);
    timer = setInterval(function () { show(index + 1); }, 7000);
  }

  document.querySelector(".next").addEventListener("click", function () {
    show(index + 1);
    queue();
  });
  document.querySelector(".prev").addEventListener("click", function () {
    show(index - 1);
    queue();
  });

  var startX = null;
  var hero = document.querySelector(".hero");
  hero.addEventListener("touchstart", function (event) {
    startX = event.changedTouches[0].clientX;
  }, { passive: true });
  hero.addEventListener("touchend", function (event) {
    if (startX === null) return;
    var delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) show(index + (delta < 0 ? 1 : -1));
    startX = null;
    queue();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") { show(index + 1); queue(); }
    if (event.key === "ArrowLeft") { show(index - 1); queue(); }
  });

  var menu = document.querySelector(".menu");
  var panel = document.querySelector(".menu-panel");
  menu.addEventListener("click", function () {
    var open = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", open ? "false" : "true");
    panel.hidden = open;
  });
  panel.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      menu.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    }
  });

  show(0);
  queue();
})();
