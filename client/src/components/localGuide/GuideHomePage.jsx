import React, { useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addGuide } from "../../Redux/GuideSlice";
import { findGuideByUserId } from "../../Apihandle/LocalGuide";
import apiClient from "../../shared/api/client";
import { APP_ROUTES } from "../../shared/constants/routes";
import { createLogger } from "../../shared/lib/logger";
import WorkwithUs from "./Workwithus";
import {
  GUIDE_LANDING_BENEFITS,
  GUIDE_LANDING_CONTENT,
  GUIDE_LANDING_STEPS,
  GUIDE_LANDING_TESTIMONIALS,
} from "../../features/guides/constants/dashboardContent";

const guideLandingLogger = createLogger("guide-landing");

function GuideHomePage() {
  const status = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const guideData = useSelector((state) => state.Guide.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData || guideData) {
      return;
    }

    const findGuide = async () => {
      try {
        const { data } = await apiClient.post(findGuideByUserId, { user: userData._id });

        if (data.success && data.guide) {
          dispatch(addGuide({ userData: data.guide }));
        }
      } catch (error) {
        guideLandingLogger.warn("Unable to look up guide profile", error);
      }
    };

    findGuide();
  }, [dispatch, guideData, userData]);

  const handlePrimaryAction = () => {
    if (!status) {
      navigate(APP_ROUTES.login);
      return;
    }

    navigate(APP_ROUTES.dashboard);
  };

  const primaryCtaLabel = guideData
    ? GUIDE_LANDING_CONTENT.heroCtaGuide
    : status
      ? GUIDE_LANDING_CONTENT.heroCtaMember
      : GUIDE_LANDING_CONTENT.heroCtaGuest;

  return (
    <div className="min-h-screen bg-cream pb-20 pt-24 dark:bg-charcoal">
      <div className="section-shell grid gap-12">
        <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(135deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury sm:px-12 sm:py-14">
            <div className="relative">
              <span className="eyebrow-label">{GUIDE_LANDING_CONTENT.eyebrow}</span>
              <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight text-cream sm:text-5xl">
                {GUIDE_LANDING_CONTENT.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-sand/80 sm:text-base">
                {GUIDE_LANDING_CONTENT.heroBody}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={handlePrimaryAction} className="brand-button">
                  {primaryCtaLabel}
                </button>
                <button
                  onClick={() => navigate(APP_ROUTES.search)}
                  className="brand-button-secondary dark:border-white/10 dark:bg-white/5 dark:text-sand"
                >
                  Explore traveler experience
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {GUIDE_LANDING_BENEFITS.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-md"
                  >
                    <p className="text-lg font-semibold text-cream">{benefit.title}</p>
                    <p className="mt-3 text-sm leading-7 text-sand/75">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
            <div className="flex items-center gap-3 text-forest dark:text-sand">
              <IoLocationOutline className="text-2xl" />
              <span className="text-sm font-semibold uppercase tracking-[0.22em]">
                {GUIDE_LANDING_CONTENT.stepsHeading}
              </span>
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-forest dark:text-cream">
              A clear path from profile creation to hosted trips
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate dark:text-sand/75">
              {GUIDE_LANDING_CONTENT.stepsBody}
            </p>

            <div className="mt-8 grid gap-4">
              {GUIDE_LANDING_STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[24px] border border-sand-dark/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#101714]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-forest dark:text-cream">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate dark:text-sand/75">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          {GUIDE_LANDING_TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.name}
              className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                {testimonial.role}
              </p>
              <p className="mt-5 text-lg leading-8 text-forest dark:text-cream">
                "{testimonial.quote}"
              </p>
              <p className="mt-6 text-sm font-semibold text-slate dark:text-sand/75">
                {testimonial.name}
              </p>
            </article>
          ))}
        </section>

        <WorkwithUs />
      </div>
    </div>
  );
}

export default GuideHomePage;
