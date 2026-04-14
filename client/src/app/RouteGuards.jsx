import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { APP_ROUTES } from "../shared/constants/routes";

const getAuthenticatedLandingRoute = (userData, guideData) => {
  if (userData?.role === "guide" || guideData?._id) {
    return APP_ROUTES.dashboard;
  }

  return APP_ROUTES.profile;
};

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.status);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export const GuestRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const guideData = useSelector((state) => state.Guide.userData);
  const location = useLocation();

  if (isAuthenticated) {
    const fallbackPath =
      location.state?.from || getAuthenticatedLandingRoute(userData, guideData);

    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};
