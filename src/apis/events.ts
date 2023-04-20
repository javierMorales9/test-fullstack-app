import { ResultResponse } from "./interfaces/results";
import { axios, getAuthToken } from "./index";

const baseURL = "/events";

export function getEventsAPI(token?: string): Promise<ResultResponse> {
  const url = baseURL;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
}
