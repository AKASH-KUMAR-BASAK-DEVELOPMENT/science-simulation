"use client";

import { useEffect, useRef, useState } from "react";

const DPR = () => Math.min(devicePixelRatio || 1, 2);

export default function GameOfLife() {
  const cvRef = useRef(null);
  const [gen, setGen] = useState(0);
  const [pop, setPop] = useState(0);
  const [playing, setPlaying] = useState(true);
  const apiRef = useRef(null);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = cv.getContext("2d");
    let w, h, dpr, cell, cols, rows, grid, next;
    let playingLocal = true, speed = 8, acc = 0, raf;

    function alloc() {
      dpr = DPR(); w = cv.width = cv.clientWidth * dpr; h = cv.height = cv.clientHeight * dpr;
      cell = 13 * dpr; cols = Math.floor(w / cell); rows = Math.floor(h / cell);
      grid = new Uint8Array(cols * rows); next = new Uint8Array(cols * rows);
    }
    const idx = (x, y) => y * cols + x;
    function randomize() { for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < 0.28 ? 1 : 0; setGen(0); }
    function clear() { grid.fill(0); setGen(0); }
    let genCount = 0;
    function step() {
      let p = 0;
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = (x + dx + cols) % cols, ny = (y + dy + rows) % rows;
          n += grid[idx(nx, ny)];
        }
        const a = grid[idx(x, y)];
        next[idx(x, y)] = (a && (n === 2 || n === 3)) || (!a && n === 3) ? 1 : 0;
        p += next[idx(x, y)];
      }
      [grid, next] = [next, grid]; genCount++;
      setGen(genCount); setPop(p);
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        if (!grid[idx(x, y)]) continue;
        const px = x * cell, py = y * cell;
        ctx.fillStyle = "#5cffd0"; ctx.shadowBlur = 8; ctx.shadowColor = "#5cffd0";
        ctx.beginPath();
        const r = 3 * dpr;
        const cw = cell - 2 * dpr;
        if (ctx.roundRect) ctx.roundRect(px + 1 * dpr, py + 1 * dpr, cw, cw, r); else ctx.rect(px + 1 * dpr, py + 1 * dpr, cw, cw);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
    function frame() {
      if (!onScreen) { started = false; return; }
      if (playingLocal && !reduce) { acc++; if (acc >= (21 - speed)) { acc = 0; step(); } }
      draw();
      raf = requestAnimationFrame(frame);
    }

    let painting = false;
    function paint(e) {
      const r = cv.getBoundingClientRect(), s = e.touches ? e.touches[0] : e;
      const x = Math.floor(((s.clientX - r.left) * dpr) / cell), y = Math.floor(((s.clientY - r.top) * dpr) / cell);
      if (x >= 0 && x < cols && y >= 0 && y < rows) grid[idx(x, y)] = 1;
    }
    const onDown = (e) => { painting = true; paint(e); };
    const onMove = (e) => { if (painting) paint(e); };
    const onUp = () => { painting = false; };
    const onTouchStart = (e) => { painting = true; paint(e); };
    const onTouchMove = (e) => { if (painting) { paint(e); e.preventDefault(); } };
    cv.addEventListener("mousedown", onDown);
    cv.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    cv.addEventListener("touchstart", onTouchStart, { passive: true });
    cv.addEventListener("touchmove", onTouchMove, { passive: false });
    cv.addEventListener("touchend", onUp);

    function onResize() {
      const g = grid, oc = cols, or_ = rows;
      alloc();
      if (g) for (let y = 0; y < Math.min(or_, rows); y++) for (let x = 0; x < Math.min(oc, cols); x++) grid[idx(x, y)] = g[y * oc + x];
    }
    window.addEventListener("resize", onResize);
    alloc(); randomize();

    let onScreen = true, started = false, obs;
    if ("IntersectionObserver" in window) {
      obs = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; if (onScreen) kick(); }, { threshold: 0.01 });
      obs.observe(cv);
    }
    function kick() { if (!started) { started = true; frame(); } }
    kick();

    apiRef.current = {
      togglePlay: () => { playingLocal = !playingLocal; setPlaying(playingLocal); },
      random: randomize,
      clear,
      setSpeed: (v) => { speed = v; },
    };

    return () => {
      window.removeEventListener("resize", onResize);
      cv.removeEventListener("mousedown", onDown);
      cv.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      cv.removeEventListener("touchstart", onTouchStart);
      cv.removeEventListener("touchmove", onTouchMove);
      cv.removeEventListener("touchend", onUp);
      obs?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      apiRef.current = null;
    };
  }, []);

  return (
    <div className="life-wrap" data-reveal>
      <canvas id="life" ref={cvRef}></canvas>
      <div className="life-controls">
        <button className="pill" onClick={() => apiRef.current?.togglePlay()}>{playing ? "❚❚ Pause" : "▶ Play"}</button>
        <button className="pill" onClick={() => apiRef.current?.random()}>✦ Seed random</button>
        <button className="pill" onClick={() => apiRef.current?.clear()}>○ Clear</button>
        <div className="pill-slider">
          <label htmlFor="lifeSpeed">Speed</label>
          <input id="lifeSpeed" type="range" min="1" max="20" defaultValue="8" onChange={(e) => apiRef.current?.setSpeed(+e.target.value)} />
        </div>
        <span className="life-gen">gen <b>{gen}</b> · pop <b>{pop}</b></span>
      </div>
      <span className="life-hint">✎ click &amp; drag on the grid to paint life</span>
    </div>
  );
}
