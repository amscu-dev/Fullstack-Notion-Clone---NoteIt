import { createSlice } from "@reduxjs/toolkit";

type SettingsState = {
  isOpen: boolean;
};

const initialState: SettingsState = {
  isOpen: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    onOpenSettingsModal: (state) => {
      state.isOpen = true;
    },
    onCloseSettingsModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { onOpenSettingsModal, onCloseSettingsModal } =
  settingsSlice.actions;
export default settingsSlice.reducer;
