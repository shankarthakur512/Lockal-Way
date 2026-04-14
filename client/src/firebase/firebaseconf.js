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

const REQUIRED_FIREBASE_KEYS = ["apiKey", "authDomain", "projectId", "appId"];

export const missingFirebaseConfigKeys = REQUIRED_FIREBASE_KEYS.filter(
  (key) => !firebaseConfig[key]?.toString().trim()
);

export const isFirebaseConfigured = missingFirebaseConfigKeys.length === 0;

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = app ? getAuth(app) : null;
