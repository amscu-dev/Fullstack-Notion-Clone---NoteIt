import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
type CoverImageState = {
  isOpen: boolean;
  url?: string;
};

const initialState: CoverImageState = {
  isOpen: false,
  url: undefined,
};

export const coverImageSlice = createSlice({
  name: "command",
  initialState,
  reducers: {
    onOpenCoverImage: (state) => {
      state.isOpen = true;
      state.url = undefined;
    },
    onCloseCoverImage: (state) => {
      state.isOpen = false;
      state.url = undefined;
    },
    onReplaceCoverImage: (state, action: PayloadAction<CoverImageState>) => {
      state.url = action.payload.url;
      state.isOpen = true;
    },
  },
});

export const { onOpenCoverImage, onCloseCoverImage, onReplaceCoverImage } =
  coverImageSlice.actions;
export default coverImageSlice.reducer;
