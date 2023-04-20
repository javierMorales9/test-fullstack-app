import { EmailAttr } from "./interfaces/emails";
import { ResultResponse } from "./interfaces/results";
import { getAuthToken, axios } from "./index";

const baseURL = "/emails";

export function getEMailsAPI(token?: string): Promise<ResultResponse> {
  const url = baseURL;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
}

export function createEMailAPI(
  payload: EmailAttr,
  token?: string,
): Promise<ResultResponse> {
  const url = baseURL;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
}

export function updateEMailAPI(
  id: string,
  payload: EmailAttr,
  token?: string,
): Promise<ResultResponse> {
  const url = `${baseURL}/${id}`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
}
