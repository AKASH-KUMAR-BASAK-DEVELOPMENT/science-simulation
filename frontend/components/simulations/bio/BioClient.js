"use client";

import { useEffect, useRef, useState } from "react";
import PetriDish from "./PetriDish";
import GameOfLife from "./GameOfLife";
import DnaHelix from "./DnaHelix";
import MobileTabBar from "../../MobileTabBar";

const TABS = [
  { id: "dish", label: "Dish", icon: "cell", target: "top" },
  { id: "organisms", label: "Specimens", icon: "flask", target: "organisms" },
  { id: "life", label: "Life", icon: "life", target: "emergence" },
  { id: "dna", label: "DNA", icon: "dna", target: "dna" },
  { id: "hub", label: "Hub", icon: "home", href: "/" },
];

const SPECIMENS = [
  { cls: "s-a", emoji: "🦠", title: "Microbial Swarm", desc: "Boids that flock, flee and feed as a colony." },
  { cls: "s-b", emoji: "🧬", title: "Genetic Evolution", desc: "Mutate, select and breed across generations." },
  { cls: "s-c", emoji: "🧠", title: "Neural Growth", desc: "Dendrites reach, connect and fire in cascades." },
  { cls: "s-d", emoji: "🌿", title: "L-System Flora", desc: "Grow fractal plants from recursive rules." },
  { cls: "s-e", emoji: "🐟", title: "Predator & Prey", desc: "Watch a food web find its fragile balance." },
  { cls: "s-f", emoji: "🔬", title: "Reaction Diffusion", desc: "Turing patterns bloom from pure chemistry." },
];

export default function BioClient() {
  const containerRef = useRef(null);
  const sporeRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [note, setNote] = useState("One cell is all it takes. No card required.");
  const [specLoading, setSpecLoading] = useState(-1);

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

    const spore = sporeRef.current;
    if (spore && fine && !reduce) {
      let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy, raf;
      const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
      window.addEventListener("mousemove", onMove);
      function loop() { gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12; spore.style.transform = `translate(${gx}px,${gy}px) translate(-50%,-50%)`; raf = requestAnimationFrame(loop); }
      loop();
      cleanups.push(() => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); });
    } else if (spore) spore.style.display = "none";

    const revealEls = [...containerRef.current.querySelectorAll("[data-reveal]")];
    if ("IntersectionObserver" in window && !reduce) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach((el, k) => { el.style.transitionDelay = (k % 3) * 60 + "ms"; io.observe(el); });
      cleanups.push(() => io.disconnect());
    } else revealEls.forEach((el) => el.classList.add("in"));

    function countUp(el) {
      const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", dur = 1700, start = performance.now();
      (function step(now) {
        const t = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - t, 3), v = target * e;
        el.textContent = (v >= 1000 ? Math.floor(v).toLocaleString() : Math.floor(v)) + suffix;
        if (t < 1) requestAnimationFrame(step); else el.textContent = (target >= 1000 ? target.toLocaleString() : target) + suffix;
      })(start);
    }
    const countEls = [...containerRef.current.querySelectorAll("[data-count]")];
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }), { threshold: 0.5 });
      countEls.forEach((c) => cio.observe(c));
      cleanups.push(() => cio.disconnect());
    } else countEls.forEach(countUp);

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setNote("🌱 Culture started — welcome to the lab!");
    e.target.reset();
  }

  function handleSpecClick(e, i) {
    e.preventDefault();
    setSpecLoading(i);
    setTimeout(() => setSpecLoading(-1), 1200);
  }

  return (
    <div ref={containerRef}>
      <div className="culture" aria-hidden="true">
        <span className="cbl c1"></span><span className="cbl c2"></span><span className="cbl c3"></span><span className="cbl c4"></span>
      </div>
      <div className="spore-cursor" ref={sporeRef} aria-hidden="true"></div>
      <div className="progress" style={{ width: progress + "%" }} aria-hidden="true"></div>

      <header className={"nav" + (navScrolled ? " scrolled" : "")}>
        <a href="#top" className="logo">
          <span className="logo-cell" aria-hidden="true"></span> Vivarium
        </a>
        <nav className={"links" + (menuOpen ? " open" : "")} aria-label="Primary">
          <a href="#organisms" onClick={() => setMenuOpen(false)}>Organisms</a>
          <a href="#emergence" onClick={() => setMenuOpen(false)}>Emergence</a>
          <a href="#dna" onClick={() => setMenuOpen(false)}>DNA</a>
          <a href="#culture" onClick={() => setMenuOpen(false)}>Join</a>
        </nav>
        <a href="#organisms" className="btn btn-glow">Enter the dish <span aria-hidden="true">↝</span></a>
        <button className={"burger" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen((o) => !o)} aria-label="Menu"><span></span><span></span></button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow" data-reveal><i className="live"></i> culture #4471 · alive &amp; dividing</span>
            <h1 className="hero-title" data-reveal>Life,<br /><span className="ital">simulated.</span></h1>
            <p className="hero-sub" data-reveal>
              Grow a colony from a single cell. Watch it swim, sense, split and
              self-organize into something that feels alive — because, in every way
              that matters here, it is. Poke the dish and see for yourself.
            </p>
            <div className="hero-actions" data-reveal>
              <a href="#emergence" className="btn btn-glow btn-lg">Grow a colony <span aria-hidden="true">↝</span></a>
              <a href="#dna" className="btn btn-soft btn-lg">Read the DNA</a>
            </div>
            <div className="hero-proof" data-reveal>
              <div className="petri-mini" aria-hidden="true"><span></span><span></span><span></span></div>
              <p><b>1.2M</b> colonies cultured by curious minds worldwide</p>
            </div>
          </div>

          <div className="dish-wrap" data-reveal>
            <div className="dish">
              <PetriDish />
              <div className="dish-rim" aria-hidden="true"></div>
              <div className="dish-gloss" aria-hidden="true"></div>
            </div>
            <span className="dish-label">◔ live culture · move to disturb</span>
          </div>
        </section>

        <div className="band" aria-hidden="true">
          <div className="band-track">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} style={{ display: "contents" }}>
                <span>CELLS</span><i>❋</i><span>EVOLUTION</span><i>❋</i><span>NEURONS</span><i>❋</i>
                <span>ECOSYSTEMS</span><i>❋</i><span>DNA</span><i>❋</i><span>SWARMS</span><i>❋</i>
              </span>
            ))}
          </div>
        </div>

        <section className="section" id="organisms">
          <header className="head" data-reveal>
            <span className="kicker">The specimens</span>
            <h2>Six living <span className="ital">experiments.</span></h2>
            <p>Each a self-contained world you can seed, disturb and evolve.</p>
          </header>
          <div className="specimens">
            {SPECIMENS.map((s, i) => (
              <a key={s.cls} className={"spec " + s.cls} data-reveal href="#" onClick={(e) => handleSpecClick(e, i)}>
                <span className="spec-emoji">{s.emoji}</span><h3>{s.title}</h3><p>{s.desc}</p>
                <span className="spec-go">{specLoading === i ? "Culturing…" : "Culture →"}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="emergence">
          <header className="head" data-reveal>
            <span className="kicker">Emergence · Conway's Game of Life</span>
            <h2>Simple rules. <span className="ital">Endless life.</span></h2>
            <p>Paint living cells with your cursor. Three rules decide who survives — then complexity does the rest.</p>
          </header>
          <GameOfLife />
        </section>

        <section className="section dna" id="dna">
          <div className="dna-grid">
            <div className="dna-copy" data-reveal>
              <span className="kicker">The code of life</span>
              <h2>Four letters.<br /><span className="ital">Every living thing.</span></h2>
              <p>A · T · G · C — the alphabet that writes every organism in the dish. Watch the double helix turn, base pair by base pair.</p>
              <ul className="dna-legend">
                <li><i style={{ "--c": "#ff5c8a" }}></i> Adenine — Thymine</li>
                <li><i style={{ "--c": "#5cffd0" }}></i> Guanine — Cytosine</li>
              </ul>
              <p className="dna-tip">↔ move across the helix to spin it</p>
            </div>
            <div className="dna-vis" data-reveal>
              <DnaHelix />
            </div>
          </div>
        </section>

        <section className="section stats" id="stats">
          <div className="stat" data-reveal><span className="s-num" data-count="1200000" data-suffix="">0</span><span className="s-lab">colonies grown</span></div>
          <div className="stat" data-reveal><span className="s-num" data-count="8" data-suffix="M">0</span><span className="s-lab">generations bred</span></div>
          <div className="stat" data-reveal><span className="s-num" data-count="240" data-suffix="+">0</span><span className="s-lab">species evolved</span></div>
          <div className="stat" data-reveal><span className="s-num" data-count="100" data-suffix="%">0</span><span className="s-lab">alive in-browser</span></div>
        </section>

        <section className="section culture-cta" id="culture">
          <div className="cta-blob" data-reveal>
            <span className="eyebrow light"><i className="live"></i> free for the curious</span>
            <h2>Start your own <span className="ital">culture.</span></h2>
            <form className="cta-form" onSubmit={handleSubmit}>
              <input type="email" placeholder="you@lab.bio" aria-label="Email" required />
              <button className="btn btn-cream btn-lg" type="submit">Grow it ↝</button>
            </form>
            <span className="cta-note">{note}</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="f-top">
          <a href="#top" className="logo big"><span className="logo-cell"></span> Vivarium</a>
          <div className="f-links">
            <div><h4>Explore</h4><a href="#organisms">Organisms</a><a href="#emergence">Emergence</a><a href="#dna">DNA</a></div>
            <div><h4>Lab</h4><a href="#">Method</a><a href="#">Research</a><a href="#">Papers</a></div>
            <div><h4>Culture</h4><a href="#">Instagram</a><a href="#">GitHub</a><a href="#">Newsletter</a></div>
          </div>
        </div>
        <div className="f-bottom">
          <span>© 2026 Vivarium — cultured with care.</span>
          <span className="f-live"><i className="live"></i> specimen alive</span>
        </div>
      </footer>

      <MobileTabBar items={TABS} label="Vivarium sections" />
    </div>
  );
}
