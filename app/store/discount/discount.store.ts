import { createSlice } from "@reduxjs/toolkit";
import {
  createDiscount,
  deleteDiscount,
  getDiscounts,
  updateDiscount,
} from "./discount.action";

const initialState = {
  listDiscounts: null,
  loading: false,
  error: "",
};

const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {
    resetDiscount: (state) => {
      state.listDiscounts = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDiscounts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listDiscounts = action.payload;
      })
      .addCase(getDiscounts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDiscount.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDiscount.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDiscount.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const discountAction = discountSlice.actions;
export default discountSlice.reducer;
