import { createSlice } from "@reduxjs/toolkit";
import {
  createMovie,
  deleteMovie,
  getMovies,
  updateMovie,
} from "./movie.action";

const initialState = {
  listMovie: [],
  loading: false,
  error: "",
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    resetMovie: (state) => {
      state.listMovie = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listMovie = action.payload;
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMovie.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMovie.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMovie.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const MovieAction = movieSlice.actions;
export default movieSlice.reducer;
