import { apiClient } from "@/shared/lib/api-client";
export const userService = {
  list: async () => {
    const { data } = await apiClient.get("/users");
    return data;
  },
  remove: async (id: string) => {
    const { data } = await apiClient.delete("/users/" + id);
    return data;
  },
  create: async (payload: any) => {
    const { data } = await apiClient.post("/users", payload);
    return data;
  },
  update: async (id: string, payload: any) => {
    const { data } = await apiClient.put("/users/" + id, payload);
    return data;
  },
};
