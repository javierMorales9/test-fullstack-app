import { axios, getAuthToken } from "~/apis";
import { CreateCampaign, CampaignFilter } from "~/apis/interfaces/automation";
import { ResultResponse } from "./interfaces/results";

const baseURL = "/campaigns";
export function createCampaignAPI(
  payload: CreateCampaign,
  token?: string,
): Promise<ResultResponse> {
  const url = `${baseURL}/`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
}

export function getCampaignsAPI(
  filter?: CampaignFilter,
  token?: string,
): Promise<ResultResponse> {
  const url = `${baseURL}/`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t, params: filter });
}

export function getCampaignAPI(id, token?: string): Promise<ResultResponse> {
  const url = `${baseURL}/${id}/`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
}
export function saveCampaignAPI(
  id,
  payload,
  token?: string,
): Promise<ResultResponse> {
  const url = `${baseURL}/${id}/`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
}

export function saveTriggerAPI(
  id,
  payload,
  token?: string,
): Promise<ResultResponse> {
  const url = `${baseURL}/${id}/trigger/`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
}

export function getTriggerAPI(id, token?: string): Promise<ResultResponse> {
  const url = `${baseURL}/${id}/trigger`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
}

export function saveExitClauseAPI(
  id,
  payload,
  token?: string,
): Promise<ResultResponse> {
  const url = `${baseURL}/${id}/exitClause/`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
}
