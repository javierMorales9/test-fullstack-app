import { FilterTag } from "./interfaces/fields";
import { ResultResponse } from "./interfaces/results";
import { axios, getAuthToken } from "./index";

const baseUrl = "/slugs";

export function getSlugsAPI(
  filter?: FilterTag,
  token?,
): Promise<ResultResponse> {
  const url = baseUrl;
  const t = getAuthToken(token);
  return axios.get(url, { ...t, params: filter });
}
