import { ENV_CONFIG } from "./env";

export const API_CONFIG = {
  baseUrl: ENV_CONFIG.apiBaseUrl,
  apiPrefix: "/api/v1",
};

export const API_ROUTES = {
  users: `${API_CONFIG.baseUrl}${API_CONFIG.apiPrefix}/users`,
  guides: `${API_CONFIG.baseUrl}${API_CONFIG.apiPrefix}/Guide`,
  trips: `${API_CONFIG.baseUrl}${API_CONFIG.apiPrefix}/Trips`,
  assistant: `${API_CONFIG.baseUrl}${API_CONFIG.apiPrefix}/assistant`,
  sendMail: `${API_CONFIG.baseUrl}/sendmail`,
  verifyOtp: `${API_CONFIG.baseUrl}/verify-otp`,
  paymentIntent: `${API_CONFIG.baseUrl}/create-payment-intent`,
};
