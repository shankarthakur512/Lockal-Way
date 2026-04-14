import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import GoogleMap from "../GoogleMap/GoogleMap";
import { ENV_CONFIG } from "../../shared/config/env";
import { createLogger } from "../../shared/lib/logger";
import { toastService } from "../../shared/services/toast";
import {
  GUIDE_ADDRESS_COPY,
} from "../../features/guides/constants/dashboardContent";

const MAP_API_KEY = ENV_CONFIG.mapApiKey;
const CSC_API_KEY = ENV_CONFIG.countryStateCityApiKey;
const addressLogger = createLogger("guide-address");

const axiosInstance = axios.create({
  headers: {
    "X-CSCAPI-KEY": CSC_API_KEY,
  },
});

function Address({ setVerifyAddress, setGuideAddress }) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      country: "",
      city: "",
      street: "",
      pincode: "",
    },
  });

  const handleForm = (data) => {
    setGuideAddress({ ...data });
    setVerifyAddress(false);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      if (!CSC_API_KEY) {
        toastService.error("Country and city lookup is not configured yet.");
        return;
      }

      try {
        const response = await axiosInstance.get("https://api.countrystatecity.in/v1/countries");
        setCountries(response.data);
      } catch (error) {
        addressLogger.error("Failed to fetch countries", error);
        toastService.error("Unable to load countries right now.");
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry || !CSC_API_KEY) {
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await axiosInstance.get(
          `https://api.countrystatecity.in/v1/countries/${selectedCountry}/cities`
        );
        setCities(response.data);
      } catch (error) {
        addressLogger.error("Failed to fetch cities", error);
        toastService.error("Unable to load cities for the selected country.");
      }
    };

    fetchCities();
  }, [selectedCountry]);

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    setSelectedCountry(countryCode);
    setValue("country", countryCode);
    setValue("city", "");
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: nextLatitude, longitude: nextLongitude } = position.coords;
        setLatitude(nextLatitude);
        setLongitude(nextLongitude);
      },
      (error) => {
        addressLogger.warn(error.message);
      }
    );
  }, []);

  return (
    <div className="grid gap-8">
      <section className="overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(135deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury sm:px-12 sm:py-14">
        <span className="eyebrow-label">{GUIDE_ADDRESS_COPY.eyebrow}</span>
        <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight text-cream sm:text-5xl">
          {GUIDE_ADDRESS_COPY.title}
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-8 text-sand/80 sm:text-base">
          {GUIDE_ADDRESS_COPY.body}
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
          <h2 className="text-2xl font-semibold text-forest dark:text-cream">
            {GUIDE_ADDRESS_COPY.mapTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/75">
            Your current location helps confirm the place you guide from.
          </p>
          <div className="mt-6 overflow-hidden rounded-[28px] border border-sand-dark/70 dark:border-white/10">
            <GoogleMap apiKey={MAP_API_KEY} longitude={longitude} latitude={latitude} />
          </div>
        </section>

        <section className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
          <h2 className="text-2xl font-semibold text-forest dark:text-cream">
            {GUIDE_ADDRESS_COPY.formTitle}
          </h2>

          <form onSubmit={handleSubmit(handleForm)} className="mt-6 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate dark:text-sand">
                  {GUIDE_ADDRESS_COPY.countryLabel}
                </span>
                <select
                  {...register("country")}
                  className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                  onChange={handleCountryChange}
                  defaultValue=""
                >
                  <option value="" disabled>
                    {GUIDE_ADDRESS_COPY.countryPlaceholder}
                  </option>
                  {countries.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate dark:text-sand">
                  {GUIDE_ADDRESS_COPY.cityLabel}
                </span>
                <select
                  {...register("city")}
                  className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {GUIDE_ADDRESS_COPY.cityPlaceholder}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate dark:text-sand">
                  {GUIDE_ADDRESS_COPY.streetLabel}
                </span>
                <input
                  {...register("street")}
                  className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                  placeholder={GUIDE_ADDRESS_COPY.streetPlaceholder}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate dark:text-sand">
                  {GUIDE_ADDRESS_COPY.pincodeLabel}
                </span>
                <input
                  type="number"
                  {...register("pincode")}
                  className="rounded-2xl border border-sand-dark bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
                  placeholder={GUIDE_ADDRESS_COPY.pincodePlaceholder}
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button className="brand-button" type="submit">
                {GUIDE_ADDRESS_COPY.submit}
              </button>
              <button
                type="button"
                onClick={() => setVerifyAddress(false)}
                className="brand-button-secondary dark:border-white/10 dark:bg-white/5 dark:text-sand"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Address;
