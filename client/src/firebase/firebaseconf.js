import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { ENV_CONFIG } from "../shared/config/env";

const firebaseConfig = {
  apiKey: ENV_CONFIG.firebase.apiKey,
  authDomain: ENV_CONFIG.firebase.authDomain,
  projectId: ENV_CONFIG.firebase.projectId,
  storageBucket: ENV_CONFIG.firebase.storageBucket,
  messagingSenderId: ENV_CONFIG.firebase.messagingSenderId,
  appId: ENV_CONFIG.firebase.appId,
  measurementId: ENV_CONFIG.firebase.measurementId,
};

const PLACEHOLDER_MARKERS = ["replace_me", "your-project"];
const REQUIRED_FIREBASE_KEYS = ["apiKey", "authDomain", "projectId", "appId"];
const isPlaceholderValue = (value) =>
  !value || PLACEHOLDER_MARKERS.some((marker) => value.toLowerCase().includes(marker));
const hasValidFirebaseApiKey = (value) => /^AIza[0-9A-Za-z_-]{20,}$/.test(value || "");

export const missingFirebaseConfigKeys = REQUIRED_FIREBASE_KEYS.filter(
  (key) => isPlaceholderValue(firebaseConfig[key]?.toString().trim())
);

export const isFirebaseConfigured =
  missingFirebaseConfigKeys.length === 0 && hasValidFirebaseApiKey(firebaseConfig.apiKey);

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = app ? getAuth(app) : null;
