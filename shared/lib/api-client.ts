import axios from "axios";
import { getToken, clearToken } from "@/shared/stores/auth.store";
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  withCredentials: true,
});
apiClient.interceptors.request.use((cfg) => {
  const t = getToken();
  console.log("getToken : ", t);
  if (t && cfg.headers) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      console.log("clearToken()");
      window.location.href = "/auth/login";
    }
    if (err.response?.status === 403) {
      //window.location.href = "/";
    }
    return Promise.reject(err);
  }
);
