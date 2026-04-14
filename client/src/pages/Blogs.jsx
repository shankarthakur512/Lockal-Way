import React from "react";

import BlogsComp from "../components/Blogs/BlogsComp";

const Blogs = () => {
  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 dark:bg-charcoal">
      <div className="section-shell">
        <section className="overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(135deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury sm:px-12 sm:py-14">
          <span className="eyebrow-label">Editorial</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            Travel stories with a calmer, more useful point of view.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-sand/80 sm:text-base">
            Explore articles that support discovery, planning confidence, and the more thoughtful side of travel.
          </p>
        </section>
      </div>

      <BlogsComp
        title="Journal notes that make the product feel human, aspirational, and useful."
        copy="These stories give the brand a stronger editorial layer while helping travelers imagine better trips."
      />
    </div>
  );
};

export default Blogs;
