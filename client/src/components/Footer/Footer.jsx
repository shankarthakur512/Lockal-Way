import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

import FooterLogo from "../../assets/lokalway-logo.svg";
import { APP_ROUTES, getGuideEntryRoute } from "../../shared/constants/routes";
import { APP_STRINGS, NAV_STRINGS } from "../../shared/constants/strings";

const getDefaultFooterColumns = (isLoggedIn) => ({
  Discover: [
    { title: NAV_STRINGS.home, link: APP_ROUTES.home },
    { title: NAV_STRINGS.about, link: APP_ROUTES.about },
    { title: NAV_STRINGS.blogs, link: APP_ROUTES.blogs },
    { title: NAV_STRINGS.guideHome, link: getGuideEntryRoute(isLoggedIn) },
  ],
  Plan: [
    { title: "Curated Trips", link: APP_ROUTES.home },
    { title: "Booking Flow", link: APP_ROUTES.search },
    { title: "Traveler Support", link: APP_ROUTES.about },
    { title: "Flexible Dates", link: APP_ROUTES.home },
  ],
  Host: [
    { title: NAV_STRINGS.guideHome, link: getGuideEntryRoute(isLoggedIn) },
    { title: NAV_STRINGS.guideDashboard, link: APP_ROUTES.dashboard },
    { title: NAV_STRINGS.createPackage, link: APP_ROUTES.tourPackage },
    { title: "Payments", link: APP_ROUTES.payment },
  ],
});

const workspaceLinks = [
  { title: NAV_STRINGS.backHome, link: APP_ROUTES.home },
  { title: NAV_STRINGS.guideDashboard, link: APP_ROUTES.dashboard },
  { title: NAV_STRINGS.createPackage, link: APP_ROUTES.tourPackage },
];

const Footer = () => {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => Boolean(state.auth.status));
  const pathname = location.pathname;
  const isGuideWorkspace =
    pathname === APP_ROUTES.dashboard || pathname === APP_ROUTES.tourPackage;
  const isAuthPage = pathname === APP_ROUTES.login || pathname === APP_ROUTES.signup;
  const defaultFooterColumns = getDefaultFooterColumns(isLoggedIn);

  if (isGuideWorkspace || isAuthPage) {
    return (
      <footer className="mt-12 border-t border-sand-dark/70 bg-[linear-gradient(180deg,#17332C_0%,#102520_100%)] text-sand dark:border-white/10">
        <div className="section-shell flex flex-col gap-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-cream">
              {isGuideWorkspace ? NAV_STRINGS.workspaceLabel : APP_STRINGS.brandName}
            </p>
            <p className="mt-1 text-sand/60">
              {isGuideWorkspace
                ? "Keep your guide tools close while you manage packages and onboarding."
                : "Thoughtful travel starts with a calmer, clearer sign-in experience."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {(isGuideWorkspace ? workspaceLinks : defaultFooterColumns.Discover).map((link) => (
              <Link
                key={link.title}
                to={link.link}
                onClick={() => window.scrollTo(0, 0)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-12 bg-[linear-gradient(180deg,#17332C_0%,#102520_100%)] text-sand">
      <div className="section-shell py-16 sm:py-20">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-4">
              <img src={FooterLogo} alt={APP_STRINGS.brandName} className="h-14 w-auto sm:h-16" />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-sand/55">
                  {APP_STRINGS.tagline}
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-8 text-sand/72">
              Trusted local guides, thoughtful itineraries, and warm design for travelers who want their trip to feel effortless from the first click.
            </p>

            <div className="mt-8 space-y-4 text-sm text-sand/78">
              <div className="flex items-center gap-3">
                <FaLocationArrow className="text-clay" />
                <p>Madhubani, Bihar</p>
              </div>
              <div className="flex items-center gap-3">
                <FaMobileAlt className="text-clay" />
                <p>+91 123456789</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {Object.entries(defaultFooterColumns).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="text-lg font-semibold text-cream">{heading}</h3>
                <ul className="mt-5 space-y-4 text-sm text-sand/72">
                  {links.map((link) => (
                    <li key={link.title}>
                      <Link
                        to={link.link}
                        onClick={() => window.scrollTo(0, 0)}
                        className="transition hover:text-cream"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-sand/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {APP_STRINGS.brandNameAlt}. {APP_STRINGS.copyright}</p>
          <p>Crafted for travelers who want beauty, clarity, and confidence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
