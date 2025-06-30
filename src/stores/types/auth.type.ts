import { IAuthUser } from "interfaces/auth.interface";

export type TAuth = {
  user: IAuthUser | null;
  token: string | null;
  refreshToken: string | null;
  setUser: (player: IAuthUser | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  clear: () => void;
};
