import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppVersionState {
  androidVersion: string | null;
  iosVersion: string | null;
}

const initialState: AppVersionState = {
  androidVersion: null,
  iosVersion: null,
};

const appVersionSlice = createSlice({
  name: "appVersion",
  initialState,
  reducers: {
    setAndroidVersion: (state, action: PayloadAction<any>) => {
      state.androidVersion =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.version; // extract if object slipped in
    },

    setIosVersion: (state, action: PayloadAction<any>) => {
      state.iosVersion =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.version;
    },

    setBothVersions: (state, action: PayloadAction<any>) => {
      state.androidVersion =
        typeof action.payload.android === "string"
          ? action.payload.android
          : action.payload.android?.version;

      state.iosVersion =
        typeof action.payload.ios === "string"
          ? action.payload.ios
          : action.payload.ios?.version;
    },
  },
});

export const { setAndroidVersion, setIosVersion, setBothVersions } =
  appVersionSlice.actions;

export default appVersionSlice.reducer;
