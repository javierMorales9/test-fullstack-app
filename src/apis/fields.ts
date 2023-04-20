import { axios, getAuthToken } from "~/apis";

import { FilterTag } from "./interfaces/fields";
import { ResultResponse } from "./interfaces/results";

const baseUrl = "/fields";
export function createFieldAPI(payload, token?): Promise<ResultResponse> {
  const url = baseUrl;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
}

export function duplicateFieldAPI(
  payload,
  name,
  token?,
): Promise<ResultResponse> {
  const url = baseUrl + "/" + payload.name + "/duplicate";
  console.log("payload -> " + payload);
  console.log("url -> " + url);
  //const url = `${baseUrl}/${name}`;
  console.log(name);
  //url cambiarla field/previusName/duplicate
  const t = getAuthToken(token);
  return axios.put(url, { newName: name.name }, { ...t });
}

export function deleteFieldAPI(payload, token?): Promise<ResultResponse> {
  const url = baseUrl + "/" + payload;
  const t = getAuthToken(token);
  console.log("payload -> " + payload);
  console.log("url -> " + url);
  return axios.delete(url, { ...t });
}

export function getFieldsAPI(
  filter?: FilterTag,
  token?,
): Promise<ResultResponse> {
  const url = baseUrl;
  const t = getAuthToken(token);
  return axios.get(url, { ...t, params: filter });
}

export function searchFieldsAPI(
  name,
  filter?: FilterTag,
  token?,
): Promise<ResultResponse> {
  const url = `${baseUrl}/${name}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t, params: filter });
}

export function getUserFields(token?): Promise<ResultResponse> {
  const url = `${baseUrl}/users`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
}

export function getEventFields(token?): Promise<ResultResponse> {
  const url = `${baseUrl}/events`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
}
