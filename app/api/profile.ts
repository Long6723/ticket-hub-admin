import authorizedRequest from "~/config/axios";
import { LOGIN, USER_PROFILE } from "./endpoint";

export const loginApi = async (body: { email?: string; password?: string }) => {
  try {
    const response = await authorizedRequest.post(LOGIN, body);
    return response.data;
  } catch (error) {
    console.error("Error searching profile:", error);
    throw error;
  }
};

export const getProfileApi = async () => {
  try {
    const response = await authorizedRequest.get(USER_PROFILE);
    return response;
  } catch (error) {
    console.error("Error searching profile:", error);
    throw error;
  }
};
