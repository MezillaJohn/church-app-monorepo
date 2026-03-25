import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  paymentUrl: string;
  paymentSource: "GIVING" | "BOOKS" | null;
}

const initialState: AppState = {
  paymentUrl: "",
  paymentSource: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Generic state setter
    setAppState: <K extends keyof AppState>(
      state: AppState,
      action: PayloadAction<{ key: K; value: AppState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },

    resetAppState: () => initialState,
  },
});

export const { setAppState, resetAppState } = appSlice.actions;
export default appSlice.reducer;
