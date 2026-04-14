import React, { useMemo, useState } from "react";
import { FaCheckCircle, FaEnvelope, FaIdCard, FaMobileAlt } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

import { sendMail, verifyOtp } from "../../Apihandle/sendMail";
import apiClient from "../../shared/api/client";
import {
  GUIDE_VERIFICATION_COPY,
} from "../../features/guides/constants/dashboardContent";
import { TOAST_MESSAGES } from "../../shared/constants/strings";
import { getErrorMessage } from "../../shared/lib/error";
import { createLogger } from "../../shared/lib/logger";
import { toastService } from "../../shared/services/toast";

const verificationLogger = createLogger("guide-verification");

const Verification = ({ setVerification, setGuideInfo }) => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [debugOtp, setDebugOtp] = useState("");
  const [otp, setOtp] = useState("");

  const fieldConfig = useMemo(
    () => [
      {
        key: "mobile",
        label: GUIDE_VERIFICATION_COPY.mobileLabel,
        placeholder: "Enter your mobile number",
        value: mobile,
        onChange: setMobile,
        icon: FaMobileAlt,
        type: "text",
      },
      {
        key: "email",
        label: GUIDE_VERIFICATION_COPY.emailLabel,
        placeholder: "Enter your email address",
        value: email,
        onChange: setEmail,
        icon: FaEnvelope,
        type: "email",
      },
      {
        key: "aadhaar",
        label: GUIDE_VERIFICATION_COPY.governmentIdLabel,
        placeholder: "Enter your government ID",
        value: aadhaar,
        onChange: setAadhaar,
        icon: FaIdCard,
        type: "text",
      },
    ],
    [aadhaar, email, mobile]
  );

  const handleSendOtp = async () => {
    if (!email || !mobile || !aadhaar) {
      toastService.warning("Complete your contact and ID details before requesting the OTP.");
      return;
    }

    try {
      const { data } = await apiClient.post(sendMail, { email });
      setVerificationToken(data.verificationToken || "");
      setDebugOtp(data.debugOtp || "");
      setOtpSent(true);
      verificationLogger.debug("OTP sent");
      toastService.success(TOAST_MESSAGES.otpSent);
      if (data.debugOtp) {
        toastService.info(`Local mail fallback active. Debug OTP: ${data.debugOtp}`);
      }
    } catch (error) {
      verificationLogger.error("OTP send failed", error);
      toastService.error(getErrorMessage(error, TOAST_MESSAGES.otpSendFailed));
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      toastService.warning("Enter the OTP that was sent to your email.");
      return;
    }

    try {
      await apiClient.post(verifyOtp, {
        email,
        otp,
        verificationToken,
      });

      toastService.success(TOAST_MESSAGES.otpVerified);
      setGuideInfo({ mobile, email, aadhaar, otp: debugOtp || otp });
      verificationLogger.debug("Verified", { mobile, email, aadhaar });
      setVerification(false);
    } catch (error) {
      toastService.error(getErrorMessage(error, TOAST_MESSAGES.otpInvalid));
      verificationLogger.warn("OTP verification failed.", error);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
      <div className="rounded-[32px] border border-sand-dark bg-[linear-gradient(135deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury">
        <span className="eyebrow-label">{GUIDE_VERIFICATION_COPY.eyebrow}</span>
        <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-cream">
          {GUIDE_VERIFICATION_COPY.title}
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-8 text-sand/80">
          {GUIDE_VERIFICATION_COPY.body}
        </p>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
            Verification note
          </p>
          <p className="mt-4 text-sm leading-7 text-sand/78">
            {GUIDE_VERIFICATION_COPY.otpHint}
          </p>
        </div>
      </div>

      <div className="relative rounded-[32px] border border-sand-dark/70 bg-warm-white p-6 shadow-soft dark:border-white/10 dark:bg-[#18211E] sm:p-8">
        <button
          type="button"
          onClick={() => setVerification(false)}
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand-dark bg-white text-forest transition hover:bg-sand dark:border-white/10 dark:bg-white/5 dark:text-sand"
          aria-label="Close verification"
        >
          <IoCloseCircle className="text-xl" />
        </button>

        <div className="grid gap-5">
          {fieldConfig.map((field) => {
            const Icon = field.icon;

            return (
              <label key={field.key} className="grid gap-2">
                <span className="text-sm font-medium text-slate dark:text-sand">
                  <Icon className="mr-2 inline" />
                  {field.label}
                </span>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                  className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                />
              </label>
            );
          })}

          {otpSent && (
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate dark:text-sand">
                <FaCheckCircle className="mr-2 inline" />
                {GUIDE_VERIFICATION_COPY.otpLabel}
              </span>
              <input
                type="text"
                placeholder="Enter the code from your email"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
              />
            </label>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {!otpSent ? (
              <button onClick={handleSendOtp} type="button" className="brand-button">
                {GUIDE_VERIFICATION_COPY.sendOtp}
              </button>
            ) : (
              <button onClick={handleVerify} type="button" className="brand-button">
                {GUIDE_VERIFICATION_COPY.verifyOtp}
              </button>
            )}
            <button
              type="button"
              onClick={() => setVerification(false)}
              className="brand-button-secondary dark:border-white/10 dark:bg-white/5 dark:text-sand"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
