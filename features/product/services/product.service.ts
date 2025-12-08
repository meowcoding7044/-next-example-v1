import { apiClient } from "@/shared/lib/api-client";
import { ProductListResponse, Product, ProductCreate } from "../../../shared/types";

export const productService = {
  list: async (q = "", page = 1, pageSize = 10): Promise<ProductListResponse> => {
    const { data } = await apiClient.get<ProductListResponse>("/products", {
      params: { q, page, pageSize },
    });
    return data;
  },
  create: async (p: ProductCreate) => {
    const { data } = await apiClient.post<Product>("/products", p);
    return data;
  },
  update: async (id: string, p: Partial<Product>) => {
    const { data } = await apiClient.put<Product>("/products/" + id, p);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await apiClient.delete<{ success: boolean }>("/products/" + id);
    return data;
  },
};
