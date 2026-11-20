"use client";

import { useEffect, useRef } from "react";

const HUES = [[92, 255, 208], [166, 255, 92], [255, 92, 138], [255, 207, 92]];
const CAP = 46;
const rand = (a, b) => a + Math.random() * (b - a);
const DPR = () => Math.min(devicePixelRatio || 1, 2);

function visibleLoop(canvas, frame) {
  let on = true, started = false, raf;
  let obs;
  if ("IntersectionObserver" in window) {
    obs = new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) kick(); }, { threshold: 0.01 });
    obs.observe(canvas);
  }
  function kick() { if (!started) { started = true; loop(); } }
  function loop() { if (!on) { started = false; return; } frame(); raf = requestAnimationFrame(loop); }
  kick();
  return () => { obs?.disconnect(); if (raf) cancelAnimationFrame(raf); };
}

export default function PetriDish() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = cv.getContext("2d");
    let w, h, dpr, cxc, cyc, maxR, cells = [], food = [], divideAcc = 0;
    const mouse = { x: -9999, y: -9999, in: false };

    function spawn(x, y, r) {
      const c = HUES[(Math.random() * HUES.length) | 0];
      return { x, y, vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4), r: r || rand(4, 9), tr: r || rand(4, 9), col: c, phase: Math.random() * 6.28, age: 0 };
    }
    function seed() {
      dpr = DPR(); w = cv.width = cv.clientWidth * dpr; h = cv.height = cv.clientHeight * dpr;
      cxc = w / 2; cyc = h / 2; maxR = w / 2 - 6 * dpr;
      cells = []; food = [];
      const n = Math.min(26, Math.floor((cv.clientWidth * cv.clientHeight) / 5200));
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.28, rr = Math.sqrt(Math.random()) * maxR * 0.8;
        cells.push(spawn(cxc + Math.cos(a) * rr, cyc + Math.sin(a) * rr));
      }
      for (let i = 0; i < 24; i++) {
        const a = Math.random() * 6.28, rr = Math.sqrt(Math.random()) * maxR;
        food.push({ x: cxc + Math.cos(a) * rr, y: cyc + Math.sin(a) * rr, ph: Math.random() * 6.28 });
      }
    }
    function toLocal(e) {
      const r = cv.getBoundingClientRect(), s = e.touches ? e.touches[0] : e;
      mouse.x = (s.clientX - r.left) * dpr; mouse.y = (s.clientY - r.top) * dpr; mouse.in = true;
    }
    const onLeave = () => { mouse.in = false; mouse.x = mouse.y = -9999; };
    cv.addEventListener("mousemove", toLocal);
    cv.addEventListener("mouseleave", onLeave);
    cv.addEventListener("touchmove", toLocal, { passive: true });
    cv.addEventListener("touchend", onLeave);
    window.addEventListener("resize", seed);
    seed();

    function frame() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(7,32,26,0.35)"; ctx.beginPath(); ctx.arc(cxc, cyc, maxR, 0, 6.28); ctx.fill();

      for (const f of food) {
        f.ph += 0.03;
        ctx.beginPath(); ctx.arc(f.x, f.y, (1.2 + Math.sin(f.ph) * 0.5) * dpr, 0, 6.28);
        ctx.fillStyle = "rgba(166,255,92,0.35)"; ctx.fill();
      }

      const link = 60 * dpr;
      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          const a = cells[i], b = cells[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < link) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(92,255,208,${0.12 * (1 - d / link)})`; ctx.lineWidth = dpr; ctx.stroke();
          }
        }
      }

      for (const c of cells) {
        c.age++; c.phase += 0.05;
        c.vx += rand(-0.06, 0.06); c.vy += rand(-0.06, 0.06);
        if (mouse.in) {
          const dx = c.x - mouse.x, dy = c.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 90 * dpr && d > 0) { c.vx += (dx / d) * 1.1; c.vy += (dy / d) * 1.1; }
        }
        const sp = Math.hypot(c.vx, c.vy), max = 1.4 * dpr;
        if (sp > max) { c.vx = (c.vx / sp) * max; c.vy = (c.vy / sp) * max; }
        c.vx *= 0.97; c.vy *= 0.97;
        c.x += c.vx; c.y += c.vy;
        const dx = c.x - cxc, dy = c.y - cyc, dist = Math.hypot(dx, dy);
        if (dist > maxR - c.r) {
          const nx = dx / dist, ny = dy / dist;
          c.x = cxc + nx * (maxR - c.r); c.y = cyc + ny * (maxR - c.r);
          const dot = c.vx * nx + c.vy * ny; c.vx -= 2 * dot * nx; c.vy -= 2 * dot * ny;
        }
        c.r += (c.tr - c.r) * 0.05;
        const [r0, g0, b0] = c.col, pr = c.r * (1 + Math.sin(c.phase) * 0.12);
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, pr * 2.4);
        g.addColorStop(0, `rgba(${r0},${g0},${b0},0.5)`); g.addColorStop(1, `rgba(${r0},${g0},${b0},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.x, c.y, pr * 2.4, 0, 6.28); ctx.fill();
        ctx.beginPath(); ctx.arc(c.x, c.y, pr, 0, 6.28);
        ctx.fillStyle = `rgba(${r0},${g0},${b0},0.95)`; ctx.fill();
        ctx.beginPath(); ctx.arc(c.x - pr * 0.25, c.y - pr * 0.25, pr * 0.32, 0, 6.28);
        ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.fill();
      }

      divideAcc++;
      if (divideAcc > 40 && cells.length < CAP && !reduce) {
        divideAcc = 0;
        const parent = cells[(Math.random() * cells.length) | 0];
        if (parent && parent.r > 5) {
          parent.tr = parent.r * 0.72; parent.r = parent.tr;
          const child = spawn(parent.x + rand(-6, 6), parent.y + rand(-6, 6), 1);
          child.tr = parent.tr; child.col = parent.col; cells.push(child);
        }
      }
      if (cells.length > CAP) cells.splice(0, cells.length - CAP);
    }
    const stopLoop = visibleLoop(cv, frame);

    return () => {
      window.removeEventListener("resize", seed);
      cv.removeEventListener("mousemove", toLocal);
      cv.removeEventListener("mouseleave", onLeave);
      cv.removeEventListener("touchmove", toLocal);
      cv.removeEventListener("touchend", onLeave);
      stopLoop();
    };
  }, []);

  return <canvas id="petri" ref={ref}></canvas>;
}
