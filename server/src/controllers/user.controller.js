import crypto from "crypto";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { createLogger } from "../utils/logger.js";

const userLogger = createLogger("user-controller");

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const normalizeUsername = (username = "") => username.trim().toLowerCase();
const normalizeGoogleId = (googleId = "") => googleId.toString().trim();

const buildUserAuthResponse = (user, accessToken, refreshToken) => ({
  success: true,
  message: "User authenticated successfully.",
  user,
  accessToken,
  refreshToken,
});

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");

  if (!user) {
    throw new Error("Unable to find user while generating tokens.");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const sanitizeUsernameCandidate = (value = "") => {
  const normalized = value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/^[._-]+|[._-]+$/g, "");

  return normalized || `traveler${Math.floor(1000 + Math.random() * 9000)}`;
};

const createUniqueUsername = async (baseValue) => {
  const baseUsername = sanitizeUsernameCandidate(baseValue);
  let attempt = baseUsername;
  let suffix = 1;

  while (await User.findOne({ username: attempt })) {
    attempt = `${baseUsername}${suffix}`;
    suffix += 1;
  }

  return attempt;
};

const buildDisplayNameFallback = (email = "") => {
  const localPart = normalizeEmail(email).split("@")[0] || "Traveler";
  return localPart
    .split(/[._-]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const verifyGoogleIdentity = async ({ idToken, accessToken }) => {
  if (idToken?.trim()) {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken.trim())}`
    );

    if (response.ok) {
      return response.json();
    }
  }

  if (accessToken?.trim()) {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken.trim()}`,
      },
    });

    if (response.ok) {
      return response.json();
    }
  }

  return null;
};

export const registerUser = async (req, res) => {
  try {
    const { fullname, email, username, password } = req.body;
    const avatarLocalPath = req.file?.path || null;

    if (![fullname, email, username, password].every((field) => field?.trim())) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedUsername = normalizeUsername(username);

    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with username or email already exists.",
      });
    }

    const avatarUpload = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;

    const user = await User.create({
      fullname: fullname.trim(),
      email: normalizedEmail,
      username: normalizedUsername,
      password,
      avatar: avatarUpload?.secure_url || avatarUpload?.url || "",
    });

    const createdUser = await User.findById(user._id);
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    userLogger.info("User registered", {
      userId: createdUser?._id,
      email: createdUser?.email,
    });

    return res
      .status(201)
      .cookie("accessToken", accessToken, buildCookieOptions())
      .cookie("refreshToken", refreshToken, buildCookieOptions())
      .json(buildUserAuthResponse(createdUser, accessToken, refreshToken));
  } catch (error) {
    userLogger.error("User registration failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to register user right now.",
    });
  }
};

export const CheckUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json(new ApiResponse(400, null, "Email is required."));
    }

    const user = await User.findOne({ email: normalizeEmail(email) });

    if (!user) {
      return res.status(200).json(new ApiResponse(404, null, "User not found."));
    }

    return res.status(200).json(new ApiResponse(200, user, "Success"));
  } catch (error) {
    userLogger.error("User lookup failed", { error: error.message });
    return res.status(500).json(new ApiResponse(500, null, "Unable to check user."));
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: normalizeEmail(email) }).select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message: "This account uses Google sign-in. Continue with Google to access it.",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id);

    userLogger.info("User logged in", { userId: user._id, email: user.email });

    return res
      .status(200)
      .cookie("accessToken", accessToken, buildCookieOptions())
      .cookie("refreshToken", refreshToken, buildCookieOptions())
      .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully."));
  } catch (error) {
    userLogger.error("User login failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to log in right now.",
    });
  }
};

export const GoogleAuthUser = async (req, res) => {
  try {
    const { idToken = "", accessToken = "", email = "", fullname = "", avatar = "" } = req.body;

    if (!idToken?.trim() && !accessToken?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Google authentication token is required.",
      });
    }

    const googleProfile = await verifyGoogleIdentity({ idToken, accessToken });

    if (!googleProfile) {
      return res.status(401).json({
        success: false,
        message: "Unable to verify your Google sign-in.",
      });
    }

    const normalizedEmail = normalizeEmail(googleProfile.email || email);
    const normalizedGoogleId = normalizeGoogleId(googleProfile.sub);
    const isEmailVerified = String(googleProfile.email_verified) === "true" || googleProfile.email_verified === true;

    if (!normalizedEmail || !normalizedGoogleId || !isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "Google sign-in did not return a verified email address.",
      });
    }

    const requestedEmail = normalizeEmail(email);

    if (requestedEmail && requestedEmail !== normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Google account details do not match the selected email.",
      });
    }

    let user = await User.findOne({
      $or: [{ googleId: normalizedGoogleId }, { email: normalizedEmail }],
    }).select("+refreshToken");

    if (!user) {
      const resolvedFullname =
        fullname?.trim() ||
        googleProfile.name?.trim() ||
        buildDisplayNameFallback(normalizedEmail) ||
        "Traveler";

      const resolvedUsername = await createUniqueUsername(
        normalizedEmail.split("@")[0] || resolvedFullname
      );

      user = await User.create({
        fullname: resolvedFullname,
        email: normalizedEmail,
        username: resolvedUsername,
        password: crypto.randomBytes(24).toString("hex"),
        avatar: avatar?.trim() || googleProfile.picture || "",
        googleId: normalizedGoogleId,
        authProvider: "google",
      });
    } else {
      const updates = {};

      if (!user.googleId) {
        updates.googleId = normalizedGoogleId;
      }

      if (!user.avatar && (avatar?.trim() || googleProfile.picture)) {
        updates.avatar = avatar?.trim() || googleProfile.picture;
      }

      if (!user.fullname && (fullname?.trim() || googleProfile.name?.trim())) {
        updates.fullname = fullname?.trim() || googleProfile.name?.trim();
      }

      if (Object.keys(updates).length > 0) {
        user = await User.findByIdAndUpdate(user._id, updates, {
          new: true,
        }).select("+refreshToken");
      }
    }

    const { accessToken: appAccessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id);

    userLogger.info("User authenticated with Google", {
      userId: user._id,
      email: normalizedEmail,
    });

    return res
      .status(200)
      .cookie("accessToken", appAccessToken, buildCookieOptions())
      .cookie("refreshToken", refreshToken, buildCookieOptions())
      .json(buildUserAuthResponse(loggedInUser, appAccessToken, refreshToken));
  } catch (error) {
    userLogger.error("Google auth failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Unable to continue with Google right now.",
    });
  }
};
