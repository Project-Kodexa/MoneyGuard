//redux slice for currency
import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrency } from "./currencyOperation";

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    rates: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        state.rates = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrency.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default currencySlice.reducer;
