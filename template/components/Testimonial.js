import Reveal from "@/components/Reveal";

export default function Testimonial() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 md:py-24">
      <Reveal>
        <figure className="relative overflow-hidden rounded-[2.5rem] bg-card p-10 text-center shadow-[0_30px_70px_-40px_rgba(28,25,53,0.5)] ring-1 ring-line md:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative">
            <div className="mx-auto flex w-fit gap-0.5 text-lg">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className="text-amber-400">{s}</span>
              ))}
            </div>
            <blockquote className="mt-5 font-[family-name:var(--font-round)] text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
              My students finally understand projectile motion. They change the
              angle and see{" "}
              <span className="bg-gradient-to-r from-primary to-primary2 bg-clip-text text-transparent">
                why
              </span>{" "}
              it works. It has completely changed how I teach.
            </blockquote>
            <figcaption className="mt-8 flex items-center justify-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-primary2 font-semibold text-white">
                AR
              </span>
              <div className="text-left">
                <div className="text-sm font-semibold text-ink">Anita Rao</div>
                <div className="text-sm text-muted">High-school physics teacher</div>
              </div>
            </figcaption>
          </div>
        </figure>
      </Reveal>
    </section>
  );
}
