import React, { useEffect, useMemo, useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { IoCallSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { HiOutlineGlobeAlt, HiOutlineMapPin, HiOutlineUser } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { findGuide, scheduleGuideCall } from "../../../Apihandle/LocalGuide";
import ChatComponent from "../../../components/others/Chat";
import Testimonial from "../../../components/Testimonial/Testimonial";
import DarkModeToggle from "../../../components/others/DarkMode";
import apiClient from "../../../shared/api/client";
import { GUIDE_PAGE_COPY, GUIDE_TIME_SLOTS } from "../constants/content";
import { createLogger } from "../../../shared/lib/logger";
import { getErrorMessage } from "../../../shared/lib/error";
import { toastService } from "../../../shared/services/toast";
import { formatCurrency, getInitials } from "../../../shared/lib/format";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { TOAST_MESSAGES } from "../../../shared/constants/strings";
import StatePanel from "../../../shared/ui/StatePanel";

const guidePageLogger = createLogger("guide-page");

const GUIDE_DETAIL_FIELDS = [
  { key: "address", label: GUIDE_PAGE_COPY.addressLabel, icon: HiOutlineMapPin },
  { key: "native", label: GUIDE_PAGE_COPY.nativeLabel, icon: HiOutlineUser },
];

const GuidePage = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [guideData, setGuideData] = useState(null);
  const [isLoadingGuide, setIsLoadingGuide] = useState(true);
  const [guideLoadError, setGuideLoadError] = useState(null);
  const [showCallBooking, setShowCallBooking] = useState(false);
  const [showGuideBooking, setShowGuideBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guideStartDate, setGuideStartDate] = useState(null);
  const [guideEndDate, setGuideEndDate] = useState(null);
  const [guideBookingNotes, setGuideBookingNotes] = useState("");
  const { guideId } = useParams();
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    setIsOnline(Math.random() > 0.5);
  }, []);

  useEffect(() => {
    const getGuideData = async () => {
      try {
        setIsLoadingGuide(true);
        setGuideLoadError(null);
        const res = await apiClient.get(`${findGuide}/${guideId}`);
        guidePageLogger.debug("Guide details loaded", res.data.guide);
        setGuideData(res.data.guide);
      } catch (error) {
        guidePageLogger.error("Failed to load guide details", error);
        setGuideLoadError(getErrorMessage(error, "Unable to load guide details."));
      } finally {
        setIsLoadingGuide(false);
      }
    };

    getGuideData();
  }, [guideId]);

  const guideName = guideData?.userDetails?.fullname || GUIDE_PAGE_COPY.notProvided;
  const guideLocation = [guideData?.city, guideData?.country].filter(Boolean).join(", ");
  const guideLanguages = guideData?.languages?.join(", ") || GUIDE_PAGE_COPY.notProvided;
  const guideDailyRate = Number(guideData?.dailyRate || 0);
  const guideRating = useMemo(
    () => ({ filled: 3, total: 5, label: "(3/5)" }),
    []
  );
  const guideBookingDays = useMemo(() => {
    if (!guideStartDate || !guideEndDate) {
      return 0;
    }

    const normalizedStart = new Date(guideStartDate);
    const normalizedEnd = new Date(guideEndDate);
    normalizedStart.setHours(0, 0, 0, 0);
    normalizedEnd.setHours(0, 0, 0, 0);

    const totalDays = Math.floor((normalizedEnd - normalizedStart) / (24 * 60 * 60 * 1000)) + 1;
    return totalDays > 0 ? totalDays : 0;
  }, [guideEndDate, guideStartDate]);
  const guideBookingTotal = guideDailyRate * guideBookingDays;

  const closeCallModal = () => {
    setShowCallBooking(false);
    setSelectedSlot(null);
    setSelectedDate(null);
  };

  const closeGuideBookingModal = () => {
    setShowGuideBooking(false);
    setGuideStartDate(null);
    setGuideEndDate(null);
    setGuideBookingNotes("");
  };

  const ensureSignedIn = () => {
    if (!userData?._id) {
      toastService.warning(TOAST_MESSAGES.signInRequired);
      navigate(APP_ROUTES.login);
      return false;
    }

    return true;
  };

  const handleScheduleCall = async () => {
    if (!ensureSignedIn()) {
      return;
    }

    if (!selectedDate || !selectedSlot) {
      toastService.warning("Select a date and time slot to schedule the call.");
      return;
    }

    try {
      await apiClient.post(scheduleGuideCall, {
        guideId,
        bookedBy: userData._id,
        selectedDate,
        selectedSlot,
      });
      toastService.success(TOAST_MESSAGES.guideCallBooked);
      closeCallModal();
    } catch (error) {
      guidePageLogger.error("Guide call scheduling failed", error);
      toastService.error(getErrorMessage(error, "Unable to schedule the guide call."));
    }
  };

  const handleGuideBookingCheckout = () => {
    if (!ensureSignedIn()) {
      return;
    }

    if (!guideDailyRate) {
      toastService.warning("This guide has not set a daily booking rate yet.");
      return;
    }

    if (!guideStartDate || !guideEndDate) {
      toastService.warning("Select the start and end date for your guide booking.");
      return;
    }

    if (guideBookingDays < 1) {
      toastService.warning("End date must be the same day or after the start date.");
      return;
    }

    navigate(APP_ROUTES.payment, {
      state: {
        bookingType: "guide",
        guideData,
        guideBooking: {
          startDate: guideStartDate.toISOString(),
          endDate: guideEndDate.toISOString(),
          totalDays: guideBookingDays,
          dailyRate: guideDailyRate,
          totalPrice: guideBookingTotal,
          notes: guideBookingNotes.trim(),
        },
      },
    });
    closeGuideBookingModal();
  };

  const callBookingModal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm">
      <div className="surface-panel relative w-full max-w-2xl p-6 dark:border-white/10 dark:bg-[#18211E]">
        <button
          onClick={closeCallModal}
          className="absolute right-5 top-5 text-xl text-mist transition hover:text-ink dark:hover:text-cream"
        >
          ×
        </button>

        <div className="mb-8 max-w-lg">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            {GUIDE_PAGE_COPY.bookingTitle}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-forest dark:text-cream">
            {GUIDE_PAGE_COPY.bookingSubtitle}
          </h2>
        </div>

        <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
          <label className="mb-3 block text-sm font-semibold text-forest dark:text-sand">
            {GUIDE_PAGE_COPY.bookingTitle}
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
            className="w-full rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm font-medium text-ink outline-none dark:border-white/10 dark:bg-[#101714] dark:text-cream"
            placeholderText="Click to select a date"
          />
        </div>

        {selectedDate && (
          <div className="mt-6">
            <p className="mb-4 text-sm font-semibold text-forest dark:text-sand">
              {GUIDE_PAGE_COPY.slotsTitle}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {GUIDE_TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    selectedSlot === slot
                      ? "border-forest bg-forest text-sand"
                      : "border-sand-dark bg-white text-forest hover:bg-sand dark:border-white/10 dark:bg-[#101714] dark:text-sand dark:hover:bg-white/10"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSlot && (
          <div className="mt-6 flex flex-col gap-4 rounded-[24px] border border-sand-dark bg-warm-white p-5 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate dark:text-sand/70">
              {GUIDE_PAGE_COPY.selectedSlot}: <span className="font-semibold text-forest dark:text-cream">{selectedSlot}</span>
            </p>
            <button className="brand-button rounded-full px-5 py-3" onClick={handleScheduleCall}>
              {GUIDE_PAGE_COPY.confirmBooking}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const guideBookingModal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm">
      <div className="surface-panel relative w-full max-w-3xl p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
        <button
          onClick={closeGuideBookingModal}
          className="absolute right-5 top-5 text-xl text-mist transition hover:text-ink dark:hover:text-cream"
        >
          ×
        </button>

        <div className="mb-8 max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            Book this guide
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-forest dark:text-cream">
            Reserve local support by the day.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/70">
            Choose your travel dates and continue to the same secure Stripe checkout used for trip packages.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-5">
            <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
              <label className="block text-sm font-semibold text-forest dark:text-sand">
                Start date
              </label>
              <DatePicker
                selected={guideStartDate}
                onChange={(date) => setGuideStartDate(date)}
                minDate={new Date()}
                dateFormat="yyyy/MM/dd"
                className="mt-3 w-full rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm font-medium text-ink outline-none dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                placeholderText="Choose a start date"
              />
            </div>

            <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
              <label className="block text-sm font-semibold text-forest dark:text-sand">
                End date
              </label>
              <DatePicker
                selected={guideEndDate}
                onChange={(date) => setGuideEndDate(date)}
                minDate={guideStartDate || new Date()}
                dateFormat="yyyy/MM/dd"
                className="mt-3 w-full rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm font-medium text-ink outline-none dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                placeholderText="Choose an end date"
              />
            </div>

            <label className="grid gap-2 rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
              <span className="text-sm font-semibold text-forest dark:text-sand">Notes for the guide</span>
              <textarea
                rows={4}
                value={guideBookingNotes}
                onChange={(event) => setGuideBookingNotes(event.target.value)}
                className="rounded-2xl border border-sand-dark bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                placeholder="Share arrival context, group size, or the kind of help you need."
              />
            </label>
          </div>

          <aside className="rounded-[28px] border border-sand-dark bg-warm-white p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
              Booking summary
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-forest dark:text-cream">
              {guideName}
            </h3>

            <div className="mt-6 space-y-4 border-b border-sand-dark pb-6 dark:border-white/10">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate dark:text-sand/70">Daily rate</span>
                <span className="font-semibold text-forest dark:text-cream">
                  {guideDailyRate ? formatCurrency(guideDailyRate) : "Not available"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate dark:text-sand/70">Duration</span>
                <span className="font-semibold text-forest dark:text-cream">
                  {guideBookingDays || 0} day{guideBookingDays === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate dark:text-sand/70">Destination</span>
                <span className="text-right font-semibold text-forest dark:text-cream">
                  {guideLocation || GUIDE_PAGE_COPY.notProvided}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-lg font-semibold text-forest dark:text-cream">Total payable</span>
              <span className="text-2xl font-semibold text-forest dark:text-cream">
                {formatCurrency(guideBookingTotal)}
              </span>
            </div>

            <button
              className="brand-button mt-8 w-full rounded-full"
              onClick={handleGuideBookingCheckout}
              disabled={!guideDailyRate}
            >
              Continue to payment
            </button>
          </aside>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream pb-20 pt-28 text-ink dark:bg-charcoal dark:text-cream">
      <div className="section-shell">
        {isLoadingGuide ? (
          <StatePanel
            eyebrow="Guide profile"
            title="Loading local guide details"
            message="Pulling together availability, profile details, and booking options."
          />
        ) : guideLoadError ? (
          <StatePanel
            eyebrow="Guide profile"
            title="We could not load this guide"
            message={guideLoadError}
            actionLabel="Try again"
            onAction={() => window.location.reload()}
            variant="error"
          />
        ) : (
          <>
        <section className="relative overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(130deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-6 py-12 shadow-luxury sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.26),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(122,158,138,0.16),transparent_18%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="eyebrow-label">{GUIDE_PAGE_COPY.eyebrow}</span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-cream sm:text-5xl">
                {GUIDE_PAGE_COPY.heading}
              </h1>
            </div>
            <div className="self-start rounded-full border border-white/10 bg-white/10 p-2 backdrop-blur-md">
              <DarkModeToggle />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-panel overflow-hidden dark:border-white/10 dark:bg-[#18211E]">
            <div className="relative">
              {guideData?.picture || guideData?.userDetails?.avatar ? (
                <img
                  src={guideData?.picture || guideData?.userDetails?.avatar}
                  alt={guideName}
                  loading="lazy"
                  className="h-[420px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center bg-[linear-gradient(135deg,#3D6B5A,#2C4A3E)] text-6xl font-semibold text-sand">
                  {getInitials(guideName)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sand/70">
                    {guideLocation || GUIDE_PAGE_COPY.notProvided}
                  </p>
                  <h2 className="mt-2 text-4xl font-semibold text-cream">{guideName}</h2>
                </div>
                <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-forest">
                  {isOnline ? GUIDE_PAGE_COPY.online : GUIDE_PAGE_COPY.offline}
                </div>
              </div>
            </div>

            <div className="space-y-8 p-6 sm:p-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                  {GUIDE_PAGE_COPY.aboutTitle}
                </p>
                <p className="mt-4 text-sm leading-8 text-slate dark:text-sand/70">
                  {guideData?.aboutYourself || GUIDE_PAGE_COPY.guideFallback}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {GUIDE_DETAIL_FIELDS.map(({ key, label, icon: Icon }) => (
                  <div
                    key={key}
                    className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-center gap-3 text-sm font-semibold text-forest dark:text-sand">
                      <Icon className="text-clay" />
                      {label}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/70">
                      {guideData?.[key] || GUIDE_PAGE_COPY.notProvided}
                    </p>
                  </div>
                ))}

                <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-3 text-sm font-semibold text-forest dark:text-sand">
                    <HiOutlineGlobeAlt className="text-clay" />
                    {GUIDE_PAGE_COPY.languageLabel}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/70">{guideLanguages}</p>
                </div>

                <div className="rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-3 text-sm font-semibold text-forest dark:text-sand">
                    <FaStar className="text-gold" />
                    {GUIDE_PAGE_COPY.ratingLabel}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {[...Array(guideRating.total)].map((_, index) => (
                      <FaStar
                        key={`star-${index}`}
                        className={index < guideRating.filled ? "text-gold" : "text-sand-dark dark:text-white/20"}
                      />
                    ))}
                    <span className="ml-2 text-sm text-slate dark:text-sand/70">{guideRating.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                {GUIDE_PAGE_COPY.detailsTitle}
              </p>
              <div className="mt-6 space-y-5">
                <div className="flex justify-between gap-4 border-b border-sand-dark pb-4 dark:border-white/10">
                  <span className="text-sm text-mist">{GUIDE_PAGE_COPY.nameLabel}</span>
                  <span className="text-sm font-semibold text-forest dark:text-cream">{guideName}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-sand-dark pb-4 dark:border-white/10">
                  <span className="text-sm text-mist">{GUIDE_PAGE_COPY.statusLabel}</span>
                  <span className={`text-sm font-semibold ${isOnline ? "text-sage" : "text-terracotta"}`}>
                    {isOnline ? GUIDE_PAGE_COPY.online : GUIDE_PAGE_COPY.offline}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-sand-dark pb-4 dark:border-white/10">
                  <span className="text-sm text-mist">{GUIDE_PAGE_COPY.addressLabel}</span>
                  <span className="text-right text-sm font-semibold text-forest dark:text-cream">
                    {guideData?.address || GUIDE_PAGE_COPY.notProvided}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-sand-dark pb-4 dark:border-white/10">
                  <span className="text-sm text-mist">Per day charge</span>
                  <span className="text-right text-sm font-semibold text-forest dark:text-cream">
                    {guideDailyRate ? formatCurrency(guideDailyRate) : "Not available"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-mist">{GUIDE_PAGE_COPY.languageLabel}</span>
                  <span className="text-right text-sm font-semibold text-forest dark:text-cream">
                    {guideLanguages}
                  </span>
                </div>
              </div>
            </div>

            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                Connect
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-forest dark:text-cream">
                Ask questions before you book.
              </h3>
              <p className="mt-4 text-sm leading-8 text-slate dark:text-sand/70">
                Reach out for local recommendations, trip suggestions, or quick planning help.
              </p>

              <div className="mt-8 grid gap-3">
                <button
                  className="brand-button rounded-full"
                  onClick={() => {
                    if (!ensureSignedIn()) {
                      return;
                    }

                    setShowGuideBooking(true);
                  }}
                >
                  Book this guide
                </button>
                <button
                  className="brand-button-secondary rounded-full dark:border-white/10 dark:bg-white/5 dark:text-sand"
                  onClick={() => {
                    if (!ensureSignedIn()) {
                      return;
                    }

                    setShowCallBooking(true);
                  }}
                >
                  <IoCallSharp className="mr-2 inline" />
                  {GUIDE_PAGE_COPY.bookCall}
                </button>
                <button
                  className="brand-button-secondary rounded-full dark:border-white/10 dark:bg-white/5 dark:text-sand"
                  onClick={() => {
                    if (!ensureSignedIn()) {
                      return;
                    }

                    setChatStarted(true);
                  }}
                >
                  <FiMessageSquare className="mr-2 inline" />
                  {GUIDE_PAGE_COPY.chat}
                </button>
              </div>
            </div>
          </aside>
        </section>
          </>
        )}
      </div>

      {!isLoadingGuide && !guideLoadError && showCallBooking && callBookingModal}
      {!isLoadingGuide && !guideLoadError && showGuideBooking && guideBookingModal}
      {chatStarted && (
        <ChatComponent
          darkMode={isDarkMode}
          guideId={guideId}
          guideData={guideData}
          setChatStarted={setChatStarted}
          userId={userData?._id}
        />
      )}

      <Testimonial />
    </div>
  );
};

export default GuidePage;
