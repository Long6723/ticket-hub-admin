import { createSlice } from "@reduxjs/toolkit";
import { getUsers } from "./users.action";

const initialState = {
  listUsers: null,
  loading: false,
  error: "",
};

const usersSlide = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.listUsers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listUsers = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const usersAction = usersSlide.actions;

export default usersSlide.reducer;
