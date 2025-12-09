"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export function useUserMutations() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueriesData({ queryKey: ["users"] });
      queryClient.setQueriesData({ queryKey: ["users"] }, (old: any) => {
        if (!old) return old;
        const data = old.data || old;
        const newData = data.filter((it: any) => it.id !== id);
        // preserve shape: if old had {data, meta} keep that structure
        if (old.data) return { ...old, data: newData, meta: { ...old.meta, total: Math.max(0, (old.meta?.total || 1) - 1) } };
        return newData;
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => userService.create(payload),
    onMutate: async (payload: any) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueriesData({ queryKey: ["users"] });
      queryClient.setQueriesData({ queryKey: ["users"] }, (old: any) => {
        if (!old) return old;
        const data = old.data || old;
        const temp = { ...payload, id: `__temp__${Date.now()}` };
        const newData = [temp, ...data];
        if (old.data) return { ...old, data: newData, meta: { ...old.meta, total: (old.meta?.total || 0) + 1 } };
        return newData;
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => userService.update(id, payload),
    onMutate: async ({ id, payload }: any) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueriesData({ queryKey: ["users"] });
      queryClient.setQueriesData({ queryKey: ["users"] }, (old: any) => {
        if (!old) return old;
        const data = old.data || old;
        const newData = (data || []).map((it: any) => (String(it.id) === String(id) ? { ...it, ...payload } : it));
        if (old.data) return { ...old, data: newData };
        return newData;
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { deleteMutation, createMutation, updateMutation };
}
