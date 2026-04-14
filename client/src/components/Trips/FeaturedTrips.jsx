import React, { useEffect, useState } from "react";
import TripCard from "../SearchCards/TripCard.jsx";
import { FeaturedTrips as FeaturedTripsApi } from "../../Apihandle/Trips";
import apiClient from "../../shared/api/client";
import { createLogger } from "../../shared/lib/logger";

const featuredTripsLogger = createLogger("featured-trips");

const FeaturedTrips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const loadFeaturedTrips = async () => {
      try {
        const { data } = await apiClient.get(FeaturedTripsApi);
        setTrips(data.trips || []);
      } catch (error) {
        featuredTripsLogger.error("Unable to load featured trips", error);
      }
    };

    loadFeaturedTrips();
  }, []);

  if (trips.length === 0) {
    return null;
  }

  return (
    <section id="services" className="section-shell py-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            Featured trips
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-forest dark:text-cream">
            Popular packages ready to book
          </h2>
        </div>
        <p className="text-sm text-slate dark:text-sand/65">{trips.length} curated picks</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {trips.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedTrips;
