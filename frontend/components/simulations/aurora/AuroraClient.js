"use client";

import { useEffect, useRef, useState } from "react";
import AuroraBackground from "./AuroraBackground";
import GooCursor from "./GooCursor";
import GooBlob from "./GooBlob";
import useConfetti from "../../Confetti";
import MobileTabBar from "../../MobileTabBar";

const TABS = [
  { id: "home", label: "Home", icon: "sparkle", target: "top" },
  { id: "experiments", label: "Labs", icon: "flask", target: "experiments" },
  { id: "gallery", label: "Gallery", icon: "gallery", target: "gallery" },
  { id: "join", label: "Join", icon: "mail", target: "join" },
  { id: "hub", label: "Hub", icon: "home", href: "/" },
];

const WORDS = ["touch", "break", "bend", "feel"];
const TILES = [
  { num: "01", cls: "t-violet", emoji: "⚛️", title: "Particle Physics", desc: "Collide thousands of bodies under live force fields." },
  { num: "02", cls: "t-ink", emoji: "🪐", title: "Orbital Mechanics", desc: "Build solar systems. Sling probes with gravity assists." },
  { num: "03", cls: "t-coral", emoji: "🧪", title: "Chemical Reactions", desc: "Mix, heat, pressurize — watch kinetics unfold live." },
  { num: "04", cls: "t-lime", emoji: "🧬", title: "Cellular Life", desc: "Evolve organisms and watch ecosystems self-organize." },
  { num: "05", cls: "t-sky", emoji: "🌊", title: "Waves & Optics", desc: "Interfere, diffract and bend light and sound." },
  { num: "06", cls: "t-sun", emoji: "🔮", title: "Quantum Fields", desc: "Tunnel, superpose and collapse wave functions." },
];
const SLIDES = [
  { cls: "s-1", tag: "N-body", title: "Galaxy collision" },
  { cls: "s-2", tag: "Fluid", title: "Smoke & ink" },
  { cls: "s-3", tag: "Chaos", title: "Double pendulum" },
  { cls: "s-4", tag: "Waves", title: "Ripple interference" },
  { cls: "s-5", tag: "Life", title: "Cellular automata" },
];

export default function AuroraClient() {
  const containerRef = useRef(null);
  const railRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [leavingIdx, setLeavingIdx] = useState(-1);
  const [note, setNote] = useState("No card. No spam. Just science.");
  const [tileLoading, setTileLoading] = useState(-1);
  const burst = useConfetti(["#6d28d9", "#ff5334", "#c6f24e", "#37c4f0", "#ffb703", "#12100c"]);

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
      const id = setInterval(() => {
        setWordIdx((i) => {
          setLeavingIdx(i);
          setTimeout(() => setLeavingIdx(-1), 650);
          return (i + 1) % WORDS.length;
        });
      }, 2200);
      cleanups.push(() => clearInterval(id));
    }

    const revealEls = [...containerRef.current.querySelectorAll("[data-reveal]")];
    if ("IntersectionObserver" in window && !reduce) {
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach((el, k) => { el.style.transitionDelay = (k % 3) * 70 + "ms"; io.observe(el); });
      cleanups.push(() => io.disconnect());
    } else revealEls.forEach((el) => el.classList.add("in"));

    const accentMap = { experiments: "#6d28d9", engine: "#ff5334", gallery: "#37c4f0", stats: "#ffb703", join: "#6d28d9" };
    if ("IntersectionObserver" in window) {
      const aio = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting && accentMap[e.target.id]) {
            document.documentElement.style.setProperty("--accent", accentMap[e.target.id]);
          }
        });
      }, { threshold: 0.4 });
      ["experiments", "engine", "gallery", "stats", "join"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) aio.observe(el);
      });
      cleanups.push(() => aio.disconnect());
    }

    function fmt(n) { return n >= 1000 ? Math.floor(n).toLocaleString() : String(Math.floor(n)); }
    function countUp(el) {
      const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", dur = 1700, start = performance.now();
      (function step(now) {
        const t = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt(target * e) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = fmt(target) + suffix;
      })(start);
    }
    const countEls = [...containerRef.current.querySelectorAll("[data-count]")];
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.6 });
      countEls.forEach((c) => cio.observe(c));
      cleanups.push(() => cio.disconnect());
    } else countEls.forEach(countUp);

    if (fine && !reduce) {
      containerRef.current.querySelectorAll(".btn").forEach((btn) => {
        const onMove = (e) => {
          const r = btn.getBoundingClientRect();
          btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
        };
        const onLeave = () => { btn.style.transform = ""; };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); });
      });
    }

    const rail = railRef.current;
    if (rail) {
      let down = false, startX, scrollStart, moved = false;
      const onDown = (e) => { down = true; moved = false; startX = e.clientX; scrollStart = rail.scrollLeft; rail.classList.add("dragging"); rail.setPointerCapture(e.pointerId); };
      const onMove = (e) => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = scrollStart - dx; };
      const onEnd = () => { down = false; rail.classList.remove("dragging"); };
      const onClick = (e) => { if (moved) e.preventDefault(); };
      rail.addEventListener("pointerdown", onDown);
      rail.addEventListener("pointermove", onMove);
      rail.addEventListener("pointerup", onEnd);
      rail.addEventListener("pointercancel", onEnd);
      rail.addEventListener("click", onClick, true);
      cleanups.push(() => {
        rail.removeEventListener("pointerdown", onDown);
        rail.removeEventListener("pointermove", onMove);
        rail.removeEventListener("pointerup", onEnd);
        rail.removeEventListener("pointercancel", onEnd);
        rail.removeEventListener("click", onClick, true);
      });
    }

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setNote("🎉 You're in — check your inbox!");
    const b = e.target.querySelector("button").getBoundingClientRect();
    burst(150, { x: b.left + b.width / 2, y: b.top });
    e.target.reset();
  }

  function handleTileClick(e, i) {
    e.preventDefault();
    setTileLoading(i);
    setTimeout(() => setTileLoading(-1), 1200);
  }

  return (
    <div ref={containerRef}>
      <AuroraBackground />
      <div className="grain" aria-hidden="true"></div>
      <GooCursor />
      <div className="progress" style={{ width: progress + "%" }} aria-hidden="true"></div>

      <svg className="defs" aria-hidden="true">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <header className={"nav" + (navScrolled ? " scrolled" : "")}>
        <a href="#top" className="logo" data-cursor>
          <span className="logo-mark">✦</span> Aurora<b>Lab</b>
        </a>
        <nav className={"links" + (menuOpen ? " open" : "")} aria-label="Primary">
          <a href="#experiments" data-cursor onClick={() => setMenuOpen(false)}>Experiments</a>
          <a href="#engine" data-cursor onClick={() => setMenuOpen(false)}>Engine</a>
          <a href="#gallery" data-cursor onClick={() => setMenuOpen(false)}>Gallery</a>
          <a href="#join" data-cursor onClick={() => setMenuOpen(false)}>Join</a>
        </nav>
        <a href="#experiments" className="btn btn-ink" data-cursor>Start free <span aria-hidden="true">↗</span></a>
        <button className={"burger" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen((o) => !o)} aria-label="Menu"><span></span><span></span></button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="sticker" data-reveal>◆ Real-time science engine · no installs</span>
            <h1 className="hero-title" data-reveal>
              Science<br />
              you can
              {" "}
              <span className="rotator" aria-label={WORDS[wordIdx]}>
                {WORDS.map((w, i) => (
                  <span key={w} className={"word" + (i === wordIdx ? " is-active" : "") + (i === leavingIdx ? " leave" : "")}>{w}</span>
                ))}
              </span>
            </h1>
            <p className="hero-sub" data-reveal>
              Not videos. Not slides. Real simulations you grab, tweak and shatter — physics,
              chemistry, life and the cosmos, running live under your fingertips.
            </p>
            <div className="hero-actions" data-reveal>
              <a href="#experiments" className="btn btn-ink btn-lg" data-cursor>Launch an experiment <span aria-hidden="true">→</span></a>
              <a href="#gallery" className="btn btn-line btn-lg" data-cursor>See it move</a>
            </div>
            <div className="hero-proof" data-reveal>
              <div className="stack" aria-hidden="true"><span>🧪</span><span>🪐</span><span>🧬</span><span>🔬</span></div>
              <p>Loved by <b>120k+</b> tinkerers, teachers &amp; the endlessly curious</p>
            </div>
          </div>

          <div className="goo-stage" id="gooStage" aria-hidden="true">
            <div className="halo"></div>
            <div className="blobs" id="blobs">
              <span className="blob b1"></span>
              <span className="blob b2"></span>
              <span className="blob b3"></span>
              <span className="blob b4"></span>
              <span className="blob b5"></span>
              <GooBlob />
            </div>
            <span className="orbit-chip c-a">H₂O</span>
            <span className="orbit-chip c-b">Δt = 16ms</span>
            <span className="orbit-chip c-c">g = 9.8</span>
          </div>
        </section>

        <div className="band" aria-hidden="true">
          <div className="band-track">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} style={{ display: "contents" }}>
                <span>PHYSICS</span><i>✦</i><span>CHEMISTRY</span><i>✦</i><span>BIOLOGY</span><i>✦</i>
                <span>ASTRONOMY</span><i>✦</i><span>QUANTUM</span><i>✦</i><span>THERMO</span><i>✦</i>
              </span>
            ))}
          </div>
        </div>

        <section className="section" id="experiments">
          <header className="head" data-reveal>
            <span className="kicker">The Lab · 06 engines</span>
            <h2>Pick your poison.<br />Then poke it.</h2>
          </header>

          <div className="tiles">
            {TILES.map((t, i) => (
              <a key={t.num} className={"tile " + t.cls} data-cursor data-reveal href="#" onClick={(e) => handleTileClick(e, i)}>
                <span className="t-num">{t.num}</span>
                <span className="t-emoji">{t.emoji}</span>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <span className="t-go">{tileLoading === i ? "Loading…" : "Open →"}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section engine" id="engine">
          <p className="big-statement" data-reveal>
            A <mark>real physics engine</mark> under a playful skin — deterministic,
            60fps, and honest enough for a <mark>research paper</mark>, playful enough
            for a <mark>rainy afternoon</mark>.
          </p>
          <div className="engine-grid">
            <div className="e-card" data-reveal><span className="e-ico">⚡</span><h3>Zero install</h3><p>Pure WebGL &amp; WebAssembly. Open a link, you're in.</p></div>
            <div className="e-card" data-reveal><span className="e-ico">🎛️</span><h3>Every knob is live</h3><p>Turn any constant into a slider. Break the rules on purpose.</p></div>
            <div className="e-card" data-reveal><span className="e-ico">⏱️</span><h3>Scrub time</h3><p>Rewind, freeze, step frame-by-frame. Inspect anything.</p></div>
            <div className="e-card" data-reveal><span className="e-ico">🔗</span><h3>Share &amp; remix</h3><p>Every setup is a permanent link. Fork in one click.</p></div>
          </div>
        </section>

        <section className="section" id="gallery">
          <header className="head" data-reveal>
            <span className="kicker">Live gallery · drag me</span>
            <h2>Motion, not mock-ups.</h2>
          </header>
          <div className="rail" id="rail" ref={railRef} data-cursor-drag>
            {SLIDES.map((s) => (
              <article key={s.cls} className={"slide " + s.cls} data-reveal><span>{s.tag}</span><h3>{s.title}</h3></article>
            ))}
          </div>
          <p className="rail-hint" data-reveal>← drag to explore →</p>
        </section>

        <section className="section stats" id="stats">
          <div className="stat" data-reveal><span className="s-num" data-count="120000" data-suffix="+">0</span><span className="s-lab">curious minds</span></div>
          <div className="stat" data-reveal><span className="s-num outline" data-count="42" data-suffix="+">0</span><span className="s-lab">engines</span></div>
          <div className="stat" data-reveal><span className="s-num" data-count="3" data-suffix="M">0</span><span className="s-lab">experiments run</span></div>
          <div className="stat" data-reveal><span className="s-num outline" data-count="60" data-suffix="fps">0</span><span className="s-lab">buttery smooth</span></div>
        </section>

        <section className="section cta" id="join">
          <div className="cta-block" data-reveal>
            <span className="sticker light">◆ free forever for students</span>
            <h2>Come break<br />something beautiful.</h2>
            <form className="cta-form" onSubmit={handleSubmit}>
              <input type="email" placeholder="you@lab.edu" aria-label="Email" required />
              <button className="btn btn-cream btn-lg" type="submit" data-cursor>Get in ↗</button>
            </form>
            <span className="cta-note">{note}</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="f-top">
          <a href="#top" className="logo big" data-cursor><span className="logo-mark">✦</span> Aurora<b>Lab</b></a>
          <div className="f-links">
            <div><h4>Explore</h4><a href="#experiments" data-cursor>Experiments</a><a href="#engine" data-cursor>Engine</a><a href="#gallery" data-cursor>Gallery</a></div>
            <div><h4>Company</h4><a href="#" data-cursor>About</a><a href="#" data-cursor>Research</a><a href="#" data-cursor>Careers</a></div>
            <div><h4>Connect</h4><a href="#" data-cursor>Twitter</a><a href="#" data-cursor>GitHub</a><a href="#" data-cursor>Discord</a></div>
          </div>
        </div>
        <div className="f-bottom">
          <span>© 2026 Aurora Lab — made with curiosity.</span>
          <span>Rendered live ◈</span>
        </div>
      </footer>

      <MobileTabBar items={TABS} label="Aurora Lab sections" />
    </div>
  );
}
