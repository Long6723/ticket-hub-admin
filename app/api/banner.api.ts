import authorizedRequest from "~/config/axios";
import { ADMIN_BANNER, BANNER_REORDER } from "./endpoint";

export interface GetBannersParams {
  sortOrder?: number;
}

export const getBannersApi = async (params?: GetBannersParams) => {
  try {
    const response = await authorizedRequest.get(ADMIN_BANNER, { params });
    return response.data;
  } catch (error) {
    console.error("Error getBannersApi:", error);
    throw error;
  }
};

export const updateBannerApi = async (body: any) => {
  try {
    const response = await authorizedRequest.patch(
      `${ADMIN_BANNER}/${body.id}`,
      body.body,
    );
    return response.data;
  } catch (error) {
    console.error("Error updateBannerApi:", error);
    throw error;
  }
};

export const createBannerApi = async (body: object) => {
  try {
    const response = await authorizedRequest.post(ADMIN_BANNER, body);
    return response.data;
  } catch (error) {
    console.error("Error createBannerApi:", error);
    throw error;
  }
};

export const deleteBannerApi = async (id: string) => {
  try {
    const response = await authorizedRequest.delete(`${ADMIN_BANNER}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleteBannerApi:", error);
    throw error;
  }
};

export const reorderBannerApi = async (body: { ids: string[] }) => {
  try {
    const response = await authorizedRequest.post(BANNER_REORDER, body);
    return response.data;
  } catch (error) {
    console.error("Error reorderBannerApi:", error);
    throw error;
  }
};
