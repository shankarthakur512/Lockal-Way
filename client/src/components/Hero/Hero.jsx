import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlineArrowRight, HiOutlineMapPin } from "react-icons/hi2";
import { FiCalendar, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FindTripsByLocation } from "../../Apihandle/Trips";
import { useDispatch } from "react-redux";
import { setTripsArray } from "../../Redux/Tripslice";
import { findGuideByCity } from "../../Apihandle/LocalGuide";
import { addSearchedGuide } from "../../Redux/GuideSlice";
import apiClient from "../../shared/api/client";
import { APP_ROUTES } from "../../shared/constants/routes";
import { HOME_STRINGS } from "../../shared/constants/strings";
import { createLogger } from "../../shared/lib/logger";
import { getErrorMessage } from "../../shared/lib/error";
import { toastService } from "../../shared/services/toast";
import NatureVid from "../../assets/video/main.mp4";

const heroLogger = createLogger("hero-search");

const Hero = () => {
  const [priceValue, setPriceValue] = useState(300);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [destination, setDestination] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!destination.trim()) {
      toastService.warning("Enter a destination to start exploring.");
      return;
    }

    try {
      const tripResponse = await apiClient.post(FindTripsByLocation, { location: destination });
      const guideResponse = await apiClient.post(findGuideByCity, { city: destination });
      const allTrips = tripResponse.data.trips || [];
      const guides = guideResponse.data.guides || [];
      const trips = allTrips.filter((trip) => {
        const tripStartDate = trip?.startingDate ? new Date(trip.startingDate) : null;
        const searchStartDate = startDate ? new Date(startDate) : null;
        const searchEndDate = endDate ? new Date(endDate) : null;

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

      heroLogger.debug("Trips fetched", trips);
      dispatch(setTripsArray({ trips }));
      dispatch(addSearchedGuide({ guides }));
      navigate(APP_ROUTES.search, {
        state: {
          filters: {
            destination: destination.trim(),
            startDate: startDate?.toISOString() || null,
            endDate: endDate?.toISOString() || null,
          },
        },
      });
    } catch (error) {
      heroLogger.error("Search failed", error);
      toastService.error(getErrorMessage(error, "Unable to search right now."));
    }
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32" data-testid="home-hero">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src={NatureVid} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(26,53,48,0.9)_0%,rgba(44,74,62,0.78)_50%,rgba(61,92,74,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.28),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(122,158,138,0.18),transparent_20%)]" />
      </div>

      <div className="section-shell relative z-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl">
            <span className="eyebrow-label">{HOME_STRINGS.eyebrow}</span>
            <h1
              data-aos="fade-up"
              className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] text-cream sm:text-6xl lg:text-7xl"
            >
              {HOME_STRINGS.headline}
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="mt-6 max-w-2xl text-base leading-8 text-sand/80 sm:text-lg"
            >
              {HOME_STRINGS.subline}
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="150"
              className="mt-10 flex flex-wrap gap-3"
            >
              {[HOME_STRINGS.featureOne, HOME_STRINGS.featureTwo, HOME_STRINGS.featureThree].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-sand backdrop-blur-md"
                >
                  {item}
                </span>
              ))}
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="220"
              className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-8"
            >
              <div>
                <div className="text-3xl font-semibold text-cream">120+</div>
                <div className="mt-1 text-xs uppercase tracking-[0.22em] text-sand/60">
                  {HOME_STRINGS.guideStat}
                </div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-cream">340+</div>
                <div className="mt-1 text-xs uppercase tracking-[0.22em] text-sand/60">
                  {HOME_STRINGS.tripStat}
                </div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-cream">18k</div>
                <div className="mt-1 text-xs uppercase tracking-[0.22em] text-sand/60">
                  {HOME_STRINGS.travelerStat}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:justify-self-end">
            <form
              data-aos="fade-left"
              data-testid="home-search-form"
              className="surface-panel w-full max-w-xl overflow-hidden bg-warm-white/95 p-6 dark:border-white/10 dark:bg-[#18211E]/95 sm:p-8"
              onSubmit={handleSearch}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                    {HOME_STRINGS.showcaseBadge}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-forest dark:text-cream">
                    {HOME_STRINGS.searchButton}
                  </h2>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-sand text-forest dark:bg-white/10 dark:text-sand sm:flex">
                  <FiSearch size={20} />
                </div>
              </div>

              <div className="grid gap-4">
                <label className="rounded-[22px] border border-sand-dark bg-white px-4 py-4 dark:border-white/10 dark:bg-[#101714]">
                  <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist dark:text-sand/50">
                    <HiOutlineMapPin />
                    {HOME_STRINGS.destinationLabel}
                  </span>
                    <input
                      type="text"
                      value={destination}
                      onChange={(event) => setDestination(event.target.value)}
                      name="destination"
                      id="destination"
                      placeholder={HOME_STRINGS.destinationPlaceholder}
                      data-testid="home-destination"
                      className="w-full bg-transparent text-base font-medium text-ink outline-none placeholder:text-mist dark:text-cream dark:placeholder:text-sand/45"
                    />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="rounded-[22px] border border-sand-dark bg-white px-4 py-4 dark:border-white/10 dark:bg-[#101714]">
                    <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist dark:text-sand/50">
                      <FiCalendar />
                      {HOME_STRINGS.startDateLabel}
                    </span>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Choose date"
                      className="w-full bg-transparent text-base font-medium text-ink outline-none placeholder:text-mist dark:text-cream dark:placeholder:text-sand/45"
                      minDate={new Date()}
                    />
                  </label>

                  <label className="rounded-[22px] border border-sand-dark bg-white px-4 py-4 dark:border-white/10 dark:bg-[#101714]">
                    <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist dark:text-sand/50">
                      <FiCalendar />
                      {HOME_STRINGS.endDateLabel}
                    </span>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || new Date()}
                      placeholderText="Choose date"
                      className="w-full bg-transparent text-base font-medium text-ink outline-none placeholder:text-mist dark:text-cream dark:placeholder:text-sand/45"
                    />
                  </label>
                </div>

                <div className="rounded-[22px] border border-sand-dark bg-white px-4 py-4 dark:border-white/10 dark:bg-[#101714]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist dark:text-sand/50">
                      {HOME_STRINGS.priceLabel}
                    </span>
                    <span className="text-sm font-semibold text-forest dark:text-sand">${priceValue}</span>
                  </div>
                  <input
                    type="range"
                    name="price"
                    id="price"
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-sand"
                    min="100"
                    max="1500"
                    value={priceValue}
                    step="50"
                    onChange={(event) => setPriceValue(event.target.value)}
                    style={{
                      background: `linear-gradient(to right, #2C4A3E ${((priceValue - 100) / 1400) * 100}%, #E8DFC8 ${((priceValue - 100) / 1400) * 100}%)`,
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="brand-button mt-6 w-full gap-2 rounded-[22px] py-4 text-base"
                data-testid="home-search-submit"
              >
                {HOME_STRINGS.searchButton}
                <HiOutlineArrowRight className="text-lg" />
              </button>
            </form>

            <div
              data-aos="fade-left"
              data-aos-delay="120"
              className="grid gap-4 sm:grid-cols-[1fr_auto]"
            >
              <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 text-sand shadow-soft backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                  {HOME_STRINGS.showcaseLocation}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-cream">
                  {HOME_STRINGS.showcaseTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-sand/75">
                  {HOME_STRINGS.showcaseMeta}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-base font-semibold text-cream">
                    {HOME_STRINGS.showcasePrice}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    Featured
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-full border border-white/15 bg-warm-white px-3 py-3 shadow-soft dark:bg-[#18211E]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3D6B5A,#2C4A3E)] text-sm font-semibold text-sand">
                  AS
                </div>
                <div className="pr-4">
                  <p className="text-sm font-semibold text-ink dark:text-cream">{HOME_STRINGS.guidePillName}</p>
                  <p className="text-xs text-mist dark:text-sand/50">{HOME_STRINGS.guidePillLocation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
