import { axios, getAuthToken } from "~/apis";
import { ResultResponse } from "./interfaces/results";
import { FilterTag } from "./interfaces/tags";

const baseURL = "/tags";

export function createTagAPI(payload, token?): Promise<ResultResponse> {
  const url = baseURL;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
}

export function getTagsAPI(
  filter?: FilterTag,
  token?: string,
): Promise<ResultResponse> {
  const url = baseURL;
  const t = getAuthToken(token);
  return axios.get(url, { ...t, params: filter });
}

export function searchTagsAPI(
  name: string,
  filter?: FilterTag,
  token?: string,
): Promise<ResultResponse> {
  const url = `${baseURL}/${name}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t, params: filter });
}
