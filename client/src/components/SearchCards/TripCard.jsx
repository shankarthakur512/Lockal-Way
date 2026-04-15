import React from "react";
import { HiOutlineArrowUpRight, HiOutlineCalendarDays, HiOutlineClock, HiOutlineMapPin } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { getTripDetailsRoute } from "../../shared/constants/routes";
import { formatCurrency, formatDate } from "../../shared/lib/format";

function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <article
      className="group overflow-hidden rounded-[28px] border border-sand-dark/70 bg-warm-white shadow-soft transition duration-500 hover:-translate-y-2 hover:shadow-luxury dark:border-white/10 dark:bg-[#1B2421]"
      onClick={() => {
        navigate(getTripDetailsRoute(trip._id));
      }}
      data-testid="search-trip-card"
    >
      <div className="relative overflow-hidden">
        <img
          src={trip?.photos?.[0]}
          alt={trip?.tripName || "Trip preview"}
          className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest shadow-sm">
          {trip?.status || "Upcoming"}
        </div>
        <div className="absolute bottom-5 right-5 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-forest">
          {formatCurrency(trip?.price)}
        </div>
      </div>

      <div className="space-y-5 p-6 dark:text-cream">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            {trip?.location || "Destination"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink dark:text-cream">
            {trip?.tripName || "Curated trip"}
          </h3>
        </div>

        <div className="grid gap-3 text-sm text-slate dark:text-sand/70">
          <div className="flex items-center gap-3">
            <HiOutlineClock className="text-clay" />
            <span>{trip?.duration} Days</span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineCalendarDays className="text-clay" />
            <span>{formatDate(trip?.startingDate)}</span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineMapPin className="text-clay" />
            <span>{trip?.type || "Guided experience"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-sand-dark pt-5 dark:border-white/10">
          <p className="text-sm text-mist dark:text-sand/50">View itinerary, host details, and booking options.</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-forest dark:text-sand">
            Book Now
            <HiOutlineArrowUpRight className="transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default TripCard;
