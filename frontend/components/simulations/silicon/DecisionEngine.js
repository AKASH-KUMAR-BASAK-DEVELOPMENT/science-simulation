"use client";

import { useEffect, useRef, useState } from "react";

const DPR = () => Math.min(devicePixelRatio || 1, 2);

export default function DecisionEngine() {
  const ref = useRef(null);
  const biasRef = useRef(60);
  const [biasDisplay, setBiasDisplay] = useState(60);
  const [trueN, setTrueN] = useState(0);
  const [falseN, setFalseN] = useState(0);
  const apiRef = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = cv.getContext("2d");
    let w, h, dpr, nodes = {}, tokens = [], spawnAcc = 0, trueCount = 0, falseCount = 0;

    function resize() {
      dpr = DPR(); w = cv.width = cv.clientWidth * dpr; h = cv.height = cv.clientHeight * dpr;
      const cyc = h / 2;
      nodes = {
        start: { x: w * 0.08, y: cyc, r: 22 * dpr, label: "IN", type: "round" },
        proc: { x: w * 0.3, y: cyc, label: "LOAD", type: "rect" },
        gate: { x: w * 0.52, y: cyc, label: "x > θ ?", type: "diamond" },
        tru: { x: w * 0.72, y: cyc - h * 0.28, label: "TRUE", type: "rect", col: "#39ff9f" },
        fal: { x: w * 0.72, y: cyc + h * 0.28, label: "FALSE", type: "rect", col: "#ff4d9d" },
        out: { x: w * 0.92, y: cyc, r: 22 * dpr, label: "OUT", type: "round" },
      };
    }
    window.addEventListener("resize", resize); resize();

    function spawn() {
      const val = Math.random() * 100 < biasRef.current;
      tokens.push({ route: val ? ["start", "proc", "gate", "tru", "out"] : ["start", "proc", "gate", "fal", "out"], seg: 0, t: 0, val });
    }
    apiRef.current = { inject: spawn };

    function edge(a, b) { return { x1: nodes[a].x, y1: nodes[a].y, x2: nodes[b].x, y2: nodes[b].y }; }
    function drawNode(n) {
      ctx.lineWidth = 1.6 * dpr; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const col = n.col || "#2de2ff";
      ctx.strokeStyle = col; ctx.fillStyle = "rgba(8,15,30,0.9)";
      if (n.type === "round") {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill(); ctx.shadowBlur = 10; ctx.shadowColor = col; ctx.stroke(); ctx.shadowBlur = 0;
      } else if (n.type === "diamond") {
        const s = 42 * dpr;
        ctx.beginPath(); ctx.moveTo(n.x, n.y - s); ctx.lineTo(n.x + s * 1.3, n.y); ctx.lineTo(n.x, n.y + s); ctx.lineTo(n.x - s * 1.3, n.y); ctx.closePath();
        ctx.fill(); ctx.shadowBlur = 12; ctx.shadowColor = "#ffb020"; ctx.strokeStyle = "#ffb020"; ctx.stroke(); ctx.shadowBlur = 0;
      } else {
        const bw = 84 * dpr, bh = 40 * dpr;
        ctx.beginPath(); ctx.rect(n.x - bw / 2, n.y - bh / 2, bw, bh); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = col; ctx.font = `700 ${12 * dpr}px "Chakra Petch", sans-serif`;
      ctx.fillText(n.label, n.x, n.y);
    }
    function arrow(a, b, col) {
      const e = edge(a, b);
      ctx.strokeStyle = col; ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath(); ctx.moveTo(e.x1, e.y1); ctx.lineTo(e.x2, e.y2); ctx.stroke();
    }

    let raf, on = true, started = false, obs;
    function frame() {
      if (!on) { started = false; return; }
      ctx.clearRect(0, 0, w, h);
      arrow("start", "proc", "rgba(45,226,255,0.3)");
      arrow("proc", "gate", "rgba(45,226,255,0.3)");
      arrow("gate", "tru", "rgba(57,255,159,0.3)");
      arrow("gate", "fal", "rgba(255,77,157,0.3)");
      arrow("tru", "out", "rgba(57,255,159,0.3)");
      arrow("fal", "out", "rgba(255,77,157,0.3)");
      ctx.font = `${10 * dpr}px "JetBrains Mono", monospace`; ctx.textAlign = "center";
      ctx.fillStyle = "#39ff9f"; ctx.fillText("1", (nodes.gate.x + nodes.tru.x) / 2 + 10 * dpr, (nodes.gate.y + nodes.tru.y) / 2 - 6 * dpr);
      ctx.fillStyle = "#ff4d9d"; ctx.fillText("0", (nodes.gate.x + nodes.fal.x) / 2 + 10 * dpr, (nodes.gate.y + nodes.fal.y) / 2 + 6 * dpr);

      for (const k in nodes) drawNode(nodes[k]);

      spawnAcc++; if (spawnAcc > 60) { spawnAcc = 0; spawn(); }

      for (const tk of tokens) {
        tk.t += 0.02 * (reduce ? 0 : 1);
        if (tk.t >= 1) {
          tk.t = 0; tk.seg++;
          if (tk.seg >= tk.route.length - 1) { tk.done = true; if (tk.val) trueCount++; else falseCount++; }
        }
      }
      tokens = tokens.filter((tk) => !tk.done);
      for (const tk of tokens) {
        const a = nodes[tk.route[tk.seg]], b = nodes[tk.route[tk.seg + 1]];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * tk.t, y = a.y + (b.y - a.y) * tk.t;
        const col = tk.val ? "#39ff9f" : "#ff4d9d";
        ctx.beginPath(); ctx.arc(x, y, 6 * dpr, 0, 6.2832);
        ctx.fillStyle = col; ctx.shadowBlur = 14; ctx.shadowColor = col; ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = "#04070e"; ctx.font = `700 ${8 * dpr}px "JetBrains Mono", monospace`; ctx.textBaseline = "middle";
        ctx.fillText(tk.val ? "1" : "0", x, y);
      }
      setTrueN(trueCount);
      setFalseN(falseCount);
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!started) { started = true; frame(); } }
    if ("IntersectionObserver" in window) {
      obs = new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) kick(); }, { threshold: 0.01 });
      obs.observe(cv);
    }
    kick();

    return () => { window.removeEventListener("resize", resize); obs?.disconnect(); if (raf) cancelAnimationFrame(raf); apiRef.current = null; };
  }, []);

  return (
    <>
      <canvas id="dec" ref={ref}></canvas>
      <div className="dec-controls">
        <div className="dc-slider">
          <label htmlFor="biasRange">CONDITION BIAS</label>
          <input
            id="biasRange"
            type="range"
            min="0"
            max="100"
            defaultValue={60}
            onChange={(e) => { biasRef.current = +e.target.value; setBiasDisplay(+e.target.value); }}
          />
          <span>{biasDisplay}%</span>
        </div>
        <button className="btn btn-wire" onClick={() => apiRef.current?.inject()}>▸ inject token</button>
        <div className="dc-count">
          <span className="c-true">TRUE <b>{trueN}</b></span>
          <span className="c-false">FALSE <b>{falseN}</b></span>
        </div>
      </div>
    </>
  );
}
