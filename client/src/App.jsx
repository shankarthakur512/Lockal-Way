import React, { Suspense } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "./app/ScrollToTop.jsx";
import { GuestRoute, ProtectedRoute } from "./app/RouteGuards.jsx";
import AppBootScreen from "./app/AppBootScreen.jsx";

const Home = React.lazy(() => import("./pages/Home"));
const Blogs = React.lazy(() => import("./pages/Blogs"));
const NoPage = React.lazy(() => import("./pages/NoPage"));
const About = React.lazy(() => import("./pages/About"));
const Localguide = React.lazy(() => import("./pages/Localguide"));
const BlogsDetails = React.lazy(() => import("./pages/BlogsDetails"));
const GuidePage = React.lazy(() => import("./features/guides/pages/GuidePage.jsx"));
const GuideDashboard = React.lazy(() => import("./components/DashBoard/GuideDashboard"));
const TourPackageCreation = React.lazy(() => import("./features/trips/components/TourPackageCreation"));
const AuthForm = React.lazy(() => import("./features/auth/components/AuthForm"));
const Search = React.lazy(() => import("./features/search/pages/SearchPage"));
const TourPage = React.lazy(() => import("./features/trips/pages/TourPage.jsx"));
const PaymentPage = React.lazy(() => import("./features/trips/pages/PaymentCheckoutPage.jsx"));
const SignUp = React.lazy(() => import("./features/auth/components/SignUpPage.jsx"));
const Profile = React.lazy(() => import("./pages/Profile.jsx"));
const BookedTrips = React.lazy(() => import("./pages/BookedTrips.jsx"));
const Chats = React.lazy(() => import("./pages/Chats.jsx"));
const Settings = React.lazy(() => import("./pages/Settings.jsx"));

const App = () => {
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 900,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<AppBootScreen />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:id" element={<BlogsDetails />} />
            <Route path="local-guide" element={<Localguide />} />
            <Route path="about" element={<About />} />
            <Route path="search" element ={<Search />} />
            <Route path="search/:guideId" element={<GuidePage />} />
            <Route path="search/tour/:TripId" element={<TourPage />} />

            <Route element={<GuestRoute />}>
              <Route path="signup" element={<SignUp />} />
              <Route path="login" element={<AuthForm />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<GuideDashboard />} />
              <Route path="tourPackage" element={<TourPackageCreation />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="my-trips" element={<BookedTrips />} />
              <Route path="calls-messages" element={<Chats />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
