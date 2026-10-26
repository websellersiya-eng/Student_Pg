"use client";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/domain";

type AuthState = {
  user: User | null;
  accessToken: string | null;
};

const getInitial = (): AuthState => {
  if (typeof window === "undefined") return { user: null, accessToken: null };
  try {
    const token = localStorage.getItem("nearstay_access_token");
    const raw = localStorage.getItem("nearstay_user");
    const user = raw ? (JSON.parse(raw) as User) : null;
    return { user, accessToken: token };
  } catch {
    return { user: null, accessToken: null };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitial,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("nearstay_access_token", action.payload.accessToken);
      localStorage.setItem("nearstay_refresh_token", action.payload.refreshToken);
      localStorage.setItem("nearstay_user", JSON.stringify(action.payload.user));
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("nearstay_access_token");
      localStorage.removeItem("nearstay_refresh_token");
      localStorage.removeItem("nearstay_user");
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("nearstay_user", JSON.stringify(action.payload));
    }
  }
});

export const { setAuth, clearAuth, updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
