import React, { useEffect, useMemo, useState } from "react";
import { FaSuitcaseRolling, FaUserCircle } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight, HiOutlineIdentification, HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BookedTripsByUser } from "../Apihandle/Trips";
import { guideBookingsByUser, guideContactHistory } from "../Apihandle/LocalGuide";
import apiClient from "../shared/api/client";
import { APP_ROUTES } from "../shared/constants/routes";
import { getErrorMessage } from "../shared/lib/error";
import { formatDate, getInitials } from "../shared/lib/format";
import StatePanel from "../shared/ui/StatePanel";

const Profile = () => {
  const userData = useSelector((state) => state.auth.userData);
  const guideData = useSelector((state) => state.Guide.userData);
  const [bookingCount, setBookingCount] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);
  const [callCount, setCallCount] = useState(0);
  const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(true);
  const [snapshotError, setSnapshotError] = useState(null);

  const loadAccountSnapshot = async () => {
    if (!userData?._id) {
      return;
    }

    try {
      setIsLoadingSnapshot(true);
      setSnapshotError(null);
      const [{ data: bookingsData }, { data: guideBookingsData }, { data: historyData }] = await Promise.all([
        apiClient.get(`${BookedTripsByUser}/${userData._id}`),
        apiClient.get(`${guideBookingsByUser}/${userData._id}`),
        apiClient.get(`${guideContactHistory}/${userData._id}`),
      ]);

      setBookingCount((bookingsData.bookings?.length || 0) + (guideBookingsData.bookings?.length || 0));
      setConversationCount(historyData.history?.conversations?.length || 0);
      setCallCount(historyData.history?.calls?.length || 0);
    } catch (error) {
      setBookingCount(0);
      setConversationCount(0);
      setCallCount(0);
      setSnapshotError(getErrorMessage(error, "Unable to load your account activity right now."));
    } finally {
      setIsLoadingSnapshot(false);
    }
  };

  useEffect(() => {
    loadAccountSnapshot();
  }, [userData?._id]);

  const stats = useMemo(
    () => [
      { label: "Trips booked", value: bookingCount, icon: FaSuitcaseRolling },
      { label: "Messages started", value: conversationCount, icon: HiOutlineChatBubbleLeftRight },
      { label: "Guide calls", value: callCount, icon: HiOutlinePhone },
    ],
    [bookingCount, callCount, conversationCount]
  );

  if (!userData?._id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 text-ink dark:bg-charcoal dark:text-cream">
      <div className="section-shell grid gap-10">
        <section className="overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(130deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury sm:px-12 sm:py-14">
          <span className="eyebrow-label">My profile</span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            A clear view of your account, trip activity, and guide connections.
          </h1>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
            <div className="flex flex-col items-center text-center">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.fullname}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-sand"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3D6B5A,#2C4A3E)] text-3xl font-semibold text-sand">
                  {getInitials(userData.fullname)}
                </div>
              )}
              <h2 className="mt-5 text-3xl font-semibold text-forest dark:text-cream">
                {userData.fullname}
              </h2>
              <p className="mt-2 text-sm text-slate dark:text-sand/70">{userData.email}</p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3 text-sm font-semibold text-forest dark:text-sand">
                  <FaUserCircle />
                  Full name
                </div>
                <p className="mt-3 text-sm text-slate dark:text-sand/70">{userData.fullname}</p>
              </div>
              <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3 text-sm font-semibold text-forest dark:text-sand">
                  <HiOutlineIdentification />
                  Username
                </div>
                <p className="mt-3 text-sm text-slate dark:text-sand/70">
                  {userData.username || "Not available"}
                </p>
              </div>
              <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3 text-sm font-semibold text-forest dark:text-sand">
                  <HiOutlineMapPin />
                  Account mode
                </div>
                <p className="mt-3 text-sm text-slate dark:text-sand/70">
                  {guideData ? "Traveler and guide" : "Traveler"}
                </p>
              </div>
              <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3 text-sm font-semibold text-forest dark:text-sand">
                  <HiOutlineIdentification />
                  Joined
                </div>
                <p className="mt-3 text-sm text-slate dark:text-sand/70">{formatDate(userData.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {stats.map(({ label, value, icon: Icon }) => (
                <article
                  key={label}
                  className="surface-panel p-6 text-center dark:border-white/10 dark:bg-[#18211E]"
                >
                  <Icon className="mx-auto text-4xl text-gold" />
                  <h3 className="mt-5 text-3xl font-semibold text-forest dark:text-cream">
                    {isLoadingSnapshot ? "..." : value}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/72">{label}</p>
                </article>
              ))}
            </div>

            {snapshotError ? (
              <StatePanel
                compact
                eyebrow="Account activity"
                title="Some activity details are unavailable"
                message={snapshotError}
                actionLabel="Refresh activity"
                onAction={loadAccountSnapshot}
                variant="error"
              />
            ) : null}

            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                Quick access
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Link to={APP_ROUTES.myTrips} className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 transition hover:bg-sand dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                  <h3 className="text-lg font-semibold text-forest dark:text-cream">Trips Booked</h3>
                  <p className="mt-2 text-sm leading-7 text-slate dark:text-sand/70">
                    Review all confirmed packages and traveler details.
                  </p>
                </Link>
                <Link to={APP_ROUTES.callsAndMessages} className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 transition hover:bg-sand dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                  <h3 className="text-lg font-semibold text-forest dark:text-cream">Calls & Messages</h3>
                  <p className="mt-2 text-sm leading-7 text-slate dark:text-sand/70">
                    Continue guide conversations and review scheduled calls.
                  </p>
                </Link>
                <Link to={APP_ROUTES.settings} className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 transition hover:bg-sand dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                  <h3 className="text-lg font-semibold text-forest dark:text-cream">Settings</h3>
                  <p className="mt-2 text-sm leading-7 text-slate dark:text-sand/70">
                    Adjust preferences, theme, and notification choices.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
