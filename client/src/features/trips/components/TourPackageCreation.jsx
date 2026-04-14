import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaHotel,
  FaImage,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaStar,
  FaTag,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RegisterTour } from "../../../Apihandle/Trips";
import apiClient from "../../../shared/api/client";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { TOAST_MESSAGES } from "../../../shared/constants/strings";
import { getErrorMessage } from "../../../shared/lib/error";
import { createLogger } from "../../../shared/lib/logger";
import { toastService } from "../../../shared/services/toast";

const tripCreationLogger = createLogger("trip-creation");

const TOUR_TYPE_OPTIONS = [
  "Cultural",
  "Religious",
  "Honeymoon",
  "Solo Trip",
  "Adventure",
  "Luxury",
  "Eco Tour",
  "Family",
  "Group Tour",
];

const TOUR_CREATION_COPY = {
  eyebrow: "Guide package builder",
  title: "Create a trip travelers can trust at a glance.",
  body:
    "Add the essentials clearly so your package looks polished on the traveler side and is easier to compare during search.",
  submit: "Publish package",
};

const TourPackageCreation = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [hotelRating, setHotelRating] = useState(0);
  const guideData = useSelector((state) => state.Guide.userData);
  const navigate = useNavigate();

  useEffect(() => {
    if (!guideData) {
      navigate(APP_ROUTES.login);
    }
  }, [guideData, navigate]);

  const formFields = useMemo(
    () => [
      {
        name: "tripName",
        label: "Trip Name",
        placeholder: "Enter the name of the trip",
        icon: FaTag,
        rules: { required: "Trip name is required" },
      },
      {
        name: "location",
        label: "Location",
        placeholder: "Enter the trip location",
        icon: FaLocationArrow,
        rules: { required: "Location is required" },
      },
      {
        name: "hotel",
        label: "Hotel",
        placeholder: "Hotel name or details",
        icon: FaHotel,
        rules: { required: "Hotel details are required" },
      },
      {
        name: "price",
        label: "Price",
        placeholder: "Enter the price",
        icon: FaDollarSign,
        type: "number",
        rules: { required: "Price is required" },
      },
      {
        name: "startingDate",
        label: "Starting Date",
        icon: FaCalendarAlt,
        type: "date",
        rules: { required: "Starting date is required" },
      },
      {
        name: "duration",
        label: "Duration (days)",
        placeholder: "How many days?",
        icon: FaCalendarAlt,
        type: "number",
        rules: { required: "Duration is required" },
      },
    ],
    []
  );

  const handlePhotoUpload = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const nextPhotos = [...photos, ...selectedFiles];

    setPhotos(nextPhotos);
    setPhotoPreviews((current) => [
      ...current,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ]);
    setValue("photos", nextPhotos);
  };

  const handleRatingChange = (rating) => {
    setHotelRating(rating);
    setValue("hotelRating", rating);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("createdBy", guideData._id);
      formData.append("tripName", data.tripName);
      formData.append("Location", data.location);
      formData.append("type", data.tourType);
      formData.append("hotel", data.hotel);
      formData.append("hotelRating", hotelRating);
      formData.append("itinerary", data.itinerary);
      formData.append("price", data.price);
      formData.append("startingDate", data.startingDate);
      formData.append("duration", data.duration);

      photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const response = await apiClient.post(RegisterTour, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      tripCreationLogger.info("Tour package registered", response.data);
      toastService.success(TOAST_MESSAGES.tripCreated);
      navigate(APP_ROUTES.dashboard);
    } catch (error) {
      tripCreationLogger.error("Error registering tour package", error);
      toastService.error(getErrorMessage(error, "Error registering tour package."));
    }
  };

  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 dark:bg-charcoal">
      <div className="section-shell">
        <section className="overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(135deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury sm:px-12 sm:py-14">
          <span className="eyebrow-label">{TOUR_CREATION_COPY.eyebrow}</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            {TOUR_CREATION_COPY.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-sand/80 sm:text-base">
            {TOUR_CREATION_COPY.body}
          </p>
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="surface-panel mt-8 grid gap-6 p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {formFields.map((fieldConfig) => {
              const Icon = fieldConfig.icon;

              return (
                <label key={fieldConfig.name} className="grid gap-2">
                  <span className="text-sm font-medium text-slate dark:text-sand">
                    <Icon className="mr-2 inline" />
                    {fieldConfig.label}
                    <span className="text-terracotta"> *</span>
                  </span>
                  <Controller
                    name={fieldConfig.name}
                    control={control}
                    defaultValue=""
                    rules={fieldConfig.rules}
                    render={({ field }) => (
                      <input
                        {...field}
                        type={fieldConfig.type || "text"}
                        className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                        placeholder={fieldConfig.placeholder}
                      />
                    )}
                  />
                  {errors[fieldConfig.name] && (
                    <p className="text-xs text-terracotta">{errors[fieldConfig.name].message}</p>
                  )}
                </label>
              );
            })}
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_auto]">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate dark:text-sand">
                <FaMapMarkerAlt className="mr-2 inline" />
                Tour Type <span className="text-terracotta">*</span>
              </span>
              <Controller
                name="tourType"
                control={control}
                defaultValue=""
                rules={{ required: "Tour type is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                  >
                    <option value="" disabled>
                      Select tour type
                    </option>
                    {TOUR_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.tourType && (
                <p className="text-xs text-terracotta">{errors.tourType.message}</p>
              )}
            </label>

            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate dark:text-sand">
                <FaStar className="mr-2 inline" />
                Hotel Rating <span className="text-terracotta">*</span>
              </span>
              <div className="flex h-full items-center gap-2 rounded-2xl border border-sand-dark bg-white px-4 py-4 dark:border-white/10 dark:bg-[#101714]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => handleRatingChange(star)}>
                    <FaStar className={star <= hotelRating ? "text-gold" : "text-sand-dark"} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate dark:text-sand">
              Itinerary <span className="text-terracotta">*</span>
            </span>
            <Controller
              name="itinerary"
              control={control}
              defaultValue=""
              rules={{ required: "Itinerary is required" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={5}
                  className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                  placeholder="Outline the day-by-day experience, highlights, and what makes this trip special."
                />
              )}
            />
            {errors.itinerary && (
              <p className="text-xs text-terracotta">{errors.itinerary.message}</p>
            )}
          </label>

          <div className="grid gap-2">
            <span className="text-sm font-medium text-slate dark:text-sand">
              <FaImage className="mr-2 inline" />
              Trip Photos
            </span>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-sand-dark bg-sand/30 px-6 py-10 text-center dark:border-white/10 dark:bg-white/5">
              <input type="file" multiple className="hidden" onChange={handlePhotoUpload} />
              <span className="text-sm font-semibold text-forest dark:text-cream">
                Upload destination and stay photos
              </span>
              <span className="mt-2 text-sm text-mist dark:text-sand/55">
                Add multiple images to make the package feel complete.
              </span>
            </label>
          </div>

          {photoPreviews.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {photoPreviews.map((preview) => (
                <img
                  key={preview}
                  src={preview}
                  alt="Trip preview"
                  className="h-40 w-full rounded-[24px] object-cover shadow-soft"
                />
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-sand-dark/70 pt-6 dark:border-white/10">
            <button type="submit" className="brand-button">
              {TOUR_CREATION_COPY.submit}
            </button>
            <button
              type="button"
              onClick={() => navigate(APP_ROUTES.dashboard)}
              className="brand-button-secondary dark:border-white/10 dark:bg-white/5 dark:text-sand"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourPackageCreation;
