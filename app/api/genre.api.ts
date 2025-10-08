import authorizedRequest from "~/config/axios";
import { ADMIN_GENRE } from "./endpoint";

export const getGenreApi = async () => {
  try {
    const response = await authorizedRequest.get(ADMIN_GENRE);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getGenreApi:", error);
    throw error;
  }
};

export const updateGenreApi = async (body: any) => {
  try {
    const response = await authorizedRequest.patch(
      `${ADMIN_GENRE}/${body.id}`,
      body.body,
    );
    return response.data;
  } catch (error) {
    console.error("Error updateBannerApi:", error);
    throw error;
  }
};

export const createGenreApi = async (body: object) => {
  try {
    const response = await authorizedRequest.post(ADMIN_GENRE, body);
    return response.data;
  } catch (error) {
    console.error("Error createBannerApi:", error);
    throw error;
  }
};

export const deleteGenreApi = async (id: string) => {
  try {
    const response = await authorizedRequest.delete(`${ADMIN_GENRE}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleteBannerApi:", error);
    throw error;
  }
};
