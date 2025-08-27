import {
  IBaseEntity,
  IPaginateQuery,
  ISortOption,
  IPaginateResponse,
} from "./common.interface";
import { CONTACT_CHANNEL } from "constants/enum/player.enum";
import { ISession } from "./session.interface";

export enum Role {
  USER = "user",
  ADMIN = "admin",
  MEMBER = "member",
}

export enum MembershipLevel {
  USER = "user",
  MEMBER = "member",
}

export interface IUser extends IBaseEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  membershipLevel: MembershipLevel;
  noShowCount?: number;
  isBanned: boolean;
  lastSignInAt?: string;
  role?: Role; // Optional field for local state management
}

export type IUserCreate = Omit<IUser, "id">;

export interface IUserPaginateQuery extends IPaginateQuery {
  sortOptions?: ISortOption[];
  search?: string;
}

export interface IUserCountResponse {
  count: number;
}

export interface IUserPaginateResponse extends IPaginateResponse<IUser> {}

export interface IUpdateUserRoleRequest {
  role: Role;
}

export interface IUpdateMembershipLevelRequest {
  membershipLevel: MembershipLevel;
}
