import { axios, getAuthToken } from "./index";
import { AudienceAttr } from "~/apis/interfaces/audience";
import { ResultResponse } from "~/apis/interfaces/results";

const baseURL = "/audience";

const createAudienceAPI = (
  payload: AudienceAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/create`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
};

const getAudienceAPI = (
  audienceId: string,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/${audienceId}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

export { createAudienceAPI, getAudienceAPI };
