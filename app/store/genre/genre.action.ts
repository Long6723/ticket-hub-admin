import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createGenreApi,
  deleteGenreApi,
  getGenreApi,
  updateGenreApi,
} from "~/api/genre.api";

export const getGenres = createAsyncThunk(
  "genres/getGenres",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getGenreApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tải thể loại");
    }
  },
);

export const createGenre = createAsyncThunk(
  "genres/createGenre",
  async (body: object, { rejectWithValue }) => {
    try {
      const response = await createGenreApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tạo thể loại");
    }
  },
);

export const updateGenre = createAsyncThunk(
  "genres/updateGenre",
  async (body: { id: string; body: object }, { rejectWithValue }) => {
    try {
      const response = await updateGenreApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || "Lỗi khi cập nhật thể loại",
      );
    }
  },
);

export const deleteGenre = createAsyncThunk(
  "genres/deleteGenre",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteGenreApi(id);
      return { id, response };
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi xóa thể loại");
    }
  },
);
