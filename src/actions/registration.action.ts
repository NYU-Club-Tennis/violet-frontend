import {
  IRegistrationWithUser,
  ISessionRegistrationsResponse,
} from "interfaces/registration.interface";
import { fetch } from "../utils/fetch.util";

const url = "registration";

export const getSessionRegistrationsWithUsers = (sessionId: number) => {
  const method = "GET";
  const path = `${url}/session/${sessionId}/users`;

  return fetch<ISessionRegistrationsResponse>(method, path);
};

export const getCurrentUserRegistrations = (query: any) => {
  const method = "GET";
  const path = `${url}/current`;

  return fetch<IRegistrationWithUser[]>(method, path, query);
};

export const getActiveRegistrationsCount = () => {
  const method = "GET";
  const path = `${url}/active/count`;

  return fetch<{ count: number }>(method, path);
};

export const markAttendance = (
  registrationId: number,
  hasAttended: boolean
) => {
  const method = "POST";
  const path = `${url}/${registrationId}/attendance`;

  return fetch<IRegistrationWithUser>(method, path, { hasAttended });
};

export const deleteRegistration = (registrationId: number) => {
  const method = "DELETE";
  const path = `${url}/${registrationId}`;

  return fetch(method, path);
};
