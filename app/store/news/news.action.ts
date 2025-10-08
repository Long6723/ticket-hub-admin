import { createAsyncThunk } from "@reduxjs/toolkit";
import type { GetMovieParams } from "~/api/movie.api";
import {
  createNewsApi,
  deleteNewsApi,
  getNewsApi,
  updateNewsApi,
} from "~/api/news.api";

export const getNews = createAsyncThunk(
  "news/getNews",
  async (params: GetMovieParams, { rejectWithValue }) => {
    try {
      const apiParams = {
        ...params,
        status: params.status === "all" ? undefined : params.status,
        sortBy: params.sortBy || "createdAt",
      };
      const response = await getNewsApi(apiParams);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tải tin tức");
    }
  },
);

export const createNews = createAsyncThunk(
  "news/createNews",
  async (body: object, { rejectWithValue }) => {
    try {
      const response = await createNewsApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tạo tin tức");
    }
  },
);

export const updateNews = createAsyncThunk(
  "news/updateNews",
  async (body: { id: string; body: object }, { rejectWithValue }) => {
    try {
      const response = await updateNewsApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || "Lỗi khi cập nhật tin tức",
      );
    }
  },
);

export const deleteNews = createAsyncThunk(
  "news/deleteNews",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteNewsApi(id);
      return { id, response };
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi xóa tin tức");
    }
  },
);
