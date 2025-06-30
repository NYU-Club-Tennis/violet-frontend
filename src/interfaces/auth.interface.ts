import { IUser } from "./user.interface";

export interface IAuthUser
  extends Pick<
    IUser,
    "id" | "firstName" | "lastName" | "email" | "createdAt"
  > {}

export interface IAuthValidateCodeResponse {
  email: string;
}

export interface IAuthCreateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface IAuthUserResponse {
  user: IUser;
  token: string;
  refreshToken: string;
}
export interface IAuthLoginRequest {
  email: string;
  password: string;
}
