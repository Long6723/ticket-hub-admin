import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBannersApi,
  createBannerApi,
  updateBannerApi,
  deleteBannerApi,
  reorderBannerApi,
} from "~/api/banner.api";

export const getBanners = createAsyncThunk(
  "banners/getBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBannersApi();
      // console.log(response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tải banner");
    }
  },
);

export const createBanner = createAsyncThunk(
  "banners/createBanner",
  async (body: object, { rejectWithValue }) => {
    try {
      const response = await createBannerApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tạo banner");
    }
  },
);

export const updateBanner = createAsyncThunk(
  "banners/updateBanner",
  async (body: { id: string; body: object }, { rejectWithValue }) => {
    try {
      const response = await updateBannerApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi cập nhật banner");
    }
  },
);

export const deleteBanner = createAsyncThunk(
  "banners/deleteBanner",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteBannerApi(id);
      return { id, response };
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi xóa banner");
    }
  },
);

export const reorderBanners = createAsyncThunk(
  "banners/reorderBanners",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const response = await reorderBannerApi({ ids });
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi sắp xếp banner");
    }
  },
);
