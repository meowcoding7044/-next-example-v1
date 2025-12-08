import axios from "axios";
import { clearUser } from "@/shared/stores/auth.store";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      // Clear local user and redirect to login
      try {
        clearUser();
      } catch (e) {}
      window.location.href = "/auth/login";
    }
    if (err.response?.status === 403) {
      // optional: redirect or show forbidden
    }
    return Promise.reject(err);
  }
);
