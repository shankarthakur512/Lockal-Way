import React from "react";
import { FaBriefcase, FaMapMarkerAlt, FaRoute, FaUsers } from "react-icons/fa";
import Location from "../components/Location/Location";
import founderImage from "../assets/founder.jpg";
import { ABOUT_CONTENT } from "../shared/constants/editorialContent";

const impactIcons = [FaUsers, FaMapMarkerAlt, FaBriefcase];
const careerPathIcons = [FaRoute, FaBriefcase, FaUsers, FaMapMarkerAlt];

const About = () => {
  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 text-ink dark:bg-charcoal dark:text-cream">
      <div className="section-shell grid gap-10">
        <section className="overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(135deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury sm:px-12 sm:py-14">
          <span className="eyebrow-label">{ABOUT_CONTENT.eyebrow}</span>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            {ABOUT_CONTENT.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-sand/80 sm:text-base">
            {ABOUT_CONTENT.body}
          </p>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              {ABOUT_CONTENT.storyTitle}
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">
              A young company with a local-first product story.
            </h2>
            <p className="mt-5 text-sm leading-8 text-slate dark:text-sand/75">
              {ABOUT_CONTENT.storyBody}
            </p>

            <div className="mt-8 grid gap-4">
              {ABOUT_CONTENT.historyTimeline.map((item) => (
                <article
                  key={item.year}
                  className="rounded-[24px] border border-sand-dark/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#101714]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                    {item.year}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-forest dark:text-cream">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate dark:text-sand/75">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-sand-dark/70 shadow-soft dark:border-white/10">
            <img
              src={founderImage}
              alt={ABOUT_CONTENT.founderName}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <img
                src={founderImage}
                alt={ABOUT_CONTENT.founderName}
                className="h-56 w-56 rounded-full object-cover ring-4 ring-sand shadow-luxury dark:ring-white/10"
              />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                {ABOUT_CONTENT.founderTitle}
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">
                Build with a small team and broad ownership.
              </h2>
              <p className="mt-5 text-sm leading-8 text-slate dark:text-sand/75">
                {ABOUT_CONTENT.founderBody}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              {ABOUT_CONTENT.impactTitle}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ABOUT_CONTENT.impactCards.map((item, index) => {
              const Icon = impactIcons[index];

              return (
                <article
                  key={item.value}
                  className="surface-panel p-6 text-center dark:border-white/10 dark:bg-[#18211E]"
                >
                  <Icon className="mx-auto text-4xl text-gold" />
                  <h3 className="mt-5 text-3xl font-semibold text-forest dark:text-cream">
                    {item.value}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/72">
                    {item.label}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                {ABOUT_CONTENT.openingsTitle}
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">
                Sample openings for the Career section
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate dark:text-sand/75">
                {ABOUT_CONTENT.openingsBody}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {ABOUT_CONTENT.openings.map((opening) => (
              <article
                key={opening.title}
                className="rounded-[28px] border border-sand-dark/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-[#101714]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                  {opening.meta}
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-forest dark:text-cream">
                  {opening.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/75">
                  {opening.description}
                </p>
                <button type="button" className="brand-button mt-6">
                  Apply Now
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              {ABOUT_CONTENT.careerPathsTitle}
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">
              Example career options across the platform
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate dark:text-sand/75">
              {ABOUT_CONTENT.careerPathsBody}
            </p>

            <div className="mt-8 grid gap-4">
              {ABOUT_CONTENT.careerPaths.map((path, index) => {
                const Icon = careerPathIcons[index % careerPathIcons.length];

                return (
                  <article
                    key={path.title}
                    className="rounded-[24px] border border-sand-dark/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#101714]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-sand/70 p-3 dark:bg-white/5">
                        <Icon className="text-xl text-forest dark:text-sand" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-forest dark:text-cream">
                          {path.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate dark:text-sand/75">
                          {path.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              Team snapshot
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">
              Work that blends travel, trust, and product quality
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate dark:text-sand/75">
              The team works across traveler discovery, guide growth, booking confidence, and destination storytelling. That makes the environment a good fit for people who enjoy cross-functional work and want to influence both strategy and execution.
            </p>
            <div className="mt-6 overflow-hidden rounded-[28px] border border-sand-dark/70 dark:border-white/10">
              <img
                src={founderImage}
                alt="Lockal Way team culture"
                className="h-[320px] w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              {ABOUT_CONTENT.contactTitle}
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">
              Tell us where you would like to contribute.
            </h2>
            <p className="mt-5 text-sm leading-8 text-slate dark:text-sand/75">
              {ABOUT_CONTENT.contactBody}
            </p>

            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  type="text"
                  className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                  placeholder="Your Name"
                  required
                />
                <input
                  type="email"
                  className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                  placeholder="Your Email"
                  required
                />
              </div>
              <textarea
                rows="5"
                className="w-full rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                placeholder="Your Message"
                required
              />
              <button type="submit" className="brand-button w-full">
                Send Message
              </button>
            </form>
          </div>

          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              {ABOUT_CONTENT.locationsTitle}
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">
              A flexible setup for remote and hybrid hiring.
            </h2>
            <p className="mt-5 text-sm leading-8 text-slate dark:text-sand/75">
              {ABOUT_CONTENT.locationsBody}
            </p>
            <div className="mt-6 overflow-hidden rounded-[28px] border border-sand-dark/70 dark:border-white/10">
              <Location />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
