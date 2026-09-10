import SimulationCard from "@/components/SimulationCard";
import Reveal from "@/components/Reveal";
import { simulations } from "@/lib/simulations";

export const metadata = {
  title: "Simulations",
  description:
    "Browse the full library of interactive physics, chemistry, biology and astronomy simulations.",
};

export default function SimulationsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <Reveal>
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">Library</span>
          <h1 className="mt-3 font-[family-name:var(--font-round)] text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            All simulations
          </h1>
          <p className="mt-4 text-lg text-muted">
            Every experiment runs live in your browser. Pick a subject, open a
            simulation, and start changing the variables.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {simulations.map((sim, i) => (
          <Reveal key={sim.slug} delay={(i % 3) * 70} className="h-full">
            <SimulationCard sim={sim} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
