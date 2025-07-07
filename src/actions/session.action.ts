import { IPaginateResponse } from "interfaces/common.interface";
import { ISession, ISessionPaginateQuery } from "interfaces/session.interface";
import { fetch } from "../utils/fetch.util";

const url = "session";

export const getSessionPaginate = (query: ISessionPaginateQuery) => {
  const method = "GET";
  const path = `${url}/paginate`;

  return fetch<IPaginateResponse<ISession>>(method, path, query);
};
