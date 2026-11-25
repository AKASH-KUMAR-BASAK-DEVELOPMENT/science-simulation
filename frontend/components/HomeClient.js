"use client";

import { useEffect, useRef, useState } from "react";
import Playground from "./simulations/Playground";
import useSound from "./useSound";
import useConfetti from "./Confetti";
import SiteChrome from "./site/SiteChrome";
import SiteFooter from "./site/SiteFooter";
import { LABS, labHref } from "./simulations/catalog";
import Link from "next/link";

const GLYPHS ="!<>-_\\/[]{}—=+*^?#01";

export default function HomeClient() {
  const containerRef = useRef(null);
  const toastRef = useRef(null);
  const fieldApiRef = useRef({ burst: () => {} });
  const sound = useSound();
  const burst = useConfetti();

  const [ctaNote, setCtaNote] = useState("Free forever for students. No credit card.");
  const prefersReducedRef = useRef(false);

  function toast(msg, ms) { toastRef.current?.show(msg, ms); }

  useEffect(() => {
    prefersReducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // ambient particle field + cursor glow + reveals + counters + Konami
  useEffect(() => {
    const prefersReduced = prefersReducedRef.current;
    const finePointer = window.matchMedia("(pointer:fine)").matches;
    const cleanups = [];

    // field
    const field = document.getElementById("field");
    if (field && !prefersReduced) {
      const ctx = field.getContext("2d");
      let w, h, dpr, particles = [], lastW = 0, lastH = 0;
      const mouse = { x: -9999, y: -9999 };
      function resize() {
        // mobile browsers fire resize as the address bar slides; skip small height-only changes
        if (innerWidth === lastW && Math.abs(innerHeight - lastH) < 160) return;
        lastW = innerWidth; lastH = innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = field.width = innerWidth * dpr;
        h = field.height = innerHeight * dpr;
        field.style.width = innerWidth + "px";
        field.style.height = innerHeight + "px";
        const count = Math.min(120, Math.floor((innerWidth * innerHeight) / 16000));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25 * dpr,
          vy: (Math.random() - 0.5) * 0.25 * dpr,
          r: (Math.random() * 1.6 + 0.6) * dpr,
        }));
      }
      const palette = ["91,140,255", "160,107,255", "42,212,212"];
      let raf;
      function tick() {
        ctx.clearRect(0, 0, w, h);
        const linkDist = 130 * dpr;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          const mdx = p.x - mouse.x, mdy = p.y - mouse.y, md = Math.hypot(mdx, mdy);
          if (md < 120 * dpr && md > 0) { p.x += (mdx / md) * 2.2 * dpr; p.y += (mdy / md) * 2.2 * dpr; }
          const c = palette[i % palette.length];
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c},0.9)`;
          ctx.fill();
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
            if (d < linkDist) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(${c},${0.14 * (1 - d / linkDist)})`;
              ctx.lineWidth = dpr;
              ctx.stroke();
            }
          }
        }
        raf = requestAnimationFrame(tick);
      }
      fieldApiRef.current.burst = () => {
        const cx = w / 2, cy = h / 2;
        particles.forEach((p) => {
          const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1;
          p.vx += (dx / d) * (6 + Math.random() * 6) * dpr;
          p.vy += (dy / d) * (6 + Math.random() * 6) * dpr;
        });
      };
      const onMove = (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; };
      const onOut = () => { mouse.x = mouse.y = -9999; };
      window.addEventListener("resize", resize);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onOut);
      resize(); tick();
      cleanups.push(() => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseout", onOut);
        cancelAnimationFrame(raf);
      });
    }

    // cursor glow
    const glow = document.getElementById("cursorGlow");
    if (glow && finePointer && !prefersReduced) {
      let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy, raf;
      const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
      window.addEventListener("mousemove", onMove);
      function follow() {
        gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
        glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
        raf = requestAnimationFrame(follow);
      }
      follow();
      cleanups.push(() => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); });
    } else if (glow) glow.style.display = "none";

    // reveal
    const revealEls = [...containerRef.current.querySelectorAll("[data-reveal]")];
    if ("IntersectionObserver" in window && !prefersReduced) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(el); });
      cleanups.push(() => io.disconnect());
    } else revealEls.forEach((el) => el.classList.add("in"));

    // scramble eyebrow
    function scramble(el) {
      const text = el.dataset.txt || el.textContent;
      el.dataset.txt = text;
      let frame = 0;
      const dur = 26;
      const queue = [...text].map((ch, i) => ({ ch, start: Math.floor(i * 1.4), end: Math.floor(i * 1.4) + 8 + Math.random() * 8 }));
      let raf;
      (function run() {
        let out = "", done = 0;
        for (const q of queue) {
          if (frame >= q.end) { out += q.ch; done++; }
          else if (frame >= q.start) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          else out += "";
        }
        el.textContent = out;
        if (done < queue.length && frame < dur + text.length * 1.5) { frame++; raf = requestAnimationFrame(run); }
        else el.textContent = text;
      })();
    }
    if (!prefersReduced && "IntersectionObserver" in window) {
      const sio = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { scramble(e.target); sio.unobserve(e.target); } });
      }, { threshold: 0.8 });
      containerRef.current.querySelectorAll(".eyebrow").forEach((el) => sio.observe(el));
      cleanups.push(() => sio.disconnect());
    }

    // count-up
    function animateCount(el) {
      const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
      const isFloat = !Number.isInteger(target), dur = 1600, start = performance.now();
      (function step(now) {
        const t = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - t, 3), val = target * eased;
        el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
      })(start);
    }
    const countEls = [...containerRef.current.querySelectorAll("[data-count]")];
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.5 });
      countEls.forEach((c) => cio.observe(c));
      cleanups.push(() => cio.disconnect());
    } else countEls.forEach(animateCount);

    // tilt + hero parallax + magnetic
    if (finePointer && !prefersReduced) {
      containerRef.current.querySelectorAll(".tilt").forEach((card) => {
        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `translateY(-8px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg)`;
        };
        const onLeave = () => { card.style.transform = ""; };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => { card.removeEventListener("mousemove", onMove); card.removeEventListener("mouseleave", onLeave); });
      });

      const heroVisual = containerRef.current.querySelector(".hero-visual");
      const orbit = containerRef.current.querySelector(".orbit-system");
      const fcards = [...containerRef.current.querySelectorAll(".float-card")];
      if (heroVisual) {
        const onMove = (e) => {
          const r = heroVisual.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          if (orbit) orbit.style.transform = `translate(${px * 18}px, ${py * 18}px)`;
          fcards.forEach((c, i) => { c.style.marginLeft = `${px * (10 + i * 6)}px`; c.style.marginTop = `${py * (10 + i * 6)}px`; });
        };
        const onLeave = () => {
          if (orbit) orbit.style.transform = "";
          fcards.forEach((c) => { c.style.marginLeft = ""; c.style.marginTop = ""; });
        };
        heroVisual.addEventListener("mousemove", onMove);
        heroVisual.addEventListener("mouseleave", onLeave);
        cleanups.push(() => { heroVisual.removeEventListener("mousemove", onMove); heroVisual.removeEventListener("mouseleave", onLeave); });
      }

      containerRef.current.querySelectorAll(".magnetic").forEach((btn) => {
        const onMove = (e) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
          btn.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
        };
        const onLeave = () => { btn.style.transform = ""; };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); });
      });
    }

    // Konami code
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let ki = 0;
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      ki = k === seq[ki] ? ki + 1 : (k === seq[0] ? 1 : 0);
      if (ki === seq.length) {
        ki = 0;
        fieldApiRef.current.burst();
        burst(240, undefined, prefersReduced);
        sound.chord();
        toast("💥 BIG BANG — you found the easter egg!", 3600);
      }
    };
    window.addEventListener("keydown", onKey);
    cleanups.push(() => window.removeEventListener("keydown", onKey));

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extraCommands = [
    { icon: "🎉", title: "Celebrate", sub: "Just because", run: () => { burst(180); sound.chord(); } },
  ];

  function handleCtaSubmit(e) {
    e.preventDefault();
    setCtaNote("🎉 You're on the list! Check your inbox to confirm.");
    const btn = e.target.querySelector("button[type=submit]");
    const r = btn.getBoundingClientRect();
    burst(150, { x: r.left + r.width / 2, y: r.top });
    sound.chord();
    e.target.reset();
  }

  return (
    <div ref={containerRef} className="theme-home">
      <canvas id="field" aria-hidden="true"></canvas>
      <div className="cursor-glow" id="cursorGlow" aria-hidden="true"></div>
      <SiteChrome home sound={sound} toastRef={toastRef} extraCommands={extraCommands} />

      <main id="top">
        <section className="hero">
          <div className="hero-inner">
            <div className="pill reveal" data-reveal>
              <span className="pill-dot"></span>
              New · Real-time WebGL physics engine
            </div>

            <h1 className="hero-title reveal" data-reveal>
              Where science
              <span className="grad-text">comes alive</span>
              in your browser.
            </h1>

            <p className="hero-sub reveal" data-reveal>
              Run particle collisions, orbital mechanics, chemical reactions and neural
              growth — all interactive, all in real time. No installs. No limits.
              Just pure, playable science.
            </p>

            <div className="hero-cta reveal" data-reveal>
              <a href="#simulations" className="btn btn-primary btn-lg magnetic">
                Explore Simulations <span aria-hidden="true">→</span>
              </a>
              <a href="#showcase" className="btn btn-outline btn-lg">
                <span className="play-icon" aria-hidden="true">▶</span> Watch it run
              </a>
            </div>

            <div className="hero-trust reveal" data-reveal>
              <div className="avatars" aria-hidden="true">
                <span style={{ "--i": 0 }}>🧑‍🔬</span>
                <span style={{ "--i": 1 }}>👩‍🚀</span>
                <span style={{ "--i": 2 }}>🧑‍🏫</span>
                <span style={{ "--i": 3 }}>👨‍💻</span>
              </div>
              <p>Trusted by <b>120,000+</b> students, teachers &amp; curious minds</p>
            </div>
          </div>

          <div className="hero-visual reveal" data-reveal aria-hidden="true">
            <div className="orbit-system">
              <div className="sun"></div>
              <div className="ring ring-1"><span className="planet p1"></span></div>
              <div className="ring ring-2"><span className="planet p2"></span></div>
              <div className="ring ring-3"><span className="planet p3"></span></div>
              <div className="ring ring-4"><span className="planet p4"></span></div>
            </div>
            <div className="float-card fc-1">
              <span className="fc-label">Velocity</span>
              <span className="fc-value" data-count="29.8">0</span> km/s
            </div>
            <div className="float-card fc-2">
              <span className="fc-label">Particles</span>
              <span className="fc-value" data-count="4096">0</span>
            </div>
            <div className="float-card fc-3">
              <span className="fc-label">FPS</span>
              <span className="fc-value" data-count="60">0</span>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} style={{ display: "contents" }}>
                <span>PHYSICS</span><span>•</span><span>CHEMISTRY</span><span>•</span>
                <span>ASTRONOMY</span><span>•</span><span>BIOLOGY</span><span>•</span>
                <span>QUANTUM</span><span>•</span><span>THERMODYNAMICS</span><span>•</span>
              </span>
            ))}
          </div>
        </div>

        <section className="section" id="simulations">
          <div className="section-head reveal" data-reveal>
            <span className="eyebrow">The Lab</span>
            <h2>Pick a discipline. <span className="grad-text">Start experimenting.</span></h2>
            <p>Six living laboratories, each a fully interactive sandbox tuned for discovery.</p>
          </div>

          <div className="sim-grid">
            {LABS.map((lab) => (
              <Link key={lab.slug} href={labHref(lab)} className="sim-card tilt" data-cat={lab.cat} style={{ "--accent": lab.accent }}>
                <div className="sim-icon">{lab.icon}</div>
                <h3>{lab.title}{lab.live ? <span className="sim-live">Live</span> : <span className="sim-soon">Preview</span>}</h3>
                <p>{lab.desc}</p>
                <div className="sim-meta"><span>{lab.tags[0]}</span><span>{lab.tags[1]}</span></div>
                <span className="sim-go">{lab.live ? "Open sandbox →" : "View preview →"}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section" id="features">
          <div className="section-head reveal" data-reveal>
            <span className="eyebrow">The Platform</span>
            <h2>Built for <span className="grad-text">deep exploration.</span></h2>
            <p>A serious engine under a playful surface — designed for classrooms and researchers alike.</p>
          </div>

          <div className="bento">
            <div className="bento-card b-large reveal" data-reveal>
              <div className="bento-glow"></div>
              <h3>Real-time physics engine</h3>
              <p>A deterministic solver running at 60fps on the GPU. Scrub time forward and back, freeze the frame, and inspect any variable.</p>
              <div className="mini-graph" aria-hidden="true">
                <svg viewBox="0 0 300 80" preserveAspectRatio="none">
                  <path className="graph-line" d="M0,60 C40,20 70,70 110,40 S180,10 220,45 S280,20 300,35" />
                </svg>
              </div>
            </div>

            <div className="bento-card reveal" data-reveal>
              <div className="feat-ico">⚡</div>
              <h3>Zero install</h3>
              <p>Runs entirely in the browser via WebGL &amp; WebAssembly.</p>
            </div>

            <div className="bento-card reveal" data-reveal>
              <div className="feat-ico">🎛️</div>
              <h3>Tweak everything</h3>
              <p>Every constant is a live slider. Break the rules of physics on purpose.</p>
            </div>

            <div className="bento-card b-wide reveal" data-reveal>
              <div className="feat-ico">🔗</div>
              <h3>Share &amp; remix</h3>
              <p>Every experiment gets a permanent link. Fork a colleague's setup and build on it in one click.</p>
            </div>

            <div className="bento-card reveal" data-reveal>
              <div className="feat-ico">📊</div>
              <h3>Export data</h3>
              <p>Stream results to CSV, JSON or live charts for your lab report.</p>
            </div>
          </div>
        </section>

        <section className="section showcase" id="showcase">
          <div className="section-head reveal" data-reveal>
            <span className="eyebrow">Live Demo</span>
            <h2>Four engines. <span className="grad-text">One canvas.</span></h2>
            <p>Real simulations running live in your browser. Switch engines, tweak the physics, click and drag — it all responds in real time.</p>
          </div>

          <Playground sound={sound} />
        </section>

        <section className="section stats" id="stats">
          <div className="stat reveal" data-reveal>
            <span className="stat-num" data-count="120000" data-suffix="+">0</span>
            <span className="stat-label">Active learners</span>
          </div>
          <div className="stat reveal" data-reveal>
            <span className="stat-num" data-count="42" data-suffix="+">0</span>
            <span className="stat-label">Simulation modules</span>
          </div>
          <div className="stat reveal" data-reveal>
            <span className="stat-num" data-count="3" data-suffix="M+">0</span>
            <span className="stat-label">Experiments run</span>
          </div>
          <div className="stat reveal" data-reveal>
            <span className="stat-num" data-count="99" data-suffix="%">0</span>
            <span className="stat-label">Would recommend</span>
          </div>
        </section>

        <section className="section cta-section">
          <div className="cta-card reveal" data-reveal>
            <div className="cta-aura" aria-hidden="true"></div>
            <h2>Ready to run your first experiment?</h2>
            <p>Join a community turning curiosity into discovery — one simulation at a time.</p>
            <form className="cta-form" onSubmit={handleCtaSubmit}>
              <input type="email" placeholder="you@university.edu" aria-label="Email address" required />
              <button className="btn btn-primary btn-lg" type="submit">Get early access</button>
            </form>
            <span className="cta-note">{ctaNote}</span>
          </div>
        </section>
      </main>

      <SiteFooter home />
    </div>
  );
}
