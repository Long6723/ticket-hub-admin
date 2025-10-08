import authorizedRequest from "~/config/axios";
import { ADMIN_SHOWTIME } from "./endpoint";

export interface GetShowtimeParams {
  current: number;
  pageSize: number;
  movieId?: string;
  cinema?: string;
  date?: string;
  roomId?: string;
  sortBy?: string;
}

export const getShowtimeApi = async (params?: GetShowtimeParams) => {
  try {
    const response = await authorizedRequest.get(ADMIN_SHOWTIME, { params });
    return response.data;
  } catch (error) {
    console.error("Error getShowtimeApi:", error);
    throw error;
  }
};

export const updateShowtimeApi = async (body: any) => {
  try {
    const response = await authorizedRequest.patch(
      `${ADMIN_SHOWTIME}/${body.id}`,
      body.body,
    );
    return response.data;
  } catch (error) {
    console.error("Error updateShowtimeApi:", error);
    throw error;
  }
};

export const createShowtimeApi = async (body: object) => {
  try {
    const response = await authorizedRequest.post(ADMIN_SHOWTIME, body);
    return response.data;
  } catch (error) {
    console.error("Error createShowtimeApi:", error);
    throw error;
  }
};

export const deleteShowtimeApi = async (id: string) => {
  try {
    const response = await authorizedRequest.delete(`${ADMIN_SHOWTIME}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleteShowtimeApi:", error);
    throw error;
  }
};
