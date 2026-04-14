import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaDollarSign,
  FaHotel,
  FaStar,
} from "react-icons/fa";
import {
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineQueueList,
  HiOutlineSparkles,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { useParams } from "react-router-dom";
import { FindtripDetail } from "../../../Apihandle/Trips";
import BookingModal from "../../../components/Booking/BookingModal.jsx";
import apiClient from "../../../shared/api/client";
import { TRIP_PAGE_COPY } from "../constants/content";
import { createLogger } from "../../../shared/lib/logger";
import { getErrorMessage } from "../../../shared/lib/error";
import { toastService } from "../../../shared/services/toast";
import { formatCurrency, formatDate, getInitials } from "../../../shared/lib/format";

const tourPageLogger = createLogger("tour-page");

const TourPage = () => {
  const [tourData, setTourData] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [showPolicy, setShowPolicy] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { TripId } = useParams();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const getTripData = async () => {
      try {
        const res = await apiClient.get(`${FindtripDetail}/${TripId}`);
        const trip = res.data.trips[0];
        setTourData(trip);
        tourPageLogger.debug("Trip loaded", trip);
        setSelectedPhoto(trip?.photos?.[0] || "");
      } catch (error) {
        tourPageLogger.error("Failed to load trip details", error);
        toastService.error(getErrorMessage(error, "Unable to load trip details."));
      }
    };

    getTripData();
  }, [TripId]);

  const itineraryItems = useMemo(
    () =>
      tourData?.itinerary
        ? tourData.itinerary.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    [tourData?.itinerary]
  );

  const tripMeta = useMemo(
    () => [
      {
        label: TRIP_PAGE_COPY.statusLabel,
        value: tourData?.status || "Upcoming",
        icon: HiOutlineSparkles,
      },
      {
        label: TRIP_PAGE_COPY.locationLabel,
        value: tourData?.location || "Not available",
        icon: HiOutlineMapPin,
      },
      {
        label: TRIP_PAGE_COPY.dateLabel,
        value: formatDate(tourData?.startingDate),
        icon: HiOutlineCalendarDays,
      },
      {
        label: TRIP_PAGE_COPY.typeLabel,
        value: tourData?.type || "Guided experience",
        icon: HiOutlineQueueList,
      },
    ],
    [tourData?.location, tourData?.startingDate, tourData?.status, tourData?.type]
  );

  if (!tourData) {
    return (
      <div className="min-h-screen bg-cream pt-32 text-center text-lg font-medium text-slate dark:bg-charcoal dark:text-sand">
        {TRIP_PAGE_COPY.loading}
      </div>
    );
  }

  const discountedPrice = tourData.price - (tourData.price * 10) / 100;
  const hostName = tourData?.userDetails?.fullName || "Guide host";
  const hostLocation = [tourData?.guideDetails?.city, tourData?.guideDetails?.country]
    .filter(Boolean)
    .join(", ");
  const bookedUsers = tourData?.bookedByUsers || [];
  const isBookedByCurrentUser = bookedUsers.some(
    (entry) => entry.user === userData?._id || entry.user?._id === userData?._id
  );

  return (
    <div className="min-h-screen bg-cream pb-20 pt-28 text-ink dark:bg-charcoal dark:text-cream">
      <div className="section-shell">
        <section className="relative overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(130deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-6 py-12 shadow-luxury sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.26),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(122,158,138,0.16),transparent_18%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="eyebrow-label">{tourData.location}</span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-cream sm:text-5xl">
                {tourData.tripName}
              </h1>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {tripMeta.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-[24px] border border-white/10 bg-white/10 p-5 text-cream backdrop-blur-md"
                  >
                    <Icon className="text-xl text-gold" />
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand/60">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 text-cream backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                {TRIP_PAGE_COPY.bookingTitle}
              </p>
              {isBookedByCurrentUser ? (
                <span className="mt-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sand">
                  Already booked
                </span>
              ) : null}
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-sand/70">{TRIP_PAGE_COPY.pricePerPerson}</p>
                  <p className="mt-2 text-4xl font-semibold">{formatCurrency(discountedPrice)}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-2 text-sm text-sand/70 line-through">
                  {formatCurrency(tourData.price)}
                </span>
              </div>
              <button
                className="brand-button mt-8 w-full rounded-full"
                onClick={() => setShowBookingModal(true)}
              >
                {TRIP_PAGE_COPY.bookNow}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="surface-panel overflow-hidden dark:border-white/10 dark:bg-[#18211E]">
              <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="overflow-hidden rounded-[28px]">
                  <img
                    src={selectedPhoto || tourData?.photos?.[0]}
                    alt="Selected Tour"
                    className="h-[420px] w-full object-cover"
                  />
                </div>
                <div>
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                    {TRIP_PAGE_COPY.galleryLabel}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {tourData.photos.map((photo, index) => (
                      <button
                        key={index}
                        className={`overflow-hidden rounded-[22px] border transition ${
                          selectedPhoto === photo
                            ? "border-forest shadow-soft dark:border-sand"
                            : "border-sand-dark dark:border-white/10"
                        }`}
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <img
                          src={photo}
                          alt={`Tour ${index + 1}`}
                          className="h-28 w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                    Experience details
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-forest dark:text-cream">
                    {showPolicy ? TRIP_PAGE_COPY.policyTitle : TRIP_PAGE_COPY.itineraryTitle}
                  </h2>
                </div>
                <button
                  className="rounded-full border border-forest/15 bg-white px-4 py-2 text-sm font-semibold text-forest transition hover:bg-sand dark:border-white/10 dark:bg-white/5 dark:text-sand"
                  onClick={() => setShowPolicy((current) => !current)}
                >
                  {showPolicy ? TRIP_PAGE_COPY.showItinerary : TRIP_PAGE_COPY.showPolicy}
                </button>
              </div>

              {!showPolicy ? (
                <div className="space-y-8">
                  <div className="grid gap-3">
                    {itineraryItems.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex gap-4 rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-forest text-sand">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-7 text-slate dark:text-sand/70">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[28px] border border-sand-dark bg-warm-white p-6 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <FaHotel className="text-2xl text-clay" />
                      <div>
                        <h3 className="text-xl font-semibold text-forest dark:text-cream">
                          {TRIP_PAGE_COPY.hotelTitle}
                        </h3>
                        <p className="text-sm text-slate dark:text-sand/70">
                          {tourData.hotel.name}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-3 text-sm text-slate dark:text-sand/70">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={`hotel-star-${index}`}
                            className={index < tourData.hotel.rating ? "text-gold" : "text-sand-dark dark:text-white/20"}
                          />
                        ))}
                      </div>
                      <span>{tourData.hotel.rating} Stars</span>
                    </div>
                    <p className="mt-4 text-sm text-mist dark:text-sand/50">
                      {TRIP_PAGE_COPY.noFacilities}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-8 text-slate dark:text-sand/70">
                  {tourData.policy || TRIP_PAGE_COPY.noPolicy}
                </p>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                {TRIP_PAGE_COPY.hostedBy}
              </p>
              <div className="group relative mt-6">
                <div className="flex items-center gap-4 rounded-[24px] border border-sand-dark bg-sand/30 p-4 transition dark:border-white/10 dark:bg-white/5">
                  {tourData?.guideDetails?.picture ? (
                    <img
                      src={tourData.guideDetails.picture}
                      alt={hostName}
                      className="h-16 w-16 rounded-full object-cover ring-4 ring-sand"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3D6B5A,#2C4A3E)] text-lg font-semibold text-sand">
                      {getInitials(hostName)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-semibold text-forest dark:text-cream">{hostName}</h2>
                    <p className="mt-1 text-sm text-slate dark:text-sand/70">{hostLocation || "Location not listed"}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                      Hover to read guide intro
                    </p>
                  </div>
                </div>

                <div className="pointer-events-none absolute left-0 right-0 top-full z-10 mt-3 rounded-[24px] border border-sand-dark bg-warm-white p-5 opacity-0 shadow-soft transition duration-300 group-hover:opacity-100 dark:border-white/10 dark:bg-[#111916]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                    Guide description
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/70">
                    {tourData?.guideDetails?.aboutYourself || "This guide has not added a description yet."}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 border-t border-sand-dark pt-6 dark:border-white/10">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-mist">Booking status</span>
                  <span className="text-right font-medium text-forest dark:text-cream">
                    {isBookedByCurrentUser ? "Booked by you" : "Available to book"}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-mist">Booked travellers</span>
                  <span className="text-right font-medium text-forest dark:text-cream">
                    {bookedUsers.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <h3 className="text-2xl font-semibold text-forest dark:text-cream">
                Booked by
              </h3>
              {bookedUsers.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {bookedUsers.map((entry, index) => (
                    <div
                      key={`${entry.fullname}-${index}`}
                      className="rounded-[24px] border border-sand-dark bg-sand/30 p-4 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-forest dark:text-cream">
                          {entry.fullname}
                        </p>
                        <span className="text-xs uppercase tracking-[0.18em] text-mist dark:text-sand/55">
                          {entry.totalUnitsBooked} traveller{entry.totalUnitsBooked > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-8 text-slate dark:text-sand/70">
                  No one has booked this trip yet. Be the first traveller to confirm it.
                </p>
              )}
            </div>
          </aside>
        </section>
      </div>

      {showBookingModal && (
        <BookingModal onClose={() => setShowBookingModal(false)} tripData={tourData} />
      )}
    </div>
  );
};

export default TourPage;
