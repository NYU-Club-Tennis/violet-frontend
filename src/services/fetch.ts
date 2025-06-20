/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse, Method } from "axios";
import { environment } from "constants/environment";
import { AuthStore } from "stores/auth.store";

export const fetch = <T, TP = any>(
  method: Method = "GET",
  path = "/",
  data?: TP,
  headers = {},
  apiUrl = environment.API_URL,
  options: any = {}
): Promise<AxiosResponse<T, any>> => {
  const baseURL = `${apiUrl}/${path}`;
  const queryName = method === "GET" ? "params" : "data";

  const api = axios.create({ baseURL });

  // ---- Token refresh state ----
  let isRefreshing = false;
  let failedQueue: any[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueue = [];
  };

  // ---- Request Interceptor ----
  api.interceptors.request.use((config) => {
    const { token } = AuthStore.getState();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  // ---- Response Interceptor with Refresh Logic ----
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest: any = error.config;
      const { refreshToken, setToken, setRefreshToken, clear } =
        AuthStore.getState();

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        refreshToken
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axios.post(
            `${environment.API_URL}/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          const newToken = data.token;
          const newRefreshToken = data.refreshToken;

          setToken(newToken);
          setRefreshToken(newRefreshToken);
          processQueue(null, newToken);

          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          clear();
          window.location.href = "/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

  const contentTypeHeader =
    data instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

  return api.request({
    method,
    baseURL,
    [queryName]: data,
    headers: {
      Accept: "application/json",
      ...contentTypeHeader,
      ...headers,
    },
    ...options,
  });
};
