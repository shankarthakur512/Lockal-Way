import React, { useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaMapMarkerAlt, FaUserCheck, FaUserEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Verification from "./GuideVerification";
import CompleteProfile from "./CompleteProfile.jsx";
import TripDashboard from "./TripDashboard.jsx";
import RecentComponent from "./RecentComponent.jsx";
import Guidelines from "../Guidlines/Guideline.jsx";
import Address from "../localGuide/Address.jsx";
import { findGuideByUserId, guideDashboard, registerGuide } from "../../Apihandle/LocalGuide.js";
import { addGuide } from "../../Redux/GuideSlice.js";
import apiClient from "../../shared/api/client";
import { APP_ROUTES } from "../../shared/constants/routes";
import { TOAST_MESSAGES } from "../../shared/constants/strings";
import { getErrorMessage } from "../../shared/lib/error";
import { formatCurrency, formatDate } from "../../shared/lib/format";
import { createLogger } from "../../shared/lib/logger";
import { toastService } from "../../shared/services/toast";
import {
  GUIDE_DASHBOARD_COPY,
  GUIDE_ONBOARDING_STEPS,
} from "../../features/guides/constants/dashboardContent";

ChartJS.register(ArcElement, Tooltip, Legend);

const dashboardLogger = createLogger("guide-dashboard");

const GuideDashboard = () => {
  const [verification, setVerification] = useState(false);
  const [profileComp, setProfileComp] = useState(false);
  const [verifyAddress, setVerifyAddress] = useState(false);
  const [guideProfileDraft, setGuideProfileDraft] = useState(null);
  const [guideAddress, setGuideAddress] = useState(null);
  const [guideIdentity, setGuideIdentity] = useState(null);
  const [guideRegistered, setGuideRegistered] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      packagesPublished: 0,
      travelerConversations: 0,
      estimatedEarnings: 0,
      confirmedCalls: 0,
      totalTripBookings: 0,
    },
    chart: {
      labels: ["Calls", "Chats", "Trip bookings"],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ["#C4603B", "#3D6B5A", "#D4A24C"],
          borderWidth: 0,
        },
      ],
    },
    activities: [],
    calls: {
      upcoming: [],
      past: [],
    },
  });

  const userData = useSelector((state) => state.auth.userData);
  const guideUserData = useSelector((state) => state.Guide.userData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate(APP_ROUTES.login);
    }
  }, [navigate, userData]);

  useEffect(() => {
    if (!userData || guideUserData) {
      if (guideUserData) {
        setGuideRegistered(true);
      }
      return;
    }

    const fetchGuide = async () => {
      try {
        const { data } = await apiClient.post(findGuideByUserId, { user: userData._id });

        if (data.success && data.guide) {
          dispatch(addGuide({ userData: data.guide }));
          setGuideRegistered(true);
        }
      } catch (error) {
        dashboardLogger.warn("Unable to fetch guide profile", error);
      }
    };

    fetchGuide();
  }, [dispatch, guideUserData, userData]);

  useEffect(() => {
    if (!guideAddress || !guideProfileDraft || !guideIdentity || !userData || guideRegistered) {
      return;
    }

    const registerNewGuide = async () => {
      try {
        const formData = new FormData();
        formData.append("user", userData._id);
        formData.append("address", guideAddress.street);
        formData.append("city", guideAddress.city);
        formData.append("country", guideAddress.country);
        formData.append("aboutYourself", guideProfileDraft.aboutYourself);
        formData.append("native", guideProfileDraft.placeBelonging);
        formData.append("mobileNo", guideIdentity.mobile);
        formData.append("email", guideIdentity.email);
        formData.append("Govt_ID", guideIdentity.aadhaar);
        formData.append("languages", guideProfileDraft.Languages);
        formData.append("dailyRate", guideProfileDraft.dailyRate);

        if (guideProfileDraft.Photo) {
          formData.append("Photo", guideProfileDraft.Photo);
        }

        const { data } = await apiClient.post(registerGuide, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        dispatch(addGuide({ userData: data.guide }));
        setGuideRegistered(true);
        toastService.success(TOAST_MESSAGES.guideRegistered);
      } catch (error) {
        dashboardLogger.error("Guide registration failed", error);
        toastService.error(getErrorMessage(error, TOAST_MESSAGES.genericError));
      }
    };

    registerNewGuide();
  }, [dispatch, guideAddress, guideIdentity, guideProfileDraft, guideRegistered, userData]);

  useEffect(() => {
    if (!guideRegistered || !guideUserData?._id) {
      return;
    }

    const loadDashboard = async () => {
      try {
        const { data } = await apiClient.get(`${guideDashboard}/${guideUserData._id}`);
        if (data.dashboard) {
          setDashboardData(data.dashboard);
        }
      } catch (error) {
        dashboardLogger.error("Failed to load guide dashboard analytics", error);
      }
    };

    loadDashboard();
  }, [guideRegistered, guideUserData?._id]);

  const statCards = useMemo(
    () => [
      {
        label: "Packages published",
        value: dashboardData.stats.packagesPublished,
      },
      {
        label: "Traveler conversations",
        value: dashboardData.stats.travelerConversations,
      },
      {
        label: "Estimated earnings",
        value: formatCurrency(dashboardData.stats.estimatedEarnings),
      },
    ],
    [dashboardData.stats]
  );

  const checklistItems = useMemo(
    () =>
      GUIDE_ONBOARDING_STEPS.map((step) => {
        const isComplete =
          (step.key === "verification" && Boolean(guideIdentity || guideRegistered)) ||
          (step.key === "profile" && Boolean(guideProfileDraft || guideRegistered)) ||
          (step.key === "address" && Boolean(guideAddress || guideRegistered));

        return {
          ...step,
          isComplete,
        };
      }),
    [guideAddress, guideIdentity, guideProfileDraft, guideRegistered]
  );

  const renderFlow = () => {
    if (verifyAddress) {
      return <Address setVerifyAddress={setVerifyAddress} setGuideAddress={setGuideAddress} />;
    }

    if (verification) {
      return (
        <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
          <Verification setVerification={setVerification} setGuideInfo={setGuideIdentity} />
        </div>
      );
    }

    if (profileComp) {
      return (
        <div className="surface-panel p-4 dark:border-white/10 dark:bg-[#18211E] sm:p-6">
          <CompleteProfile setProfileComp={setProfileComp} setGuideData={setGuideProfileDraft} />
        </div>
      );
    }

    return (
      <div className="grid gap-8">
        <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(135deg,#1A3530_0%,#2C4A3E_48%,#3D6B5A_100%)] px-8 py-10 shadow-luxury">
            <div className="relative">
              <span className="eyebrow-label">{GUIDE_DASHBOARD_COPY.eyebrow}</span>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-cream sm:text-5xl">
                  Welcome back, {userData?.fullname?.split(" ")[0] || "Guide"}.
                </h1>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-sand">
                  {guideRegistered
                    ? GUIDE_DASHBOARD_COPY.completionReady
                    : GUIDE_DASHBOARD_COPY.completionPending}
                </span>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-sand/80 sm:text-base">
                {GUIDE_DASHBOARD_COPY.heroBody}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-md"
                  >
                    <p className="text-[11px] uppercase tracking-[0.2em] text-sand/60">
                      {card.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-cream">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
            <h2 className="text-2xl font-semibold text-forest dark:text-cream">
              {GUIDE_DASHBOARD_COPY.checklistHeading}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/75">
              {GUIDE_DASHBOARD_COPY.checklistBody}
            </p>

            <div className="mt-6 grid gap-4">
              {checklistItems.map((item) => {
                const iconClassName = item.isComplete
                  ? "text-gold"
                  : "text-forest dark:text-sand";

                const actionHandler =
                  item.key === "verification"
                    ? () => setVerification(true)
                    : item.key === "profile"
                      ? () => setProfileComp(true)
                      : () => setVerifyAddress(true);

                const Icon =
                  item.key === "verification"
                    ? FaUserCheck
                    : item.key === "profile"
                      ? FaUserEdit
                      : FaMapMarkerAlt;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={actionHandler}
                    className="flex w-full items-start gap-4 rounded-[24px] border border-sand-dark/70 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-[#101714]"
                  >
                    <div className="mt-1 rounded-2xl bg-sand/70 p-3 dark:bg-white/5">
                      <Icon className={`text-xl ${iconClassName}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest dark:text-cream">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate dark:text-sand/75">
                        {item.isComplete
                          ? item.completeDescription
                          : item.pendingDescription}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {guideRegistered && (
          <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <h2 className="text-2xl font-semibold text-forest dark:text-cream">
                {GUIDE_DASHBOARD_COPY.analyticsHeading}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/75">
                {GUIDE_DASHBOARD_COPY.analyticsBody}
              </p>
              <div className="mt-8">
                <Doughnut data={dashboardData.chart} />
              </div>
            </div>

            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <h2 className="text-2xl font-semibold text-forest dark:text-cream">
                Recent activity
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/75">
                Keep an eye on new actions as your guide presence grows.
              </p>
              <div className="mt-6">
                <RecentComponent activities={dashboardData.activities} />
              </div>
            </div>
          </section>
        )}

        <section className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
          <div className="flex flex-col gap-4 border-b border-sand-dark/70 pb-6 dark:border-white/10 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-forest dark:text-cream">
                {GUIDE_DASHBOARD_COPY.activityHeading}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate dark:text-sand/75">
                {GUIDE_DASHBOARD_COPY.activityBody}
              </p>
            </div>
            {!guideRegistered && (
              <button onClick={() => setVerification(true)} className="brand-button">
                Finish onboarding
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-sand">
              {GUIDE_DASHBOARD_COPY.upcomingCalls}
            </span>
            <span className="rounded-full border border-sand-dark px-4 py-2 text-sm font-semibold text-forest dark:border-white/10 dark:text-sand">
              {GUIDE_DASHBOARD_COPY.pastCalls}
            </span>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[28px] border border-sand-dark bg-sand/40 p-5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-lg font-semibold text-forest dark:text-cream">
                {GUIDE_DASHBOARD_COPY.upcomingCalls}
              </h3>
              <div className="mt-4 space-y-3">
                {dashboardData.calls.upcoming.length > 0 ? (
                  dashboardData.calls.upcoming.map((call) => (
                    <article
                      key={call._id}
                      className="rounded-[24px] border border-sand-dark/70 bg-white p-4 text-sm dark:border-white/10 dark:bg-[#101714]"
                    >
                      <p className="font-semibold text-forest dark:text-cream">
                        {call.traveler?.fullname || "Traveler"}
                      </p>
                      <p className="mt-1 text-slate dark:text-sand/70">
                        {formatDate(call.travelDate)} at {call.timeSlot}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-sand-dark bg-white/60 px-4 py-5 text-sm text-slate dark:border-white/10 dark:bg-white/5 dark:text-sand/75">
                    {guideRegistered ? GUIDE_DASHBOARD_COPY.callsEmpty : GUIDE_DASHBOARD_COPY.callsLocked}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-sand-dark bg-sand/40 p-5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-lg font-semibold text-forest dark:text-cream">
                {GUIDE_DASHBOARD_COPY.pastCalls}
              </h3>
              <div className="mt-4 space-y-3">
                {dashboardData.calls.past.length > 0 ? (
                  dashboardData.calls.past.map((call) => (
                    <article
                      key={call._id}
                      className="rounded-[24px] border border-sand-dark/70 bg-white p-4 text-sm dark:border-white/10 dark:bg-[#101714]"
                    >
                      <p className="font-semibold text-forest dark:text-cream">
                        {call.traveler?.fullname || "Traveler"}
                      </p>
                      <p className="mt-1 text-slate dark:text-sand/70">
                        {formatDate(call.travelDate)} at {call.timeSlot}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-sand-dark bg-white/60 px-4 py-5 text-sm text-slate dark:border-white/10 dark:bg-white/5 dark:text-sand/75">
                    No completed or past guide calls yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <TripDashboard
          guideRegistered={guideRegistered}
          onTripsChanged={() => {
            if (!guideUserData?._id) {
              return;
            }

            apiClient
              .get(`${guideDashboard}/${guideUserData._id}`)
              .then(({ data }) => {
                if (data.dashboard) {
                  setDashboardData(data.dashboard);
                }
              })
              .catch((error) => {
                dashboardLogger.error("Failed to refresh guide dashboard analytics", error);
              });
          }}
        />

        <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
            <h2 className="text-2xl font-semibold text-forest dark:text-cream">
              {GUIDE_DASHBOARD_COPY.reviewsHeading}
            </h2>
            <div className="mt-6 flex min-h-52 items-center justify-center rounded-[28px] border border-dashed border-sand-dark bg-sand/40 px-6 text-center text-sm text-slate dark:border-white/10 dark:bg-white/5 dark:text-sand/75">
              {GUIDE_DASHBOARD_COPY.reviewsEmpty}
            </div>
          </div>

          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
            <h2 className="text-2xl font-semibold text-forest dark:text-cream">
              Hosting guidelines
            </h2>
            <div className="mt-6">
              <Guidelines />
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 dark:bg-charcoal">
      <div className="section-shell">{renderFlow()}</div>
    </div>
  );
};

export default GuideDashboard;
