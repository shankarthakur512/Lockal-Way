import React from "react";

const BannerPic2 = ({ img }) => {
  const title = "Get beautiful travel ideas before everyone else.";
  const description =
    "Subscribe for destination notes, guide picks, limited-time packages, and thoughtful inspiration for your next escape.";

  return (
    <section className="py-20 sm:py-24">
      <div className="section-shell">
        <div
          data-aos="zoom-in"
          className="relative overflow-hidden rounded-[36px] shadow-luxury"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(44,74,62,0.88)_0%,rgba(61,107,90,0.72)_48%,rgba(201,149,106,0.56)_100%)]" />
          <div className="relative grid min-h-[520px] items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_360px] lg:px-14">
            <div className="max-w-2xl text-cream">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
                Weekly travel letter
              </span>
              <h2 className="mt-6 text-4xl font-semibold leading-tight text-cream sm:text-5xl">
                {title}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-8 text-sand/80 sm:text-base">
                {description}
              </p>
            </div>

            <div className="rounded-[32px] border border-white/12 bg-warm-white p-6 shadow-soft dark:bg-[#18211E] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                Join the list
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-forest dark:text-cream">
                Curated updates. No clutter.
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/72">
                Be first to hear about guide-led packages, editorial travel notes, and seasonal offers.
              </p>

              <div className="mt-6 space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-full border border-sand-dark bg-white px-5 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream dark:placeholder:text-sand/45"
                />
                <button className="brand-button w-full rounded-full py-4">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerPic2;
