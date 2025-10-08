import authorizedRequest from "~/config/axios";
import { CREATE_USER, ADMIN_USER } from "./endpoint";

export interface GetUsersParams {
  current: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortField?: string;
}

export const getUsersApi = async (params?: GetUsersParams) => {
  try {
    const response = await authorizedRequest.get(ADMIN_USER, { params });

    return response;
  } catch (error) {
    console.error("Error getUsersApi:", error);
    throw error;
  }
};

export const updateUserApi = async (body: any) => {
  try {
    const response = await authorizedRequest.patch(
      `${ADMIN_USER}/${body.id}`,
      body.body,
    );
    return response.data;
  } catch (error) {
    console.error("Error updateUserApi:", error);
    throw error;
  }
};

export const createUserApi = async (body: object) => {
  try {
    const response = await authorizedRequest.post(CREATE_USER, body);
    return response.data;
  } catch (error) {
    console.error("Error createUserApi:", error);
    throw error;
  }
};
