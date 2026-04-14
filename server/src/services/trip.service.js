import mongoose from "mongoose";
import Trip from "../models/TripPackage.model.js";
import LocalGuide from "../models/LocalGuide.model.js";
import BookingTrip from "../models/BookingTrip.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { PUBLIC_TRIP_STATUSES } from "../validators/trip.validator.js";

export const normalizeLocation = (location = "") => location.trim().toLowerCase();

export const buildTripSummary = (trip) => ({
  _id: trip._id,
  id: trip._id,
  tripName: trip.tripName,
  name: trip.hotel?.name,
  hotel: trip.hotel?.name,
  rating: trip.hotel?.rating,
  description: trip.itinerary,
  duration: trip.duration,
  photos: trip.photos,
  price: trip.price,
  startingDate: trip.startingDate,
  status: trip.status,
  type: trip.type,
  totalBookings: trip.totalBookings,
  totalUnitsBooked: trip.totalUnitsBooked,
});

export const buildTripDetail = (trip, guide) => ({
  _id: trip._id,
  tripName: trip.tripName,
  location: trip.location,
  duration: trip.duration,
  type: trip.type,
  hotel: trip.hotel,
  price: trip.price,
  itinerary: trip.itinerary,
  photos: trip.photos,
  startingDate: trip.startingDate,
  status: trip.status,
  bookedByUsers: trip.bookedByUsers,
  totalBookings: trip.totalBookings,
  totalUnitsBooked: trip.totalUnitsBooked,
  guideDetails: guide
    ? {
        aboutYourself: guide.aboutYourself,
        address: guide.address,
        city: guide.city,
        country: guide.country,
        native: guide.native,
        picture: guide.picture,
        languages: guide.languages,
      }
    : null,
  userDetails: guide?.user
    ? {
        _id: guide.user._id,
        fullName: guide.user.fullname,
        email: guide.user.email,
        profilePicture: guide.user.avatar,
      }
    : null,
});

export const buildBookedTripPayload = (booking) => ({
  _id: booking._id,
  bookingReference: booking.bookingReference,
  status: booking.status,
  paymentStatus: booking.paymentStatus,
  totalUnitsBooked: booking.totalUnitsBooked,
  totalPrice: booking.totalPrice,
  unitPrice: booking.unitPrice,
  createdAt: booking.createdAt,
  travellers: booking.travellers,
  trip: booking.trip
    ? {
        _id: booking.trip._id,
        tripName: booking.trip.tripName,
        location: booking.trip.location,
        photos: booking.trip.photos,
        startingDate: booking.trip.startingDate,
        type: booking.trip.type,
        status: booking.trip.status,
      }
    : {
        _id: booking.trip,
        tripName: booking.tripName,
        location: booking.tripLocation,
        photos: [],
      },
  guide: booking.guide
    ? {
        _id: booking.guide._id,
        city: booking.guide.city,
        country: booking.guide.country,
        picture: booking.guide.picture,
        userDetails: booking.guide.user
          ? {
              _id: booking.guide.user._id,
              fullName: booking.guide.user.fullname,
              profilePicture: booking.guide.user.avatar,
            }
          : null,
      }
    : null,
});

export const findGuideOrThrow = async (guideId) => {
  const guide = await LocalGuide.findById(guideId);
  return guide || null;
};

export const assertTripOwnership = async (tripId, userId, isAdmin = false) => {
  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    return { error: "Invalid trip ID." };
  }

  const trip = await Trip.findById(tripId).populate("createdBy", "user");

  if (!trip) {
    return { error: "Trip not found." };
  }

  if (!isAdmin && trip.createdBy?.user?.toString() !== userId?.toString()) {
    return { error: "You can only manage your own trips." };
  }

  return { trip };
};

export const uploadTripPhotos = async (files = []) => {
  const uploadedPhotos = await Promise.all(
    files.map(async (file) => {
      const photo = await uploadOnCloudinary(file.path);
      return photo?.secure_url || photo?.url;
    })
  );

  return uploadedPhotos.filter(Boolean);
};

export const createTripRecord = async (payload, files = []) => {
  const photos = await uploadTripPhotos(files);

  return Trip.create({
    createdBy: payload.createdBy,
    tripName: payload.tripName,
    location: normalizeLocation(payload.location),
    duration: payload.duration,
    type: payload.type,
    hotel: {
      name: payload.hotelName,
      rating: payload.hotelRating,
    },
    price: payload.price,
    status: payload.status,
    itinerary: payload.itinerary,
    startingDate: payload.startingDate,
    photos,
  });
};

export const updateTripRecord = async (trip, updates, files = []) => {
  if (updates.tripName !== undefined) {
    trip.tripName = updates.tripName;
  }

  if (updates.location !== undefined) {
    trip.location = normalizeLocation(updates.location);
  }

  if (updates.duration !== undefined) {
    trip.duration = updates.duration;
  }

  if (updates.type !== undefined) {
    trip.type = updates.type;
  }

  if (updates.hotelName !== undefined) {
    trip.hotel.name = updates.hotelName;
  }

  if (updates.hotelRating !== undefined) {
    trip.hotel.rating = updates.hotelRating;
  }

  if (updates.price !== undefined) {
    trip.price = updates.price;
  }

  if (updates.itinerary !== undefined) {
    trip.itinerary = updates.itinerary;
  }

  if (updates.startingDate !== undefined) {
    trip.startingDate = updates.startingDate;
  }

  if (updates.status !== undefined) {
    trip.status = updates.status;
  }

  if (updates.photos !== undefined) {
    trip.photos = updates.photos;
  }

  if (files.length > 0) {
    const nextPhotos = await uploadTripPhotos(files);
    trip.photos = nextPhotos.length > 0 ? [...trip.photos, ...nextPhotos] : trip.photos;
  }

  await trip.save();
  return trip;
};

export const deleteTripRecord = async (trip) => {
  const existingBookings = await BookingTrip.countDocuments({
    trip: trip._id,
    status: { $in: ["Pending", "Confirmed"] },
  });

  if (existingBookings > 0) {
    return { error: "Trips with active bookings cannot be deleted. Cancel the trip instead." };
  }

  await Trip.findByIdAndDelete(trip._id);
  return { success: true };
};

export const buildPublicTripFilter = (location) => ({
  location: normalizeLocation(location),
  status: { $in: PUBLIC_TRIP_STATUSES },
});
