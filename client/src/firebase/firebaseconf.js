import { initializeApp } from "firebase/app";
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

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
