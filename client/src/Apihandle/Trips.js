import { API_ROUTES } from "../shared/config/api";

const host = API_ROUTES.trips;

export const RegisterTour = `${host}/register-trip`;
export const FindTripsByLocalGuide = `${host}/trips`;
export const FeaturedTrips = `${host}/featured-trips`;
export const BookTrip = `${host}/book-trip`;
export const BookedTripsByUser = `${host}/booked-trips`;
export const FindTripsByLocation = `${host}/find-trips`;
export const FindtripDetail = `${host}/find-trip`;
export const UpdateTrip = `${host}/trips`;
export const UpdateTripStatus = `${host}/trips`;
export const DeleteTrip = `${host}/trips`;
