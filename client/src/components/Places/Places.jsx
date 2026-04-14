import React from "react";
import PlaceCard from "./PlaceCard";
import Img1 from "../../assets/places/boat.jpg";
import Img2 from "../../assets/places/tajmahal.jpg";
import Img3 from "../../assets/places/water.jpg";
import Img4 from "../../assets/places/place4.jpg";
import Img5 from "../../assets/places/place5.jpg";
import Img6 from "../../assets/places/place6.jpg";

const PlacesData = [
  {
    img: Img1,
    title: "Lake Retreat",
    location: "Lake Tahoe",
    description: "Slow mornings, private boat rides, and crisp alpine air wrapped into a calming long-weekend itinerary.",
    price: 670,
    type: "Cultural Relax",
  },
  {
    img: Img2,
    title: "Taj Mahal Dawn Tour",
    location: "Agra, India",
    description: "Sunrise at the Taj, local storytelling, and heritage dining designed for travelers who want beauty with context.",
    price: 420,
    type: "Heritage Escape",
  },
  {
    img: Img3,
    title: "Blue Water Getaway",
    location: "Maui, Hawaii",
    description: "Ocean-front stays, curated diving spots, and laid-back coastal plans for a breezy tropical reset.",
    price: 620,
    type: "Island Leisure",
  },
  {
    img: Img4,
    title: "Sydney After Dark",
    location: "Sydney, Australia",
    description: "Harbour views, rooftop dinners, and city walks shaped around design-led urban travel.",
    price: 710,
    type: "Urban Discovery",
  },
  {
    img: Img5,
    title: "Pacific Coast Drive",
    location: "California, USA",
    description: "Scenic highways, boutique stops, and flexible local guidance for the perfect west-coast road story.",
    price: 540,
    type: "Road Journey",
  },
  {
    img: Img6,
    title: "Desert Lights",
    location: "Nevada, USA",
    description: "A cinematic mix of skyline nights, desert escapes, and bold experiences crafted for adventurous groups.",
    price: 580,
    type: "City + Desert",
  },
];

const Places = ({ handleOrderPopup }) => {
  return (
    <section className="py-20 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow-label">Most Loved Journeys</span>
            <h2 className="section-heading mt-5 dark:text-cream">Best places to visit for a story-worthy escape.</h2>
            <p className="section-copy mt-4 dark:text-sand/75">
              Browse a curated collection of destinations that feel elevated, photogenic, and easy to explore with the right local host.
            </p>
          </div>
          <div className="rounded-[24px] border border-sand-dark bg-warm-white px-6 py-5 shadow-soft dark:border-white/10 dark:bg-[#18211E]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist dark:text-sand/50">Why travelers love these</p>
            <p className="mt-2 max-w-sm text-sm leading-7 text-slate dark:text-sand/72">
              Flexible dates, trusted local support, and beautiful stays bundled into each itinerary.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {PlacesData.map((item, index) => (
            <PlaceCard
              handleOrderPopup={handleOrderPopup}
              key={index}
              {...item}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Places;
