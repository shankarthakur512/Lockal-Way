import { API_ROUTES } from "../shared/config/api";

const host = API_ROUTES.guides;

export const registerGuide = `${host}/register-guide`;
export const findGuideByUserId = `${host}/find-guide`;
export const findGuideByCity = `${host}/find-guideByCity`;
export const findGuide = `${host}/find-guide`;
export const scheduleGuideCall = `${host}/schedule-call`;
export const bookGuide = `${host}/book-guide`;
export const guideBookingsByUser = `${host}/guide-bookings`;
export const guideContactHistory = `${host}/contact-history`;
export const guideContactThread = `${host}/contact-thread`;
export const guideContactMessage = `${host}/contact-thread/message`;
export const guideDashboard = `${host}/dashboard`;
