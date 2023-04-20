import { axios, getAuthToken } from "./index";
import { LoginAttr, RegisterAttr } from "~/apis/interfaces/authentication";
import { ResultResponse } from "~/apis/interfaces/results";

const baseURL = "/user";

const login = (payload: LoginAttr): Promise<ResultResponse> => {
  const url = `${baseURL}/login`;
  return axios.post(url, payload);
};

const register = (payload: RegisterAttr): Promise<ResultResponse> => {
  const url = `${baseURL}/create`;
  return axios.put(url, payload);
};

const getUser = (token?: string): Promise<ResultResponse> => {
  const url = `${baseURL}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

export { login as loginAPI, register as registerAPI, getUser as getUserAPI };
