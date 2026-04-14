import React, { useEffect, useState } from "react";
import { FcCheckmark } from "react-icons/fc";
import { IoIosArrowForward } from "react-icons/io";

import CapturePhoto from "./CapturePhoto";
import GuideQuestions from "./GuideQuestions";
import { GUIDE_PROFILE_COPY } from "../../features/guides/constants/dashboardContent";

function CompleteProfile({ setProfileComp, setGuideData }) {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCaptureImage, setShowCaptureImage] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(false);

  useEffect(() => {
    if (image) {
      setImageCaptured(true);
      const previewUrl = URL.createObjectURL(image);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [image]);

  if (showCaptureImage) {
    return (
      <CapturePhoto
        setImage={setImage}
        setShowCaptureImage={setShowCaptureImage}
        setImageCaptured={setImageCaptured}
      />
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[32px] border border-sand-dark bg-[linear-gradient(135deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury">
        <span className="eyebrow-label">Guide profile</span>
        <h2 className="mt-6 text-4xl font-semibold leading-tight text-cream">
          {GUIDE_PROFILE_COPY.title}
        </h2>
        <p className="mt-5 text-sm leading-8 text-sand/80">{GUIDE_PROFILE_COPY.body}</p>

        <button
          type="button"
          className="mt-8 flex w-full items-start justify-between rounded-[28px] border border-white/10 bg-white/10 p-6 text-left backdrop-blur-md transition hover:bg-white/15"
          onClick={() => setShowCaptureImage(true)}
        >
          <div>
            <h3 className="text-xl font-semibold text-cream">
              {imageCaptured ? GUIDE_PROFILE_COPY.photoComplete : GUIDE_PROFILE_COPY.photoTitle}
            </h3>
            <p className="mt-2 text-sm leading-7 text-sand/78">
              {imageCaptured
                ? GUIDE_PROFILE_COPY.photoCompleteBody
                : GUIDE_PROFILE_COPY.photoPending}
            </p>
          </div>
          <div className="mt-1 text-3xl">
            {imageCaptured ? <FcCheckmark /> : <IoIosArrowForward className="text-sand" />}
          </div>
        </button>

        {imageCaptured && imagePreview && (
          <div className="mt-8 flex justify-center">
            <img
              src={imagePreview}
              alt="Guide preview"
              className="h-40 w-40 rounded-full object-cover ring-4 ring-white/20"
            />
          </div>
        )}
      </div>

      <GuideQuestions
        setGuideData={setGuideData}
        setProfileComp={setProfileComp}
        imageCaptured={imageCaptured}
        image={image}
      />
    </div>
  );
}

export default CompleteProfile;
