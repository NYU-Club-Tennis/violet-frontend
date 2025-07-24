import {
  IUser,
  IUserCountResponse,
  IUserPaginateQuery,
  IUserPaginateResponse,
} from "interfaces/user.interface";
import { fetch } from "../utils/fetch.util";

const url = "user";

export const getCurrentUser = () => {
  const method = "GET";
  const path = `${url}/current`;

  return fetch<IUser>(method, path);
};

export const getTotalUsersCount = () => {
  const method = "GET";
  const path = `${url}/count`;

  return fetch<IUserCountResponse>(method, path);
};

export const getUsersPaginate = (query: IUserPaginateQuery) => {
  const method = "GET";
  const path = `${url}/paginate`;

  return fetch<IUserPaginateResponse>(method, path, query);
};
