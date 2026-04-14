import { Router } from "express";
import {
  bookGuideAfterPayment,
  findGuideByCity,
  findGuideById,
  findGuideByUser,
  getGuideBookingsByUser,
  getGuideDashboard,
  getContactHistoryByUser,
  getContactThread,
  registerGuide,
  scheduleGuideCall,
  sendContactMessage,
} from "../controllers/Locaguide.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadTempImage } from "../middleware/multer.js";

const router = Router();

router.route("/register-guide").post(requireAuth, uploadTempImage.single("Photo"), registerGuide);
router.route("/find-guide").post(requireAuth, findGuideByUser);
router.route("/find-guideByCity").post(findGuideByCity);
router.route("/find-guide/:guideId").get(findGuideById);
router.route("/dashboard/:guideId").get(requireAuth, getGuideDashboard);
router.route("/book-guide").post(requireAuth, bookGuideAfterPayment);
router.route("/guide-bookings/:userId").get(requireAuth, getGuideBookingsByUser);
router.route("/schedule-call").post(requireAuth, scheduleGuideCall);
router.route("/contact-history/:userId").get(requireAuth, getContactHistoryByUser);
router.route("/contact-thread/:guideId/:userId").get(requireAuth, getContactThread);
router.route("/contact-thread/message").post(requireAuth, sendContactMessage);

export default router;
