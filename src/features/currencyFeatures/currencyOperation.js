//create async thunk for fetching currency data
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading } from '../../redux/globalSlice';

export const fetchCurrency = createAsyncThunk(
  "currency/fetchCurrency",
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const API_URL = "https://api.monobank.ua/bank/currency";
    const STORAGE_KEY = "currencyData";
    const TIME_KEY = "currencyTimestamp";
    const now = Date.now();

    try {
      dispatch(setLoading(true));

      const storedData = localStorage.getItem(STORAGE_KEY);
      const storedTime = Number(localStorage.getItem(TIME_KEY));

      if (storedData && storedTime && now - storedTime < 60 * 60 * 1000) {
        return JSON.parse(storedData); // 1 saat geçmemişse
      }

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("API isteği başarısız");
      }

      const data = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(TIME_KEY, now);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Döviz verisi alınamadı");
    } finally {
      dispatch(setLoading(false));
    }
  }
);
