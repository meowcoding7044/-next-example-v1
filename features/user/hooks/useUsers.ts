"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export function useUsers() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.list(),
    staleTime: 1000 * 30,
  });

  const rows = query.data?.data || query.data || [];

  function reload() {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  }

  return {
    rows,
    isLoading: query.isLoading,
    error: query.error,
    reload,
  };
}
