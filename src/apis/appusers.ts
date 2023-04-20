import { axios, getAuthToken } from "~/apis";

import { ResultResponse } from "./interfaces/results";
import { UserFilter } from "./interfaces/appusers";

const baseUrl = "/appusers";

export function getTestUsersAPI(
  filter?: UserFilter,
  token?: string,
): Promise<ResultResponse> {
  return getAppUsersAPI({ ...filter, test: true }, token);
}

export function getTestUserAPI(id, token?): Promise<ResultResponse> {
  const url = `${baseUrl}/${id}?test=true`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
}

export function getAppUsersAPI(
  filter: UserFilter,
  token?: string,
): Promise<ResultResponse> {
  const url = baseUrl;
  const t = getAuthToken(token);
  return axios.get(url, { ...t, params: filter });
}

export function getSegmentUsersAPI(
  segmentId,
  filter = {},
  token?: string,
): Promise<ResultResponse> {
  const url = `${baseUrl}/segments/${segmentId}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t, params: filter });
}
