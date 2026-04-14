import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaFacebook, FaGoogle, FaInstagramSquare, FaTwitter } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "../../../firebase/firebaseconf";
import { CheckUser, googleAuthUser, loginUser, registerUser } from "../../../Apihandle/user";
import { login } from "../../../Redux/authslice";
import { APP_ROUTES } from "../../../shared/constants/routes";
import apiClient from "../../../shared/api/client";
import { createLogger } from "../../../shared/lib/logger";
import { getErrorMessage } from "../../../shared/lib/error";
import { toastService } from "../../../shared/services/toast";
import {
  APP_STRINGS,
  AUTH_PAGE_COPY,
  AUTH_QUOTES,
  AUTH_STRINGS,
} from "../constants/authStrings";

const authPageLogger = createLogger("auth-page");

const AuthPage = ({ mode = "login" }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = mode === "signup";
  const redirectPath = location.state?.from || APP_ROUTES.home;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % AUTH_QUOTES.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const pageCopy = useMemo(
    () => ({
      title: isSignup ? AUTH_PAGE_COPY.signupTitle : AUTH_PAGE_COPY.loginTitle,
      body: isSignup ? AUTH_PAGE_COPY.signupBody : AUTH_PAGE_COPY.loginBody,
      switchLabel: isSignup ? AUTH_PAGE_COPY.switchToLogin : AUTH_PAGE_COPY.switchToSignup,
      switchLink: isSignup ? APP_ROUTES.login : APP_ROUTES.signup,
      switchText: isSignup ? AUTH_STRINGS.signInTitle : AUTH_STRINGS.signUpTitle,
      submitLabel: isSignup ? AUTH_STRINGS.signUpTitle : AUTH_STRINGS.signInTitle,
    }),
    [isSignup]
  );

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatar(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { data } = await apiClient.post(loginUser, { email, password });
      const loggedInUser = data.data.user;
      dispatch(login({ userData: loggedInUser, accessToken: data.data.accessToken }));
      navigate(redirectPath, { replace: true });
    } catch (error) {
      authPageLogger.error("Login failed", error);
      toastService.error(getErrorMessage(error, AUTH_STRINGS.loginFailed));
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toastService.error(AUTH_STRINGS.passwordsMismatch);
      return;
    }

    try {
      const { data } = await apiClient.post(CheckUser, { email });
      if (data.success) {
        toastService.error(AUTH_STRINGS.emailAlreadyExists);
        navigate(APP_ROUTES.login);
        return;
      }

      const formData = new FormData();
      if (avatar) {
        formData.append("avatar", avatar);
      }
      formData.append("email", email);
      formData.append("password", password);
      formData.append("fullname", fullname);
      formData.append("username", username);

      const response = await apiClient.post(registerUser, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.user) {
        dispatch(login({ userData: response.data.user, accessToken: response.data.accessToken }));
        navigate(redirectPath, { replace: true });
      } else {
        toastService.error(AUTH_STRINGS.signupFailed);
      }
    } catch (error) {
      authPageLogger.error("Sign up failed", error);
      toastService.error(getErrorMessage(error, AUTH_STRINGS.genericAuthError));
    }
  };

  const handleGoogleAuth = async (event) => {
    event.preventDefault();

    if (!isFirebaseConfigured || !firebaseAuth) {
      toastService.error(AUTH_STRINGS.googleSigninUnavailable);
      return;
    }

    if (isGoogleLoading) {
      return;
    }

    try {
      setIsGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(firebaseAuth, provider);
      const { user } = result;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleEmail = user.email;
      const googleAccessToken = credential?.accessToken || "";
      const googleIdToken = credential?.idToken || "";

      if (!googleEmail) {
        toastService.error(AUTH_STRINGS.genericAuthError);
        return;
      }

      const { data } = await apiClient.post(googleAuthUser, {
        idToken: googleIdToken,
        accessToken: googleAccessToken,
        email: googleEmail,
        fullname: user.displayName || "",
        avatar: user.photoURL || "",
      });

      dispatch(login({ userData: data.user, accessToken: data.accessToken }));
      navigate(redirectPath, { replace: true });
    } catch (error) {
      authPageLogger.error("Google auth failed", error);
      toastService.error(getErrorMessage(error, AUTH_STRINGS.genericAuthError));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 dark:bg-charcoal">
      <div className="section-shell">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(130deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury sm:px-12 sm:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.26),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(122,158,138,0.16),transparent_18%)]" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div>
                <span className="eyebrow-label">{APP_STRINGS.brandName}</span>
                <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-cream sm:text-5xl">
                  {pageCopy.title}
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-8 text-sand/80 sm:text-base">
                  {pageCopy.body}
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Travel note
                </p>
                <p className="mt-4 text-lg leading-8 text-cream">
                  {AUTH_QUOTES[currentQuoteIndex]}
                </p>
              </div>
            </div>
          </div>

          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(APP_ROUTES.login)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  !isSignup
                    ? "bg-forest text-sand"
                    : "bg-sand text-forest dark:bg-white/5 dark:text-sand"
                }`}
              >
                {AUTH_STRINGS.signInTitle}
              </button>
              <button
                type="button"
                onClick={() => navigate(APP_ROUTES.signup)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isSignup
                    ? "bg-forest text-sand"
                    : "bg-sand text-forest dark:bg-white/5 dark:text-sand"
                }`}
              >
                {AUTH_STRINGS.signUpTitle}
              </button>
            </div>

            <form
              onSubmit={isSignup ? handleSignUp : handleLogin}
              className="grid gap-4"
            >
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate dark:text-sand">
                  {AUTH_PAGE_COPY.emailLabel}
                </span>
                <input
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                />
              </label>

              {isSignup && (
                <>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate dark:text-sand">
                      {AUTH_PAGE_COPY.fullNameLabel}
                    </span>
                    <input
                      type="text"
                      value={fullname}
                      placeholder="Your full name"
                      onChange={(event) => setFullname(event.target.value)}
                      className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate dark:text-sand">
                      {AUTH_PAGE_COPY.usernameLabel}
                    </span>
                    <input
                      type="text"
                      value={username}
                      placeholder="Choose a username"
                      onChange={(event) => setUsername(event.target.value)}
                      className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                    />
                  </label>
                </>
              )}

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate dark:text-sand">
                  {AUTH_PAGE_COPY.passwordLabel}
                </span>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(event) => setPassword(event.target.value)}
                  className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                />
              </label>

              {isSignup && (
                <>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate dark:text-sand">
                      {AUTH_PAGE_COPY.confirmPasswordLabel}
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      placeholder="Confirm your password"
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate dark:text-sand">
                      {AUTH_PAGE_COPY.avatarLabel}
                    </span>
                    <input
                      type="file"
                      onChange={handleAvatarChange}
                      className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                    />
                  </label>

                  {avatarPreview && (
                    <div className="mt-2">
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="h-16 w-16 rounded-full object-cover ring-4 ring-sand"
                      />
                    </div>
                  )}
                </>
              )}

              <button type="submit" className="brand-button mt-2 w-full rounded-full py-4">
                {pageCopy.submitLabel}
              </button>
            </form>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">
                {AUTH_PAGE_COPY.socialLabel}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={isGoogleLoading || !isFirebaseConfigured}
                  className="brand-button-secondary w-full justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-sand"
                  onClick={handleGoogleAuth}
                >
                  <FaGoogle />
                  {isGoogleLoading
                    ? "Connecting..."
                    : !isFirebaseConfigured
                      ? "Google sign-in unavailable"
                      : AUTH_PAGE_COPY.continueWithGoogle}
                </button>
                <div className="flex items-center justify-center gap-5 rounded-full border border-sand-dark bg-sand px-5 py-4 text-forest dark:border-white/10 dark:bg-white/5 dark:text-sand">
                  <FaFacebook className="text-lg" />
                  <FaInstagramSquare className="text-lg" />
                  <FaTwitter className="text-lg" />
                </div>
              </div>
              {!isFirebaseConfigured && (
                <p className="mt-3 text-sm text-mist dark:text-sand/55">
                  {AUTH_STRINGS.googleSigninUnavailable}
                </p>
              )}
            </div>

            <p className="mt-8 text-sm text-mist dark:text-sand/55">
              {pageCopy.switchLabel}{" "}
              <Link to={pageCopy.switchLink} className="font-semibold text-forest underline underline-offset-4 dark:text-cream">
                {pageCopy.switchText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
