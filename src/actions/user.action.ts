import {
  IUser,
  IUserCountResponse,
  IUserPaginateQuery,
  IUserPaginateResponse,
  IUpdateUserRoleRequest,
  IUpdateMembershipLevelRequest,
  Role,
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

export const updateUserRole = (
  userId: number,
  roleData: IUpdateUserRoleRequest
) => {
  const method = "PATCH";
  const path = `${url}/${userId}/role`;

  return fetch<IUser>(method, path, roleData);
};

export const updateMembershipLevel = (
  userId: number,
  membershipData: IUpdateMembershipLevelRequest
) => {
  const method = "PATCH";
  const path = `${url}/${userId}/membership-level`;

  return fetch<IUser>(method, path, membershipData);
};

export const getUserEmailsByRoles = (roles: Role[]) => {
  const method = "GET";
  const path = `${url}/emails-by-roles`;

  // Create URLSearchParams to properly serialize array parameters
  const params = new URLSearchParams();
  roles.forEach((role) => {
    params.append("roles", role);
  });

  // Add the query string to the path
  const queryString = params.toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;

  return fetch<{ emails: string[] }>(method, fullPath);
};

export const getAllClubMembers = () => {
  const method = "GET";
  const path = `${url}/club-members`;

  return fetch<{ emails: string[] }>(method, path);
};

export const searchUsers = (searchQuery: string, limit: number = 10) => {
  const method = "GET";
  const path = `${url}/search`;

  const query = {
    query: searchQuery,
    limit,
  };

  return fetch<{
    users: Array<{
      firstName: string;
      lastName: string;
      email: string;
    }>;
  }>(method, path, query);
};

export const updateUser = (userId: number, userData: Partial<IUser>) => {
  const method = "PATCH";
  const path = `${url}/${userId}`;

  return fetch<IUser>(method, path, userData);
};

export const userExists = (email: string) => {
  const method = "GET";
  const path = `${url}/exists`;
  const query = { email } as any;
  return fetch<{ exists: boolean }>(method, path, query);
};

export const updateUserBanStatus = (userId: number, isBanned: boolean) => {
  const method = "PATCH";
  const path = `${url}/${userId}/ban-status`;
  return fetch<IUser>(method, path, { isBanned });
};
