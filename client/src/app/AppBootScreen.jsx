const AppBootScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-cream px-6 text-ink dark:bg-charcoal dark:text-cream">
    <div className="max-w-md text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-clay">
        LokalWay
      </p>
      <h1 className="mt-5 text-4xl font-semibold text-forest dark:text-cream">
        Preparing your travel workspace
      </h1>
      <p className="mt-4 text-sm leading-7 text-slate dark:text-sand/70">
        Restoring your account, preferences, and latest planning context.
      </p>
      <div className="mx-auto mt-8 h-2 w-40 overflow-hidden rounded-full bg-sand-dark/60 dark:bg-white/10">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-forest dark:bg-sand" />
      </div>
    </div>
  </div>
);

export default AppBootScreen;
