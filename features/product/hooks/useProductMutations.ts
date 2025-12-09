"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import { ProductCreate } from "@/shared/types";

export function useProductMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: ProductCreate) => productService.create(payload),
    onMutate: async (newProduct: ProductCreate) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueriesData({ queryKey: ["products"] });
      const temp = { id: `tmp-${Date.now()}`, ...newProduct } as any;
      queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
        if (!old) return { data: [temp], meta: { page: 1, pageSize: 10, total: 1 } };
        return { ...old, data: [temp, ...old.data], meta: { ...old.meta, total: (old.meta?.total || 0) + 1 } };
      });
      return { previous };
    },
    onError: (err, vars, context: any) => {
      if (context?.previous) {
        for (const [key, data] of context.previous as Array<any>) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: any) => productService.update(id, patch),
    onMutate: async ({ id, patch }: any) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueriesData({ queryKey: ["products"] });
      queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
        if (!old) return old;
        return { ...old, data: old.data.map((it: any) => (it.id === id ? { ...it, ...patch } : it)) };
      });
      return { previous };
    },
    onError: (err, vars, context: any) => {
      if (context?.previous) {
        for (const [key, data] of context.previous as Array<any>) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueriesData({ queryKey: ["products"] });
      queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
        if (!old) return old;
        return { ...old, data: old.data.filter((it: any) => it.id !== id), meta: { ...old.meta, total: Math.max(0, (old.meta?.total || 1) - 1) } };
      });
      return { previous };
    },
    onError: (err, vars, context: any) => {
      if (context?.previous) {
        for (const [key, data] of context.previous as Array<any>) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
