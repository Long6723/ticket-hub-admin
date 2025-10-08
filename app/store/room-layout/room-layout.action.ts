import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createRoomLayoutApi,
  deleteRoomLayoutApi,
  getRoomLayoutApi,
  updateRoomLayoutApi,
} from "~/api/room-layout.api";

export const getRoomLayout = createAsyncThunk(
  "room-layout/getRoomLayout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRoomLayoutApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || "Lỗi khi tải chi tiết phòng chiếu",
      );
    }
  },
);

export const createRoomLayout = createAsyncThunk(
  "room-layout/createRoomLayout",
  async (body: object, { rejectWithValue }) => {
    try {
      const response = await createRoomLayoutApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || "Lỗi khi tạo chi tiết phòng chiếu",
      );
    }
  },
);

export const updateRoomLayout = createAsyncThunk(
  "room-layout/updateRoomLayout",
  async (body: { id: string; body: object }, { rejectWithValue }) => {
    try {
      const response = await updateRoomLayoutApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || "Lỗi khi cập nhật chi tiết phòng chiếu",
      );
    }
  },
);

export const deleteRoomLayout = createAsyncThunk(
  "room-layout/deleteRoomLayout",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteRoomLayoutApi(id);
      return { id, response };
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || "Lỗi khi xóa chi tiết phòng chiếu",
      );
    }
  },
);
