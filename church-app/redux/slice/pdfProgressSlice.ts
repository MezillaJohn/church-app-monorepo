// src/store/slices/pdfProgressSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PdfProgress = {
  page: number;
  totalPages: number;
  updatedAt: number;
};

type PdfProgressState = {
  progress: Record<string, PdfProgress>;
};

const initialState: PdfProgressState = {
  progress: {},
};

const pdfProgressSlice = createSlice({
  name: "pdfProgress",
  initialState,
  reducers: {
    savePdfProgress: (
      state,
      action: PayloadAction<{
        bookKey: string;
        page: number;
        totalPages: number;
      }>
    ) => {
      state.progress[action.payload.bookKey] = {
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        updatedAt: Date.now(),
      };
    },
  },
});

export const { savePdfProgress } = pdfProgressSlice.actions;
export default pdfProgressSlice.reducer;
