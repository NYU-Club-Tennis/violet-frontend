import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TAuth } from "./types/auth.type";

export const AuthStore = create(
  persist<TAuth>(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      setUser: (user) => {
        set({ user });
      },
      setToken: (token) => {
        set({ token });
      },
      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
      },
      clear: () => {
        set({ user: null, token: null, refreshToken: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
