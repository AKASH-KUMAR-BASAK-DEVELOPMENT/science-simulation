import Reveal from "@/components/Reveal";

const features = [
  {
    title: "Adjustable parameters",
    text: "Every simulation exposes the variables that matter, so students can test their own ideas.",
    grad: "from-cyan-400 to-blue-500",
    icon: (<><line x1="4" y1="8" x2="20" y2="8" /><circle cx="9" cy="8" r="2.5" fill="currentColor" stroke="none" /><line x1="4" y1="16" x2="20" y2="16" /><circle cx="15" cy="16" r="2.5" fill="currentColor" stroke="none" /></>),
  },
  {
    title: "Live data & graphs",
    text: "Values plot in real time as the simulation runs, connecting the visuals to the numbers.",
    grad: "from-violet-400 to-fuchsia-500",
    icon: (<><path d="M4 19V5" /><path d="M4 15l5-5 4 3 6-7" /></>),
  },
  {
    title: "Guided lessons",
    text: "Built-in prompts walk learners from observation to hypothesis to conclusion.",
    grad: "from-emerald-400 to-teal-500",
    icon: (<><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M9 7h7M9 11h7" /></>),
  },
  {
    title: "Runs anywhere",
    text: "Phone, tablet or projector — it loads instantly in any modern browser.",
    grad: "from-amber-400 to-orange-500",
    icon: (<><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></>),
  },
  {
    title: "Zero setup",
    text: "Share a link, project it, or assign it. No installs, accounts or plugins.",
    grad: "from-pink-400 to-rose-500",
    icon: (<><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></>),
  },
  {
    title: "Always accurate",
    text: "Simulations run on the real equations, so behaviour matches the science taught.",
    grad: "from-indigo-400 to-purple-500",
    icon: (<><path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z" /><path d="M9 12l2 2 4-4" /></>),
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">Capabilities</span>
          <h2 className="mt-3 font-[family-name:var(--font-round)] text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A serious lab, minus the lab.
          </h2>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 70}>
            <div className="lift h-full rounded-3xl bg-card p-8 shadow-[0_20px_50px_-30px_rgba(28,25,53,0.5)] ring-1 ring-line hover:-translate-y-1 hover:shadow-[0_30px_60px_-28px_rgba(109,94,252,0.5)]">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${f.grad} text-white shadow-lg`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
