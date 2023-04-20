import { axios, getAuthToken } from "./index";
import { CouponsAttr, OfferAttr } from "~/apis/interfaces/offer";
import { ResultResponse } from "~/apis/interfaces/results";

const baseURL = "/offer";

const createOfferAPI = (
  payload: OfferAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/create`;
  const t = getAuthToken(token);
  return axios.post(url, payload, { ...t });
};

const getOfferAPI = (
  offerId: string,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/${offerId}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

const getCouponsAPI = (
  paymentProvider: CouponsAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/couponList/${paymentProvider}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

export { createOfferAPI, getOfferAPI, getCouponsAPI };
