import authorizedRequest from "~/config/axios";
import { CREATE_USER, ADMIN_USER, USER } from "./endpoint";

interface GetUsersParams {
  page?: number;
  search?: string;
}

interface UpdateUserPayload {
  id?: number;
  body?: string;
}

export const getUsersApi = async (params?: GetUsersParams) => {
  try {
    const response = await authorizedRequest.get(ADMIN_USER, { params });
    return response.data;
  } catch (error) {
    console.error("Error getUsersApi:", error);
    throw error;
  }
};

export const updateUserApi = async ({ id, body }: UpdateUserPayload) => {
  try {
    const response = await authorizedRequest.patch(`${USER}/${id}`, body);
    return response.data;
  } catch (error) {
    console.error("Error updateUserApi:", error);
    throw error;
  }
};

export const createUserApi = async (body: string) => {
  try {
    const response = await authorizedRequest.post(CREATE_USER, body);
    return response.data;
  } catch (error) {
    console.error("Error createUserApi:", error);
    throw error;
  }
};
