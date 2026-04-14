import React, { useEffect } from "react";
import { FaPlusCircle, FaStopCircle, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FindTripsByLocalGuide, UpdateTripStatus } from "../../Apihandle/Trips";
import { setTrips, updateTrip } from "../../Redux/Tripslice";
import { GUIDE_TRIP_DASHBOARD_COPY } from "../../features/guides/constants/dashboardContent";
import apiClient from "../../shared/api/client";
import { APP_ROUTES } from "../../shared/constants/routes";
import { getErrorMessage } from "../../shared/lib/error";
import { createLogger } from "../../shared/lib/logger";
import { toastService } from "../../shared/services/toast";

const tripDashboardLogger = createLogger("trip-dashboard");

function TripDashboard({ guideRegistered, onTripsChanged }) {
  const guideData = useSelector((state) => state.Guide?.userData);
  const trips = useSelector((state) => state.Trips.trips);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!guideData) {
      return;
    }

    const fetchTrips = async () => {
      try {
        const { data } = await apiClient.get(`${FindTripsByLocalGuide}/${guideData._id}`);
        dispatch(setTrips({ trips: data.trips || [] }));
      } catch (error) {
        tripDashboardLogger.error("Failed to load trips", error);
        toastService.error(
          getErrorMessage(error, GUIDE_TRIP_DASHBOARD_COPY.fetchTripsError)
        );
      }
    };

    fetchTrips();
  }, [dispatch, guideData]);

  const handleCreateTrip = () => {
    if (!guideRegistered) {
      toastService.warning(GUIDE_TRIP_DASHBOARD_COPY.disabledTripCreation);
      return;
    }

    navigate(APP_ROUTES.tourPackage);
  };

  const handleStatusToggle = async (trip) => {
    const nextStatus = trip.status === "Paused" ? "Upcoming" : "Paused";

    try {
      const { data } = await apiClient.patch(`${UpdateTripStatus}/${trip._id || trip.id}/status`, {
        status: nextStatus,
      });
      dispatch(updateTrip({ trip: data.trip }));
      onTripsChanged?.();
      toastService.success(`Trip status updated to ${nextStatus}.`);
    } catch (error) {
      tripDashboardLogger.error("Failed to update trip status", error);
      toastService.error(getErrorMessage(error, "Unable to update the trip status right now."));
    }
  };

  const handleCancelTrip = async (trip) => {
    try {
      const { data } = await apiClient.patch(`${UpdateTripStatus}/${trip._id || trip.id}/status`, {
        status: "Cancelled",
      });
      dispatch(updateTrip({ trip: data.trip }));
      onTripsChanged?.();
      toastService.success("Trip cancelled successfully.");
    } catch (error) {
      tripDashboardLogger.error("Failed to cancel trip", error);
      toastService.error(getErrorMessage(error, "Unable to cancel the trip right now."));
    }
  };

  if (trips.length === 0) {
    return (
      <div className="surface-panel p-8 dark:border-white/10 dark:bg-[#18211E]">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow-label">Trip publishing</span>
          <h2 className="mt-5 text-3xl font-semibold text-forest dark:text-cream">
            {GUIDE_TRIP_DASHBOARD_COPY.emptyHeading}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate dark:text-sand/75">
            {GUIDE_TRIP_DASHBOARD_COPY.emptyBody}
          </p>
          <button onClick={handleCreateTrip} className="brand-button mt-8 gap-2">
            <FaPlusCircle />
            {GUIDE_TRIP_DASHBOARD_COPY.createFirstTrip}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
      <div className="flex flex-col gap-4 border-b border-sand-dark/70 pb-6 dark:border-white/10 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-forest dark:text-cream">
            {GUIDE_TRIP_DASHBOARD_COPY.manageTripsHeading}
          </h2>
          <p className="mt-2 text-sm text-slate dark:text-sand/75">
            Manage your active package lineup from one place.
          </p>
        </div>
        <button onClick={handleCreateTrip} className="brand-button gap-2">
          <FaPlusCircle />
          {GUIDE_TRIP_DASHBOARD_COPY.createNewTrip}
        </button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {trips.map((trip) => (
          <article
            key={trip._id || trip.id}
            className="rounded-[28px] border border-sand-dark/70 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#101714]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                  {trip.type || "Custom trip"}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-forest dark:text-cream">
                  {trip.tripName || "Untitled trip"}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/75">
                  {trip.description || GUIDE_TRIP_DASHBOARD_COPY.tripDetailsFallback}
                </p>
              </div>
              <div className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-forest dark:bg-white/10 dark:text-sand">
                {trip.duration
                  ? `${trip.duration} ${GUIDE_TRIP_DASHBOARD_COPY.durationSuffix}`
                  : "Flexible duration"}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-sand/55 px-4 py-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">
                  Hotel
                </p>
                <p className="mt-2 text-sm font-medium text-forest dark:text-cream">
                  {trip.name || trip.hotel || GUIDE_TRIP_DASHBOARD_COPY.hotelFallback}
                </p>
              </div>
              <div className="rounded-2xl bg-sand/55 px-4 py-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">
                  Price
                </p>
                <p className="mt-2 text-sm font-medium text-forest dark:text-cream">
                  {trip.price ? `$${trip.price}` : "Not added"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-full bg-sand px-4 py-2 text-center text-sm font-semibold text-forest dark:bg-white/10 dark:text-sand">
              {trip.status || "Upcoming"}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => handleCancelTrip(trip)}
                disabled={trip.status === "Cancelled"}
                className="brand-button-secondary gap-2 rounded-full dark:border-white/10 dark:bg-white/5 dark:text-sand"
              >
                <FaTrashAlt />
                {GUIDE_TRIP_DASHBOARD_COPY.cancelButton}
              </button>
              <button
                onClick={() => handleStatusToggle(trip)}
                disabled={trip.status === "Cancelled" || trip.status === "Completed"}
                className="brand-button-secondary gap-2 rounded-full dark:border-white/10 dark:bg-white/5 dark:text-sand"
              >
                <FaStopCircle />
                {trip.status === "Paused" ? "Resume bookings" : GUIDE_TRIP_DASHBOARD_COPY.statusButton}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default TripDashboard;
