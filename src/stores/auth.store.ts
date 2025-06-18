import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TAuth } from "./types/auth.type";

export const AuthStore = create(
  persist<TAuth>(
    (set) => ({
      player: null,
      token: null,
      refreshToken: null,
      setPlayer: (player) => {
        set({ player });
      },
      setToken: (token) => {
        set({ token });
      },
      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
      },
      clear: () => {
        set({ player: null, token: null, refreshToken: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
