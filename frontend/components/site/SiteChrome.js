"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import CommandPalette from "../CommandPalette";
import Toast from "../Toast";
import MobileTabBar from "../MobileTabBar";
import { PALETTES, applyAccent, clearAccent, getAccent, getTheme, loadSavedTheme, setTheme, subscribeTheme } from "../theme";
import { LABS, labHref } from "../simulations/catalog";

// shared by the desktop dropdown and the mobile sheet
const DISCIPLINES = [
  { key: "physics", lab: "particle-physics", title: "Physics", sub: "Motion, forces & energy", icon: <g fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><ellipse cx="12" cy="12" rx="9.5" ry="4" /><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)" /></g> },
  { key: "chemistry", lab: "chemical-reactions", title: "Chemistry", sub: "Reactions & molecules", icon: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2.5h6" /><path d="M10 2.5v6.2L4.8 18a2 2 0 0 0 1.8 2.9h10.8a2 2 0 0 0 1.8-2.9L14 8.7V2.5" /><path d="M7.5 15h9" /></g> },
  { key: "biology", lab: "bio", title: "Biology", sub: "Cells, genes & growth", icon: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M7 3c0 7 10 11 10 18" /><path d="M17 3c0 7-10 11-10 18" /><path d="M8 7h8M7.3 12h9.4M8 17h8" /></g> },
  { key: "geographic", title: "Geographic", sub: "Earth & climate systems", icon: <g fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9.5" /><ellipse cx="12" cy="12" rx="4.2" ry="9.5" /><path d="M2.5 12h19M3.8 7.5h16.4M3.8 16.5h16.4" strokeLinecap="round" /></g> },
  { key: "history", title: "History", sub: "Timelines & civilizations", icon: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5L12 4l9 4.5" /><path d="M4.5 8.5v10M9.5 8.5v10M14.5 8.5v10M19.5 8.5v10" /><path d="M3 20h18" /></g> },
  { key: "philosophy", title: "Philosophy", sub: "Logic & thought experiments", icon: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4" /><path d="M7 7h10l1.5 7a5.5 5.5 0 0 1-11 0L9 7" /><path d="M9.5 20.5h5" /></g> },
];

// disciplines with a lab open its page; the rest fall back to the home page's lab grid
const disciplineHref = (d, base) => (d.lab ? `/simulations/${d.lab}` : base + "#simulations");

const SECTIONS = [
  ["simulations", "🧪", "Simulations", "Browse the six lab disciplines"],
  ["features", "⚙️", "Platform", "Engine & feature overview"],
  ["showcase", "🎮", "Live demo", "The interactive playground"],
  ["stats", "📈", "Impact", "Usage stats"],
];

export function BrandMark({ size = 30 }) {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="24" cy="24" r="4.5" fill="currentColor" stroke="none" />
          <ellipse cx="24" cy="24" rx="19" ry="8" />
          <ellipse cx="24" cy="24" rx="19" ry="8" transform="rotate(60 24 24)" />
          <ellipse cx="24" cy="24" rx="19" ry="8" transform="rotate(120 24 24)" />
        </g>
      </svg>
    </span>
  );
}

/**
 * The Experiverse header, menu sheet, mobile tab bar, command palette and toast,
 * identical on every page that uses the home theme.
 * home: true on the home page (section links scroll in place); elsewhere they point back to "/".
 */
export default function SiteChrome({ home = false, sound, toastRef: externalToastRef, extraCommands = [] }) {
  const ownToastRef = useRef(null);
  const toastRef = externalToastRef ?? ownToastRef;
  const base = home ? "" : "/";
  // in-page anchors on the home page, client-side navigation back to it everywhere else
  const NavLink = home ? "a" : Link;
  const router = useRouter();

  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "dark");
  const accentIdx = useSyncExternalStore(subscribeTheme, getAccent, () => 0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);

  function toast(msg, ms) { toastRef.current?.show(msg, ms); }

  useEffect(() => { loadSavedTheme(); return clearAccent; }, []);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setNavScrolled(y > 20);
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? (y / max) * 100 : 0);
    }
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdkOpen((o) => !o); }
      else if (e.key === "Escape") { setCmdkOpen(false); setSheetOpen(false); }
    };
    // ui sounds on hover/click, when sound is switched on
    const onOver = (e) => { if (e.target.closest(".btn, .pg-tab, .sim-card, .nav-links a, .cmdk-item, .chip, .lp-card, .lp-rel")) sound.hover(); };
    const onClick = (e) => { if (e.target.closest(".btn, .nav-links a, .sim-card, .lp-rel")) sound.click(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("click", onClick);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, [sound]);

  // lock page scroll while the sheet is open
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [sheetOpen]);

  // swipe the sheet down to dismiss
  const sheetRef = useRef(null);
  const dragRef = useRef(null);
  function onSheetTouchStart(e) {
    if (sheetRef.current.scrollTop > 0) return;
    dragRef.current = { y: e.touches[0].clientY, dy: 0 };
  }
  function onSheetTouchMove(e) {
    const d = dragRef.current;
    if (!d) return;
    d.dy = Math.max(0, e.touches[0].clientY - d.y);
    sheetRef.current.style.transition = "none";
    sheetRef.current.style.transform = `translateY(${d.dy}px)`;
  }
  function onSheetTouchEnd() {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    sheetRef.current.style.transition = "";
    sheetRef.current.style.transform = "";
    if (d.dy > 90) setSheetOpen(false);
  }

  function goTo(id) {
    if (home) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    else router.push("/#" + id);
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function toggleSound() {
    const next = !sound.enabled;
    sound.set(next);
    if (next) { sound.tab(); toast("🔊 Sound on"); } else toast("🔇 Sound off");
  }

  function cycleAccent() {
    const next = (accentIdx + 1) % PALETTES.length;
    applyAccent(next);
    toast(`🎨 Accent: ${PALETTES[next].name}`);
  }

  function pickAccent(i) {
    applyAccent(i);
    sound.click();
  }

  function sheetGo(id) {
    setSheetOpen(false);
    // let the body scroll lock release before scrolling
    setTimeout(() => goTo(id), 60);
  }

  const commands = [
    ...SECTIONS.map(([id, icon, label, sub]) => ({ icon, title: `Go to ${label}`, sub, run: () => goTo(id) })),
    ...LABS.map((l) => ({ icon: l.icon, title: `Open ${l.title}`, sub: l.live ? "Live simulation" : "Lab overview", run: () => router.push(labHref(l)) })),
    { icon: "🎨", title: "Cycle accent color", sub: "Change the theme palette", run: cycleAccent },
    { icon: "◑", title: "Toggle light / dark theme", sub: "", run: toggleTheme },
    { icon: "🔊", title: "Toggle sound effects", sub: "", run: toggleSound },
    ...extraCommands,
  ];

  const tabs = home
    ? [
        { id: "home", label: "Home", icon: "home", target: "top" },
        { id: "labs", label: "Labs", icon: "flask", target: "simulations" },
        { id: "platform", label: "Platform", icon: "grid", target: "features" },
        { id: "demo", label: "Live", icon: "play", target: "showcase" },
        { id: "more", label: "More", icon: "menu", onClick: () => setSheetOpen(true), pressed: sheetOpen },
      ]
    : [
        { id: "home", label: "Home", icon: "home", href: "/" },
        { id: "labs", label: "Labs", icon: "flask", href: "/#simulations", pressed: !sheetOpen },
        { id: "platform", label: "Platform", icon: "grid", href: "/#features" },
        { id: "demo", label: "Live", icon: "play", href: "/#showcase" },
        { id: "more", label: "More", icon: "menu", onClick: () => setSheetOpen(true), pressed: sheetOpen },
      ];

  return (
    <>
      <div className="scroll-progress" style={{ width: progress + "%" }} aria-hidden="true"></div>

      <header className={"nav" + (navScrolled ? " scrolled" : "")}>
        <NavLink className="brand" href={home ? "#top" : "/"} aria-label="Experiverse home">
          <BrandMark />
          <span className="brand-text">Experi<b>verse</b></span>
        </NavLink>

        <nav className="nav-links" aria-label="Primary">
          <div className="nav-dropdown">
            <NavLink href={base + "#simulations"}>
              Simulations <span className="nav-caret" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="12" height="12"><path d="M5 8l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </NavLink>
            <div className="nav-dropdown-bridge" aria-hidden="true"></div>
            <div className="nav-dropdown-panel" role="menu">
              {DISCIPLINES.map((d) => (
                <Link key={d.key} href={disciplineHref(d, base)} className={"nav-dropdown-item icon-" + d.key} role="menuitem">
                  <span className="nav-dropdown-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20">{d.icon}</svg>
                  </span>
                  <span className="nav-dropdown-text">
                    <span className="nav-dropdown-title">{d.title}</span>
                    <span className="nav-dropdown-sub">{d.sub}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <NavLink href={base + "#features"}>Platform</NavLink>
          <NavLink href={base + "#showcase"}>Live Demo</NavLink>
          <NavLink href={base + "#stats"}>Impact</NavLink>
        </nav>

        <div className="nav-actions">
          <button className="btn btn-ghost icon-btn search-btn" aria-label="Search" title="Command palette — Ctrl/⌘ K" onClick={() => setCmdkOpen(true)}>
            <span className="kbd-label">⌘K</span>
            <svg className="search-ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></g></svg>
          </button>
          <button className="btn btn-ghost icon-btn accent-btn" aria-label="Change accent color" title="Change accent color" onClick={cycleAccent}>
            <span className="accent-dot" aria-hidden="true"></span>
          </button>
          <button className="btn btn-ghost icon-btn sound-btn" aria-label="Toggle sound" title="Toggle sound" aria-pressed={sound.enabled} onClick={toggleSound}>
            <span className="sound-icon">{sound.enabled ? "🔊" : "🔇"}</span>
          </button>
          <button className="btn btn-ghost icon-btn" aria-label="Toggle theme" onClick={toggleTheme}>
            <span className="theme-icon">◑</span>
          </button>
          <NavLink href={base + "#simulations"} className="btn btn-primary magnetic">Launch Lab <span aria-hidden="true">→</span></NavLink>
        </div>

        <button className={"nav-burger" + (sheetOpen ? " open" : "")} aria-label="Open menu" aria-expanded={sheetOpen} onClick={() => setSheetOpen((o) => !o)}>
          <span></span><span></span><span></span>
        </button>
      </header>

      <div className={"sheet-root" + (sheetOpen ? " open" : "")} inert={!sheetOpen}>
        <div className="sheet-backdrop" onClick={() => setSheetOpen(false)} aria-hidden="true"></div>
        <div
          className="sheet"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onTouchStart={onSheetTouchStart}
          onTouchMove={onSheetTouchMove}
          onTouchEnd={onSheetTouchEnd}
        >
          <div className="sheet-grabber" aria-hidden="true"></div>
          <div className="sheet-head">
            <span className="brand-text">Experi<b>verse</b></span>
            <button className="sheet-close" aria-label="Close menu" onClick={() => setSheetOpen(false)}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
            </button>
          </div>

          <p className="sheet-label">Disciplines</p>
          <div className="sheet-grid">
            {DISCIPLINES.map((d) => (
              <button key={d.key} className={"sheet-tile icon-" + d.key} onClick={() => (d.lab ? router.push(disciplineHref(d, base)) : sheetGo("simulations"))}>
                <span className="nav-dropdown-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22">{d.icon}</svg>
                </span>
                <span>{d.title}</span>
              </button>
            ))}
          </div>

          <p className="sheet-label">Jump to</p>
          <div className="sheet-group">
            {SECTIONS.map(([id, ico, label]) => (
              <button key={id} className="sheet-row" onClick={() => sheetGo(id)}>
                <span className="sheet-row-ico" aria-hidden="true">{ico}</span>
                <span className="sheet-row-text">{label}</span>
                <span className="sheet-chev" aria-hidden="true">›</span>
              </button>
            ))}
          </div>

          <p className="sheet-label">Preferences</p>
          <div className="sheet-group">
            <button className="sheet-row" role="switch" aria-checked={theme === "light"} onClick={toggleTheme}>
              <span className="sheet-row-ico" aria-hidden="true">◑</span>
              <span className="sheet-row-text">Light mode</span>
              <span className={"switch" + (theme === "light" ? " on" : "")} aria-hidden="true"></span>
            </button>
            <button className="sheet-row" role="switch" aria-checked={sound.enabled} onClick={toggleSound}>
              <span className="sheet-row-ico" aria-hidden="true">{sound.enabled ? "🔊" : "🔇"}</span>
              <span className="sheet-row-text">Sound effects</span>
              <span className={"switch" + (sound.enabled ? " on" : "")} aria-hidden="true"></span>
            </button>
            <div className="sheet-row">
              <span className="sheet-row-ico" aria-hidden="true">🎨</span>
              <span className="sheet-row-text">Accent</span>
              <span className="swatches" role="radiogroup" aria-label="Accent color">
                {PALETTES.map((p, i) => (
                  <button
                    key={p.name}
                    role="radio"
                    aria-checked={accentIdx === i}
                    aria-label={p.name}
                    className={"swatch" + (accentIdx === i ? " on" : "")}
                    style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b})` }}
                    onClick={() => pickAccent(i)}
                  ></button>
                ))}
              </span>
            </div>
            <button className="sheet-row" onClick={() => { setSheetOpen(false); setCmdkOpen(true); }}>
              <span className="sheet-row-ico" aria-hidden="true">⌕</span>
              <span className="sheet-row-text">Search actions</span>
              <span className="sheet-chev" aria-hidden="true">›</span>
            </button>
          </div>

          <Link href="/simulations/bio" className="btn btn-primary btn-lg sheet-cta">Open a live lab <span aria-hidden="true">→</span></Link>
        </div>
      </div>

      <MobileTabBar items={tabs} label="Experiverse sections" />

      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} commands={commands} />
      <Toast ref={toastRef} />
    </>
  );
}
