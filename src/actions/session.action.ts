import { IPaginateResponse } from "interfaces/common.interface";
import {
  ISession,
  ISessionPaginateQuery,
  ISessionCountResponse,
  ISessionCreate,
  ISessionUpdate,
} from "interfaces/session.interface";
import { fetch } from "../utils/fetch.util";

const url = "session";

export const getSessionPaginate = (query: ISessionPaginateQuery) => {
  const method = "GET";
  const path = `${url}/paginate`;

  return fetch<IPaginateResponse<ISession>>(method, path, query);
};

export const getActiveSessionsCount = () => {
  const method = "GET";
  const path = `${url}/active/count`;

  return fetch<ISessionCountResponse>(method, path);
};

export const createSession = (payload: ISessionCreate) => {
  const method = "POST";
  const path = `${url}`;

  return fetch<ISession>(method, path, payload);
};

export const updateSession = (id: number, payload: ISessionUpdate) => {
  const method = "PUT";
  const path = `${url}/${id}`;

  return fetch<ISession>(method, path, payload);
};

export const deleteSession = (id: number) => {
  const method = "DELETE";
  const path = `${url}/${id}`;

  return fetch<ISession>(method, path);
};

export const getUserSessions = (userId: number, type: "upcoming" | "past") => {
  const method = "GET";
  const path = `${url}/user/${userId}/${type}`;

  return fetch<ISession[]>(method, path);
};

export const cancelSessionRegistration = (sessionId: number) => {
  const method = "DELETE";
  const path = `${url}/${sessionId}/registration`;

  return fetch<{ success: boolean }>(method, path);
};
