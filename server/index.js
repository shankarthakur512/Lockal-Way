import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import Stripe from "stripe";
import connectDb from "./src/Database/index.js";
import { Sendmail, verifyOtp } from "./src/controllers/sendmail.js";
import userRouter from "./src/routes/user.routes.js";
import GuideRouter from "./src/routes/LocalGuide.routes.js";
import TripsRouter from "./src/routes/TripPackage.routes.js";
import assistantRouter from "./src/routes/assistant.routes.js";
import { getServerEnv } from "./src/config/env.js";
import { createLogger } from "./src/utils/logger.js";
import Trip from "./src/models/TripPackage.model.js";
import LocalGuide from "./src/models/LocalGuide.model.js";
import { calculateGuideBookingPricing } from "./src/utils/guidePricing.js";
import { calculateTripPricing } from "./src/utils/tripPricing.js";

const BOOKABLE_TRIP_STATUSES = new Set(["Upcoming", "Ongoing"]);

dotenv.config({ path: ".env" });

const { port, corsOrigin } = getServerEnv();

const app = express();
const serverLogger = createLogger("server");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4001",
  "http://localhost:4173",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

const configuredOrigins = (corsOrigin || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredOrigins]);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header, such as Postman or server-to-server calls.
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    serverLogger.warn("Blocked by CORS", { origin });
    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use("/public/temp", express.static("public/temp"));
app.use("/uploads", express.static("uploads"));

// Lightweight request logging keeps backend debugging easy without adding a new dependency.
app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    serverLogger.info("Request completed", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/Guide", GuideRouter);
app.use("/api/v1/Trips", TripsRouter);
app.use("/api/v1/assistant", assistantRouter);

app.get("/healthz", (req, res) => {
  const mongoReadyState = mongoose.connection.readyState;

  res.status(mongoReadyState === 1 ? 200 : 503).json({
    success: mongoReadyState === 1,
    status: mongoReadyState === 1 ? "ok" : "degraded",
    uptimeSeconds: Math.round(process.uptime()),
    database: {
      readyState: mongoReadyState,
    },
    timestamp: new Date().toISOString(),
  });
});

app.post("/sendmail", Sendmail);
app.post("/verify-otp", verifyOtp);

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { bookingType = "trip", tripId, travellerCount, guideId, bookingDays } = req.body;

    let pricing;
    let metadata;

    if (bookingType === "guide") {
      if (!guideId || !Number.isInteger(Number(bookingDays)) || Number(bookingDays) < 1) {
        return res.status(400).json({
          success: false,
          error: "A valid guide and booking duration are required.",
        });
      }

      const guide = await LocalGuide.findById(guideId);

      if (!guide) {
        return res.status(404).json({
          success: false,
          error: "Guide not found.",
        });
      }

      if (!Number.isFinite(Number(guide.dailyRate)) || Number(guide.dailyRate) <= 0) {
        return res.status(409).json({
          success: false,
          error: "This guide is not available for paid bookings yet.",
        });
      }

      pricing = calculateGuideBookingPricing(guide.dailyRate, Number(bookingDays));
      metadata = {
        bookingType: "guide",
        guideId: String(guide._id),
        bookingDays: String(pricing.totalDays),
      };
    } else {
      if (!tripId || !Number.isInteger(Number(travellerCount)) || Number(travellerCount) < 1) {
        return res.status(400).json({
          success: false,
          error: "A valid trip and traveller count are required.",
        });
      }

      const trip = await Trip.findById(tripId);

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: "Trip not found.",
        });
      }

      if (!BOOKABLE_TRIP_STATUSES.has(trip.status)) {
        return res.status(409).json({
          success: false,
          error: "This trip is not accepting payments right now.",
        });
      }

      pricing = calculateTripPricing(trip.price, Number(travellerCount));
      metadata = {
        bookingType: "trip",
        tripId: String(trip._id),
        travellerCount: String(pricing.travellerCount),
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: pricing.amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
      metadata,
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      pricing,
    });
  } catch (error) {
    serverLogger.error("Payment intent creation failed", { error: error.message });
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

connectDb().then(() => {
  const server = app.listen(port, () => {
    serverLogger.info("Server is running", { port });
  });

  server.on("error", (error) => {
    serverLogger.error("Server failed to start", {
      port,
      error: error.message,
    });
    process.exit(1);
  });
});
