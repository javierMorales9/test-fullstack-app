import { axios, getAuthToken } from "./index";

import { ResultResponse } from "./interfaces/results";

const baseUrl = "/segments";

export function createSegmentAPI(
  payload,
  token?: string,
): Promise<ResultResponse> {
  const url = baseUrl;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
}

export function getSegmentsAPI(
  filter?,
  token?: string,
): Promise<ResultResponse> {
  const url = baseUrl;
  const t = getAuthToken(token);
  return axios.get(url, { ...t, params: filter });
}

export function getSegmentDetailAPI(
  id,
  token?: string,
): Promise<ResultResponse> {
  const url = `${baseUrl}/${id}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
}
