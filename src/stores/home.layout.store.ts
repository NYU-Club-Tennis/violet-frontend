import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { THomeLayout } from "./types/home.layout.types.store";

export const HomeLayoutStore = create(
  persist<THomeLayout>(
    (set) => ({
      loadWelcome: "true",
      setLoadWelcome: (loadWelcome) => set({ loadWelcome }),
    }),
    {
      name: "home-layout-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
