const runtimeConfig =
  typeof window !== "undefined" && window.__LOKALWAY_CONFIG__
    ? window.__LOKALWAY_CONFIG__
    : {};

const readConfig = (key, fallback = "") => {
  const runtimeValue = runtimeConfig[key];

  if (runtimeValue !== undefined && runtimeValue !== "") {
    return runtimeValue;
  }

  const buildValue = import.meta.env[key];

  if (buildValue !== undefined && buildValue !== "") {
    return buildValue;
  }

  return fallback;
};

const normalizeBaseUrl = (value) => {
  if (!value || value === "/") {
    return "";
  }

  return value.replace(/\/+$/, "");
};

export const ENV_CONFIG = {
  apiBaseUrl: normalizeBaseUrl(readConfig("VITE_API_BASE_URL", "")),
  stripePublishableKey: readConfig("VITE_STRIPE_PUBLISHABLE_KEY", ""),
  mapApiKey: readConfig("VITE_MAP_API_KEY", ""),
  countryStateCityApiKey: readConfig("VITE_COUNTRY_STATE_CITY_API_KEY", ""),
  firebase: {
    apiKey: readConfig("VITE_FIREBASE_API_KEY", ""),
    authDomain: readConfig("VITE_FIREBASE_AUTH_DOMAIN", ""),
    projectId: readConfig("VITE_FIREBASE_PROJECT_ID", ""),
    storageBucket: readConfig("VITE_FIREBASE_STORAGE_BUCKET", ""),
    messagingSenderId: readConfig("VITE_FIREBASE_MESSAGING_SENDER_ID", ""),
    appId: readConfig("VITE_FIREBASE_APP_ID", ""),
    measurementId: readConfig("VITE_FIREBASE_MEASUREMENT_ID", ""),
  },
};
