const PRODUCTION_REQUIRED_KEYS = [
  "PORT",
  "MONGODB_URI",
  "CORS_ORIGIN",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRY",
  "STRIPE_SECRET_KEY",
  "OTP_TOKEN_SECRET",
  "CLOUDNARY_CLOUD_NAME",
  "CLOUDNARY_API_KEY",
  "CLOUDNARY_API_SECRET",
  "MAIL_USER",
  "MAIL_PASS",
];

const NON_PRODUCTION_REQUIRED_KEYS = [
  "PORT",
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRY",
  "STRIPE_SECRET_KEY",
  "CLOUDNARY_CLOUD_NAME",
  "CLOUDNARY_API_KEY",
  "CLOUDNARY_API_SECRET",
];

const isBlank = (value) => !value || !value.toString().trim();

const readEnv = (key, fallback = "") => process.env[key]?.toString().trim() || fallback;

export const getServerEnv = () => {
  const nodeEnv = readEnv("NODE_ENV", "development");
  const requiredKeys =
    nodeEnv === "production" ? PRODUCTION_REQUIRED_KEYS : NON_PRODUCTION_REQUIRED_KEYS;

  const missingKeys = requiredKeys.filter((key) => isBlank(process.env[key]));

  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(", ")}`);
  }

  const corsOrigin = readEnv("CORS_ORIGIN");

  if (nodeEnv === "production") {
    if (!corsOrigin) {
      throw new Error("CORS_ORIGIN must be set in production.");
    }

    if (corsOrigin === "*" || corsOrigin.includes("*")) {
      throw new Error("CORS_ORIGIN must be explicit in production and cannot use '*'.");
    }
  }

  return {
    nodeEnv,
    port: Number(readEnv("PORT", "8000")) || 8000,
    corsOrigin,
  };
};
