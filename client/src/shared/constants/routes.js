export const APP_ROUTES = {
  home: "/",
  about: "/about",
  blogs: "/blogs",
  localGuide: "/local-guide",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  search: "/search",
  payment: "/payment",
  tourPackage: "/tourPackage",
  profile: "/profile",
  myTrips: "/my-trips",
  callsAndMessages: "/calls-messages",
  settings: "/settings",
  accountOverview: "/settings",
};

export const getGuideEntryRoute = (isLoggedIn) =>
  isLoggedIn ? APP_ROUTES.dashboard : APP_ROUTES.localGuide;

export const getGuideDetailsRoute = (guideId) => `${APP_ROUTES.search}/${guideId}`;

export const getTripDetailsRoute = (tripId) => `${APP_ROUTES.search}/tour/${tripId}`;
