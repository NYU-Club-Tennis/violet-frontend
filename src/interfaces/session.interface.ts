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

export type ISessionCreate = Omit<ISession, "id">;

export interface ISessionPaginateQuery extends IPaginateQuery {
  sortOptions: ISortOption[];
  skillLevels?: LEVELS[];
}
