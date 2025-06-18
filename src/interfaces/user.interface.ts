import { IBaseEntity, IPaginateQuery, ISortOption } from "./common.interface";
import { CONTACT_CHANNEL } from "constants/enum/player.enum";
import { ISession } from "./session.interface";

export interface IUser extends IBaseEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

export type IUserCreate = Omit<IUser, "id">;

export interface IUserPaginateQuery extends IPaginateQuery {
  sortOptions: ISortOption[];
}
