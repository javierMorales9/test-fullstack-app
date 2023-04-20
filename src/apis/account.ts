import { axios, getAuthToken } from "~/apis";
import {
  AccountInfoAttr,
  UploadLogoAttr,
  AddDomainsAttr,
  DeleteDomainAttr,
} from "~/apis/interfaces/account";
import { ResultResponse } from "~/apis/interfaces/results";
import { FormData } from "~/apis/interfaces";

const baseURL = "/account";

const addInfoAPI = (
  payload: AccountInfoAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/addInfo`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
};

const uploadLogoAPI = (
  payload: FormData<UploadLogoAttr>,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/uploadLogo`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
};

const getInfoAPI = (token?: string): Promise<ResultResponse> => {
  const url = `${baseURL}`;
  const t = getAuthToken(token);
  return axios.get(url, { ...t });
};

const deleteAccountAPI = (token?: string): Promise<ResultResponse> => {
  const url = `${baseURL}`;
  const t = getAuthToken(token);
  return axios.delete(url, { ...t });
};

const addDomainsAPI = (
  payload: AddDomainsAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/addDomains`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
};

const deleteDomainAPI = (
  payload: DeleteDomainAttr,
  token?: string,
): Promise<ResultResponse> => {
  const url = `${baseURL}/deleteDomain`;
  const t = getAuthToken(token);
  return axios.put(url, payload, { ...t });
};

export {
  addInfoAPI,
  uploadLogoAPI,
  getInfoAPI,
  deleteAccountAPI,
  addDomainsAPI,
  deleteDomainAPI,
};
