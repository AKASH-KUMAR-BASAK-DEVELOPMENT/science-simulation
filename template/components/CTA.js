import Reveal from "@/components/Reveal";
import Button from "@/components/Button";

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary2 to-primary px-8 py-16 text-center shadow-[0_40px_90px_-40px_rgba(109,94,252,0.7)] md:py-20">
          {/* soft light blobs */}
          <div className="pointer-events-none absolute -left-20 -top-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-[family-name:var(--font-round)] text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Stop explaining science.
              <br />
              Start running it.
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-medium text-white/85">
              Explore the full library today — it&apos;s free, and there is
              nothing to install.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="/simulations"
                variant="secondary"
                className="px-8 py-4 text-base text-primary"
              >
                Explore simulations →
              </Button>
              <Button
                href="/about"
                variant="ghost"
                className="px-3 py-4 text-base text-white hover:text-white/80"
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
