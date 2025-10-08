import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createRoomApi,
  deleteRoomApi,
  getRoomApi,
  updateRoomApi,
} from "~/api/room.api";

export const getRooms = createAsyncThunk(
  "rooms/getRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRoomApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tải phòng chiếu");
    }
  },
);

export const createRoom = createAsyncThunk(
  "rooms/createRoom",
  async (body: object, { rejectWithValue }) => {
    try {
      const response = await createRoomApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi tạo phòng chiếu");
    }
  },
);

export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async (body: { id: string; body: object }, { rejectWithValue }) => {
    try {
      const response = await updateRoomApi(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || "Lỗi khi cập nhật phòng chiếu",
      );
    }
  },
);

export const deleteRoom = createAsyncThunk(
  "rooms/deleteRoom",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteRoomApi(id);
      return { id, response };
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Lỗi khi xóa phòng chiếu");
    }
  },
);
