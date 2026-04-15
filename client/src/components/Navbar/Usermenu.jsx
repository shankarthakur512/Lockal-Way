import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../Redux/authslice";
import { removeGuide } from "../../Redux/GuideSlice";
import { persistor } from "../../Redux/store";
import { APP_ROUTES } from "../../shared/constants/routes";
import { NAV_STRINGS } from "../../shared/constants/strings";

const UserMenu = ({ onItemClick }) => {
  const dispatch = useDispatch();
  const guideData = useSelector((state) => state.Guide.userData);

  const menuLinks = [
    { label: NAV_STRINGS.profile, to: APP_ROUTES.profile },
    {
      label: NAV_STRINGS.bookedTrips,to: APP_ROUTES.myTrips,
    },
    { label: NAV_STRINGS.callAndMessages, to: APP_ROUTES.callsAndMessages },
    { label: NAV_STRINGS.AccountSettings, to: APP_ROUTES.accountOverview },
  ];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeGuide());
    persistor.purge();
    onItemClick?.();
  };

  return (
    <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-sand-dark bg-warm-white p-2 shadow-soft dark:border-white/10 dark:bg-[#102520]">
      <div className="py-1">
        {menuLinks.map((link) => (
          <Link
            key={link.to + link.label}
            to={link.to}
            onClick={onItemClick}
            className="block rounded-2xl px-4 py-3 text-sm text-slate transition hover:bg-sand hover:text-forest dark:text-sand/70 dark:hover:bg-white/10 dark:hover:text-cream"
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          data-testid="navbar-logout"
          className="mt-1 block w-full rounded-2xl border border-sand-dark px-4 py-3 text-left text-sm text-terracotta transition hover:bg-sand dark:border-white/10 dark:hover:bg-white/10"
        >
          {NAV_STRINGS.logout}
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
