import mongoose from "mongoose";
import BookingGuide from "../models/BookingGuide.model.js";
import BookingTrip from "../models/BookingTrip.model.js";
import GuideHireBooking from "../models/GuideHireBooking.model.js";
import GuideConversation from "../models/GuideConversation.model.js";
import Trip from "../models/TripPackage.model.js";

const formatActivityDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

export const getGuideDashboardSummary = async (guideId) => {
  const normalizedGuideId = mongoose.Types.ObjectId.isValid(guideId)
    ? new mongoose.Types.ObjectId(guideId)
    : guideId;

  const [
    tripCount,
    conversationCount,
    confirmedCalls,
    totalPaidTripBookings,
    totalPaidGuideBookings,
    tripEarnings,
    guideEarnings,
    paidTripBookings,
    paidGuideBookings,
    trips,
    recentCalls,
    recentConversations,
  ] =
    await Promise.all([
      Trip.countDocuments({ createdBy: guideId }),
      GuideConversation.countDocuments({ guide: guideId }),
      BookingGuide.countDocuments({ guide: guideId, status: "Confirmed" }),
      BookingTrip.countDocuments({ guide: guideId, paymentStatus: "Paid" }),
      GuideHireBooking.countDocuments({ guide: guideId, paymentStatus: "Paid" }),
      BookingTrip.aggregate([
        {
          $match: {
            guide: normalizedGuideId,
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]),
      GuideHireBooking.aggregate([
        {
          $match: {
            guide: normalizedGuideId,
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]),
      BookingTrip.find({ guide: guideId, paymentStatus: "Paid" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("bookedBy", "fullname")
        .populate("trip", "tripName"),
      GuideHireBooking.find({ guide: guideId, paymentStatus: "Paid" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("bookedBy", "fullname"),
      Trip.find({ createdBy: guideId }).sort({ createdAt: -1 }).limit(5),
      BookingGuide.find({ guide: guideId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("bookedBy", "fullname"),
      GuideConversation.find({ guide: guideId })
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .limit(5)
        .populate("traveler", "fullname"),
    ]);

  const totalEarnings =
    Number(tripEarnings[0]?.total || 0) + Number(guideEarnings[0]?.total || 0);

  const totalTripBookings = totalPaidTripBookings + totalPaidGuideBookings;
  const now = new Date();

  const [upcomingCalls, pastCalls] = await Promise.all([
    BookingGuide.find({ guide: guideId, travelDate: { $gte: now } })
      .sort({ travelDate: 1, createdAt: -1 })
      .limit(10)
      .populate({
        path: "bookedBy",
        select: "fullname email avatar",
      }),
    BookingGuide.find({ guide: guideId, travelDate: { $lt: now } })
      .sort({ travelDate: -1, createdAt: -1 })
      .limit(10)
      .populate({
        path: "bookedBy",
        select: "fullname email avatar",
      }),
  ]);

  const activities = [
    ...paidTripBookings.map((booking) => ({
      occurredAt: booking.createdAt,
      description: `${booking.bookedBy?.fullname || "A traveler"} booked ${booking.trip?.tripName || "a trip"}.`,
    })),
    ...paidGuideBookings.map((booking) => ({
      occurredAt: booking.createdAt,
      description: `${booking.bookedBy?.fullname || "A traveler"} booked you for ${booking.totalDays} day${booking.totalDays > 1 ? "s" : ""}.`,
    })),
    ...trips.map((trip) => ({
      occurredAt: trip.createdAt,
      description: `You published the package "${trip.tripName}".`,
    })),
    ...recentCalls.map((call) => ({
      occurredAt: call.createdAt,
      description: `${call.bookedBy?.fullname || "A traveler"} scheduled a guide call for ${formatActivityDate(call.travelDate)}.`,
    })),
    ...recentConversations.map((thread) => ({
      occurredAt: thread.lastMessageAt || thread.updatedAt,
      description: `${thread.traveler?.fullname || "A traveler"} continued a guide conversation.`,
    })),
  ]
    .filter((activity) => activity.occurredAt)
    .sort((left, right) => new Date(right.occurredAt) - new Date(left.occurredAt))
    .slice(0, 8)
    .map((activity) => ({
      description: activity.description,
      date: formatActivityDate(activity.occurredAt),
    }));

  return {
    stats: {
      packagesPublished: tripCount,
      travelerConversations: conversationCount,
      estimatedEarnings: totalEarnings,
      confirmedCalls,
      totalTripBookings,
    },
    chart: {
      labels: ["Calls", "Chats", "Paid bookings"],
      datasets: [
        {
          data: [confirmedCalls, conversationCount, totalTripBookings],
          backgroundColor: ["#C4603B", "#3D6B5A", "#D4A24C"],
          borderWidth: 0,
        },
      ],
    },
    activities,
    calls: {
      upcoming: upcomingCalls.map((call) => ({
        _id: call._id,
        bookingReference: call.bookingReference,
        travelDate: call.travelDate,
        timeSlot: call.timeSlot,
        status: call.status,
        traveler: call.bookedBy,
      })),
      past: pastCalls.map((call) => ({
        _id: call._id,
        bookingReference: call.bookingReference,
        travelDate: call.travelDate,
        timeSlot: call.timeSlot,
        status: call.status,
        traveler: call.bookedBy,
      })),
    },
  };
};
