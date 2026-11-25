"use client";

import { useEffect, useRef, useState } from "react";
import CircuitBackground from "./CircuitBackground";
import CpuDie from "./CpuDie";
import InstructionPipeline from "./InstructionPipeline";
import DecisionEngine from "./DecisionEngine";
import MobileTabBar from "../../MobileTabBar";

const TABS = [
  { id: "core", label: "Core", icon: "chip", target: "top" },
  { id: "pipeline", label: "Pipeline", icon: "flow", target: "pipeline" },
  { id: "decision", label: "Decide", icon: "branch", target: "decision" },
  { id: "access", label: "Access", icon: "terminal", target: "access" },
  { id: "hub", label: "Hub", icon: "home", href: "/" },
];

const TYPE_LINES = [
  "booting 128 cores............ OK",
  "streaming 4.2M ops/sec",
  "branch predictor .......... 99.2%",
  "decision engine .......... ONLINE",
  "signal integrity ......... NOMINAL",
];

export default function SiliconClient() {
  const containerRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [typeText, setTypeText] = useState("");
  const [noteGranted, setNoteGranted] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer:fine)").matches;
    const cleanups = [];

    function onScroll() {
      const y = scrollY;
      setNavScrolled(y > 20);
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? (y / max) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    if (!reduce) {
      let li = 0, ci = 0, del = false, timer;
      function tw() {
        const line = TYPE_LINES[li];
        setTypeText(line.slice(0, ci));
        if (!del) { ci++; if (ci > line.length) { del = true; timer = setTimeout(tw, 1400); return; } }
        else { ci--; if (ci === 0) { del = false; li = (li + 1) % TYPE_LINES.length; } }
        timer = setTimeout(tw, del ? 22 : 45);
      }
      tw();
      cleanups.push(() => clearTimeout(timer));
    } else setTypeText("decision engine :: ONLINE");

    const revealEls = [...containerRef.current.querySelectorAll("[data-reveal]")];
    if ("IntersectionObserver" in window && !reduce) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach((el, k) => { el.style.transitionDelay = (k % 3) * 60 + "ms"; io.observe(el); });
      cleanups.push(() => io.disconnect());
    } else revealEls.forEach((el) => el.classList.add("in"));

    function countUp(el) {
      const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", isFloat = !Number.isInteger(target), dur = 1700, start = performance.now();
      (function step(now) {
        const t = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - t, 3), v = target * e;
        el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v).toLocaleString()) + suffix;
        if (t < 1) requestAnimationFrame(step); else el.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
      })(start);
    }
    const countEls = [...containerRef.current.querySelectorAll("[data-count]")];
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }), { threshold: 0.5 });
      countEls.forEach((c) => cio.observe(c));
      cleanups.push(() => cio.disconnect());
    } else countEls.forEach(countUp);

    if (fine && !reduce) {
      containerRef.current.querySelectorAll(".btn").forEach((btn) => {
        const onMove = (e) => { const r = btn.getBoundingClientRect(); btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`; };
        const onLeave = () => { btn.style.transform = ""; };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); });
      });
    }

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setNoteGranted(true);
    e.target.reset();
  }

  return (
    <div ref={containerRef} className="theme-silicon">
      <CircuitBackground />
      <div className="scanlines" aria-hidden="true"></div>
      <div className="vignette" aria-hidden="true"></div>
      <div className="progress" style={{ width: progress + "%" }} aria-hidden="true"></div>

      <header className={"nav" + (navScrolled ? " scrolled" : "")}>
        <a href="#top" className="logo">
          <span className="logo-chip" aria-hidden="true"></span>
          SILICON<span className="blink">_</span>
        </a>
        <nav className={"links" + (menuOpen ? " open" : "")} aria-label="Primary">
          <a href="#pipeline" onClick={() => setMenuOpen(false)}>// pipeline</a>
          <a href="#decision" onClick={() => setMenuOpen(false)}>// decisions</a>
          <a href="#specs" onClick={() => setMenuOpen(false)}>// specs</a>
          <a href="#access" onClick={() => setMenuOpen(false)}>// access</a>
        </nav>
        <a href="#pipeline" className="btn btn-glow">Boot core <span aria-hidden="true">▸</span></a>
        <button className={"burger" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen((o) => !o)} aria-label="Menu"><span></span><span></span></button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="status" data-reveal><i className="dot"></i> SYSTEM ONLINE · core v9.0</span>
            <h1 className="hero-title" data-reveal>Watch <span className="neon">silicon</span><br />think in real&nbsp;time.</h1>
            <p className="type-line" data-reveal><span className="prompt">&gt;</span> <span>{typeText}</span><span className="caret">█</span></p>
            <p className="hero-sub" data-reveal>
              A living supercomputer in your browser. Signals race down copper traces,
              instructions surge through the pipeline, and logic gates make millions of
              decisions a second — all visible, all interactive.
            </p>
            <div className="hero-actions" data-reveal>
              <a href="#pipeline" className="btn btn-glow btn-lg">Run the pipeline <span aria-hidden="true">▸</span></a>
              <a href="#decision" className="btn btn-wire btn-lg">See it decide</a>
            </div>
            <div className="hero-readout" data-reveal>
              <div className="ro"><span className="ro-k">CLK</span><span className="ro-v" data-count="4.6" data-suffix=" GHz">0</span></div>
              <div className="ro"><span className="ro-k">CORES</span><span className="ro-v" data-count="128">0</span></div>
              <div className="ro"><span className="ro-k">THREADS</span><span className="ro-v" data-count="1024">0</span></div>
            </div>
          </div>

          <CpuDie />
        </section>

        <div className="band" aria-hidden="true">
          <div className="band-track">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} style={{ display: "contents" }}>
                <span>FETCH</span><i>›</i><span>DECODE</span><i>›</i><span>EXECUTE</span><i>›</i>
                <span>MEMORY</span><i>›</i><span>WRITEBACK</span><i>›</i>
              </span>
            ))}
          </div>
        </div>

        <section className="section" id="pipeline">
          <header className="head" data-reveal>
            <span className="kicker">// 01 — instruction pipeline</span>
            <h2>Five stages. Zero idle cycles.</h2>
            <p>Instructions stream in and flow through Fetch → Decode → Execute → Memory → Writeback, overlapping like a real superscalar core.</p>
          </header>
          <div className="panel" data-reveal>
            <InstructionPipeline />
          </div>
        </section>

        <section className="section" id="decision">
          <header className="head" data-reveal>
            <span className="kicker">// 02 — decision engine</span>
            <h2>Every branch, a choice.</h2>
            <p>Tokens hit a logic gate and split — TRUE up, FALSE down. Bias the condition and watch the flow rebalance live.</p>
          </header>
          <div className="panel" data-reveal>
            <DecisionEngine />
          </div>
        </section>

        <section className="section" id="specs">
          <header className="head" data-reveal>
            <span className="kicker">// 03 — architecture</span>
            <h2>Built like real hardware.</h2>
          </header>
          <div className="bento">
            <div className="cell c-big" data-reveal>
              <span className="cell-tag">DATA BUS</span>
              <h3>Signals you can see</h3>
              <p>Every trace carries live pulses. Probe any wire and read its state — high, low, or racing between.</p>
              <div className="wave" aria-hidden="true">
                <svg viewBox="0 0 300 60" preserveAspectRatio="none">
                  <path d="M0,30 L30,30 L30,10 L70,10 L70,50 L110,50 L110,20 L150,20 L150,40 L190,40 L190,10 L230,10 L230,45 L270,45 L270,30 L300,30" />
                </svg>
              </div>
            </div>
            <div className="cell" data-reveal><span className="cell-ico">⚙️</span><h3>128 parallel cores</h3><p>Massively concurrent, lock-free scheduling.</p></div>
            <div className="cell" data-reveal><span className="cell-ico">⌁</span><h3>Real-time signals</h3><p>Nanosecond-accurate event propagation.</p></div>
            <div className="cell c-wide" data-reveal><span className="cell-ico">▤</span><h3>Deterministic memory</h3><p>Every cache line, register and bus transfer is inspectable and replayable — rewind the whole machine.</p></div>
            <div className="cell" data-reveal><span className="cell-ico">⎇</span><h3>Logic gates</h3><p>AND · OR · XOR · NAND wired to first principles.</p></div>
          </div>
        </section>

        <section className="section stats" id="stats">
          <div className="stat" data-reveal><span className="s-num" data-count="4200000" data-suffix="">0</span><span className="s-lab">ops / second</span></div>
          <div className="stat" data-reveal><span className="s-num" data-count="99" data-suffix=".2%">0</span><span className="s-lab">branch accuracy</span></div>
          <div className="stat" data-reveal><span className="s-num" data-count="12" data-suffix=" ns">0</span><span className="s-lab">signal latency</span></div>
          <div className="stat" data-reveal><span className="s-num" data-count="64" data-suffix=" TB/s">0</span><span className="s-lab">bus bandwidth</span></div>
        </section>

        <section className="section access" id="access">
          <div className="terminal" data-reveal>
            <div className="term-bar"><span></span><span></span><span></span><em>silicon@lab: ~</em></div>
            <div className="term-body">
              <p><span className="prompt">$</span> request --early-access</p>
              <p className="term-out">Enter your credentials to boot a private core:</p>
              <form className="term-form" onSubmit={handleSubmit}>
                <span className="prompt">$</span>
                <input type="email" placeholder="you@lab.dev" aria-label="Email" required />
                <button className="btn btn-glow" type="submit">connect ▸</button>
              </form>
              <p className="term-note">
                {noteGranted ? (
                  <><span className="prompt">#</span> ACCESS GRANTED — core provisioning… ✓</>
                ) : (
                  <><span className="prompt">#</span> free for researchers &amp; students · no card</>
                )}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="f-top">
          <a href="#top" className="logo"><span className="logo-chip"></span> SILICON</a>
          <div className="f-links">
            <div><h4>System</h4><a href="#pipeline">Pipeline</a><a href="#decision">Decisions</a><a href="#specs">Specs</a></div>
            <div><h4>Lab</h4><a href="#">Docs</a><a href="#">Research</a><a href="#">Changelog</a></div>
            <div><h4>Signal</h4><a href="#">GitHub</a><a href="#">Discord</a><a href="#">X</a></div>
          </div>
        </div>
        <div className="f-bottom">
          <span>© 2026 Silicon Lab · all systems nominal</span>
          <span className="f-live"><i className="dot"></i> live</span>
        </div>
      </footer>

      <MobileTabBar items={TABS} label="Silicon sections" />
    </div>
  );
}
