"use client";

import { useEffect, useRef } from "react";

function ParticleSim(demo, ctx, getWHD, ptr) {
  let dots = [];
  const cols = ["#5b8cff", "#a06bff", "#2ad4d4", "#ff6bb5", "#3ddc97", "#ffb454"];
  const params = { mode: "attract", force: 45 };
  function seed() {
    const { W, H, DPR } = getWHD();
    const n = Math.min(360, Math.floor((demo.clientWidth * demo.clientHeight) / 900));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
      r: (Math.random() * 2 + 1.2) * DPR, c: cols[(Math.random() * cols.length) | 0],
    }));
  }
  function burst(sound) {
    if (ptr.x == null) return;
    const { DPR } = getWHD();
    dots.forEach((d) => {
      const dx = d.x - ptr.x, dy = d.y - ptr.y, dist = Math.hypot(dx, dy) || 1;
      const f = (12 * DPR) / dist * params.force;
      d.vx += (dx / dist) * f; d.vy += (dy / dist) * f;
    });
    sound?.spawn();
  }
  return {
    desc: "A field of 300+ particles. Attract, repel or orbit them with your cursor — or switch to Burst and click to detonate a shockwave.",
    hint: "Move to steer · click for effect ✦",
    controls: [
      { type: "segment", label: "Mode", value: "attract", options: [
        { v: "attract", label: "Attract" }, { v: "repel", label: "Repel" },
        { v: "orbit", label: "Orbit" }, { v: "burst", label: "Burst" }],
        onChange: (v) => { params.mode = v; } },
      { type: "range", label: "Force", min: 1, max: 100, value: 45, onChange: (v) => { params.force = v; } },
    ],
    resize: seed,
    reset: seed,
    pointer: (t, sound) => { if (t === "down" && params.mode === "burst") burst(sound); },
    frame() {
      const { W, H, DPR } = getWHD();
      ctx.fillStyle = "rgba(5,6,15,0.28)"; ctx.fillRect(0, 0, W, H);
      const strength = params.force / 45;
      for (const d of dots) {
        if (ptr.active && ptr.x != null && params.mode !== "burst") {
          const dx = ptr.x - d.x, dy = ptr.y - d.y, dist = Math.hypot(dx, dy) || 1;
          if (dist < 260 * DPR) {
            const f = (0.5 * DPR * strength) / Math.max(dist * 0.04, 1);
            if (params.mode === "attract") { d.vx += (dx / dist) * f; d.vy += (dy / dist) * f; }
            else if (params.mode === "repel") { d.vx -= (dx / dist) * f; d.vy -= (dy / dist) * f; }
            else if (params.mode === "orbit") {
              d.vx += (dx / dist) * f * 0.35 - (dy / dist) * f;
              d.vy += (dy / dist) * f * 0.35 + (dx / dist) * f;
            }
          }
        }
        d.vx *= 0.96; d.vy *= 0.96; d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.2832);
        ctx.fillStyle = d.c; ctx.shadowBlur = 12; ctx.shadowColor = d.c; ctx.fill(); ctx.shadowBlur = 0;
      }
      return `<span><b>${dots.length}</b> particles</span><span>mode <b>${params.mode}</b></span>`;
    },
  };
}

function GravitySim(demo, ctx, getWHD, ptr) {
  let bodies = [];
  const params = { G: 55, trails: true };
  const cols = ["#5b8cff", "#a06bff", "#2ad4d4", "#ff6bb5", "#3ddc97", "#ffb454"];
  function seed() {
    const { W, H, DPR } = getWHD();
    const cx = W / 2, cy = H / 2;
    bodies = [{ x: cx, y: cy, vx: 0, vy: 0, m: 1400, r: 12 * DPR, c: "#ffcf6b", sun: true, trail: [] }];
    for (let i = 0; i < 4; i++) addOrbiter(cx + (90 + i * 55) * DPR, cy, cols[i]);
  }
  function addOrbiter(x, y, c) {
    const sun = bodies[0]; const dx = x - sun.x, dy = y - sun.y, r = Math.hypot(dx, dy) || 1;
    const v = Math.sqrt((params.G * sun.m) / r) * 0.06;
    const { DPR } = getWHD();
    bodies.push({ x, y, vx: (-dy / r) * v, vy: (dx / r) * v, m: 8 + Math.random() * 20, r: (2.5 + Math.random() * 2) * DPR, c: c || cols[(Math.random() * cols.length) | 0], trail: [] });
  }
  return {
    desc: "A gravitational N-body system. Every body pulls on every other. Click anywhere to fling a new planet into a stable orbit around the star.",
    hint: "Click to add a planet ✦",
    controls: [
      { type: "range", label: "Gravity", min: 5, max: 120, value: 55, onChange: (v) => { params.G = v; } },
      { type: "toggle", label: "Trails", value: true, onChange: (v) => { params.trails = v; } },
    ],
    resize: seed, reset: seed,
    pointer: (t, sound) => { if (t === "down" && ptr.x != null && bodies.length < 60) { addOrbiter(ptr.x, ptr.y); sound?.spawn(); } },
    frame() {
      const { W, H, DPR } = getWHD();
      if (params.trails) { ctx.fillStyle = "rgba(5,6,15,0.16)"; ctx.fillRect(0, 0, W, H); }
      else { ctx.fillStyle = "rgba(5,6,15,1)"; ctx.fillRect(0, 0, W, H); }
      const G = params.G * 0.00004;
      for (let i = 0; i < bodies.length; i++) {
        const a = bodies[i]; if (a.sun) continue;
        for (let j = 0; j < bodies.length; j++) {
          if (i === j) continue;
          const b = bodies[j];
          const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy + 40 * DPR * DPR;
          const d = Math.sqrt(d2), f = (G * b.m) / d2;
          a.vx += (dx / d) * f; a.vy += (dy / d) * f;
        }
      }
      for (const b of bodies) {
        if (b.sun) continue;
        b.x += b.vx; b.y += b.vy;
        if (params.trails) { b.trail.push(b.x, b.y); if (b.trail.length > 90) b.trail.splice(0, 2); }
      }
      for (const b of bodies) {
        if (params.trails && b.trail.length > 3) {
          ctx.beginPath(); ctx.moveTo(b.trail[0], b.trail[1]);
          for (let k = 2; k < b.trail.length; k += 2) ctx.lineTo(b.trail[k], b.trail[k + 1]);
          ctx.strokeStyle = b.c + "66"; ctx.lineWidth = DPR; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.2832);
        ctx.fillStyle = b.c; ctx.shadowBlur = b.sun ? 40 : 14; ctx.shadowColor = b.c; ctx.fill(); ctx.shadowBlur = 0;
      }
      return `<span><b>${bodies.length}</b> bodies</span><span>G <b>${params.G}</b></span>`;
    },
  };
}

function PendulumSim(demo, ctx, getWHD, ptr, accent) {
  let a1, a2, a1v, a2v, trail;
  const params = { g: 1.4, damp: 1 };
  function seed() {
    a1 = Math.PI / 2 + (Math.random() - 0.5); a2 = Math.PI / 2 + (Math.random() - 0.5);
    a1v = a2v = 0; trail = [];
  }
  function step() {
    // dimensionless physics: unit lengths & masses, tuned gravity
    const g = params.g, l1 = 1, l2 = 1, m1 = 1, m2 = 1, dt = 0.04;
    for (let s = 0; s < 6; s++) {
      const num1 = -g * (2 * m1 + m2) * Math.sin(a1);
      const num2 = -m2 * g * Math.sin(a1 - 2 * a2);
      const num3 = -2 * Math.sin(a1 - a2) * m2 * (a2v * a2v * l2 + a1v * a1v * l1 * Math.cos(a1 - a2));
      const den1 = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
      const acc1 = (num1 + num2 + num3) / den1;
      const num4 = 2 * Math.sin(a1 - a2);
      const num5 = a1v * a1v * l1 * (m1 + m2) + g * (m1 + m2) * Math.cos(a1) + a2v * a2v * l2 * m2 * Math.cos(a1 - a2);
      const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
      const acc2 = (num4 * num5) / den2;
      a1v += acc1 * dt; a2v += acc2 * dt;
      a1 += a1v * dt; a2 += a2v * dt;
    }
    a1v *= params.damp; a2v *= params.damp;
  }
  return {
    desc: "The double pendulum — a textbook example of deterministic chaos. Two coupled arms whose motion never repeats. Click to release it from your cursor.",
    hint: "Click to drop the arm ✦",
    controls: [
      { type: "range", label: "Gravity", min: 0.4, max: 3, step: 0.1, value: 1.4, onChange: (v) => { params.g = v; } },
      { type: "range", label: "Damping", min: 0.99, max: 1, step: 0.001, value: 1, onChange: (v) => { params.damp = v; } },
    ],
    resize: () => {}, reset: seed,
    pointer: (t, sound) => {
      const { W, H } = getWHD();
      if (t === "down" && ptr.x != null) {
        const ox = W / 2, oy = H * 0.32;
        a1 = Math.atan2(ptr.x - ox, ptr.y - oy); a2 = a1; a1v = a2v = 0; trail = [];
        sound?.spawn();
      }
    },
    frame() {
      const { W, H, DPR } = getWHD();
      if (a1 === undefined) seed();
      step();
      ctx.fillStyle = "rgba(5,6,15,0.2)"; ctx.fillRect(0, 0, W, H);
      const L1 = Math.min(W, H) * 0.24, L2 = Math.min(W, H) * 0.24;
      const ox = W / 2, oy = H * 0.32, l1 = L1, l2 = L2;
      const x1 = ox + l1 * Math.sin(a1), y1 = oy + l1 * Math.cos(a1);
      const x2 = x1 + l2 * Math.sin(a2), y2 = y1 + l2 * Math.cos(a2);
      trail.push(x2, y2); if (trail.length > 260) trail.splice(0, 2);
      const ac = accent();
      if (trail.length > 3) {
        ctx.beginPath(); ctx.moveTo(trail[0], trail[1]);
        for (let k = 2; k < trail.length; k += 2) ctx.lineTo(trail[k], trail[k + 1]);
        ctx.strokeStyle = ac + "88"; ctx.lineWidth = 1.6 * DPR;
        ctx.shadowBlur = 10; ctx.shadowColor = ac; ctx.stroke(); ctx.shadowBlur = 0;
      }
      ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 2.4 * DPR; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      for (const [x, y, r, c] of [[ox, oy, 4 * DPR, "#8892b8"], [x1, y1, 8 * DPR, "#ff6bb5"], [x2, y2, 8 * DPR, ac]]) {
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832);
        ctx.fillStyle = c; ctx.shadowBlur = 14; ctx.shadowColor = c; ctx.fill(); ctx.shadowBlur = 0;
      }
      return `<span>ω₁ <b>${a1v.toFixed(2)}</b></span><span>ω₂ <b>${a2v.toFixed(2)}</b></span>`;
    },
  };
}

function RippleSim(demo, ctx, getWHD, ptr, accent) {
  let sources = [], off, octx, ow, oh, cell, t0;
  const params = { wavelength: 60 };
  function seed() {
    const { W, H, DPR } = getWHD();
    cell = 6 * DPR;
    ow = Math.max(2, Math.ceil(W / cell)); oh = Math.max(2, Math.ceil(H / cell));
    off = document.createElement("canvas"); off.width = ow; off.height = oh;
    octx = off.getContext("2d");
    sources = [{ x: W * 0.38, y: H * 0.5 }, { x: W * 0.62, y: H * 0.5 }];
    t0 = performance.now();
  }
  function hexToRgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  return {
    desc: "A ripple tank showing wave interference. Each source emits circular waves; where crests meet you get bright constructive bands, where crest meets trough they cancel. Click to move a source.",
    hint: "Click to reposition a source ✦",
    controls: [
      { type: "range", label: "Wavelength", min: 24, max: 130, value: 60, onChange: (v) => { params.wavelength = v; } },
    ],
    resize: seed, reset: seed,
    pointer: (t, sound) => {
      if (t === "down" && ptr.x != null) {
        if (sources.length < 4 && ptr.downNew) { sources.push({ x: ptr.x, y: ptr.y }); }
        let idx = 0, best = Infinity;
        sources.forEach((s, i) => { const d = Math.hypot(s.x - ptr.x, s.y - ptr.y); if (d < best) { best = d; idx = i; } });
        sources[idx] = { x: ptr.x, y: ptr.y };
        sound?.spawn();
      }
    },
    frame() {
      const { DPR } = getWHD();
      if (!off) seed();
      const t = (performance.now() - t0) / 1000;
      const k = (Math.PI * 2) / (params.wavelength * DPR), w = 5.2;
      const [r0, g0, b0] = hexToRgb(accent());
      const img = octx.createImageData(ow, oh);
      const data = img.data;
      for (let gy = 0; gy < oh; gy++) {
        for (let gx = 0; gx < ow; gx++) {
          const px = gx * cell + cell / 2, py = gy * cell + cell / 2;
          let sum = 0;
          for (const s of sources) {
            const r = Math.hypot(px - s.x, py - s.y);
            sum += Math.sin(r * k - t * w) / (1 + r * 0.006);
          }
          const v = sum / sources.length;
          const inten = (v + 1) / 2;
          const idx = (gy * ow + gx) * 4;
          data[idx] = 12 + r0 * inten * 0.9;
          data[idx + 1] = 16 + g0 * inten * 0.9;
          data[idx + 2] = 30 + b0 * inten * 0.9;
          data[idx + 3] = 255;
        }
      }
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(off, 0, 0, ow, oh, 0, 0, getWHD().W, getWHD().H);
      for (const s of sources) {
        ctx.beginPath(); ctx.arc(s.x, s.y, 5 * DPR, 0, 6.2832);
        ctx.fillStyle = "#fff"; ctx.shadowBlur = 16; ctx.shadowColor = accent(); ctx.fill(); ctx.shadowBlur = 0;
      }
      return `<span><b>${sources.length}</b> sources</span><span>λ <b>${params.wavelength}</b>px</span>`;
    },
  };
}

const TABS = [
  { key: "particles", icon: "✨", label: "Particle Field" },
  { key: "gravity", icon: "🪐", label: "Gravity Sandbox" },
  { key: "pendulum", icon: "🌀", label: "Double Pendulum" },
  { key: "ripple", icon: "🌊", label: "Ripple Tank" },
];

export default function Playground({ sound }) {
  const canvasRef = useRef(null);
  const panelRef = useRef(null);
  const hintRef = useRef(null);
  const descRef = useRef(null);
  const readoutRef = useRef(null);
  const tabRefs = useRef({});
  const apiRef = useRef(null);

  useEffect(() => {
    const demo = canvasRef.current;
    if (!demo) return;
    const ctx = demo.getContext("2d");
    const panel = panelRef.current, hint = hintRef.current, desc = descRef.current, readout = readoutRef.current;
    let W, H, DPR;
    const ptr = { x: null, y: null, down: false, active: false, downNew: false };
    let current;
    let raf = null;
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#5b8cff";

    function getWHD() { return { W, H, DPR }; }
    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = demo.width = demo.clientWidth * DPR;
      H = demo.height = demo.clientHeight * DPR;
      current?.resize?.();
    }
    function pos(e) {
      const r = demo.getBoundingClientRect();
      const s = e.touches ? e.touches[0] : e;
      ptr.x = (s.clientX - r.left) * DPR;
      ptr.y = (s.clientY - r.top) * DPR;
    }

    function renderControls(defs) {
      panel.innerHTML = "";
      defs.forEach((d) => {
        if (d.type === "segment") {
          const seg = document.createElement("div"); seg.className = "pg-seg";
          d.options.forEach((o) => {
            const b = document.createElement("button");
            b.textContent = o.label; b.className = d.value === o.v ? "on" : "";
            b.onclick = () => {
              d.value = o.v; d.onChange?.(o.v);
              [...seg.querySelectorAll("button")].forEach((x, i) => x.classList.toggle("on", d.options[i].v === o.v));
              sound?.click();
            };
            seg.appendChild(b);
          });
          panel.appendChild(seg);
        } else if (d.type === "range") {
          const wrap = document.createElement("div"); wrap.className = "pg-ctl";
          const lab = document.createElement("label"); lab.textContent = d.label;
          const inp = document.createElement("input");
          inp.type = "range"; inp.min = d.min; inp.max = d.max; inp.step = d.step || 1; inp.value = d.value;
          inp.oninput = () => { d.value = +inp.value; d.onChange?.(+inp.value); };
          wrap.append(lab, inp); panel.appendChild(wrap);
        } else if (d.type === "toggle") {
          const b = document.createElement("button");
          b.className = "pg-toggle" + (d.value ? " on" : "");
          b.textContent = d.label;
          b.onclick = () => { d.value = !d.value; b.classList.toggle("on", d.value); d.onChange?.(d.value); sound?.click(); };
          panel.appendChild(b);
        }
      });
    }

    const factories = {
      particles: () => ParticleSim(demo, ctx, getWHD, ptr),
      gravity: () => GravitySim(demo, ctx, getWHD, ptr),
      pendulum: () => PendulumSim(demo, ctx, getWHD, ptr, accent),
      ripple: () => RippleSim(demo, ctx, getWHD, ptr, accent),
    };

    function frame() {
      const info = current.frame();
      if (readout && info) readout.innerHTML = info;
      raf = requestAnimationFrame(frame);
    }

    function switchTo(k) {
      current = factories[k]();
      current.resize?.();
      current.reset?.();
      renderControls(current.controls || []);
      if (hint) hint.textContent = current.hint;
      if (desc) desc.textContent = current.desc;
      Object.entries(tabRefs.current).forEach(([key, el]) => el?.classList.toggle("active", key === k));
      if (!raf) frame();
    }

    demo.addEventListener("mousemove", (e) => { pos(e); ptr.active = true; });
    demo.addEventListener("mouseleave", () => { ptr.active = false; });
    const onDown = (e) => { pos(e); ptr.down = true; ptr.downNew = true; current?.pointer?.("down", sound); ptr.downNew = false; };
    demo.addEventListener("mousedown", onDown);
    demo.addEventListener("mouseup", () => { ptr.down = false; });
    const onTouchStart = (e) => { pos(e); ptr.active = true; ptr.downNew = true; current?.pointer?.("down", sound); ptr.downNew = false; };
    demo.addEventListener("touchstart", onTouchStart, { passive: true });
    const onTouchMove = (e) => { pos(e); ptr.active = true; e.preventDefault(); };
    demo.addEventListener("touchmove", onTouchMove, { passive: false });
    demo.addEventListener("touchend", () => { ptr.active = false; });

    window.addEventListener("resize", size);
    size();
    switchTo("particles");

    apiRef.current = { switchTo, reset: () => current?.reset?.() };

    return () => {
      window.removeEventListener("resize", size);
      demo.removeEventListener("mousedown", onDown);
      demo.removeEventListener("touchstart", onTouchStart);
      demo.removeEventListener("touchmove", onTouchMove);
      if (raf) cancelAnimationFrame(raf);
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="playground reveal" data-reveal>
      <div className="pg-tabs" role="tablist" aria-label="Choose a simulation">
        {TABS.map((t) => (
          <button
            key={t.key}
            ref={(el) => { tabRefs.current[t.key] = el; }}
            className={"pg-tab" + (t.key === "particles" ? " active" : "")}
            data-sim={t.key}
            role="tab"
            onClick={() => { sound?.tab(); apiRef.current?.switchTo(t.key); }}
          >
            <span aria-hidden="true">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="demo-stage">
        <canvas id="demoCanvas" ref={canvasRef}></canvas>
        <div className="pg-readout" id="pgReadout" ref={readoutRef} aria-hidden="true"></div>
        <button className="pg-reset" onClick={() => { apiRef.current?.reset(); sound?.click(); }}>⟳ Reset</button>
        <div className="pg-panel" id="pgPanel" ref={panelRef}></div>
        <div className="demo-hint" id="pgHint" ref={hintRef}>Move &amp; click inside ✦</div>
      </div>

      <p className="pg-desc" id="pgDesc" ref={descRef}></p>
    </div>
  );
}
