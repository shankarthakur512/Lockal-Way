export const TRIP_DISCOUNT_RATE = 0.1;

const roundCurrency = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const calculateTripPricing = (unitPrice, travellerCount) => {
  const normalizedUnitPrice = Number(unitPrice);
  const normalizedTravellerCount = Number(travellerCount);

  if (!Number.isFinite(normalizedUnitPrice) || normalizedUnitPrice < 0) {
    throw new Error("Trip price must be a valid positive number.");
  }

  if (!Number.isInteger(normalizedTravellerCount) || normalizedTravellerCount < 1) {
    throw new Error("Traveller count must be at least 1.");
  }

  const subtotal = roundCurrency(normalizedUnitPrice * normalizedTravellerCount);
  const discountAmount = roundCurrency(subtotal * TRIP_DISCOUNT_RATE);
  const totalPrice = roundCurrency(subtotal - discountAmount);

  return {
    unitPrice: normalizedUnitPrice,
    travellerCount: normalizedTravellerCount,
    subtotal,
    discountAmount,
    totalPrice,
    amountInCents: Math.round(totalPrice * 100),
  };
};
