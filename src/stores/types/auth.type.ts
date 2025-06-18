import { IAuthUser } from "interfaces/auth.interface";

export type TAuth = {
  player: IAuthUser | null;
  token: string | null;
  refreshToken: string | null;
  setPlayer: (player: IAuthUser | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  clear: () => void;
};
