"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

/* ---------- animated top-level icons ---------- */

function AtomIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" className="nav-ic">
      <circle cx="12" cy="12" r="1.9" fill="currentColor" />
      <g className="nav-orbit" stroke="currentColor" strokeWidth="1.4">
        <ellipse cx="12" cy="12" rx="9.5" ry="4" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)" />
        <circle cx="21.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" className="nav-ic">
      <path
        d="M9.5 3h5M10 3v5.5L5.6 16.4A2.2 2.2 0 0 0 7.5 20h9a2.2 2.2 0 0 0 1.9-3.6L14 8.5V3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M7.7 14.6h8.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <circle className="nav-bub nav-bub1" cx="11" cy="15.6" r="0.9" fill="currentColor" />
      <circle className="nav-bub nav-bub2" cx="13.4" cy="16" r="0.7" fill="currentColor" />
      <circle className="nav-bub nav-bub3" cx="12.1" cy="14.6" r="0.6" fill="currentColor" />
    </svg>
  );
}

function MicroscopeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="nav-ic"
    >
      <path d="M3 22h18" />
      <g className="nav-scope">
        <path d="M14 22a7 7 0 1 0 0-14h-1" />
        <path d="M9 14h2" />
        <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
        <path d="M12 6V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2" />
        <path d="M6 18h6" />
      </g>
    </svg>
  );
}

/* ---------- submenu icons ---------- */

function Ic({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const IconAtom = () => (
  <Ic>
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="9" ry="4" />
    <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" />
  </Ic>
);
const IconFlaskConical = () => (
  <Ic>
    <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
    <path d="M6.453 15h11.094" />
    <path d="M8.5 2h7" />
  </Ic>
);
const IconLeaf = () => (
  <Ic>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </Ic>
);
const IconPlanet = () => (
  <Ic>
    <circle cx="12" cy="12" r="5" />
    <ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(-20 12 12)" />
  </Ic>
);
const IconClipboardCheck = () => (
  <Ic>
    <rect width="8" height="4" x="8" y="2" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </Ic>
);
const IconSparkles = () => (
  <Ic>
    <path d="M9.94 14.06A2 2 0 0 0 8.5 12.62l-5.14-1.32a.5.5 0 0 1 0-.96L8.5 9.02a2 2 0 0 0 1.44-1.44l1.32-5.14a.5.5 0 0 1 .96 0l1.32 5.14a2 2 0 0 0 1.44 1.44l5.14 1.32a.5.5 0 0 1 0 .96l-5.14 1.32a2 2 0 0 0-1.44 1.44l-1.32 5.14a.5.5 0 0 1-.96 0z" />
    <path d="M19 3v3" />
    <path d="M20.5 4.5h-3" />
  </Ic>
);
const IconTrophy = () => (
  <Ic>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </Ic>
);
const IconChart = () => (
  <Ic>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="m19 9-5 5-4-4-3 3" />
  </Ic>
);
const IconDashboard = () => (
  <Ic>
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </Ic>
);
const IconWrench = () => (
  <Ic>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </Ic>
);
const IconFile = () => (
  <Ic>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </Ic>
);
const IconUsers = () => (
  <Ic>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Ic>
);

/* ---------- menu data ---------- */

const menus = [
  {
    label: "Simulation",
    href: "/simulations",
    Icon: AtomIcon,
    blurb: "Browse all simulations",
    align: "right",
    items: [
      { label: "Physics", desc: "Motion, forces & energy", Icon: IconAtom, color: "from-cyan-400 to-blue-500", href: "/simulations" },
      { label: "Chemistry", desc: "Reactions & bonding", Icon: IconFlaskConical, color: "from-violet-400 to-fuchsia-500", href: "/simulations" },
      { label: "Biology", desc: "Cells & evolution", Icon: IconLeaf, color: "from-emerald-400 to-teal-500", href: "/simulations" },
      { label: "Astronomy", desc: "Orbits & gravity", Icon: IconPlanet, color: "from-indigo-400 to-purple-500", href: "/simulations" },
    ],
  },
  {
    label: "Experiment",
    href: "/simulations",
    Icon: FlaskIcon,
    blurb: "Start an experiment",
    align: "right",
    items: [
      { label: "Guided Labs", desc: "Step-by-step procedures", Icon: IconClipboardCheck, color: "from-sky-400 to-indigo-500", href: "/simulations" },
      { label: "Sandbox", desc: "Free-play tinkering", Icon: IconSparkles, color: "from-amber-400 to-orange-500", href: "/simulations" },
      { label: "Challenges", desc: "Timed problem sets", Icon: IconTrophy, color: "from-rose-400 to-pink-500", href: "/simulations" },
      { label: "Data & Graphs", desc: "Plot and analyze", Icon: IconChart, color: "from-teal-400 to-cyan-500", href: "/simulations" },
    ],
  },
  {
    label: "Lab",
    href: "/simulations",
    Icon: MicroscopeIcon,
    blurb: "Enter your lab",
    align: "left",
    items: [
      { label: "Workbench", desc: "Your active projects", Icon: IconDashboard, color: "from-violet-400 to-indigo-500", href: "/simulations" },
      { label: "Apparatus", desc: "Equipment library", Icon: IconWrench, color: "from-slate-400 to-slate-600", href: "/simulations" },
      { label: "Saved Results", desc: "Reports & notes", Icon: IconFile, color: "from-emerald-400 to-green-500", href: "/simulations" },
      { label: "Classroom", desc: "Share with your class", Icon: IconUsers, color: "from-fuchsia-400 to-purple-500", href: "/simulations" },
    ],
  },
];

/* ---------- pieces ---------- */

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary2 text-base shadow-[0_8px_18px_-6px_rgba(109,94,252,0.8)]">
        🔬
      </span>
      <span className="font-[family-name:var(--font-round)] text-xl font-semibold tracking-tight text-ink">
        SciSim
      </span>
    </Link>
  );
}

function SubItem({ item, onClick }) {
  const { label, desc, Icon, color, href } = item;
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group/item flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-bg"
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-sm transition-transform duration-300 group-hover/item:scale-110 group-hover/item:-rotate-6`}
      >
        <Icon />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted">{desc}</span>
      </span>
    </Link>
  );
}

function MenuDropdown({ menu }) {
  const { label, href, Icon, blurb, items, align } = menu;
  const pos =
    align === "right"
      ? "right-0"
      : align === "center"
      ? "left-1/2 -translate-x-1/2"
      : "left-0";

  return (
    <div className="group relative">
      <Link
        href={href}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-muted transition-all duration-300 hover:bg-primary/10 hover:text-primary group-focus-within:bg-primary/10 group-focus-within:text-primary"
      >
        <span className="grid h-7 w-7 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary2 group-hover:text-white group-hover:shadow-[0_8px_16px_-6px_rgba(109,94,252,0.85)]">
          <Icon />
        </span>
        <span className="font-[family-name:var(--font-round)] text-[15px] font-semibold tracking-tight">
          {label}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-transform duration-200 group-hover:rotate-180"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Link>

      <div
        className={`invisible absolute top-full ${pos} w-[24rem] translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100`}
      >
        <div className="overflow-hidden rounded-3xl bg-card p-2 shadow-[0_30px_60px_-20px_rgba(28,25,53,0.4)] ring-1 ring-line">
          <div className="grid grid-cols-2 gap-1">
            {items.map((s) => (
              <SubItem key={s.label} item={s} />
            ))}
          </div>
          <Link
            href={href}
            className="mt-1 flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary to-primary2 px-4 py-3 text-sm font-semibold text-white"
          >
            {blurb}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div
        className={`mx-auto max-w-6xl rounded-full px-3 transition-all duration-300 ${
          scrolled
            ? "bg-card/85 shadow-[0_18px_40px_-20px_rgba(28,25,53,0.5)] ring-1 ring-line backdrop-blur-xl"
            : "bg-card/60 ring-1 ring-line backdrop-blur-md"
        }`}
      >
        <nav className="flex h-14 items-center justify-between pl-3 pr-1.5">
          {/* left: logo */}
          <Wordmark />

          {/* right: featured links + actions */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 lg:flex">
              {menus.map((menu) => (
                <MenuDropdown key={menu.label} menu={menu} />
              ))}
            </div>
            <ThemeToggle />

            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full bg-card text-ink ring-1 ring-line lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="mx-auto mt-3 max-w-6xl rounded-3xl bg-card p-3 shadow-[0_24px_50px_-20px_rgba(28,25,53,0.45)] ring-1 ring-line lg:hidden">
          <div className="flex flex-col gap-1">
            {menus.map((menu) => {
              const isOpen = expanded === menu.label;
              const MenuIcon = menu.Icon;
              return (
                <div key={menu.label} className="rounded-2xl">
                  <button
                    onClick={() => setExpanded(isOpen ? null : menu.label)}
                    className={`flex w-full items-center gap-2.5 rounded-2xl px-2 py-2 transition-colors ${
                      isOpen ? "bg-primary/10 text-primary" : "text-ink hover:bg-bg"
                    }`}
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl transition-colors ${
                        isOpen ? "bg-gradient-to-br from-primary to-primary2 text-white" : "bg-primary/10 text-primary"
                      }`}
                    >
                      <MenuIcon />
                    </span>
                    <span className="font-[family-name:var(--font-round)] text-[15px] font-semibold tracking-tight">
                      {menu.label}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className={`ml-auto transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="mt-1 grid grid-cols-2 gap-1 pb-1">
                      {menu.items.map((s) => (
                        <SubItem key={s.label} item={s} onClick={closeMobile} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
