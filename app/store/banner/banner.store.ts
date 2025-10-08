import { createSlice } from "@reduxjs/toolkit";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
} from "./banner.action";

const initialState = {
  listBanners: null,
  loading: false,
  error: "",
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    resetBanner: (state) => {
      state.listBanners = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBanners.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listBanners = action.payload;
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBanner.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBanner.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBanner.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(reorderBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(reorderBanners.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(reorderBanners.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const bannerAction = bannerSlice.actions;
export default bannerSlice.reducer;
