import React from "react";
import TravelImg from "../../assets/travelbox.png";
import { MdFlight, MdOutlineLocalHotel } from "react-icons/md";
import { IoIosWifi } from "react-icons/io";
import { IoFastFoodSharp } from "react-icons/io5";

const perks = [
  {
    title: "Flights",
    icon: MdFlight,
    tone: "bg-gold/15 text-gold",
  },
  {
    title: "Hotels",
    icon: MdOutlineLocalHotel,
    tone: "bg-terracotta/12 text-terracotta",
  },
  {
    title: "Fast Wi-Fi",
    icon: IoIosWifi,
    tone: "bg-sage/18 text-forest",
  },
  {
    title: "Great Food",
    icon: IoFastFoodSharp,
    tone: "bg-clay/14 text-clay-dark",
  },
];

const Banner = () => {
  return (
    <section className="py-20 sm:py-24">
      <div className="section-shell">
        <div className="surface-panel overflow-hidden bg-[linear-gradient(135deg,#FFFDF9_0%,#F5F0E8_100%)] dark:border-white/10 dark:bg-[linear-gradient(135deg,#18211E_0%,#101714_100%)]">
          <div className="grid items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:py-14">
            <div data-aos="flip-up" className="relative">
              <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.16),transparent_35%)]" />
              <img
                src={TravelImg}
                alt="Travel image"
                className="relative mx-auto h-auto w-full max-w-[460px] drop-shadow-[0_30px_60px_rgba(44,74,62,0.18)]"
              />
            </div>

            <div className="flex flex-col justify-center gap-6">
              <span className="eyebrow-label">Travel Without Friction</span>
              <h2 data-aos="fade-up" className="section-heading max-w-xl dark:text-cream">
                Explore every corner of the world with comfort built into the journey.
              </h2>
              <p data-aos="fade-up" className="section-copy max-w-2xl dark:text-sand/75">
                From logistics to local recommendations, the experience should feel seamless. We shape each trip around ease, atmosphere, and confidence from the moment you book.
              </p>

              <div data-aos="zoom-in" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {perks.map(({ title, icon: Icon, tone }) => (
                  <div
                    key={title}
                    className="rounded-[24px] border border-sand-dark bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                        <Icon className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-forest dark:text-cream">{title}</p>
                        <p className="mt-1 text-xs leading-6 text-slate dark:text-sand/72">
                          Thoughtfully selected to keep every trip smooth and enjoyable.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
