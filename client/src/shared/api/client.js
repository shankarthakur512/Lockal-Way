import axios from "axios";
import store from "../../Redux/store";
import { logout } from "../../Redux/authslice";

const apiClient = axios.create({
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = store.getState()?.auth?.accessToken;

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && store.getState()?.auth?.status) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export default apiClient;
