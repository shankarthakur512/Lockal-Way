import { Router } from "express";
import { CheckUser, GoogleAuthUser, LoginUser, registerUser } from "../controllers/user.controller.js";
import { uploadTempImage } from "../middleware/multer.js";

const router = Router();

// Keep the same route names the frontend already calls.
router.route("/register-user").post(uploadTempImage.single("avatar"), registerUser);
router.route("/login-user").post(LoginUser);
router.route("/check-user").post(CheckUser);
router.route("/google-auth").post(GoogleAuthUser);

export default router;
