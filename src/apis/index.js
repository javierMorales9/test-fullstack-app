import ax from "axios";
import { getCookie } from "cookies-next";
import results from "~/apis/helpers/results";

ax.defaults.headers.post["Content-Type"] = "application/json";
ax.defaults.validateStatus = (status) => status >= 200 && status < 500; // default

const axios = ax.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
});

axios.CancelToken = ax.CancelToken;
axios.isCancel = ax.isCancel;

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(results.success(response.data));
    }
    return Promise.resolve(results.fail(response));
  },
  (error) => Promise.resolve(results.fail(error)),
);

const getAuthToken = (t) => {
  const token = t || getCookie("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export { axios, getAuthToken };
