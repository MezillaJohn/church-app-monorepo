import { Sermon } from "@/services/api/public/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DownloadedSermon {
  sermon: Sermon;
  localUri: string;
}

interface DownloadState {
  items: DownloadedSermon[];
}

const initialState: DownloadState = {
  items: [],
};

const downloadSlice = createSlice({
  name: "downloads",
  initialState,
  reducers: {
    addDownload: (state, action: PayloadAction<DownloadedSermon>) => {
      // prevent duplicates
      const exists = state.items.some(
        (d) => d.sermon.id === action.payload.sermon.id
      );
      if (!exists) state.items.push(action.payload);
    },

    removeDownload: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((d) => d.sermon.id !== action.payload);
    },
  },
});

export const { addDownload, removeDownload } = downloadSlice.actions;
export default downloadSlice.reducer;
