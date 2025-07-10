// src/redux/globalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {
    isLoading: false,
  },
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = globalSlice.actions;
export default globalSlice.reducer;
