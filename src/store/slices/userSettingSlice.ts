import { createSlice } from "@reduxjs/toolkit";

type UserSettingsState = {
  isOpen: boolean;
};

const initialState: UserSettingsState = {
  isOpen: false,
};

export const userSettingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    onOpenUserModal: (state) => {
      state.isOpen = true;
    },
    onCloseUserModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { onOpenUserModal, onCloseUserModal } = userSettingsSlice.actions;
export default userSettingsSlice.reducer;
