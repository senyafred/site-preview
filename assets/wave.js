(function () {
  var c = document.getElementById('waveCanvas');
  if (!c || !c.getContext) return;
  var ctx = c.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = c.clientWidth; H = c.clientHeight;
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  var N = 90;
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    var mid = H * 0.52;
    var step = Math.max(6, W / 180);
    for (var i = 0; i < N; i++) {
      var frac = i / (N - 1);
      var baseY = H * 0.13 + frac * (H * 0.76);
      var phase = i * 0.18 + t * 0.00032;
      var bob = Math.sin(t * 0.00055 + i * 0.5) * 4;
      ctx.beginPath();
      for (var x = 0; x <= W; x += step) {
        var tt = x / W;
        var env = 0.25 + 0.75 * (0.5 - 0.5 * Math.cos(2 * Math.PI * tt));
        var y = baseY + bob
              + 26 * env * Math.sin(2 * Math.PI * 1.15 * tt + phase)
              + 9  * env * Math.sin(2 * Math.PI * 2.40 * tt + phase * 1.7);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      var d = Math.abs(baseY - mid) / (H * 0.5);
      var vis = Math.max(0, 1 - d * 0.9);
      if (i % 12 === 0) {
        ctx.strokeStyle = 'rgba(91,131,176,' + (0.05 + 0.12 * vis).toFixed(3) + ')';
      } else {
        var g = 130 + Math.round(18 * Math.sin(i));
        ctx.strokeStyle = 'rgba(' + g + ',' + (g + 4) + ',' + (g + 10) + ',' + (0.06 + 0.32 * vis).toFixed(3) + ')';
      }
      ctx.lineWidth = 0.5 + 0.35 * vis;
      ctx.stroke();
    }
  }
  var raf;
  function frame(ts) { draw(ts); raf = requestAnimationFrame(frame); }
  window.addEventListener('resize', function () { resize(); if (reduce) draw(performance.now()); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else if (!reduce) { raf = requestAnimationFrame(frame); }
  });
  resize();
  if (reduce) draw(0); else raf = requestAnimationFrame(frame);
})();

(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var banner = document.querySelector('.banner');
  var inner = banner ? banner.querySelector('.banner-inner') : null;
  var ticking = false;
  function apply() {
    var y = window.scrollY || window.pageYOffset || 0;
    var h = banner ? banner.offsetHeight : 380;
    var p = Math.max(0, Math.min(1, y / (h * 0.8)));
    if (inner) {
      inner.style.opacity = (1 - p).toFixed(3);
      inner.style.transform = 'translateY(' + (-p * 28).toFixed(1) + 'px)';
    }
    header.style.setProperty('--dark', p.toFixed(3));
    header.classList.toggle('scrolled', p > 0.42);
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  apply();
})();
