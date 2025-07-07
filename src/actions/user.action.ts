import { IUser } from "interfaces/user.interface";
import { fetch } from "../utils/fetch.util";

const url = "user";

export const getCurrentUser = () => {
  const method = "GET";
  const path = `${url}/current`;

  return fetch<IUser>(method, path);
};
