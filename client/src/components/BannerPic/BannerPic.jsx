import React from "react";
import { HiOutlineArrowRight } from "react-icons/hi2";

const BannerPic = ({ img, title, description }) => {
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
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(26,26,26,0.78)_0%,rgba(44,74,62,0.52)_55%,rgba(26,26,26,0.2)_100%)]" />
          <div className="relative flex min-h-[520px] items-end p-6 sm:p-10 lg:p-14">
            <div className="max-w-2xl rounded-[28px] border border-white/12 bg-white/10 p-7 text-left backdrop-blur-md sm:p-9">
              <span className="eyebrow-label">Handcrafted Highlight</span>
              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight text-cream sm:text-5xl">
                {title}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-8 text-sand/80 sm:text-base">
                {description}
              </p>
              <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-forest transition hover:bg-sand">
                Explore this journey
                <HiOutlineArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerPic;
