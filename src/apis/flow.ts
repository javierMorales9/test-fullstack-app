import { axios, getAuthToken } from "./index";
import {
  FlowsAttr,
  FlowAttr,
  DesignAttr,
  reorderFlowAttr,
} from "~/apis/interfaces/flow";
import { ResultResponse } from "~/apis/interfaces/results";

const baseURL = "/flow";

const getFlowsAPI = (
  payload?: FlowsAttr,
  token?: string,
): Promise<ResultResponse> => {
  let url = `${baseURL}`;
  if (payload) {
    const queryParams = new URLSearchParams(payload as Record<string, string>);
    if (queryParams.toString()?.length) {
      url += `?${queryParams.toString()}`;
    }
  }
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

const createFlowAPI = (
  payload: FlowAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/save`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
};

const getFlowAPI = (
  flowId: string,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/${flowId}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

const activateFlowAPI = (
  flowId: string,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/${flowId}/activate`;
  const t = getAuthToken(token);
  return axios.put(url, undefined, { ...t });
};

const deactivateFlowAPI = (
  flowId: string,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/${flowId}/deactivate`;
  const t = getAuthToken(token);
  return axios.put(url, undefined, { ...t });
};

const deleteFlowAPI = (
  flowId: string,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/${flowId}`;
  const t = getAuthToken(token);
  return axios.delete(url, { ...t });
};

const addDesignAPI = (
  flowId: string,
  payload: DesignAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/${flowId}/design`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
};

const reorderFlowAPI = (
  signal: any,
  payload: reorderFlowAttr[],
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/reorder`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t, signal });
};

export {
  getFlowsAPI,
  createFlowAPI,
  getFlowAPI,
  activateFlowAPI,
  deactivateFlowAPI,
  deleteFlowAPI,
  addDesignAPI,
  reorderFlowAPI,
};
