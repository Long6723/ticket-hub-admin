import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createDiscountApi,
  deleteDiscountApi,
  getDiscountApi,
  updateDiscountApi,
} from "~/api/discount.api";

export const getDiscounts = createAsyncThunk(
  "discount/getDiscounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDiscountApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tải discount");
    }
  },
);

export const createDiscount = createAsyncThunk(
  "discount/createDiscount",
  async (body: object, { rejectWithValue }) => {
    try {
      const response = await createDiscountApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tạo discount");
    }
  },
);

export const updateDiscount = createAsyncThunk(
  "discount/updateDiscount",
  async (body: { id: string; body: object }, { rejectWithValue }) => {
    try {
      const response = await updateDiscountApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || "Lỗi khi cập nhật discount",
      );
    }
  },
);

export const deleteDiscount = createAsyncThunk(
  "discount/deleteDiscount",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteDiscountApi(id);
      return { id, response };
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi xóa discount");
    }
  },
);
