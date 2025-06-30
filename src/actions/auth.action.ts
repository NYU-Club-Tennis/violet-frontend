import { IUser } from "interfaces/user.interface";
import { fetch } from "../utils/fetch.util";
import {
  IAuthCreateProfileRequest,
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
