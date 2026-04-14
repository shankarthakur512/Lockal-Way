const roundCurrency = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const calculateGuideBookingDays = (startDateValue, endDateValue) => {
  const startDate = new Date(startDateValue);
  const endDate = new Date(endDateValue);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error("A valid start and end date are required.");
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((endDate - startDate) / millisecondsPerDay) + 1;

  if (totalDays < 1) {
    throw new Error("End date must be on or after the start date.");
  }

  return {
    startDate,
    endDate,
    totalDays,
  };
};

export const calculateGuideBookingPricing = (dailyRate, totalDays) => {
  const normalizedRate = Number(dailyRate);
  const normalizedDays = Number(totalDays);

  if (!Number.isFinite(normalizedRate) || normalizedRate < 0) {
    throw new Error("Guide daily rate must be a valid positive number.");
  }

  if (!Number.isInteger(normalizedDays) || normalizedDays < 1) {
    throw new Error("Guide booking must be at least 1 day.");
  }

  const totalPrice = roundCurrency(normalizedRate * normalizedDays);

  return {
    dailyRate: normalizedRate,
    totalDays: normalizedDays,
    totalPrice,
    amountInCents: Math.round(totalPrice * 100),
  };
};
