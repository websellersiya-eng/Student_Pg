import { createSlice } from "@reduxjs/toolkit";

type UiState = {
  sidebarOpen: boolean;
};

const initialState: UiState = {
  sidebarOpen: false
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    }
  }
});

export const { openSidebar, closeSidebar } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
