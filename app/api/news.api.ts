import authorizedRequest from "~/config/axios";
import { ADMIN_NEWS } from "./endpoint";

export interface GetNewsParams {
  current: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortBy?: string;
}

export const getNewsApi = async (params?: GetNewsParams) => {
  try {
    const response = await authorizedRequest.get(ADMIN_NEWS, { params });
    return response.data;
  } catch (error) {
    console.error("Error getNewsApi:", error);
    throw error;
  }
};

export const updateNewsApi = async (body: any) => {
  try {
    const response = await authorizedRequest.patch(
      `${ADMIN_NEWS}/${body.id}`,
      body.body,
    );
    return response.data;
  } catch (error) {
    console.error("Error updateNewsApi:", error);
    throw error;
  }
};

export const createNewsApi = async (body: object) => {
  try {
    const response = await authorizedRequest.post(ADMIN_NEWS, body);
    return response.data;
  } catch (error) {
    console.error("Error createNewsApi:", error);
    throw error;
  }
};

export const deleteNewsApi = async (id: string) => {
  try {
    const response = await authorizedRequest.delete(`${ADMIN_NEWS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleteNewsApi:", error);
    throw error;
  }
};
