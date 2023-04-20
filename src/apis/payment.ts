import { axios, getAuthToken } from "./index";
import { CouponsAttr } from "~/apis/interfaces/offer";
import { ResultResponse } from "~/apis/interfaces/results";

const baseURL = "/payment";

const getPlansAPI = (
  paymentProvider: CouponsAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/plans/${paymentProvider}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

const getPaymentProvidersAPI = (token?: string): Promise<ResultResponse> => {
  const url = `${baseURL}/integratedApps`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

export { getPlansAPI, getPaymentProvidersAPI };
