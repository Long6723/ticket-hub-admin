import { createSlice } from "@reduxjs/toolkit";
import { changePassword, getAccessToken, getProfile } from "./profile.action";

interface ProfileState {
  token: string | null;
  profile: any;
  loading: boolean;
  error: string | null;
  changePasswordLoading: boolean;
  changePasswordError: string | null;
  changePasswordSuccess: boolean;
}

const initialState: ProfileState = {
  token: null,
  profile: null,
  loading: false,
  error: "",
  changePasswordLoading: false,
  changePasswordError: null,
  changePasswordSuccess: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.token = null;
      state.profile = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    resetChangePasswordState: (state) => {
      state.changePasswordLoading = false;
      state.changePasswordError = null;
      state.changePasswordSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccessToken.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.token = action.payload;
      })
      .addCase(getAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.changePasswordError = null;
        state.changePasswordSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordError = action.payload as string;
        state.changePasswordSuccess = false;
      });
  },
});

export const profileAction = profileSlice.actions;

export default profileSlice.reducer;
