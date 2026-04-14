import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Elements } from "@stripe/react-stripe-js";

import store, { persistor } from "../Redux/store";
import { ENV_CONFIG } from "../shared/config/env";
import AppToastContainer from "../shared/ui/AppToastContainer";
import ThemeController from "./ThemeController";
import AppBootScreen from "./AppBootScreen";
import AppErrorBoundary from "./AppErrorBoundary";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(ENV_CONFIG.stripePublishableKey);

const AppProviders = ({ children }) => (
  <Provider store={store}>
    <PersistGate loading={<AppBootScreen />} persistor={persistor}>
      <Elements stripe={stripePromise}>
        <AppErrorBoundary>
          <ThemeController />
          {children}
          <AppToastContainer />
        </AppErrorBoundary>
      </Elements>
    </PersistGate>
  </Provider>
);

export default AppProviders;
