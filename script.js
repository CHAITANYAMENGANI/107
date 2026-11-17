// ---- Settings you can change ----
var CONFIG = {
  muhurtham: "2027-02-14T10:30:00+05:30", // wedding time with timezone offset
  whatsappNumber: ""                       // e.g. "919876543210" (country code, no +). Empty = guest picks the chat.
};
var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
function $(id){ return document.getElementById(id); }

// ---- Cover ----
document.body.style.overflow = "hidden";
$("openBtn").addEventListener("click", function () {
  $("cover").classList.add("open");
  document.body.style.overflow = "";
  if (!reduced) {
    for (var i = 0; i < 10; i++) setTimeout(petal, i * 180);
    setInterval(petal, 1100);
  }
});

// ---- Falling petals ----
var kinds = ["rose", "rose", "blossom", "leaf"];
function petal() {
  if (document.hidden) return;
  var el = document.createElement("div");
  el.className = "petal " + kinds[Math.random() * kinds.length | 0];
  el.style.left = Math.random() * 100 + "vw";
  el.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
  el.style.setProperty("--rot", (300 + Math.random() * 500) + "deg");
  var dur = 6 + Math.random() * 5;
  el.style.animationDuration = dur + "s";
  document.body.appendChild(el);
  setTimeout(function () { el.remove(); }, dur * 1000);
}

// ---- Scroll reveal ----
(function () {
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: .15 });
  els.forEach(function (e) { io.observe(e); });
})();

// ---- Scratch to reveal ----
(function () {
  var c = $("scratch"), ctx = c.getContext("2d"), down = false, done = false, moves = 0;
  function paint() {
    var r = c.getBoundingClientRect(), d = window.devicePixelRatio || 1;
    if (!r.width || done) return;
    c.width = r.width * d; c.height = r.height * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    var g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, "#8c1823"); g.addColorStop(.5, "#c22a38"); g.addColorStop(1, "#8c1823");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = "#f3d9a4"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "600 14px Georgia, serif";
    try { ctx.letterSpacing = "3px"; } catch (e) {}
    ctx.fillText("✦  SCRATCH TO REVEAL  ✦", r.width / 2, r.height / 2);
  }
  function finish() {
    done = true; c.style.opacity = 0; c.style.pointerEvents = "none";
    $("hint").textContent = "We can't wait to celebrate with you";
    if (!reduced) for (var i = 0; i < 14; i++) setTimeout(petal, i * 90);
  }
  function scratch(e) {
    if (!down || done) return;
    var r = c.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, 7); ctx.fill();
    if (++moves % 12 === 0) {
      var px = ctx.getImageData(0, 0, c.width, c.height).data, clear = 0, n = 0;
      for (var i = 3; i < px.length; i += 160) { n++; if (px[i] < 40) clear++; }
      if (clear / n > .45) finish();
    }
  }
  c.addEventListener("pointerdown", function (e) { down = true; c.setPointerCapture(e.pointerId); scratch(e); });
  c.addEventListener("pointermove", scratch);
  c.addEventListener("pointerup", function () { down = false; });
  c.addEventListener("pointercancel", function () { down = false; });
  window.addEventListener("resize", paint);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(paint);
  paint();
})();

// ---- Countdown ----
(function () {
  var target = new Date(CONFIG.muhurtham).getTime();
  function tick() {
    var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    $("cd-d").textContent = Math.floor(s / 86400);
    $("cd-h").textContent = Math.floor(s % 86400 / 3600);
    $("cd-m").textContent = Math.floor(s % 3600 / 60);
    $("cd-s").textContent = s % 60;
  }
  tick(); setInterval(tick, 1000);
})();

// ---- RSVP link ----
(function () {
  var msg = encodeURIComponent("Hi! I'd love to confirm my attendance at the wedding. 🎉");
  $("rsvp").href = "https://wa.me/" + (CONFIG.whatsappNumber || "") + "?text=" + msg;
})();
