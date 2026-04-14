import React from "react";
import { FaStar } from "react-icons/fa";
import { HiOutlineArrowUpRight, HiOutlineLanguage, HiOutlineMapPin } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { getGuideDetailsRoute } from "../../shared/constants/routes";
import { getInitials } from "../../shared/lib/format";

function GuideCard({ guide }) {
  const navigate = useNavigate();
  const guideName = guide?.userInfo?.fullname || "Local guide";
  const languages = guide?.languages?.slice(0, 2)?.join(", ") || "Languages not listed";
  const ratingLabel = guide?.rating || "No reviews";

  return (
    <article
      className="group overflow-hidden rounded-[28px] border border-sand-dark/70 bg-warm-white shadow-soft transition duration-500 hover:-translate-y-2 hover:shadow-luxury dark:border-white/10 dark:bg-[#1B2421]"
      onClick={() => {
        navigate(getGuideDetailsRoute(guide._id));
      }}
    >
      <div className="relative overflow-hidden">
        {guide?.picture ? (
          <img
            src={guide.picture}
            alt={guideName}
            className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-72 items-center justify-center bg-[linear-gradient(135deg,#3D6B5A,#2C4A3E)] text-4xl font-semibold text-sand">
            {getInitials(guideName)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest shadow-sm">
          Verified Guide
        </div>
      </div>

      <div className="space-y-5 p-6 dark:text-cream">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            {guide?.city || "City not listed"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink dark:text-cream">{guideName}</h3>
        </div>

        <div className="grid gap-3 text-sm text-slate dark:text-sand/70">
          <div className="flex items-center gap-3">
            <HiOutlineMapPin className="text-clay" />
            <span>{guide?.address || guide?.country || "Destination not listed"}</span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineLanguage className="text-clay" />
            <span>{languages}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaStar className="text-gold" />
            <span>{ratingLabel}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-sand-dark pt-5 dark:border-white/10">
          <p className="line-clamp-1 text-sm text-mist dark:text-sand/50">
            {guide?.aboutYourself || "Local stories, practical planning, and warm support."}
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-forest dark:text-sand">
            Learn More
            <HiOutlineArrowUpRight className="transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default GuideCard;
