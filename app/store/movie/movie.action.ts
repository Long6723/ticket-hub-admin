import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createMovieApi,
  deleteMovieApi,
  getMovieApi,
  updateMovieApi,
  type GetMovieParams,
} from "~/api/movie.api";

export const getMovies = createAsyncThunk(
  "movies/getMovies",
  async (params: GetMovieParams, { rejectWithValue }) => {
    try {
      const apiParams = {
        ...params,
        status: params.status === "all" ? undefined : params.status,
        genreId: params.genreId === "all" ? undefined : params.genreId,
        sortBy: params.sortBy || "createdAt",
      };
      const response = await getMovieApi(apiParams);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tải phim");
    }
  },
);

export const createMovie = createAsyncThunk(
  "movies/createMovie",
  async (body: object, { rejectWithValue }) => {
    try {
      const response = await createMovieApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tạo phim");
    }
  },
);

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async (body: { id: string; body: object }, { rejectWithValue }) => {
    try {
      const response = await updateMovieApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi cập nhật phim");
    }
  },
);

export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteMovieApi(id);
      return { id, response };
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi xóa phim");
    }
  },
);
