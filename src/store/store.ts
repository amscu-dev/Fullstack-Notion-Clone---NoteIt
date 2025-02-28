import { configureStore } from "@reduxjs/toolkit";
// commandSlice.reducer il redenumim in:
import commandReducer from "./slices/commandSlice";
import settingsReducer from "./slices/settingsSlice";
import coverImageReducer from "./slices/converImageSlice";
import userSettingsReducer from "./slices/userSettingSlice";
export const store = configureStore({
  reducer: {
    command: commandReducer,
    settings: settingsReducer,
    coverImage: coverImageReducer,
    userSettings: userSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
