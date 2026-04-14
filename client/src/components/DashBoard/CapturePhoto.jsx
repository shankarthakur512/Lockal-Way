import React, { useEffect, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { GUIDE_CAPTURE_COPY } from "../../features/guides/constants/dashboardContent";
import { createLogger } from "../../shared/lib/logger";
import { toastService } from "../../shared/services/toast";

const captureLogger = createLogger("guide-capture-photo");

function CapturePhoto({ setImage, setShowCaptureImage, setImageCaptured }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        captureLogger.error("Unable to access camera", error);
        toastService.error("Camera access is required to capture your verification photo.");
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleCapturePhoto = () => {
    if (!videoRef.current) {
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toastService.error("Unable to capture a photo right now. Please try again.");
          return;
        }

        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        setImage(file);
        setImageCaptured(true);
        setShowCaptureImage(false);
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[32px] border border-sand-dark/70 bg-warm-white p-6 shadow-soft dark:border-white/10 dark:bg-[#18211E] sm:p-8">
        <span className="eyebrow-label">{GUIDE_CAPTURE_COPY.eyebrow}</span>
        <h2 className="mt-6 text-3xl font-semibold text-forest dark:text-cream">
          {GUIDE_CAPTURE_COPY.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate dark:text-sand/75">
          {GUIDE_CAPTURE_COPY.body}
        </p>

        <div className="mt-8 overflow-hidden rounded-[28px] border border-sand-dark bg-ink shadow-soft dark:border-white/10">
          <video
            className="aspect-video w-full object-cover"
            autoPlay
            muted
            playsInline
            ref={videoRef}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="brand-button-secondary gap-2 dark:border-white/10 dark:bg-white/5 dark:text-sand"
            onClick={() => setShowCaptureImage(false)}
          >
            <IoIosArrowBack />
            {GUIDE_CAPTURE_COPY.back}
          </button>
          <button type="button" className="brand-button" onClick={handleCapturePhoto}>
            {GUIDE_CAPTURE_COPY.capture}
          </button>
        </div>
      </div>

      <div className="rounded-[32px] border border-sand-dark bg-[linear-gradient(135deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
          {GUIDE_CAPTURE_COPY.previewTitle}
        </p>
        <p className="mt-4 text-sm leading-7 text-sand/78">
          {GUIDE_CAPTURE_COPY.previewBody}
        </p>
        <ul className="mt-8 grid gap-4">
          {GUIDE_CAPTURE_COPY.guidelines.map((guideline) => (
            <li
              key={guideline}
              className="rounded-[22px] border border-white/10 bg-white/10 px-5 py-4 text-sm leading-7 text-sand/85 backdrop-blur-md"
            >
              {guideline}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CapturePhoto;
