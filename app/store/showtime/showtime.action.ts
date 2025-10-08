import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createShowtimeApi,
  deleteShowtimeApi,
  getShowtimeApi,
  updateShowtimeApi,
  type GetShowtimeParams,
} from "~/api/showtime.api";

export const getShowtimes = createAsyncThunk(
  "showtimes/getShowtimes",
  async (params: GetShowtimeParams, { rejectWithValue }) => {
    try {
      const apiParams = {
        ...params,
        movieId: params.movieId === "all" ? undefined : params.movieId,
        cinema: params.cinema === "all" ? undefined : params.cinema,
        date: params.date === "all" ? undefined : params.date,
        roomId: params.roomId === "all" ? undefined : params.roomId,
        sortBy: params.sortBy || "createdAt",
      };
      const response = await getShowtimeApi(apiParams);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tải lịch chiếu");
    }
  },
);

export const createShowtime = createAsyncThunk(
  "showtimes/createShowtime",
  async (body: object, { rejectWithValue }) => {
    try {
      const response = await createShowtimeApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tạo lịch chiếu");
    }
  },
);

export const updateShowtime = createAsyncThunk(
  "showtimes/updateShowtime",
  async (body: { id: string; body: object }, { rejectWithValue }) => {
    try {
      const response = await updateShowtimeApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || "Lỗi khi cập nhật lịch chiếu",
      );
    }
  },
);

export const deleteShowtime = createAsyncThunk(
  "showtimes/deleteShowtime",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteShowtimeApi(id);
      return { id, response };
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi xóa lịch chiếu");
    }
  },
);
