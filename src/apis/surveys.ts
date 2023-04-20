import { ResultResponse } from "./interfaces/results";
import { axios, getAuthToken } from "./index";

const baseURL = "/surveys";

export function getSurveysAPI(token?: string): Promise<ResultResponse> {
  const url = baseURL;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
}

export function createSurveyAPI(
  payload,
  token?: string,
): Promise<ResultResponse> {
  const url = baseURL;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
}

export function getSurveyDetailAPI(
  id,
  token?: string,
): Promise<ResultResponse> {
  const url = `${baseURL}/${id}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
}
