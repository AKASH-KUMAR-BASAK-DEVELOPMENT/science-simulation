import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/simulations", label: "All simulations" },
      { href: "/simulations", label: "Physics" },
      { href: "/simulations", label: "Chemistry" },
      { href: "/simulations", label: "Biology" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/about", label: "For teachers" },
      { href: "/about", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/about", label: "Getting started" },
      { href: "/about", label: "Help center" },
      { href: "/about", label: "Privacy" },
    ],
  },
];

const socials = [
  {
    label: "X",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z",
  },
  {
    label: "GitHub",
    href: "#",
    path: "M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4V9Z",
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 px-3 pb-3 sm:px-4 sm:pb-4">
      {/* elevated dark slab — reads as its own section in both themes */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#101228] text-white shadow-[0_-10px_60px_-30px_rgba(28,25,53,0.6)] ring-1 ring-white/10">
        {/* aurora glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-primary2/20 blur-3xl" />
          {/* faint grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          {/* top: brand + newsletter + link columns */}
          <div className="grid gap-12 py-16 lg:grid-cols-[1.5fr_2fr] lg:gap-16">
            {/* brand + newsletter */}
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary2 text-lg shadow-[0_10px_22px_-8px_rgba(109,94,252,0.9)]">
                  🔬
                </span>
                <span className="font-[family-name:var(--font-round)] text-2xl font-semibold tracking-tight text-white">
                  SciSim
                </span>
              </Link>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
                Interactive science simulations that help students build real
                intuition — free, and ready for any classroom.
              </p>

              {/* newsletter */}
              <div className="mt-7 max-w-sm">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Get new simulations in your inbox
                </label>
                <div className="mt-3 flex items-center gap-2 rounded-full bg-white/10 p-1.5 pl-4 ring-1 ring-white/15 backdrop-blur focus-within:ring-primary/50">
                  <span aria-hidden className="text-white/50">✉️</span>
                  <input
                    type="email"
                    placeholder="you@school.edu"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="lift shrink-0 rounded-full bg-gradient-to-r from-primary to-primary2 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_-10px_rgba(109,94,252,0.9)] hover:-translate-y-0.5"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="mt-2 pl-1 text-xs text-white/40">
                  No spam — just new experiments. Unsubscribe anytime.
                </p>
              </div>
            </div>

            {/* link columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {columns.map((col) => (
                <div key={col.title}>
                  <h4 className="text-sm font-semibold text-white">{col.title}</h4>
                  <ul className="mt-4 space-y-3">
                    {col.links.map((l, i) => (
                      <li key={i}>
                        <Link
                          href={l.href}
                          className="group inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
                        >
                          <span className="h-1 w-1 rounded-full bg-white/0 transition-colors group-hover:bg-accent" />
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* bottom bar */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 py-7 sm:flex-row">
            <p className="order-2 text-sm text-white/50 sm:order-1">
              © {new Date().getFullYear()} SciSim. A template for the science
              simulation project.
            </p>

            <div className="order-1 flex items-center gap-4 sm:order-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70 ring-1 ring-white/15">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" />
                All systems operational
              </span>
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="lift grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/70 ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-white/15 hover:text-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
