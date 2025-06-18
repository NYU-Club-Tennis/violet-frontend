import { IUser } from "./user.interface";

export interface IAuthUser
  extends Pick<
    IUser,
    "id" | "firstName" | "lastName" | "email" | "createdAt"
  > {}
