import { createSlice } from "@reduxjs/toolkit";
import { createNews, deleteNews, getNews, updateNews } from "./news.action";

const initialState = {
  listNews: [],
  loading: false,
  error: "",
};

const newSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    resetNew: (state) => {
      state.listNews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNews.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listNews = action.payload;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNews.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(createNews.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNews.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNews.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const NewAction = newSlice.actions;
export default newSlice.reducer;
