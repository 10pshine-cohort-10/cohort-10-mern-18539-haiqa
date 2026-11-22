import heroBanner from '../../assets/hero-banner.jpg';

/** Top banner from the design reference: title, tagline and the desk artwork. */
export default function WelcomeBanner() {
  return (
    <section
      aria-labelledby="welcome-title"
      className="relative overflow-hidden rounded-2xl border border-line bg-[#f1f0ea] shadow-card animate-fade-in"
    >
      <img
        src={heroBanner}
        alt=""
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden h-full w-auto max-w-none object-cover opacity-90 sm:block"
      />
      <div
        aria-hidden="true"
        className="absolute -right-16 -bottom-24 hidden size-64 rounded-full bg-sage-300/60 md:block"
      />
      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <h1 id="welcome-title" className="text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Leafnote
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-xl">
          Your thoughts,
          <br />
          thoughtfully organized.
        </p>
      </div>
    </section>
  );
}
