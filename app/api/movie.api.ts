import authorizedRequest from "~/config/axios";
import { ADMIN_MOVIE } from "./endpoint";

export interface GetMovieParams {
  current: number;
  pageSize: number;
  search?: string;
  status?: string;
  genreId?: string;
  sortBy?: string;
}

export const getMovieApi = async (params?: GetMovieParams) => {
  try {
    const response = await authorizedRequest.get(ADMIN_MOVIE, { params });
    // console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error getMovieApi:", error);
    throw error;
  }
};

export const updateMovieApi = async (body: any) => {
  try {
    const response = await authorizedRequest.patch(
      `${ADMIN_MOVIE}/${body.id}`,
      body.body,
    );
    return response.data;
  } catch (error) {
    console.error("Error updateMovieApi:", error);
    throw error;
  }
};

export const createMovieApi = async (body: object) => {
  try {
    const response = await authorizedRequest.post(ADMIN_MOVIE, body);
    return response.data;
  } catch (error) {
    console.error("Error createMovieApi:", error);
    throw error;
  }
};

export const deleteMovieApi = async (id: string) => {
  try {
    const response = await authorizedRequest.delete(`${ADMIN_MOVIE}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleteMovieApi:", error);
    throw error;
  }
};
