import { createSlice } from "@reduxjs/toolkit";
import {
  createShowtime,
  deleteShowtime,
  getShowtimes,
  updateShowtime,
} from "./showtime.action";

const initialState = {
  listShowtime: [],
  loading: false,
  error: "",
};

const showtimeSlice = createSlice({
  name: "showtime",
  initialState,
  reducers: {
    resetShowtime: (state) => {
      state.listShowtime = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShowtimes.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getShowtimes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listShowtime = action.payload;
      })
      .addCase(getShowtimes.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createShowtime.pending, (state) => {
        state.loading = true;
      })
      .addCase(createShowtime.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(createShowtime.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateShowtime.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShowtime.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(updateShowtime.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(deleteShowtime.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteShowtime.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteShowtime.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const ShowtimeAction = showtimeSlice.actions;
export default showtimeSlice.reducer;
