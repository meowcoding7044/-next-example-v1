import { apiClient } from "@/shared/lib/api-client";
export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post("/auth/login", { email, password });
    return data;
  },
};
