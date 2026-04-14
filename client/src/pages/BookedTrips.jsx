import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { guideBookingsByUser } from "../Apihandle/LocalGuide";
import { BookedTripsByUser } from "../Apihandle/Trips";
import apiClient from "../shared/api/client";
import { getGuideDetailsRoute } from "../shared/constants/routes";
import { getErrorMessage } from "../shared/lib/error";
import { formatCurrency, formatDate, getInitials } from "../shared/lib/format";
import StatePanel from "../shared/ui/StatePanel";

const BookedTrips = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [tripBookings, setTripBookings] = useState([]);
  const [guideBookings, setGuideBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadBookings = async () => {
    if (!userData?._id) {
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);

      const [{ data: tripData }, { data: guideData }] = await Promise.all([
        apiClient.get(`${BookedTripsByUser}/${userData._id}`),
        apiClient.get(`${guideBookingsByUser}/${userData._id}`),
      ]);

      setTripBookings(tripData.bookings || []);
      setGuideBookings(guideData.bookings || []);
    } catch (error) {
      setTripBookings([]);
      setGuideBookings([]);
      setLoadError(getErrorMessage(error, "Unable to load your bookings right now."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [userData?._id]);

  const totals = useMemo(
    () => ({
      bookings: tripBookings.length + guideBookings.length,
      travellers: tripBookings.reduce((count, booking) => count + Number(booking.totalUnitsBooked || 0), 0),
      spend:
        tripBookings.reduce((amount, booking) => amount + Number(booking.totalPrice || 0), 0) +
        guideBookings.reduce((amount, booking) => amount + Number(booking.totalPrice || 0), 0),
    }),
    [guideBookings, tripBookings]
  );

  if (!userData?._id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 text-ink dark:bg-charcoal dark:text-cream">
      <div className="section-shell grid gap-10">
        <section className="overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(130deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury sm:px-12 sm:py-14">
          <span className="eyebrow-label">Bookings</span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            Every confirmed trip package and private guide reservation in one place.
          </h1>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E]">
            <p className="text-xs uppercase tracking-[0.22em] text-clay">Total bookings</p>
            <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">{totals.bookings}</h2>
          </article>
          <article className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E]">
            <p className="text-xs uppercase tracking-[0.22em] text-clay">Trip travellers</p>
            <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">{totals.travellers}</h2>
          </article>
          <article className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E]">
            <p className="text-xs uppercase tracking-[0.22em] text-clay">Total paid</p>
            <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">
              {formatCurrency(totals.spend)}
            </h2>
          </article>
        </section>

        {isLoading ? (
          <StatePanel
            eyebrow="Booking history"
            title="Loading your bookings"
            message="Pulling together your trip packages and guide reservations."
          />
        ) : loadError ? (
          <StatePanel
            eyebrow="Booking history"
            title="We could not load your bookings"
            message={loadError}
            actionLabel="Try again"
            onAction={loadBookings}
            variant="error"
          />
        ) : tripBookings.length === 0 && guideBookings.length === 0 ? (
          <StatePanel
            eyebrow="Booking history"
            title="No bookings yet"
            message="Once you complete payment for a trip or guide, it will show up here."
          />
        ) : (
          <div className="grid gap-10">
            <section className="grid gap-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                    Tour packages
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-forest dark:text-cream">
                    Confirmed trip bookings
                  </h2>
                </div>
                <span className="text-sm text-mist">{tripBookings.length} booking(s)</span>
              </div>

              {tripBookings.length === 0 ? (
                <div className="surface-panel p-8 dark:border-white/10 dark:bg-[#18211E]">
                  <p className="text-sm text-slate dark:text-sand/70">
                    No package bookings yet.
                  </p>
                </div>
              ) : (
                tripBookings.map((booking) => {
                  const guideName = booking.guide?.userDetails?.fullName || "Local guide";

                  return (
                    <article
                      key={booking._id}
                      className="surface-panel grid gap-6 p-6 dark:border-white/10 dark:bg-[#18211E] lg:grid-cols-[0.32fr_0.68fr]"
                    >
                      <div className="overflow-hidden rounded-[28px]">
                        {booking.trip?.photos?.[0] ? (
                          <img
                            src={booking.trip.photos[0]}
                            alt={booking.trip?.tripName}
                            className="h-full min-h-[220px] w-full object-cover"
                          />
                        ) : (
                          <div className="flex min-h-[220px] items-center justify-center bg-[linear-gradient(135deg,#3D6B5A,#2C4A3E)] text-4xl font-semibold text-sand">
                            {getInitials(booking.trip?.tripName || "Trip")}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                              {booking.trip?.location}
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold text-forest dark:text-cream">
                              {booking.trip?.tripName}
                            </h2>
                          </div>
                          <span className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-forest dark:bg-white/10 dark:text-sand">
                            {booking.status}
                          </span>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-2xl bg-sand/55 px-4 py-4 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">Booking ref</p>
                            <p className="mt-2 text-sm font-medium text-forest dark:text-cream">{booking.bookingReference}</p>
                          </div>
                          <div className="rounded-2xl bg-sand/55 px-4 py-4 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">Travellers</p>
                            <p className="mt-2 text-sm font-medium text-forest dark:text-cream">{booking.totalUnitsBooked}</p>
                          </div>
                          <div className="rounded-2xl bg-sand/55 px-4 py-4 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">Paid</p>
                            <p className="mt-2 text-sm font-medium text-forest dark:text-cream">{formatCurrency(booking.totalPrice)}</p>
                          </div>
                          <div className="rounded-2xl bg-sand/55 px-4 py-4 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">Start date</p>
                            <p className="mt-2 text-sm font-medium text-forest dark:text-cream">{formatDate(booking.trip?.startingDate)}</p>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 xl:grid-cols-[0.68fr_0.32fr]">
                          <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                            <p className="text-sm font-semibold text-forest dark:text-cream">Booked travellers</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {booking.travellers.map((traveller, index) => (
                                <span
                                  key={`${traveller.name}-${index}`}
                                  className="rounded-full border border-forest/10 bg-white px-3 py-2 text-xs font-medium text-forest dark:border-white/10 dark:bg-white/10 dark:text-sand"
                                >
                                  {traveller.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                            <p className="text-sm font-semibold text-forest dark:text-cream">Guide contact</p>
                            <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/70">{guideName}</p>
                            {booking.guide?._id ? (
                              <Link
                                to={getGuideDetailsRoute(booking.guide._id)}
                                className="brand-button mt-5 rounded-full"
                              >
                                Open guide
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </section>

            <section className="grid gap-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                    Private guide hire
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-forest dark:text-cream">
                    Confirmed guide reservations
                  </h2>
                </div>
                <span className="text-sm text-mist">{guideBookings.length} booking(s)</span>
              </div>

              {guideBookings.length === 0 ? (
                <div className="surface-panel p-8 dark:border-white/10 dark:bg-[#18211E]">
                  <p className="text-sm text-slate dark:text-sand/70">
                    No guide-only bookings yet.
                  </p>
                </div>
              ) : (
                guideBookings.map((booking) => {
                  const guideName = booking.guide?.userDetails?.fullname || "Local guide";
                  const guideLocation = [booking.guide?.city, booking.guide?.country].filter(Boolean).join(", ");

                  return (
                    <article
                      key={booking._id}
                      className="surface-panel grid gap-6 p-6 dark:border-white/10 dark:bg-[#18211E] lg:grid-cols-[0.28fr_0.72fr]"
                    >
                      <div className="overflow-hidden rounded-[28px]">
                        {booking.guide?.picture || booking.guide?.userDetails?.avatar ? (
                          <img
                            src={booking.guide?.picture || booking.guide?.userDetails?.avatar}
                            alt={guideName}
                            className="h-full min-h-[220px] w-full object-cover"
                          />
                        ) : (
                          <div className="flex min-h-[220px] items-center justify-center bg-[linear-gradient(135deg,#3D6B5A,#2C4A3E)] text-4xl font-semibold text-sand">
                            {getInitials(guideName)}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                              {guideLocation || "Local guide"}
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold text-forest dark:text-cream">
                              {guideName}
                            </h2>
                          </div>
                          <span className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-forest dark:bg-white/10 dark:text-sand">
                            {booking.status}
                          </span>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-2xl bg-sand/55 px-4 py-4 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">Booking ref</p>
                            <p className="mt-2 text-sm font-medium text-forest dark:text-cream">{booking.bookingReference}</p>
                          </div>
                          <div className="rounded-2xl bg-sand/55 px-4 py-4 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">Duration</p>
                            <p className="mt-2 text-sm font-medium text-forest dark:text-cream">
                              {booking.totalDays} day{booking.totalDays === 1 ? "" : "s"}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-sand/55 px-4 py-4 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">Daily rate</p>
                            <p className="mt-2 text-sm font-medium text-forest dark:text-cream">
                              {formatCurrency(booking.dailyRate)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-sand/55 px-4 py-4 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">Paid</p>
                            <p className="mt-2 text-sm font-medium text-forest dark:text-cream">
                              {formatCurrency(booking.totalPrice)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 xl:grid-cols-[0.68fr_0.32fr]">
                          <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                            <p className="text-sm font-semibold text-forest dark:text-cream">Booking window</p>
                            <div className="mt-3 space-y-2 text-sm text-slate dark:text-sand/70">
                              <p><strong>Start:</strong> {formatDate(booking.startDate)}</p>
                              <p><strong>End:</strong> {formatDate(booking.endDate)}</p>
                              {booking.notes ? <p><strong>Notes:</strong> {booking.notes}</p> : null}
                            </div>
                          </div>

                          <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                            <p className="text-sm font-semibold text-forest dark:text-cream">Guide contact</p>
                            <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/70">{guideName}</p>
                            {booking.guide?._id ? (
                              <Link
                                to={getGuideDetailsRoute(booking.guide._id)}
                                className="brand-button mt-5 rounded-full"
                              >
                                Open guide
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedTrips;
