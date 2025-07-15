import {
  ICreateRegistration,
  IRegistration,
  IGetRegistrationHistoryQuery,
} from "interfaces/registration.interface";
import { fetch } from "../utils/fetch.util";

const url = "registration";

export const createRegistration = (payload: ICreateRegistration) => {
  const method = "POST";
  const path = `${url}`;

  return fetch<IRegistration>(method, path, payload);
};

export const getCurrentUserRegistrations = (
  query?: IGetRegistrationHistoryQuery
) => {
  const method = "GET";
  const path = `${url}/current`;

  return fetch<IRegistration[]>(method, path, query);
};

export const getUserRegistrations = (
  userId: number,
  query?: IGetRegistrationHistoryQuery
) => {
  const method = "GET";
  const path = `${url}/user/${userId}`;

  return fetch<IRegistration[]>(method, path, query);
};
