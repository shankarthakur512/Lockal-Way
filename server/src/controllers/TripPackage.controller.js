import mongoose from "mongoose";
import Stripe from "stripe";
import BookingTrip from "../models/BookingTrip.model.js";
import Trip from "../models/TripPackage.model.js";
import { User } from "../models/user.model.js";
import { createLogger } from "../utils/logger.js";
import { calculateTripPricing } from "../utils/tripPricing.js";
import {
  assertTripOwnership,
  buildBookedTripPayload,
  buildPublicTripFilter,
  buildTripDetail,
  buildTripSummary,
  createTripRecord,
  deleteTripRecord,
  findGuideOrThrow,
  updateTripRecord,
} from "../services/trip.service.js";
import {
  PUBLIC_TRIP_STATUSES,
  validateTripCreationPayload,
  validateTripStatusPayload,
  validateTripUpdatePayload,
} from "../validators/trip.validator.js";

const tripLogger = createLogger("trip-controller");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BOOKABLE_TRIP_STATUSES = new Set(["Upcoming", "Ongoing"]);
const isAdminRequest = (req) => req.user?.role === "admin";
const createBookingReference = (prefix = "TRIP") =>
  `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

export const registerTourPackage = async (req, res) => {
  try {
    const validationResult = validateTripCreationPayload(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        message: validationResult.error,
      });
    }

    const payload = validationResult.value;
    const guide = await findGuideOrThrow(payload.createdBy);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found.",
      });
    }

    if (!isAdminRequest(req) && guide.user.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only create packages for your own guide profile.",
      });
    }

    const newTrip = await createTripRecord(payload, req.files?.photos || []);

    tripLogger.info("Trip created", { tripId: newTrip._id, guideId: payload.createdBy });

    return res.status(201).json({
      success: true,
      message: "Trip created successfully.",
      trip: newTrip,
    });
  } catch (error) {
    tripLogger.error("Trip creation failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Failed to create trip.",
    });
  }
};

export const getTripsByLocalGuide = async (req, res) => {
  try {
    const { GuideId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(GuideId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid guide ID.",
      });
    }

    const guide = await findGuideOrThrow(GuideId);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found.",
      });
    }

    if (!isAdminRequest(req) && guide.user.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view trips created under your own guide profile.",
      });
    }

    const trips = await Trip.find({ createdBy: GuideId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Trips fetched successfully.",
      trips: trips.map(buildTripSummary),
    });
  } catch (error) {
    tripLogger.error("Guide trips fetch failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Error fetching trips.",
    });
  }
};

export const getTripByLocation = async (req, res) => {
  try {
    const location = req.body.location?.trim();

    if (!location) {
      return res.status(400).json({ success: false, msg: "Location is required." });
    }

    const trips = await Trip.find(buildPublicTripFilter(location))
      .populate({
        path: "createdBy",
        select: "aboutYourself address city country native picture languages user",
        populate: {
          path: "user",
          select: "_id fullname email avatar",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      msg: "success",
      trips: trips.map((trip) => buildTripDetail(trip, trip.createdBy)),
    });
  } catch (error) {
    tripLogger.error("Trip lookup by location failed", { error: error.message });
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getTripDetailById = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ success: false, msg: "Invalid trip ID." });
    }

    const trip = await Trip.findById(tripId).populate({
      path: "createdBy",
      select: "aboutYourself address city country native picture languages user",
      populate: {
        path: "user",
        select: "_id fullname email avatar",
      },
    });

    if (!trip) {
      return res.status(404).json({ success: false, msg: "No packages found" });
    }

    if (!PUBLIC_TRIP_STATUSES.includes(trip.status)) {
      return res.status(404).json({ success: false, msg: "No packages found" });
    }

    return res.status(200).json({
      success: true,
      msg: "success",
      trips: [buildTripDetail(trip, trip.createdBy)],
    });
  } catch (error) {
    tripLogger.error("Trip detail lookup failed", { error: error.message });
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getFeaturedTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ status: { $in: PUBLIC_TRIP_STATUSES } })
      .populate({
        path: "createdBy",
        select: "aboutYourself address city country native picture languages user",
        populate: {
          path: "user",
          select: "_id fullname email avatar",
        },
      })
      .sort({ totalBookings: -1, createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      trips: trips.map((trip) => buildTripDetail(trip, trip.createdBy)),
    });
  } catch (error) {
    tripLogger.error("Featured trips fetch failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to load featured trips.",
    });
  }
};

export const bookTripAfterPayment = async (req, res) => {
  try {
    const { tripId, bookedBy, personDetails, paymentIntentId } = req.body;

    if (!isAdminRequest(req) && bookedBy?.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only book trips for your own account.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(tripId) || !mongoose.Types.ObjectId.isValid(bookedBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip or user ID.",
      });
    }

    if (!Array.isArray(personDetails) || personDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Traveller details are required.",
      });
    }

    if (!paymentIntentId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    const existingBooking = await BookingTrip.findOne({ paymentIntentId: paymentIntentId.trim() });

    if (existingBooking) {
      return res.status(200).json({
        success: true,
        booked: true,
        message: "Trip already booked for this payment.",
        booking: existingBooking,
      });
    }

    const [trip, user] = await Promise.all([Trip.findById(tripId), User.findById(bookedBy)]);

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found." });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId.trim());

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        booked: false,
        message: "Payment is not completed yet.",
      });
    }

    if (!BOOKABLE_TRIP_STATUSES.has(trip.status)) {
      return res.status(409).json({
        success: false,
        message: "This trip is not accepting bookings right now.",
      });
    }

    const tripStartDate = trip.startingDate ? new Date(trip.startingDate) : null;

    if (tripStartDate) {
      tripStartDate.setHours(23, 59, 59, 999);
    }

    if (tripStartDate && tripStartDate < new Date()) {
      return res.status(409).json({
        success: false,
        message: "This trip has already started and can no longer be booked.",
      });
    }

    const travellers = personDetails.map((person) => ({
      name: person.name?.trim(),
      govtId: person.govtId?.trim(),
      age: Number(person.age),
    }));

    const invalidTraveller = travellers.find(
      (traveller) =>
        !traveller.name || !traveller.govtId || !Number.isFinite(traveller.age) || traveller.age < 0
    );

    if (invalidTraveller) {
      return res.status(400).json({
        success: false,
        message: "Each traveller must include a valid name, government ID, and age.",
      });
    }

    const totalUnitsBooked = travellers.length;
    const pricing = calculateTripPricing(trip.price, totalUnitsBooked);
    const paidAmountInCents = Number(paymentIntent.amount_received || paymentIntent.amount || 0);

    if (paidAmountInCents !== pricing.amountInCents) {
      return res.status(400).json({
        success: false,
        booked: false,
        message: "Payment amount does not match the selected trip price.",
      });
    }

    const booking = await BookingTrip.create({
      trip: trip._id,
      guide: trip.createdBy,
      bookedBy,
      tripName: trip.tripName,
      tripLocation: trip.location,
      unitPrice: pricing.unitPrice,
      totalPrice: pricing.totalPrice,
      totalUnitsBooked,
      travellers,
      paymentStatus: "Paid",
      status: "Confirmed",
      bookingReference: createBookingReference(),
      paymentIntentId: paymentIntentId.trim(),
    });

    const existingBookedUser = trip.bookedByUsers.find(
      (entry) => entry.user.toString() === bookedBy.toString()
    );

    if (existingBookedUser) {
      existingBookedUser.totalUnitsBooked += totalUnitsBooked;
      existingBookedUser.fullname = user.fullname;
    } else {
      trip.bookedByUsers.push({
        user: user._id,
        fullname: user.fullname,
        totalUnitsBooked,
      });
    }

    trip.totalBookings += 1;
    trip.totalUnitsBooked += totalUnitsBooked;
    await trip.save();

    tripLogger.info("Trip booked", {
      tripId,
      bookingId: booking._id,
      bookedBy,
      paymentIntentId,
    });

    return res.status(201).json({
      success: true,
      booked: true,
      message: "Trip booked successfully.",
      booking,
    });
  } catch (error) {
    tripLogger.error("Trip booking failed", { error: error.message });
    return res.status(500).json({
      success: false,
      booked: false,
      message: "Unable to complete the trip booking.",
    });
  }
};

export const getBookedTripsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isAdminRequest(req) && userId !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own booked trips.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const bookings = await BookingTrip.find({ bookedBy: userId })
      .populate("trip")
      .populate({
        path: "guide",
        select: "city country picture user",
        populate: {
          path: "user",
          select: "_id fullname avatar",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings: bookings.map(buildBookedTripPayload),
    });
  } catch (error) {
    tripLogger.error("Booked trips fetch failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to load booked trips.",
    });
  }
};

export const updateTripPackage = async (req, res) => {
  try {
    const validationResult = validateTripUpdatePayload(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        message: validationResult.error,
      });
    }

    const ownershipResult = await assertTripOwnership(
      req.params.tripId,
      req.user?._id,
      isAdminRequest(req)
    );

    if (ownershipResult.error) {
      return res.status(ownershipResult.error === "Trip not found." ? 404 : 403).json({
        success: false,
        message: ownershipResult.error,
      });
    }

    const updatedTrip = await updateTripRecord(
      ownershipResult.trip,
      validationResult.value,
      req.files?.photos || []
    );

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully.",
      trip: buildTripSummary(updatedTrip),
    });
  } catch (error) {
    tripLogger.error("Trip update failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to update the trip right now.",
    });
  }
};

export const updateTripStatus = async (req, res) => {
  try {
    const validationResult = validateTripStatusPayload(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        message: validationResult.error,
      });
    }

    const ownershipResult = await assertTripOwnership(
      req.params.tripId,
      req.user?._id,
      isAdminRequest(req)
    );

    if (ownershipResult.error) {
      return res.status(ownershipResult.error === "Trip not found." ? 404 : 403).json({
        success: false,
        message: ownershipResult.error,
      });
    }

    const updatedTrip = await updateTripRecord(ownershipResult.trip, validationResult.value);

    return res.status(200).json({
      success: true,
      message: "Trip status updated successfully.",
      trip: buildTripSummary(updatedTrip),
    });
  } catch (error) {
    tripLogger.error("Trip status update failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to update the trip status right now.",
    });
  }
};

export const deleteTripPackage = async (req, res) => {
  try {
    const ownershipResult = await assertTripOwnership(
      req.params.tripId,
      req.user?._id,
      isAdminRequest(req)
    );

    if (ownershipResult.error) {
      return res.status(ownershipResult.error === "Trip not found." ? 404 : 403).json({
        success: false,
        message: ownershipResult.error,
      });
    }

    const deletionResult = await deleteTripRecord(ownershipResult.trip);

    if (deletionResult.error) {
      return res.status(409).json({
        success: false,
        message: deletionResult.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip deleted successfully.",
    });
  } catch (error) {
    tripLogger.error("Trip deletion failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to delete the trip right now.",
    });
  }
};
