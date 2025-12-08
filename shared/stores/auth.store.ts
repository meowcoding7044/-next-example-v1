import { create } from "zustand";
import { User } from "@/shared/types";

type State = {
  user: User | null;
  setUser: (u: User | null) => void;
  rehydrated: boolean;
  setRehydrated: (v: boolean) => void;
};

export const useAuthStore = create<State>((set) => ({
  user: null,
  rehydrated: false,
  setRehydrated: (v) => set({ rehydrated: v }),
  setUser: (u) => {
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem("user", JSON.stringify(u));
      else localStorage.removeItem("user");
    }
    set({ user: u });
  },
}));

//Rehydrate store: try to load saved user or request /auth/me using cookies
export function initAuthStore() {
  if (typeof window === "undefined") return;

  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    useAuthStore.setState({ user: JSON.parse(savedUser) });
    useAuthStore.getState().setRehydrated(true);
    return;
  }

  // Try to fetch /auth/me using cookies (httpOnly tokens)
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  fetch(`${API}/auth/me`, { credentials: "include" })
    .then((r) => r.json())
    .then((data) => {
      if (data?.success && data.user) {
        useAuthStore.setState({ user: data.user });
      } else {
        useAuthStore.setState({ user: null });
      }
    })
    .catch(() => {
      useAuthStore.setState({ user: null });
    })
    .finally(() => useAuthStore.getState().setRehydrated(true));
}

export async function clearUser() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  try {
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
  } catch (e) {
    // ignore
  }
  if (typeof window !== "undefined") localStorage.removeItem("user");
  useAuthStore.getState().setUser(null);
}
