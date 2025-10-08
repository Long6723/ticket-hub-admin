import { createSlice } from "@reduxjs/toolkit";
import { createRoom, deleteRoom, getRooms, updateRoom } from "./room.action";

const initialState = {
  listRoom: null,
  loading: false,
  error: "",
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    resetRoom: (state) => {
      state.listRoom = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRooms.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listRoom = action.payload;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRoom.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRoom.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRoom.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const RoomAction = roomSlice.actions;
export default roomSlice.reducer;
