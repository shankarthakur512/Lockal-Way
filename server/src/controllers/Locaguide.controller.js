import mongoose from "mongoose";
import LocalGuide from "../models/LocalGuide.model.js";
import { User } from "../models/user.model.js";
import BookingGuide from "../models/BookingGuide.model.js";
import GuideHireBooking from "../models/GuideHireBooking.model.js";
import GuideConversation from "../models/GuideConversation.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { createLogger } from "../utils/logger.js";
import { getGuideDashboardSummary } from "../services/guideDashboard.service.js";
import { calculateGuideBookingDays, calculateGuideBookingPricing } from "../utils/guidePricing.js";
import Stripe from "stripe";

const guideLogger = createLogger("guide-controller");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const createBookingReference = (prefix = "GUIDE") =>
  `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
const createGuideHireReference = (prefix = "GUIDEHIRE") =>
  `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
const GUIDE_BOOKING_ACTIVE_STATUSES = ["Pending", "Confirmed"];
const isAdminRequest = (req) => req.user?.role === "admin";

const normalizeLanguages = (languages) => {
  if (Array.isArray(languages)) {
    return languages.map((language) => language.trim()).filter(Boolean);
  }

  if (typeof languages === "string") {
    return languages
      .split(",")
      .map((language) => language.trim())
      .filter(Boolean);
  }

  return [];
};

const buildGuideOwnerPayload = (guide, userInfo) => ({
  _id: guide._id,
  user: guide.user,
  address: guide.address,
  country: guide.country,
  city: guide.city,
  aboutYourself: guide.aboutYourself,
  native: guide.native,
  mobileNo: guide.mobileNo,
  email: guide.email,
  Govt_ID: guide.Govt_ID,
  picture: guide.picture,
  languages: guide.languages,
  dailyRate: guide.dailyRate,
  verificationStatus: guide.verificationStatus,
  createdAt: guide.createdAt,
  updatedAt: guide.updatedAt,
  userInfo: userInfo
    ? {
        _id: userInfo._id,
        username: userInfo.username,
        email: userInfo.email,
        fullname: userInfo.fullname,
        avatar: userInfo.avatar,
      }
    : undefined,
});

const buildGuideSearchPayload = (guide, userInfo) => ({
  _id: guide._id,
  address: guide.address,
  country: guide.country,
  city: guide.city,
  aboutYourself: guide.aboutYourself,
  native: guide.native,
  picture: guide.picture,
  languages: guide.languages,
  dailyRate: guide.dailyRate,
  userInfo: userInfo
    ? {
        _id: userInfo._id,
        username: userInfo.username,
        email: userInfo.email,
        fullname: userInfo.fullname,
        avatar: userInfo.avatar,
      }
    : undefined,
});

const buildGuideDetailPayload = (guide, userInfo) => ({
  _id: guide._id,
  aboutYourself: guide.aboutYourself,
  address: guide.address,
  city: guide.city,
  country: guide.country,
  native: guide.native,
  picture: guide.picture,
  languages: guide.languages,
  dailyRate: guide.dailyRate,
  userDetails: userInfo
    ? {
        _id: userInfo._id,
        fullname: userInfo.fullname,
        email: userInfo.email,
        avatar: userInfo.avatar,
      }
    : undefined,
});

const buildGuideContactPayload = (guide) => ({
  _id: guide?._id,
  city: guide?.city,
  country: guide?.country,
  picture: guide?.picture,
  dailyRate: guide?.dailyRate,
  userDetails: guide?.user
    ? {
        _id: guide.user._id,
        fullname: guide.user.fullname,
        email: guide.user.email,
        avatar: guide.user.avatar,
      }
    : undefined,
});

const buildTravelerPayload = (user) => ({
  _id: user?._id,
  fullname: user?.fullname,
  email: user?.email,
  avatar: user?.avatar,
});

const buildConversationPayload = (thread) => ({
  _id: thread?._id || null,
  guide: buildGuideContactPayload(thread?.guide),
  traveler: buildTravelerPayload(thread?.traveler),
  latestMessagePreview: thread?.latestMessagePreview || "",
  lastMessageAt: thread?.lastMessageAt || null,
  messages: (thread?.messages || []).map((message) => ({
    _id: message._id,
    senderType: message.senderType,
    text: message.text,
    createdAt: message.createdAt,
  })),
});

const buildCallHistoryPayload = (booking) => ({
  _id: booking._id,
  bookingReference: booking.bookingReference,
  travelDate: booking.travelDate,
  timeSlot: booking.timeSlot,
  status: booking.status,
  notes: booking.notes,
  createdAt: booking.createdAt,
  guide: buildGuideContactPayload(booking.guide),
});

const buildGuideHireBookingPayload = (booking) => ({
  _id: booking._id,
  bookingReference: booking.bookingReference,
  startDate: booking.startDate,
  endDate: booking.endDate,
  totalDays: booking.totalDays,
  dailyRate: booking.dailyRate,
  totalPrice: booking.totalPrice,
  status: booking.status,
  paymentStatus: booking.paymentStatus,
  notes: booking.notes,
  createdAt: booking.createdAt,
  guide: buildGuideContactPayload(booking.guide),
});

const getPopulatedConversationById = (conversationId) =>
  GuideConversation.findById(conversationId)
    .populate({
      path: "guide",
      select: "city country picture user",
      populate: {
        path: "user",
        select: "_id fullname email avatar",
      },
    })
    .populate("traveler", "_id fullname email avatar");

export const registerGuide = async (req, res) => {
  try {
    const {
      user,
      address,
      country,
      city,
      aboutYourself,
      native,
      mobileNo,
      email,
      Govt_ID,
      languages,
      dailyRate,
    } = req.body;

    const authenticatedUserId = req.user?._id?.toString();
    const requestedUserId = user?.toString().trim();
    const guideOwnerId = authenticatedUserId || requestedUserId;

    if (
      ![guideOwnerId, address, country, city, aboutYourself, native, mobileNo, email, Govt_ID, dailyRate].every(
        (field) => field?.toString().trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "All guide fields are required.",
      });
    }

    if (!Number.isFinite(Number(dailyRate)) || Number(dailyRate) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Guide daily rate must be greater than zero.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(guideOwnerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (!isAdminRequest(req) && requestedUserId && requestedUserId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only create a guide profile for your own account.",
      });
    }

    const existingGuide = await LocalGuide.findOne({ user: guideOwnerId });

    if (existingGuide) {
      const existingUser = await User.findByIdAndUpdate(
        existingGuide.user,
        { role: "guide" },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Guide profile already exists.",
        guide: buildGuideOwnerPayload(existingGuide, existingUser),
      });
    }

    const pictureUpload = req.file?.path ? await uploadOnCloudinary(req.file.path) : null;

    if (!pictureUpload?.secure_url && !pictureUpload?.url) {
      return res.status(400).json({
        success: false,
        message: "Guide profile photo is required.",
      });
    }

    const newGuide = await LocalGuide.create({
      user: new mongoose.Types.ObjectId(guideOwnerId),
      address: address.trim(),
      country: country.trim(),
      city: city.trim(),
      aboutYourself: aboutYourself.trim(),
      native: native.trim(),
      mobileNo: mobileNo.toString().trim(),
      email: email.trim().toLowerCase(),
      Govt_ID: Govt_ID.trim(),
      languages: normalizeLanguages(languages),
      dailyRate: Number(dailyRate),
      picture: pictureUpload.secure_url || pictureUpload.url,
    });

    const guideUser = await User.findByIdAndUpdate(
      newGuide.user,
      { role: "guide" },
      { new: true }
    );

    guideLogger.info("Guide registered", { guideId: newGuide._id, userId: newGuide.user });

    return res.status(201).json({
      success: true,
      message: "Local guide registered successfully.",
      guide: buildGuideOwnerPayload(newGuide, guideUser),
    });
  } catch (error) {
    guideLogger.error("Guide registration failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Error registering local guide.",
    });
  }
};

export const findGuideByUser = async (req, res) => {
  try {
    const requestedUserId = req.body.user?.toString().trim() || req.user?._id?.toString();
    const targetUserId = isAdminRequest(req) ? requestedUserId : req.user?._id?.toString();

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }

    const guide = await LocalGuide.findOne({ user: targetUserId });

    if (!guide) {
      return res.status(404).json({ success: false, message: "Local guide not found." });
    }

    const userInfo = await User.findById(guide.user);

    return res.status(200).json({
      success: true,
      message: "Local guide found.",
      guide: buildGuideOwnerPayload(guide, userInfo),
    });
  } catch (error) {
    guideLogger.error("Guide lookup by user failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Error finding local guide.",
    });
  }
};

export const findGuideByCity = async (req, res) => {
  try {
    const city = req.body.city?.trim();

    if (!city) {
      return res.status(400).json({ success: false, message: "City is required." });
    }

    const guides = await LocalGuide.find({
      city: { $regex: new RegExp(city, "i") },
    }).populate("user", "_id username email fullname avatar");

    return res.status(200).json({
      success: true,
      msg: "Success",
      guides: guides.map((guide) => buildGuideSearchPayload(guide, guide.user)),
    });
  } catch (error) {
    guideLogger.error("Guide lookup by city failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Error in finding guides.",
    });
  }
};

export const findGuideById = async (req, res) => {
  try {
    const { guideId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(guideId)) {
      return res.status(400).json({ success: false, msg: "Invalid guide ID." });
    }

    const guide = await LocalGuide.findById(guideId).populate("user", "_id fullname email avatar");

    if (!guide) {
      return res.status(404).json({ success: false, msg: "Guide not found." });
    }

    return res.status(200).json({
      success: true,
      msg: "Success",
      guide: buildGuideDetailPayload(guide, guide.user),
    });
  } catch (error) {
    guideLogger.error("Guide lookup by ID failed", { error: error.message });
    return res.status(500).json({ success: false, msg: "Server error." });
  }
};

export const scheduleGuideCall = async (req, res) => {
  try {
    const { guideId, bookedBy, selectedDate, selectedSlot } = req.body;
    const requesterUserId = req.user?._id?.toString();

    if (!isAdminRequest(req) && bookedBy?.toString() !== requesterUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only schedule calls for your own account.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(guideId) ||
      !mongoose.Types.ObjectId.isValid(bookedBy)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid guide or user ID.",
      });
    }

    if (!selectedDate || !selectedSlot?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Schedule date and slot are required.",
      });
    }

    const normalizedTravelDate = new Date(selectedDate);

    if (Number.isNaN(normalizedTravelDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule date.",
      });
    }

    normalizedTravelDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (normalizedTravelDate < today) {
      return res.status(400).json({
        success: false,
        message: "Guide calls cannot be scheduled in the past.",
      });
    }

    const trimmedSlot = selectedSlot.trim();
    const dayStart = new Date(normalizedTravelDate);
    const dayEnd = new Date(normalizedTravelDate);
    dayEnd.setHours(23, 59, 59, 999);

    const [guide, user, conflictingBooking] = await Promise.all([
      LocalGuide.findById(guideId),
      User.findById(bookedBy),
      BookingGuide.findOne({
        guide: guideId,
        travelDate: {
          $gte: dayStart,
          $lte: dayEnd,
        },
        timeSlot: trimmedSlot,
        status: { $in: GUIDE_BOOKING_ACTIVE_STATUSES },
      }),
    ]);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found.",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: "This guide already has a call scheduled for the selected slot.",
      });
    }

    const booking = await BookingGuide.create({
      guide: guide._id,
      bookedBy: user._id,
      bookingReference: createBookingReference(),
      travelDate: normalizedTravelDate,
      timeSlot: trimmedSlot,
      status: "Confirmed",
      notes: `Scheduled by ${user.fullname}`,
    });

    guideLogger.info("Guide call scheduled", {
      guideId,
      bookedBy,
      bookingId: booking._id,
    });

    return res.status(201).json({
      success: true,
      booked: true,
      message: "Guide call scheduled successfully.",
      booking,
    });
  } catch (error) {
    guideLogger.error("Guide call scheduling failed", { error: error.message });
    return res.status(500).json({
      success: false,
      booked: false,
      message: "Unable to schedule guide call.",
    });
  }
};

export const getContactThread = async (req, res) => {
  try {
    const { guideId, userId } = req.params;

    if (!isAdminRequest(req) && userId !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own conversations.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(guideId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid guide or user ID.",
      });
    }

    const existingThread = await GuideConversation.findOne({
      guide: guideId,
      traveler: userId,
    })
      .populate({
        path: "guide",
        select: "city country picture user",
        populate: {
          path: "user",
          select: "_id fullname email avatar",
        },
      })
      .populate("traveler", "_id fullname email avatar");

    if (existingThread) {
      return res.status(200).json({
        success: true,
        thread: buildConversationPayload(existingThread),
      });
    }

    const [guide, traveler] = await Promise.all([
      LocalGuide.findById(guideId).populate("user", "_id fullname email avatar"),
      User.findById(userId).select("_id fullname email avatar"),
    ]);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found.",
      });
    }

    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      thread: {
        _id: null,
        guide: buildGuideContactPayload(guide),
        traveler: buildTravelerPayload(traveler),
        latestMessagePreview: "",
        lastMessageAt: null,
        messages: [],
      },
    });
  } catch (error) {
    guideLogger.error("Guide contact thread fetch failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to load the conversation.",
    });
  }
};

export const sendContactMessage = async (req, res) => {
  try {
    const { guideId, userId, text, senderType = "traveler" } = req.body;

    if (senderType === "traveler" && !isAdminRequest(req) && userId?.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only send messages as yourself.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(guideId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid guide or user ID.",
      });
    }

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required.",
      });
    }

    if (!["traveler", "guide"].includes(senderType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sender type.",
      });
    }

    const [guide, traveler] = await Promise.all([
      LocalGuide.findById(guideId),
      User.findById(userId),
    ]);

    if (senderType === "guide") {
      if (!req.user || !["guide", "admin"].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Only guides can send guide-side messages.",
        });
      }

      if (!isAdminRequest(req) && guide?.user?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only reply from your own guide profile.",
        });
      }
    }

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found.",
      });
    }

    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let thread = await GuideConversation.findOne({
      guide: guideId,
      traveler: userId,
    });

    if (!thread) {
      thread = await GuideConversation.create({
        guide: guideId,
        traveler: userId,
      });
    }

    const trimmedText = text.trim();

    thread.messages.push({
      senderType,
      text: trimmedText,
      createdAt: new Date(),
    });
    thread.latestMessagePreview = trimmedText.slice(0, 160);
    thread.lastMessageAt = new Date();
    await thread.save();

    const populatedThread = await getPopulatedConversationById(thread._id);

    guideLogger.info("Guide contact message created", {
      guideId,
      userId,
      threadId: thread._id,
    });

    return res.status(201).json({
      success: true,
      thread: buildConversationPayload(populatedThread),
    });
  } catch (error) {
    guideLogger.error("Guide contact message failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to send the message.",
    });
  }
};

export const getContactHistoryByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isAdminRequest(req) && userId !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own contact history.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const [threads, calls] = await Promise.all([
      GuideConversation.find({ traveler: userId })
        .populate({
          path: "guide",
          select: "city country picture user",
          populate: {
            path: "user",
            select: "_id fullname email avatar",
          },
        })
        .populate("traveler", "_id fullname email avatar")
        .sort({ lastMessageAt: -1, updatedAt: -1 }),
      BookingGuide.find({ bookedBy: userId })
        .populate({
          path: "guide",
          select: "city country picture user",
          populate: {
            path: "user",
            select: "_id fullname email avatar",
          },
        })
        .sort({ travelDate: 1, createdAt: -1 }),
    ]);

    return res.status(200).json({
      success: true,
      history: {
        conversations: threads.map(buildConversationPayload),
        calls: calls.map(buildCallHistoryPayload),
      },
    });
  } catch (error) {
    guideLogger.error("Guide contact history fetch failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to load calls and messages history.",
    });
  }
};

export const bookGuideAfterPayment = async (req, res) => {
  try {
    const { guideId, bookedBy, startDate, endDate, paymentIntentId, notes = "" } = req.body;

    if (!isAdminRequest(req) && bookedBy?.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only book guides for your own account.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(guideId) || !mongoose.Types.ObjectId.isValid(bookedBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid guide or user ID.",
      });
    }

    if (!paymentIntentId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    const existingBooking = await GuideHireBooking.findOne({
      paymentIntentId: paymentIntentId.trim(),
    });

    if (existingBooking) {
      return res.status(200).json({
        success: true,
        booked: true,
        message: "Guide already booked for this payment.",
        booking: existingBooking,
      });
    }

    let dateRange;

    try {
      dateRange = calculateGuideBookingDays(startDate, endDate);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateRange.startDate < today) {
      return res.status(400).json({
        success: false,
        message: "Guide bookings cannot start in the past.",
      });
    }

    const [guide, user] = await Promise.all([LocalGuide.findById(guideId), User.findById(bookedBy)]);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found.",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const overlappingBooking = await GuideHireBooking.findOne({
      guide: guideId,
      status: { $in: GUIDE_BOOKING_ACTIVE_STATUSES },
      startDate: { $lte: dateRange.endDate },
      endDate: { $gte: dateRange.startDate },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: "This guide already has a paid booking during the selected dates.",
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId.trim());

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment is not completed yet.",
      });
    }

    if (paymentIntent.metadata?.bookingType !== "guide") {
      return res.status(400).json({
        success: false,
        message: "This payment was not created for a guide booking.",
      });
    }

    if (paymentIntent.metadata?.guideId && paymentIntent.metadata.guideId !== guide._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Payment guide details do not match the selected booking.",
      });
    }

    const pricing = calculateGuideBookingPricing(guide.dailyRate, dateRange.totalDays);
    const paidAmountInCents = Number(paymentIntent.amount_received || paymentIntent.amount || 0);

    if (
      paymentIntent.metadata?.bookingDays &&
      Number(paymentIntent.metadata.bookingDays) !== pricing.totalDays
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment duration does not match the selected booking dates.",
      });
    }

    if (paidAmountInCents !== pricing.amountInCents) {
      return res.status(400).json({
        success: false,
        message: "Payment amount does not match the selected guide rate.",
      });
    }

    const booking = await GuideHireBooking.create({
      guide: guide._id,
      bookedBy: user._id,
      bookingReference: createGuideHireReference(),
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      totalDays: pricing.totalDays,
      dailyRate: pricing.dailyRate,
      totalPrice: pricing.totalPrice,
      paymentStatus: "Paid",
      status: "Confirmed",
      paymentIntentId: paymentIntentId.trim(),
      notes: notes.trim(),
    });

    return res.status(201).json({
      success: true,
      booked: true,
      message: "Guide booked successfully.",
      booking,
    });
  } catch (error) {
    guideLogger.error("Guide booking failed", { error: error.message });
    return res.status(500).json({
      success: false,
      booked: false,
      message: "Unable to complete the guide booking.",
    });
  }
};

export const getGuideBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isAdminRequest(req) && userId !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own guide bookings.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const bookings = await GuideHireBooking.find({ bookedBy: userId })
      .populate({
        path: "guide",
        select: "city country picture dailyRate user",
        populate: {
          path: "user",
          select: "_id fullname email avatar",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings: bookings.map(buildGuideHireBookingPayload),
    });
  } catch (error) {
    guideLogger.error("Guide bookings fetch failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to load guide bookings right now.",
    });
  }
};

export const getGuideDashboard = async (req, res) => {
  try {
    const { guideId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(guideId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid guide ID.",
      });
    }

    const guide = await LocalGuide.findById(guideId);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found.",
      });
    }

    if (!isAdminRequest(req) && guide.user.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own guide dashboard.",
      });
    }

    const dashboard = await getGuideDashboardSummary(guideId);

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    guideLogger.error("Guide dashboard fetch failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to load the guide dashboard right now.",
    });
  }
};
