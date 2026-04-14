import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { APP_ROUTES } from "../../shared/constants/routes";
import { formatCurrency } from "../../shared/lib/format";
import { BOOKING_MODAL_COPY } from "../../features/trips/constants/content";
import { TOAST_MESSAGES } from "../../shared/constants/strings";
import { toastService } from "../../shared/services/toast";

const TravelerField = ({ label, type = "text", value, onChange }) => (
  <label className="grid gap-2">
    <span className="text-sm font-medium text-slate dark:text-sand">{label}</span>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border border-sand-dark bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
      required
    />
  </label>
);

const BookingModal = ({ onClose, tripData }) => {
  const [personDetails, setPersonDetails] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [currentPerson, setCurrentPerson] = useState({ name: "", govtId: "", age: "" });
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.status);

  const totalPersons = personDetails.length;
  const totalCost = tripData.price * totalPersons;
  const finalCost = totalCost;

  const summaryRows = useMemo(
    () => [
      { label: BOOKING_MODAL_COPY.basePrice, value: formatCurrency(tripData.price) },
      { label: BOOKING_MODAL_COPY.totalTravelers, value: totalPersons },
      { label: BOOKING_MODAL_COPY.subtotal, value: formatCurrency(totalCost) },
    ],
    [totalCost, totalPersons, tripData.price]
  );

  const handlePersonDetailChange = (field, value) => {
    setCurrentPerson((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSavePerson = () => {
    setPersonDetails((current) => [...current, currentPerson]);
    setCurrentPerson({ name: "", govtId: "", age: "" });
    setIsPopupOpen(false);
  };

  const handleBooking = () => {
    if (!isLoggedIn) {
      toastService.warning(TOAST_MESSAGES.signInRequired);
      navigate(APP_ROUTES.login);
      return;
    }

    if (!acceptedTerms) {
      return;
    }

    navigate(APP_ROUTES.payment, {
      state: { personDetails, totalCost, finalCost, tripData },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/70 px-4 backdrop-blur-sm">
      <div className="surface-panel relative flex w-full max-w-6xl flex-col p-6 dark:border-white/10 dark:bg-[#18211E] sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-50 text-2xl font-bold text-mist transition hover:text-ink dark:hover:text-cream"
        >
          ×
        </button>

        <div className="mb-6 rounded-[28px] bg-[linear-gradient(130deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-8 text-cream">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            {BOOKING_MODAL_COPY.reviewTitle}
          </p>
          <h2 className="mt-3 text-4xl font-semibold">
            {tripData.tripName}
          </h2>
          <p className="mt-3 text-sm text-sand/75">
            {tripData.duration} nights - {BOOKING_MODAL_COPY.basePrice}: {formatCurrency(tripData.price)}
          </p>
        </div>

        <div className="mb-6 rounded-[24px] border border-sand-dark bg-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
            {BOOKING_MODAL_COPY.instructionTitle}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/70">
            {BOOKING_MODAL_COPY.instructionBody}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <button
              className="brand-button mb-5 w-full rounded-full"
              onClick={() => setIsPopupOpen(true)}
            >
              {BOOKING_MODAL_COPY.addTraveler}
            </button>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              {personDetails.map((person, index) => (
                <div
                  key={`${person.name}-${index}`}
                  className="rounded-[24px] border border-sand-dark bg-warm-white p-5 dark:border-white/10 dark:bg-white/5"
                >
                  <h3 className="mb-3 text-lg font-semibold text-forest dark:text-cream">
                    Traveller {index + 1}
                  </h3>
                  <div className="space-y-1 text-sm text-slate dark:text-sand/70">
                    <p><strong>{BOOKING_MODAL_COPY.name}:</strong> {person.name}</p>
                    <p><strong>{BOOKING_MODAL_COPY.governmentId}:</strong> {person.govtId}</p>
                    <p><strong>{BOOKING_MODAL_COPY.age}:</strong> {person.age}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="brand-button w-full rounded-full"
              onClick={handleBooking}
              disabled={!personDetails.length || !acceptedTerms}
            >
              {BOOKING_MODAL_COPY.proceed}
            </button>
          </div>

          <aside className="rounded-[28px] border border-sand-dark bg-sand/30 p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-2xl font-semibold text-forest dark:text-cream">
              {BOOKING_MODAL_COPY.priceSummary}
            </h2>

            <div className="mt-6 space-y-4 border-b border-sand-dark pb-6 dark:border-white/10">
              {summaryRows.map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4 text-sm">
                  <span className="text-slate dark:text-sand/70">{label}</span>
                  <span className="font-semibold text-forest dark:text-cream">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between text-lg font-semibold text-forest dark:text-cream">
              <p>{BOOKING_MODAL_COPY.totalPayable}</p>
              <p>{formatCurrency(finalCost)}</p>
            </div>

            <label className="mt-6 inline-flex items-center gap-3 text-sm text-slate dark:text-sand/70">
              <input
                type="checkbox"
                id="terms"
                className="h-5 w-5 rounded border-sand-dark text-forest"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              <span>
                I agree to the{" "}
                <span className="cursor-pointer font-semibold text-forest dark:text-sand">
                  {BOOKING_MODAL_COPY.terms}
                </span>
                .
              </span>
            </label>
          </aside>
        </div>

        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm">
            <div className="surface-panel relative w-full max-w-lg p-8 dark:border-white/10 dark:bg-[#18211E]">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="absolute right-4 top-4 text-2xl font-bold text-mist transition hover:text-ink dark:hover:text-cream"
              >
                ×
              </button>

              <h3 className="mb-6 text-2xl font-semibold text-forest dark:text-cream">
                {BOOKING_MODAL_COPY.travelerDetails}
              </h3>

              <div className="space-y-4">
                <TravelerField
                  label={BOOKING_MODAL_COPY.name}
                  value={currentPerson.name}
                  onChange={(event) => handlePersonDetailChange("name", event.target.value)}
                />
                <TravelerField
                  label={BOOKING_MODAL_COPY.governmentId}
                  value={currentPerson.govtId}
                  onChange={(event) => handlePersonDetailChange("govtId", event.target.value)}
                />
                <TravelerField
                  label={BOOKING_MODAL_COPY.age}
                  type="number"
                  value={currentPerson.age}
                  onChange={(event) => handlePersonDetailChange("age", event.target.value)}
                />
              </div>

              <button
                className="brand-button mt-6 w-full rounded-full"
                onClick={handleSavePerson}
                disabled={!currentPerson.name || !currentPerson.govtId || !currentPerson.age}
              >
                {BOOKING_MODAL_COPY.saveTraveler}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
