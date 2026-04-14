import { TOAST_MESSAGES } from "../constants/strings";

export const getErrorMessage = (error, fallback = TOAST_MESSAGES.genericError) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;
