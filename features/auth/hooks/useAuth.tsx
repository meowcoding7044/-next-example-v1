"use client";
import { useAuthStore } from "@/shared/stores/auth.store";
import { authService } from "../services/auth.service";

export function useAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  async function login(email: string, password: string) {
    const res = await authService.login(email, password);
    setToken(res.accessToken);
    setUser(res.user);
    return res;
  }
  function logout() {
    setToken(null);
    setUser(null);
    window.location.href = "/auth/login";
  }
  return { login, logout };
}
