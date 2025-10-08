import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsersApi, type GetUsersParams } from "~/api/users.api";

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (params: GetUsersParams, { rejectWithValue }) => {
    try {
      const apiParams = {
        ...params,
        status: params.status === "all" ? undefined : params.status,
        sortField: params.sortField || "createdAt",
      };

      const response = await getUsersApi(apiParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
