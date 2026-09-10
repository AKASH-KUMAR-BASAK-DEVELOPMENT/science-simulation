import Link from "next/link";

export default function SimulationCard({ sim }) {
  return (
    <Link
      href="/simulations"
      className="lift group flex h-full flex-col rounded-3xl bg-card p-6 shadow-[0_20px_50px_-30px_rgba(28,25,53,0.5)] ring-1 ring-line hover:-translate-y-1 hover:shadow-[0_30px_60px_-28px_rgba(109,94,252,0.5)]"
    >
      <div className="flex items-center justify-between">
        <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${sim.color} text-2xl shadow-lg`}>
          {sim.icon}
        </div>
        <span className="rounded-full bg-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
          {sim.field}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{sim.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {sim.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Open simulation
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
