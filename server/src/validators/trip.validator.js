import mongoose from "mongoose";

export const PUBLIC_TRIP_STATUSES = ["Upcoming", "Ongoing"];
export const GUIDE_MANAGED_TRIP_STATUSES = ["Upcoming", "Ongoing", "Paused", "Completed", "Cancelled"];

const parseNumber = (value) => Number(value);

const parseTrimmedString = (value) => value?.toString().trim() || "";

const parseOptionalStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => parseTrimmedString(item)).filter(Boolean);
  }

  return [];
};

const parseDateValue = (value) => {
  if (!value) {
    return null;
  }

  const normalizedDate = new Date(value);
  return Number.isNaN(normalizedDate.getTime()) ? null : normalizedDate;
};

export const validateTripCreationPayload = (payload) => {
  const normalizedPayload = {
    createdBy: parseTrimmedString(payload.createdBy),
    tripName: parseTrimmedString(payload.tripName),
    location: parseTrimmedString(payload.Location || payload.location),
    duration: parseNumber(payload.duration),
    type: parseTrimmedString(payload.type),
    hotelName: parseTrimmedString(payload.hotel),
    hotelRating: parseNumber(payload.hotelRating),
    price: parseNumber(payload.price),
    itinerary: parseTrimmedString(payload.itinerary),
    startingDate: parseDateValue(payload.startingDate),
    status: parseTrimmedString(payload.status) || "Upcoming",
  };

  if (!normalizedPayload.createdBy || !mongoose.Types.ObjectId.isValid(normalizedPayload.createdBy)) {
    return { error: "A valid guide ID is required." };
  }

  if (!normalizedPayload.tripName) {
    return { error: "Trip name is required." };
  }

  if (!normalizedPayload.location) {
    return { error: "Trip location is required." };
  }

  if (!Number.isFinite(normalizedPayload.duration) || normalizedPayload.duration < 1) {
    return { error: "Duration must be at least 1 day." };
  }

  if (!normalizedPayload.type) {
    return { error: "Trip type is required." };
  }

  if (!normalizedPayload.hotelName) {
    return { error: "Hotel details are required." };
  }

  if (!Number.isFinite(normalizedPayload.hotelRating) || normalizedPayload.hotelRating < 0 || normalizedPayload.hotelRating > 5) {
    return { error: "Hotel rating must be between 0 and 5." };
  }

  if (!Number.isFinite(normalizedPayload.price) || normalizedPayload.price < 0) {
    return { error: "Price must be a valid positive number." };
  }

  if (!normalizedPayload.itinerary) {
    return { error: "Itinerary is required." };
  }

  if (!normalizedPayload.startingDate) {
    return { error: "A valid starting date is required." };
  }

  if (!GUIDE_MANAGED_TRIP_STATUSES.includes(normalizedPayload.status)) {
    return { error: "Trip status is invalid." };
  }

  return { value: normalizedPayload };
};

export const validateTripUpdatePayload = (payload) => {
  const updates = {};

  if (payload.tripName !== undefined) {
    const tripName = parseTrimmedString(payload.tripName);
    if (!tripName) {
      return { error: "Trip name cannot be empty." };
    }
    updates.tripName = tripName;
  }

  if (payload.location !== undefined || payload.Location !== undefined) {
    const location = parseTrimmedString(payload.Location || payload.location);
    if (!location) {
      return { error: "Trip location cannot be empty." };
    }
    updates.location = location;
  }

  if (payload.duration !== undefined) {
    const duration = parseNumber(payload.duration);
    if (!Number.isFinite(duration) || duration < 1) {
      return { error: "Duration must be at least 1 day." };
    }
    updates.duration = duration;
  }

  if (payload.type !== undefined) {
    const type = parseTrimmedString(payload.type);
    if (!type) {
      return { error: "Trip type cannot be empty." };
    }
    updates.type = type;
  }

  if (payload.hotel !== undefined || payload.hotelName !== undefined) {
    const hotelName = parseTrimmedString(payload.hotel || payload.hotelName);
    if (!hotelName) {
      return { error: "Hotel details cannot be empty." };
    }
    updates.hotelName = hotelName;
  }

  if (payload.hotelRating !== undefined) {
    const hotelRating = parseNumber(payload.hotelRating);
    if (!Number.isFinite(hotelRating) || hotelRating < 0 || hotelRating > 5) {
      return { error: "Hotel rating must be between 0 and 5." };
    }
    updates.hotelRating = hotelRating;
  }

  if (payload.price !== undefined) {
    const price = parseNumber(payload.price);
    if (!Number.isFinite(price) || price < 0) {
      return { error: "Price must be a valid positive number." };
    }
    updates.price = price;
  }

  if (payload.itinerary !== undefined) {
    const itinerary = parseTrimmedString(payload.itinerary);
    if (!itinerary) {
      return { error: "Itinerary cannot be empty." };
    }
    updates.itinerary = itinerary;
  }

  if (payload.startingDate !== undefined) {
    const startingDate = parseDateValue(payload.startingDate);
    if (!startingDate) {
      return { error: "A valid starting date is required." };
    }
    updates.startingDate = startingDate;
  }

  if (payload.status !== undefined) {
    const status = parseTrimmedString(payload.status);
    if (!GUIDE_MANAGED_TRIP_STATUSES.includes(status)) {
      return { error: "Trip status is invalid." };
    }
    updates.status = status;
  }

  if (payload.photos !== undefined) {
    const photos = parseOptionalStringArray(payload.photos);
    updates.photos = photos;
  }

  if (Object.keys(updates).length === 0) {
    return { error: "At least one trip field must be provided for update." };
  }

  return { value: updates };
};

export const validateTripStatusPayload = (payload) => {
  const status = parseTrimmedString(payload.status);

  if (!GUIDE_MANAGED_TRIP_STATUSES.includes(status)) {
    return { error: "Trip status is invalid." };
  }

  return { value: { status } };
};
