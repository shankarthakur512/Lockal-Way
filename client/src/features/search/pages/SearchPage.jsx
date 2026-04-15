import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineAdjustmentsHorizontal, HiOutlineMap, HiOutlineUsers } from "react-icons/hi2";
import { useLocation } from "react-router-dom";
import GuideCard from "../../../components/SearchCards/GuideCard.jsx";
import TripCard from "../../../components/SearchCards/TripCard.jsx";
import { SEARCH_FILTER_GROUPS, SEARCH_PAGE_COPY } from "../constants/content";
import { createLogger } from "../../../shared/lib/logger";
import { formatDate } from "../../../shared/lib/format";

const searchLogger = createLogger("search-page");

function Search() {
  const [showFilters, setShowFilters] = useState(false);
  const trips = useSelector((state) => state.TripsArray.tripsArray);
  const guides = useSelector((state) => state.searchedGuides.guides);
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
  const location = useLocation();
  const searchFilters = location.state?.filters || {};

  const filteredTrips = useMemo(() => {
    return (trips || []).filter((trip) => {
      const tripStartDate = trip?.startingDate ? new Date(trip.startingDate) : null;
      const searchStartDate = searchFilters.startDate ? new Date(searchFilters.startDate) : null;
      const searchEndDate = searchFilters.endDate ? new Date(searchFilters.endDate) : null;

      if (!tripStartDate || Number.isNaN(tripStartDate.getTime())) {
        return false;
      }

      tripStartDate.setHours(0, 0, 0, 0);

      if (searchStartDate) {
        searchStartDate.setHours(0, 0, 0, 0);
      }

      if (searchEndDate) {
        searchEndDate.setHours(23, 59, 59, 999);
      }

      if (searchStartDate && tripStartDate < searchStartDate) {
        return false;
      }

      if (searchEndDate && tripStartDate > searchEndDate) {
        return false;
      }

      return true;
    });
  }, [searchFilters.endDate, searchFilters.startDate, trips]);

  const selectedWindowLabel = useMemo(() => {
    if (!searchFilters.startDate && !searchFilters.endDate) {
      return null;
    }

    if (searchFilters.startDate && searchFilters.endDate) {
      return `${formatDate(searchFilters.startDate)} to ${formatDate(searchFilters.endDate)}`;
    }

    if (searchFilters.startDate) {
      return `Starting after ${formatDate(searchFilters.startDate)}`;
    }

    return `Before ${formatDate(searchFilters.endDate)}`;
  }, [searchFilters.endDate, searchFilters.startDate]);

  const searchSummary = useMemo(
    () => [
      {
        label: "Guides",
        value: guides?.length || 0,
        icon: HiOutlineUsers,
      },
      {
        label: "Trips",
        value: filteredTrips?.length || 0,
        icon: HiOutlineMap,
      },
    ],
    [filteredTrips?.length, guides?.length]
  );

  searchLogger.debug("Search results", { trips: filteredTrips, guides, isDarkMode, searchFilters });

  return (
    <div className="min-h-screen bg-cream pb-20 pt-28 text-ink dark:bg-charcoal dark:text-cream" data-testid="search-page">
      <div className="section-shell">
        <section className="relative overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(130deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-6 py-12 shadow-luxury sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.26),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(122,158,138,0.16),transparent_18%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <span className="eyebrow-label">{SEARCH_PAGE_COPY.eyebrow}</span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-cream sm:text-5xl">
                {SEARCH_PAGE_COPY.heading}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-sand/80 sm:text-base">
                {SEARCH_PAGE_COPY.subline}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {searchSummary.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-[28px] border border-white/10 bg-white/10 p-6 text-cream backdrop-blur-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="text-xl text-gold" />
                  </div>
                  <p className="mt-5 text-3xl font-semibold">{value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-sand/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="surface-panel h-fit p-6 dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                  Search Toolkit
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-forest dark:text-cream">
                  {SEARCH_PAGE_COPY.filtersTitle}
                </h2>
              </div>
              <button
                onClick={() => setShowFilters((current) => !current)}
                data-testid="search-toggle-filters"
                className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-2 text-sm font-semibold text-forest transition hover:bg-sand dark:border-white/10 dark:bg-white/5 dark:text-sand"
              >
                <HiOutlineAdjustmentsHorizontal />
                {SEARCH_PAGE_COPY.filtersCta}
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {SEARCH_FILTER_GROUPS.map((group) => (
                <div key={group.title} className="rounded-[24px] border border-sand-dark bg-sand/40 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">
                    {group.title}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(showFilters ? group.items : group.items.slice(0, 2)).map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-forest/10 bg-white px-3 py-2 text-xs font-medium text-forest dark:border-white/10 dark:bg-white/10 dark:text-sand"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-12">
            {guides?.length === 0 && filteredTrips?.length === 0 && (
              <div className="surface-panel flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center dark:border-white/10 dark:bg-[#18211E]">
                <h2 className="text-3xl font-semibold text-forest dark:text-cream">
                  {SEARCH_PAGE_COPY.noResultsTitle}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-8 text-slate dark:text-sand/70">
                  {SEARCH_PAGE_COPY.noResultsBody}
                </p>
                <p className="mt-6 rounded-full border border-sand-dark bg-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-mist dark:border-white/10 dark:bg-white/5 dark:text-sand/60">
                  {SEARCH_PAGE_COPY.emptyHint}
                </p>
              </div>
            )}

            {selectedWindowLabel ? (
              <div className="surface-panel flex flex-wrap items-center justify-between gap-4 p-5 dark:border-white/10 dark:bg-[#18211E]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                    Search date window
                  </p>
                  <p className="mt-2 text-lg font-semibold text-forest dark:text-cream">
                    {selectedWindowLabel}
                  </p>
                </div>
                {searchFilters.destination ? (
                  <span className="rounded-full border border-sand-dark bg-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-forest dark:border-white/10 dark:bg-white/5 dark:text-sand">
                    {searchFilters.destination}
                  </span>
                ) : null}
              </div>
            ) : null}

            {guides?.length > 0 && (
              <section>
                <div className="mb-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                      Trusted hosts
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-forest dark:text-cream">
                      {SEARCH_PAGE_COPY.guidesHeading}
                    </h2>
                  </div>
                  <p className="text-sm text-slate dark:text-sand/65">{guides.length} results</p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {guides.map((guide) => (
                    <GuideCard key={guide._id || guide.id} guide={guide} />
                  ))}
                </div>
              </section>
            )}

            {filteredTrips?.length > 0 && (
              <section>
                <div className="mb-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                      Designed itineraries
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-forest dark:text-cream">
                      {SEARCH_PAGE_COPY.tripsHeading}
                    </h2>
                  </div>
                  <p className="text-sm text-slate dark:text-sand/65">{filteredTrips.length} results</p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {filteredTrips.map((trip, index) => (
                    <TripCard key={trip._id || index} trip={trip} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Search;
