import { API_ROUTES } from "../shared/config/api";

const host = API_ROUTES.users;

export const registerUser = `${host}/register-user`;
export const loginUser = `${host}/login-user`;
export const CheckUser = `${host}/check-user`;
export const googleAuthUser = `${host}/google-auth`;
