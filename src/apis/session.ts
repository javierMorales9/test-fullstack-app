import { axios, getAuthToken } from "./index";
import {
  StatsAttr,
  ActivityAttr,
  startSessionPreviewAttr,
  surveyAnswerPreviewAttr,
  couponAnswerPreviewAttr,
  pauseAnswerPreviewAttr,
  cancelAnswerPreviewAttr,
  finalAnswerPreviewAttr,
} from "~/apis/interfaces/session";
import { ResultResponse } from "~/apis/interfaces/results";

const baseURL = "/session";

const getStatsAPI = (
  payload?: StatsAttr,
  token?: string,
): Promise<ResultResponse> => {
  const queryParams = new URLSearchParams({});
  if (payload?.startDate) {
    queryParams.append("startDate", payload.startDate);
  }
  if (payload?.endDate) {
    queryParams.append("endDate", payload.endDate);
  }
  let url = `${baseURL}/stats`;
  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

const getActivityAPI = (
  flowId: string,
  payload?: ActivityAttr,
  token?: string,
): Promise<ResultResponse> => {
  let url = `${baseURL}/activity/flow/${flowId}`;

  Object.keys(payload).forEach((key) => !payload[key] && delete payload[key]);

  if (payload) {
    const queryParams = new URLSearchParams(payload as Record<string, string>);
    if (queryParams?.toString().length) {
      url += `?${queryParams.toString()}`;
    }
  }
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

const startSessionPreviewAPI = (
  flowId: string,
  payload?: startSessionPreviewAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/preview/start/${flowId}`;
  const t = getAuthToken(token);
  return axios.post(url, payload, { ...t });
};

const submitAnswerPreviewAPI = (
  sessionToken: string,
  payload?:
    | surveyAnswerPreviewAttr
    | couponAnswerPreviewAttr
    | pauseAnswerPreviewAttr
    | cancelAnswerPreviewAttr
    | finalAnswerPreviewAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/preview/answer/${sessionToken}`;
  const t = getAuthToken(token);
  return axios.post(url, payload, { ...t });
};

const goBackPreviewAPI = (
  sessionToken: string,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/preview/goBack/${sessionToken}`;
  const t = getAuthToken(token);
  return axios.post(url, {}, { ...t });
};

const finishPreviewAPI = (
  sessionToken: string,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/preview/finish/${sessionToken}`;
  const t = getAuthToken(token);
  return axios.post(url, {}, { ...t });
};

export {
  getStatsAPI,
  getActivityAPI,
  startSessionPreviewAPI,
  submitAnswerPreviewAPI,
  goBackPreviewAPI,
  finishPreviewAPI,
};
