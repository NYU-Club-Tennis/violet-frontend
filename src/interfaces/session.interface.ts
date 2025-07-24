import { IBaseEntity, IPaginateQuery, ISortOption } from "./common.interface";
import { LEVELS } from "../constants/enum/levels.enum";
import { SessionStatus } from "constants/enum/session.status.enum";

export interface ISession extends IBaseEntity {
  id: number;
  location: string;
  name: string;
  date: string;
  skillLevels: LEVELS[];
  time: string;
  spotsAvailable: number;
  spotsTotal: number;
  status: SessionStatus;
  notes?: string;
  registration?: any; // TODO: Add proper registration interface when available
}

export interface ISessionCreate {
  name: string;
  location: string;
  date: string;
  time: string;
  skillLevels: LEVELS[];
  spotsTotal: number;
  spotsAvailable: number;
  status?: SessionStatus;
  notes?: string;
}

export interface ISessionUpdate {
  name?: string;
  location?: string;
  date?: string;
  time?: string;
  skillLevels?: LEVELS[];
  spotsTotal?: number;
  spotsAvailable?: number;
  status?: SessionStatus;
  notes?: string;
}

export type ISessionUpdateOld = Omit<ISession, "id">;

export interface ISessionPaginateQuery extends IPaginateQuery {
  sortOptions: ISortOption[];
  skillLevels?: LEVELS[];
}

export interface ISessionCountResponse {
  count: number;
}
