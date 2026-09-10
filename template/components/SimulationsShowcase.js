import Link from "next/link";
import SimulationCard from "@/components/SimulationCard";
import Reveal from "@/components/Reveal";
import { simulations } from "@/lib/simulations";

export default function SimulationsShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-semibold text-primary">Library</span>
            <h2 className="mt-3 font-[family-name:var(--font-round)] text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Popular simulations
            </h2>
          </div>
          <Link
            href="/simulations"
            className="inline-flex items-center gap-1.5 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-line transition hover:-translate-y-0.5"
          >
            View all →
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {simulations.slice(0, 6).map((sim, i) => (
          <Reveal key={sim.slug} delay={(i % 3) * 70} className="h-full">
            <SimulationCard sim={sim} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
