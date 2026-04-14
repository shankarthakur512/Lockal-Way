import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { GUIDE_LANGUAGE_OPTIONS } from "../../features/guides/constants/dashboardContent";
import { createLogger } from "../../shared/lib/logger";
import { toastService } from "../../shared/services/toast";

const guideQuestionsLogger = createLogger("guide-questions");

const GuideQuestions = ({ imageCaptured, setProfileComp, setGuideData, image }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isAccepted, setIsAccepted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const filteredLanguages = GUIDE_LANGUAGE_OPTIONS.filter(
    (language) =>
      language.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedLanguages.includes(language)
  );

  const handleAddLanguage = (language) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages((current) => [...current, language]);
    }

    setSearchTerm("");
  };

  const handleRemoveLanguage = (language) => {
    setSelectedLanguages((current) => current.filter((item) => item !== language));
  };

  const onSubmit = (data) => {
    if (!isAccepted || !imageCaptured) {
      toastService.error(
        "Accept the terms and capture your photo before submitting your guide profile."
      );
      return;
    }

    guideQuestionsLogger.info("Guide profile completed", data);
    setGuideData({ ...data, Languages: selectedLanguages, Photo: image });
    setProfileComp(false);
  };

  return (
    <div className="rounded-[28px] border border-sand-dark/70 bg-warm-white p-6 shadow-soft dark:border-white/10 dark:bg-[#18211E]">
      <h1 className="text-2xl font-semibold text-forest dark:text-cream">A few more details</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate dark:text-sand">
            Do you belong to the place where you want to serve?
          </span>
          <input
            type="text"
            className="rounded-2xl border border-sand-dark bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
            placeholder="Enter yes or no"
            {...register("placeBelonging", { required: true })}
          />
          {errors.placeBelonging && (
            <span className="text-sm text-terracotta">This field is required.</span>
          )}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate dark:text-sand">
            Languages you are comfortable with
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="rounded-2xl border border-sand-dark bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
            placeholder="Search for a language"
          />
        </label>

        {searchTerm && filteredLanguages.length > 0 && (
          <ul className="overflow-hidden rounded-2xl border border-sand-dark bg-white dark:border-white/10 dark:bg-[#101714]">
            {filteredLanguages.map((language) => (
              <li key={language}>
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left text-sm text-slate transition hover:bg-sand hover:text-forest dark:text-sand/80 dark:hover:bg-white/10 dark:hover:text-cream"
                  onClick={() => handleAddLanguage(language)}
                >
                  {language}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="grid gap-2">
          <span className="text-sm font-medium text-slate dark:text-sand">
            Selected languages
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.length > 0 ? (
              selectedLanguages.map((language) => (
                <div
                  key={language}
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-3 py-1.5 text-sm text-sand"
                >
                  <span>{language}</span>
                  <button type="button" onClick={() => handleRemoveLanguage(language)}>
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-mist dark:text-sand/55">No languages selected yet.</p>
            )}
          </div>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate dark:text-sand">About yourself</span>
          <textarea
            rows={4}
            className="rounded-2xl border border-sand-dark bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
            placeholder="Tell travelers about your style, local knowledge, and the experiences you can host."
            {...register("aboutYourself", { required: true })}
          />
          {errors.aboutYourself && (
            <span className="text-sm text-terracotta">This field is required.</span>
          )}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate dark:text-sand">
            Your daily guide charge (USD)
          </span>
          <input
            type="number"
            min="1"
            step="1"
            className="rounded-2xl border border-sand-dark bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
            placeholder="Enter your per day rate"
            {...register("dailyRate", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
          />
          {errors.dailyRate && (
            <span className="text-sm text-terracotta">Enter a valid daily rate greater than zero.</span>
          )}
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-sand-dark/70 bg-sand/40 px-4 py-4 dark:border-white/10 dark:bg-white/5">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-forest"
            checked={isAccepted}
            onChange={() => setIsAccepted((current) => !current)}
          />
          <span className="text-sm text-slate dark:text-sand">
            I accept the platform policy and terms so my guide profile can be reviewed.
          </span>
        </label>

        <button
          type="submit"
          className={`${
            isAccepted && imageCaptured
              ? "brand-button"
              : "cursor-not-allowed rounded-full bg-sand-dark px-6 py-3 text-sm font-semibold text-mist"
          }`}
          disabled={!isAccepted || !imageCaptured}
        >
          Save guide profile
        </button>
      </form>
    </div>
  );
};

export default GuideQuestions;
