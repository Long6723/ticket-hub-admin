import axios from "axios";
import { stringify } from "qs";
import { CONFIG } from "./env";
import getAccessToken from "./token";

const authorizedRequest = axios.create({
  baseURL: CONFIG.BASE_URL + CONFIG.BASE_URL_VERSION,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    return stringify(params, { arrayFormat: "repeat" });
  },
});

authorizedRequest.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authorizedRequest.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error?.response);
  },
);
export default authorizedRequest;
