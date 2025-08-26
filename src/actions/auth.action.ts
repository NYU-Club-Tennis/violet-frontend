import { IUser } from "interfaces/user.interface";
import { fetch } from "../utils/fetch.util";
import {
  IAuthCreateProfileRequest,
  IAuthLoginRequest,
  IAuthUserResponse,
  IAuthValidateCodeResponse,
} from "interfaces/auth.interface";

const url = "auth";

export const userSignUp = (email: string) => {
  const method = "POST";
  const path = `${url}/signup`;

  return fetch<IUser>(method, path, { email });
};

export const validateCode = (query: string) => {
  const method = "GET";
  const path = `${url}/validate-code?token=${query}`;

  return fetch<IAuthValidateCodeResponse>(method, path);
};

export const createProfile = (payload: IAuthCreateProfileRequest) => {
  const method = "POST";
  const path = `${url}/create-profile`;

  return fetch<IAuthUserResponse>(method, path, payload);
};

export const login = (payload: IAuthLoginRequest) => {
  const method = "POST";
  const path = `${url}/login`;

  return fetch<IAuthUserResponse>(method, path, payload);
};

export const forgotPassword = (email: string) => {
  const method = "POST";
  const path = `${url}/forgot-password`;

  return fetch<{ message: string }>(method, path, { email });
};

export const resetPassword = (
  email: string,
  password: string,
  token: string
) => {
  const method = "POST";
  const path = `${url}/reset-password`;

  return fetch<{ success: boolean }>(method, path, { email, password, token });
};

export const changePassword = (
  currentPassword: string,
  newPassword: string
) => {
  const method = "POST";
  const path = `${url}/change-password`;

  return fetch<{ success: boolean }>(method, path, {
    currentPassword,
    newPassword,
  });
};
