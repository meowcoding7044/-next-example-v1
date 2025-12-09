"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export function useRoles() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await userService.list();
      const users = res.data || res;
      const set = new Set<string>();
      (users || []).forEach((u: any) => (u.roles || []).forEach((r: string) => set.add(r)));
      return Array.from(set);
    },
    staleTime: 1000 * 30,
  });

  function reload() {
    queryClient.invalidateQueries({ queryKey: ["roles"] });
  }

  return {
    roles: query.data || [],
    isLoading: query.isLoading,
    reload,
  };
}
