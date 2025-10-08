import { createSlice } from "@reduxjs/toolkit";
import {
  createGenre,
  deleteGenre,
  getGenres,
  updateGenre,
} from "./genre.action";

const initialState = {
  listGenre: [],
  loading: false,
  error: "",
};

const genreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {
    resetGenre: (state) => {
      state.listGenre = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGenres.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listGenre = action.payload;
      })
      .addCase(getGenres.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createGenre.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGenre.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(createGenre.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateGenre.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGenre.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(updateGenre.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(deleteGenre.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGenre.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteGenre.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const genreAction = genreSlice.actions;
export default genreSlice.reducer;
