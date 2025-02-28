import { createSlice } from "@reduxjs/toolkit";

type CommandState = {
  isOpen: boolean;
};

const initialState: CommandState = {
  isOpen: false,
};

export const commandSlice = createSlice({
  name: "command",
  initialState,
  reducers: {
    onOpen: (state) => {
      state.isOpen = true;
    },
    onClose: (state) => {
      state.isOpen = false;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { onOpen, onClose, toggle } = commandSlice.actions;
export default commandSlice.reducer;
