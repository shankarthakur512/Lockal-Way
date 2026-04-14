import React from "react";
import { FaCompass } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DarkModeToggle from "../others/DarkMode";
import { NAV_STRINGS } from "../../shared/constants/strings";

const ResponsiveMenu = ({
  showMenu,
  setShowMenu,
  openQueryModal,
  primaryAction,
  showQueryAction,
  isGuideWorkspace,
  navbarLinks,
}) => {
  const userData = useSelector((state) => state.auth.userData) || { fullname: "Traveler" };
  const isLoggedIn = useSelector((state) => state.auth.status);

  return (
    <div
      className={`fixed inset-0 z-40 transition ${
        showMenu ? "pointer-events-auto bg-ink/35" : "pointer-events-none bg-transparent"
      }`}
    >
      <div
        className={`h-full w-[84%] max-w-sm transform bg-warm-white p-6 shadow-luxury transition duration-300 dark:bg-[#102520] ${
          showMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-sand">
            <FaCompass />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-forest dark:text-cream">{userData.fullname}</h1>
            <p className="text-sm text-mist dark:text-sand/55">
              {isGuideWorkspace ? NAV_STRINGS.workspaceLabel : NAV_STRINGS.premiumUser}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <DarkModeToggle />
        </div>

        <nav className="space-y-2">
          {navbarLinks.map((data) => (
            <Link
              key={data.name}
              to={data.link}
              onClick={() => setShowMenu(false)}
              className="block rounded-2xl px-4 py-3 text-base font-medium text-slate transition hover:bg-sand hover:text-forest dark:text-sand/70 dark:hover:bg-white/10 dark:hover:text-cream"
            >
              {data.name}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          {primaryAction ? (
            <Link
              to={primaryAction.link}
              className={
                primaryAction.style === "primary"
                  ? "brand-button w-full justify-center rounded-full"
                  : "brand-button-secondary w-full justify-center rounded-full dark:border-white/10 dark:bg-white/5 dark:text-sand"
              }
              onClick={() => setShowMenu(false)}
            >
              {primaryAction.label}
            </Link>
          ) : null}
          {showQueryAction ? (
            <button
              className="brand-button-secondary w-full justify-center rounded-full dark:border-white/10 dark:bg-white/5 dark:text-sand"
              onClick={() => {
                setShowMenu(false);
                openQueryModal();
              }}
            >
              {NAV_STRINGS.askQuery}
            </button>
          ) : null}
          {!isLoggedIn && (
            <p className="pt-2 text-center text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">
              {NAV_STRINGS.browseLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
