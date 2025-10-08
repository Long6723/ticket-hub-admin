import { createSlice } from "@reduxjs/toolkit";
import {
  createRoomLayout,
  deleteRoomLayout,
  getRoomLayout,
  updateRoomLayout,
} from "./room-layout.action";

const initialState = {
  listRoomLayout: [],
  loading: false,
  error: "",
};

const roomLayoutSlice = createSlice({
  name: "room-layout",
  initialState,
  reducers: {
    resetRoomLayout: (state) => {
      state.listRoomLayout = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoomLayout.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getRoomLayout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listRoomLayout = action.payload;
      })
      .addCase(getRoomLayout.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createRoomLayout.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRoomLayout.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(createRoomLayout.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateRoomLayout.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRoomLayout.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(updateRoomLayout.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(deleteRoomLayout.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRoomLayout.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteRoomLayout.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const RoomLayoutAction = roomLayoutSlice.actions;
export default roomLayoutSlice.reducer;
