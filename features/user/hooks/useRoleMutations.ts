"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export function useRoleMutations() {
  const queryClient = useQueryClient();

  const updateRoles = useMutation({
    mutationFn: ({ id, roles }: { id: string; roles: string[] }) => userService.update(id, { roles }),
    onMutate: async ({ id, roles }: { id: string; roles: string[] }) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueriesData({ queryKey: ["users"] });
      queryClient.setQueriesData({ queryKey: ["users"] }, (old: any) => {
        if (!old) return old;
        const data = old.data || old;
        const newData = data.map((u: any) => (u.id === id ? { ...u, roles } : u));
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
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return { updateRoles };
}
