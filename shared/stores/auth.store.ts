import { create } from "zustand";
import { User } from "@/shared/types";

type State = {
  user: User | null;
  token: string | null;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  rehydrated: boolean;
  setRehydrated: (v: boolean) => void;
};

export const useAuthStore = create<State>((set) => ({
  user: null,
  token: null,
  rehydrated: false,
  setRehydrated: (v) => set({ rehydrated: v }),
  setUser: (u) => {
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem("user", JSON.stringify(u));
      else localStorage.removeItem("user");
    }
    set({ user: u });
  },
  setToken: (t) => {
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem("access_token", t);
      else localStorage.removeItem("access_token");
    }
    set({ token: t });
  },
}));

//Rehydrate store
export function initAuthStore() {
  if (typeof window === "undefined") return;

  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("access_token");

  if (savedUser) useAuthStore.setState({ user: JSON.parse(savedUser) });
  if (savedToken) useAuthStore.setState({ token: savedToken });
  useAuthStore.getState().setRehydrated(true);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }
  useAuthStore.getState().setUser(null);
  useAuthStore.getState().setToken(null);
}
