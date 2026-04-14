import React, { useEffect, useMemo, useRef, useState } from "react";
import Logo from "../../assets/lokalway-logo.svg";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import ResponsiveMenu from "./ResponsiveMenu";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { useSelector } from "react-redux";
import UserMenu from "./Usermenu";
import QueryModal from "./QueryModel";
import DarkModeToggle from "../others/DarkMode";
import { APP_STRINGS, NAV_STRINGS } from "../../shared/constants/strings";
import { APP_ROUTES, getGuideEntryRoute } from "../../shared/constants/routes";
import { createLogger } from "../../shared/lib/logger";

//for the logging purpose
const navLogger = createLogger("navbar");

export const getNavbarLinks = (isLoggedIn) => [
  { name: NAV_STRINGS.home, link: APP_ROUTES.home },
  { name: NAV_STRINGS.about, link: APP_ROUTES.about },
  { name: NAV_STRINGS.blogs, link: APP_ROUTES.blogs },
  {
    name: NAV_STRINGS.guideHome,
    link: getGuideEntryRoute(isLoggedIn),
  },
];

const DropdownLinks = [
  { name: "Featured Trips", link: "/#services" },
  { name: "Popular Picks", link: "/#mobile_brands" },
  { name: "Explore by Region", link: "/#location" },
];

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);

  const status = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const guideData = useSelector((state) => state.Guide.userData);
  const pathname = location.pathname;
  const isAuthPage = pathname === APP_ROUTES.login || pathname === APP_ROUTES.signup;
  const isGuideWorkspace =
    pathname === APP_ROUTES.dashboard || pathname === APP_ROUTES.tourPackage;
  const showQuickLinks = !isGuideWorkspace;
  const showQueryAction = !isGuideWorkspace && !isAuthPage;
  const navbarLinks = useMemo(() => getNavbarLinks(Boolean(status)), [status]);

  useEffect(() => {
    if (!showUserMenu) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (!userMenuRef.current?.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showUserMenu]);

  useEffect(() => {
    setShowUserMenu(false);
  }, [pathname]);

  const primaryAction = useMemo(() => {
    if (isGuideWorkspace) {
      if (pathname === APP_ROUTES.dashboard && guideData) {
        return {
          label: NAV_STRINGS.createPackage,
          link: APP_ROUTES.tourPackage,
          style: "primary",
        };
      }

      if (pathname === APP_ROUTES.tourPackage) {
        return {
          label: NAV_STRINGS.guideDashboard,
          link: APP_ROUTES.dashboard,
          style: "secondary",
        };
      }

      return null;
    }

    if (isAuthPage) {
      return null;
    }

    if (!status) {
      return {
        label: NAV_STRINGS.signIn,
        link: APP_ROUTES.login,
        style: "secondary",
      };
    }

    if (guideData) {
      return {
        label: NAV_STRINGS.guideDashboard,
        link: APP_ROUTES.dashboard,
        style: "primary",
      };
    }

    return null;
  }, [guideData, isAuthPage, isGuideWorkspace, pathname, status]);

  navLogger.debug("render", { status, userData, guideData, pathname });

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-sand-dark/60 bg-warm-white/90 px-5 py-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-[#102520]/90">
          <Link
            to={APP_ROUTES.home}
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-3"
          >
            <img src={Logo} alt={APP_STRINGS.brandName} className="h-10 w-auto sm:h-12" />
            <div className="hidden sm:block">
              <p className="text-[11px] uppercase tracking-[0.24em] text-mist dark:text-sand/55">
                {isGuideWorkspace ? NAV_STRINGS.workspaceLabel : APP_STRINGS.tagline}
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navbarLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.link}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? "text-forest dark:text-cream" : "text-slate hover:text-forest dark:text-sand/70 dark:hover:text-cream"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {showQuickLinks && (
              <div className="group relative">
                <button className="flex items-center gap-2 text-sm font-medium text-slate transition hover:text-forest dark:text-sand/70 dark:hover:text-cream">
                  {NAV_STRINGS.quickLinks}
                  <FaCaretDown className="text-xs transition duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute left-1/2 top-full hidden w-52 -translate-x-1/2 pt-4 group-hover:block">
                  <div className="surface-panel overflow-hidden rounded-3xl border border-sand-dark bg-warm-white p-3 dark:border-white/10 dark:bg-[#18211E]">
                    {DropdownLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.link}
                        className="block rounded-2xl px-4 py-3 text-sm text-slate transition hover:bg-sand hover:text-forest dark:text-sand/70 dark:hover:bg-white/10 dark:hover:text-cream"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <DarkModeToggle />
            </div>

            {showQueryAction && (
              <button
                className="brand-button hidden sm:inline-flex"
                onClick={() => setShowQueryModal(true)}
              >
                {NAV_STRINGS.askQuery}
              </button>
            )}

            {!status ? (
              primaryAction ? (
                <Link
                  to={primaryAction.link}
                  className={primaryAction.style === "primary" ? "brand-button rounded-full" : "brand-button-secondary rounded-full dark:border-white/10 dark:bg-white/5 dark:text-sand"}
                >
                  {primaryAction.label}
                </Link>
              ) : null
            ) : (
              <>
                {primaryAction ? (
                  <Link
                    to={primaryAction.link}
                    className={primaryAction.style === "primary" ? "brand-button hidden md:inline-flex rounded-full" : "brand-button-secondary hidden md:inline-flex rounded-full dark:border-white/10 dark:bg-white/5 dark:text-sand"}
                  >
                    {primaryAction.label}
                  </Link>
                ) : null}
                <div ref={userMenuRef} className="relative">
                  <button
                    className="flex items-center gap-2 rounded-full border border-sand-dark bg-white px-2 py-2 shadow-sm dark:border-white/10 dark:bg-white/5"
                    onClick={() => setShowUserMenu((current) => !current)}
                    aria-label={NAV_STRINGS.accountMenu}
                  >
                    <img
                      src={userData?.avatar || "/default-avatar.png"}
                      alt="User Avatar"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <span className="hidden pr-2 text-sm font-medium text-forest dark:text-cream md:block">
                      {userData?.fullname?.split(" ")[0] || "Traveler"}
                    </span>
                  </button>
                  {showUserMenu && <UserMenu onItemClick={() => setShowUserMenu(false)} />}
                </div>
              </>
            )}

            <div className="lg:hidden">
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-dark bg-white text-forest shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-sand"
                onClick={() => setShowMenu((current) => !current)}
                aria-label={showMenu ? NAV_STRINGS.closeMenu : NAV_STRINGS.openMenu}
              >
                {showMenu ? <HiMenuAlt1 size={22} /> : <HiMenuAlt3 size={22} />}
              </button>
            </div>
          </div>
        </div>

        <ResponsiveMenu
          setShowMenu={setShowMenu}
          showMenu={showMenu}
          openQueryModal={() => setShowQueryModal(true)}
          primaryAction={primaryAction}
          showQueryAction={showQueryAction}
          isGuideWorkspace={isGuideWorkspace}
          navbarLinks={navbarLinks}
        />
      </nav>

      {showQueryModal && <QueryModal setShowQueryModal={setShowQueryModal} />}
    </>
  );
};

export default Navbar;
