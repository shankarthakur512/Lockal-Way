import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { createLogger } from "../utils/logger.js";

const mailLogger = createLogger("sendmail-controller");
const OTP_VERIFICATION_EXPIRY = "10m";

const createTransporter = () => {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
};

const generateOtp = () =>
  Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");

const hashOtp = (otp) =>
  crypto
    .createHash("sha256")
    .update(`${otp}:${process.env.OTP_TOKEN_SECRET || "otp-secret"}`)
    .digest("hex");

const buildVerificationToken = (email, otp) =>
  jwt.sign(
    {
      email,
      otpHash: hashOtp(otp),
    },
    process.env.OTP_TOKEN_SECRET || "otp-secret",
    {
      expiresIn: OTP_VERIFICATION_EXPIRY,
    }
  );

export const Sendmail = async (req, res) => {
  try {
    const email = req.body.email?.trim();

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const otp = generateOtp();
    const transporter = createTransporter();
    const verificationToken = buildVerificationToken(email, otp);
    const responsePayload = {
      success: true,
      verificationToken,
      message: "OTP sent successfully.",
    };

    if (!transporter) {
      mailLogger.warn("Mail credentials missing. Returning debug OTP in local fallback mode.", {
        email,
      });
      return res.status(200).json({
        ...responsePayload,
        debugOtp: process.env.NODE_ENV === "production" ? undefined : otp,
        message: "OTP generated in local fallback mode.",
      });
    }

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "The Verification Code",
      text: `Your OTP is ${otp}`,
    });

    mailLogger.info("OTP email sent", { email });

    return res.status(200).json(responsePayload);
  } catch (error) {
    mailLogger.error("OTP send failed", { error: error.message });
    return res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const otp = req.body.otp?.trim();
    const verificationToken = req.body.verificationToken?.trim();

    if (!email || !otp || !verificationToken) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and verification token are required.",
      });
    }

    const decoded = jwt.verify(
      verificationToken,
      process.env.OTP_TOKEN_SECRET || "otp-secret"
    );

    if (decoded.email !== email || decoded.otpHash !== hashOtp(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    mailLogger.error("OTP verification failed", { error: error.message });
    return res.status(400).json({
      success: false,
      message: "OTP is invalid or expired.",
    });
  }
};
