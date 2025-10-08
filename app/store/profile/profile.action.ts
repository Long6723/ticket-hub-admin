import { createAsyncThunk } from "@reduxjs/toolkit";
import { changePasswordApi, getProfileApi } from "~/api/profile.api";

export const getAccessToken = createAsyncThunk(
  "profile/getAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      return token;
    } catch (error) {
      return rejectWithValue("Failed to get access token");
    }
  },
);

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileApi();
      return response.data || response;
    } catch (error) {
      return rejectWithValue("Failed to get profile");
    }
  },
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (
    passwordData: {
      oldPassword: string;
      newPassword: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await changePasswordApi(passwordData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || "Đổi mật khẩu thất bại");
    }
  },
);
