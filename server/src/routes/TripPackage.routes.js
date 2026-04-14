import { Router } from "express";
import {
  bookTripAfterPayment,
  deleteTripPackage,
  getBookedTripsByUser,
  getFeaturedTrips,
  getTripByLocation,
  getTripDetailById,
  getTripsByLocalGuide,
  registerTourPackage,
  updateTripPackage,
  updateTripStatus,
} from "../controllers/TripPackage.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import uploadTripPhotos from "../middleware/multer.js";

const router = Router();

router
  .route("/register-trip")
  .post(
    requireAuth,
    requireRole("guide", "admin"),
    uploadTripPhotos.fields([{ name: "photos", maxCount: 10 }]),
    registerTourPackage
  );

router.get("/trips/:GuideId", requireAuth, requireRole("guide", "admin"), getTripsByLocalGuide);
router.patch(
  "/trips/:tripId",
  requireAuth,
  requireRole("guide", "admin"),
  uploadTripPhotos.fields([{ name: "photos", maxCount: 10 }]),
  updateTripPackage
);
router.patch("/trips/:tripId/status", requireAuth, requireRole("guide", "admin"), updateTripStatus);
router.delete("/trips/:tripId", requireAuth, requireRole("guide", "admin"), deleteTripPackage);
router.get("/featured-trips", getFeaturedTrips);
router.get("/booked-trips/:userId", requireAuth, getBookedTripsByUser);
router.post("/book-trip", requireAuth, bookTripAfterPayment);
router.post("/find-trips", getTripByLocation);
router.get("/find-trip/:tripId", getTripDetailById);

export default router;
