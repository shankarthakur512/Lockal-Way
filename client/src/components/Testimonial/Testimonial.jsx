import React from "react";
import Slider from "react-slick";

const testimonialData = [
  {
    id: 1,
    name: "Maya Chen",
    text: "The guide profile felt trustworthy, the itinerary was beautifully paced, and booking never felt stressful. It was the first trip site that felt curated for people, not just clicks.",
    img: "https://picsum.photos/seed/traveler1/120/120",
    role: "Booked a heritage journey",
  },
  {
    id: 2,
    name: "Samuel Brooks",
    text: "I found a local guide in minutes, asked a few questions, and had a much better trip than if I had planned everything alone. The experience felt premium from start to finish.",
    img: "https://picsum.photos/seed/traveler2/120/120",
    role: "Used a local guide in Jaipur",
  },
  {
    id: 3,
    name: "Aisha Rahman",
    text: "The site made it easy to compare options without overwhelm. The visual design and the way details were presented made me feel confident enough to book right away.",
    img: "https://picsum.photos/seed/traveler3/120/120",
    role: "Booked a curated escape",
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    cssEase: "ease",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section data-aos="fade-up" data-aos-duration="300" className="py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="eyebrow-label">Traveler Notes</span>
          <h2 className="section-heading mt-5 dark:text-cream">What people remember most is how easy it all felt.</h2>
          <p className="section-copy mx-auto mt-4 dark:text-sand/75">
            Social proof should feel intimate and believable. These testimonials support trust right after the more aspirational sections.
          </p>
        </div>

        <div data-aos="zoom-in" data-aos-duration="300" className="mx-auto max-w-6xl">
          <Slider {...settings}>
            {testimonialData.map(({ id, name, text, img, role }) => (
              <div key={id} className="px-3 py-6">
                <article className="relative h-full rounded-[30px] border border-sand-dark/70 bg-warm-white p-8 shadow-soft dark:border-white/10 dark:bg-[#18211E]">
                  <div className="absolute right-6 top-5 text-7xl leading-none text-clay/15">"</div>
                  <div className="mb-6 flex items-center gap-4">
                    <img
                      src={img}
                      alt={name}
                      className="h-16 w-16 rounded-full object-cover ring-4 ring-sand"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-forest dark:text-cream">{name}</h3>
                      <p className="text-sm text-mist dark:text-sand/50">{role}</p>
                    </div>
                  </div>
                  <p className="relative z-10 text-sm leading-8 text-slate dark:text-sand/72">{text}</p>
                </article>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
