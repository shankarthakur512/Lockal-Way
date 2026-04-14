import React, { useEffect, useState } from "react";
import { HiOutlineBellAlert, HiOutlineMoon, HiOutlineShieldCheck } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../shared/constants/routes";
import { disableDarkMode, enableDarkMode } from "../Redux/Darkmode";

const SETTINGS_STORAGE_KEY = "lokalway-account-settings";

const DEFAULT_SETTINGS = {
  tripReminders: true,
  marketingEmails: false,
  shareProfile: true,
  preferredContact: "messages",
};

const SettingToggle = ({ title, description, enabled, onToggle }) => (
  <div className="flex items-start justify-between gap-4 rounded-[24px] border border-sand-dark bg-sand/35 p-5 dark:border-white/10 dark:bg-white/5">
    <div>
      <h3 className="text-lg font-semibold text-forest dark:text-cream">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate dark:text-sand/70">{description}</p>
    </div>
    <button
      type="button"
      onClick={onToggle}
      className={`relative h-8 w-14 rounded-full transition ${
        enabled ? "bg-forest" : "bg-sand-dark dark:bg-white/10"
      }`}
      aria-pressed={enabled}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
          enabled ? "left-7" : "left-1"
        }`}
      />
    </button>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!storedSettings) {
      return DEFAULT_SETTINGS;
    }

    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) };
    } catch (error) {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    if (!userData?._id) {
      navigate(APP_ROUTES.login);
    }
  }, [navigate, userData?._id]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  if (!userData?._id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 text-ink dark:bg-charcoal dark:text-cream">
      <div className="section-shell grid gap-10">
        <section className="overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(130deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury sm:px-12 sm:py-14">
          <span className="eyebrow-label">Account settings</span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            Manage how Lockal Way reaches you and how your workspace feels.
          </h1>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="space-y-6">
            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-clay">
                <HiOutlineShieldCheck className="text-lg" />
                Privacy
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">
                Your preferences stay on this device.
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate dark:text-sand/70">
                Until a full account-settings API is added, these controls save locally so your browsing and communication preferences still persist.
              </p>
            </div>

            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-clay">
                <HiOutlineMoon className="text-lg" />
                Theme
              </div>
              <div className="mt-5 flex items-center justify-between rounded-[24px] border border-sand-dark bg-sand/35 p-5 dark:border-white/10 dark:bg-white/5">
                <div>
                  <h3 className="text-lg font-semibold text-forest dark:text-cream">Dark mode</h3>
                  <p className="mt-2 text-sm text-slate dark:text-sand/70">
                    Match the guide pages and dashboard with a darker palette.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(isDarkMode ? disableDarkMode() : enableDarkMode())}
                  className={`relative h-8 w-14 rounded-full transition ${
                    isDarkMode ? "bg-forest" : "bg-sand-dark dark:bg-white/10"
                  }`}
                  aria-pressed={isDarkMode}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                      isDarkMode ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-clay">
                <HiOutlineBellAlert className="text-lg" />
                Notifications
              </div>
              <div className="mt-6 space-y-4">
                <SettingToggle
                  title="Trip reminders"
                  description="Get reminded about booked departures, itinerary timing, and pre-trip tasks."
                  enabled={settings.tripReminders}
                  onToggle={() =>
                    setSettings((current) => ({
                      ...current,
                      tripReminders: !current.tripReminders,
                    }))
                  }
                />
                <SettingToggle
                  title="Promotional emails"
                  description="Receive destination highlights, seasonal trip ideas, and featured guide recommendations."
                  enabled={settings.marketingEmails}
                  onToggle={() =>
                    setSettings((current) => ({
                      ...current,
                      marketingEmails: !current.marketingEmails,
                    }))
                  }
                />
                <SettingToggle
                  title="Profile discoverability"
                  description="Allow guides to recognize your profile details faster when you contact them."
                  enabled={settings.shareProfile}
                  onToggle={() =>
                    setSettings((current) => ({
                      ...current,
                      shareProfile: !current.shareProfile,
                    }))
                  }
                />
              </div>
            </div>

            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">
                Preferred contact
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["messages", "calls", "either"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setSettings((current) => ({
                        ...current,
                        preferredContact: option,
                      }))
                    }
                    className={`rounded-[24px] border px-4 py-4 text-sm font-semibold capitalize transition ${
                      settings.preferredContact === option
                        ? "border-forest bg-forest text-sand"
                        : "border-sand-dark bg-sand/35 text-forest hover:bg-sand dark:border-white/10 dark:bg-white/5 dark:text-sand dark:hover:bg-white/10"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate dark:text-sand/70">
                This helps us keep your workspace organized around the way you usually plan with guides.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
