import { IBaseEntity, IPaginateQuery, ISortOption } from "./common.interface";
import { IUser } from "./user.interface";
import { LEVELS } from "../constants/enum/levels.enum";

export interface ISession extends IBaseEntity {
  id: number;
  location: string;
  name: string;
  date: string;
  skillLevel: string;
  time: string;
  spotsAvailable: number;
  spotsTotal: number;
}

export type ISessionCreate = Omit<ISession, "id">;

export interface ISessionPaginateQuery extends IPaginateQuery {
  sortOptions: ISortOption[];
}
