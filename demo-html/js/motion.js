(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function progress() {
    const onScroll = () => {
      const bar = document.querySelector("[data-progress]");
      const top = document.querySelector(".top");
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (bar) bar.style.width = (p * 100).toFixed(2) + "%";
      if (top) top.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function reveal() {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;
    if (reduce) {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );
    nodes.forEach((el) => io.observe(el));
  }

  function network(canvas, opts) {
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dense = opts.dense;
    const color = opts.color || [127, 212, 220];
    let nodes = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.floor((w * h) / (dense ? 14000 : 28000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: dense ? 1.4 + Math.random() * 1.4 : 1 + Math.random(),
      }));
    }

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const link = dense ? 118 : 96;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.85)`;
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < link) {
            ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${(1 - d / link) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }

    let running = false;
    function start() {
      if (running || reduce) return;
      running = true;
      tick();
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }
    const wrap = canvas.parentElement || canvas;
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    const vis = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting && !document.hidden ? start() : stop()));
    }, { threshold: 0.05 });
    vis.observe(wrap);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
    });
  }

  function liveFrame() {
    const frame = document.querySelector("[data-live-frame]");
    if (!frame || reduce) return;
    const items = frame.querySelectorAll(".side-item");
    const rows = frame.querySelectorAll("tbody tr");
    let i = 0;
    setInterval(() => {
      items.forEach((el, idx) => el.classList.toggle("active", idx === i % items.length));
      rows.forEach((el, idx) => el.classList.toggle("is-live", idx === i % rows.length));
      i += 1;
    }, 2200);
  }

  function bootNets() {
    document.querySelectorAll("[data-net]").forEach((el) => {
      if (el.dataset.bound) return;
      el.dataset.bound = "1";
      network(el, { dense: el.getAttribute("data-net") === "dense", color: [127, 212, 220] });
    });
  }

  function boot() {
    document.documentElement.classList.add("has-motion");
    progress();
    reveal();
    liveFrame();
    bootNets();
  }

  document.addEventListener("pttcrm:lang", () => {
    reveal();
    bootNets();
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
