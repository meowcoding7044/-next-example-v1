"use client";
import { useAuthStore } from "@/shared/stores/auth.store";
import { authService } from "../services/auth.service";
import { clearUser } from "@/shared/stores/auth.store";

export function useAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  async function login(email: string, password: string) {
    const res = await authService.login(email, password);
    if (res?.success && res.user) {
      setUser(res.user);
    }
    return res;
  }
  async function logout() {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    }
    clearUser();
    window.location.href = "/auth/login";
  }
  return { login, logout };
}
