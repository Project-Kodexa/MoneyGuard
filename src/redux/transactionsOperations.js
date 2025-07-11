import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";
import { setLoading } from "./globalSlice";
import {
  setTransactions,
  addTransaction,
  updateTransaction as updateTransactionAction,
  deleteTransaction as deleteTransactionAction,
  setCategories,
  setStatistics,
  setBalance,
  setCurrencyRates,
  setLoading as setTransactionsLoading,
  setError,
} from "../features/transactions/transactionsSlice";

// İşlemleri getir
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      thunkAPI.dispatch(setTransactionsLoading(true));

      const { data } = await API.get("/transactions");

      thunkAPI.dispatch(setTransactions(data.transactions));
      return data.transactions;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch transactions";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    } finally {
      thunkAPI.dispatch(setLoading(false));
      thunkAPI.dispatch(setTransactionsLoading(false));
    }
  }
);

// İşlem ekle
export const addTransactionThunk = createAsyncThunk(
  "transactions/addTransaction",
  async (transactionData, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));

      const { data } = await API.post("/transactions", transactionData);

      thunkAPI.dispatch(addTransaction(data.transaction));
      return data.transaction;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add transaction";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

// İşlem güncelle
export const updateTransactionThunk = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, transactionData }, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));

      const { data } = await API.put(`/transactions/${id}`, transactionData);

      thunkAPI.dispatch(
        updateTransactionAction({ id, transaction: data.transaction })
      );
      return data.transaction;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update transaction";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

// İşlem sil
export const deleteTransactionThunk = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));

      await API.delete(`/transactions/${id}`);

      thunkAPI.dispatch(deleteTransactionAction(id));
      return id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete transaction";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

// Kategorileri getir
export const fetchCategories = createAsyncThunk(
  "transactions/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/transaction-categories");
      thunkAPI.dispatch(setCategories(data));
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch categories";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// İstatistikleri getir
export const fetchStatistics = createAsyncThunk(
  "transactions/fetchStatistics",
  async ({ month, year }, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));

      const { data } = await API.get(
        `/transactions-summary?month=${month}&year=${year}`
      );

      thunkAPI.dispatch(setStatistics(data));
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch statistics";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

// Kategoriye göre işlemleri getir
export const fetchTransactionsByCategory = createAsyncThunk(
  "transactions/fetchTransactionsByCategory",
  async (categoryId, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      thunkAPI.dispatch(setTransactionsLoading(true));

      const { data } = await API.get(`/transactions?categoryId=${categoryId}`);

      thunkAPI.dispatch(setTransactions(data.transactions));
      return data.transactions;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch transactions by category";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    } finally {
      thunkAPI.dispatch(setLoading(false));
      thunkAPI.dispatch(setTransactionsLoading(false));
    }
  }
);

// Bakiye getir
export const fetchBalance = createAsyncThunk(
  "transactions/fetchBalance",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/users/current");
      thunkAPI.dispatch(setBalance(data.balance));
      return data.balance;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch balance";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Döviz kurlarını getir (Monobank API)
export const fetchCurrencyRates = createAsyncThunk(
  "transactions/fetchCurrencyRates",
  async (_, thunkAPI) => {
    try {
      // localStorage'dan son sorgu zamanını kontrol et
      const lastFetchTime = localStorage.getItem("currencyLastFetch");
      const currentTime = new Date().getTime();

      // Eğer son sorgudan 1 saat geçmemişse, localStorage'dan al
      if (lastFetchTime && currentTime - parseInt(lastFetchTime) < 3600000) {
        const cachedRates = localStorage.getItem("currencyRates");
        if (cachedRates) {
          const parsedRates = JSON.parse(cachedRates);
          thunkAPI.dispatch(setCurrencyRates(parsedRates));
          return parsedRates;
        }
      }

      // Monobank API'den döviz kurlarını al
      const response = await fetch("https://api.monobank.ua/bank/currency");
      const rates = await response.json();

      // USD ve EUR kurlarını filtrele
      const usdRate = rates.find(
        (rate) => rate.currencyCodeA === 840 && rate.currencyCodeB === 980
      );
      const eurRate = rates.find(
        (rate) => rate.currencyCodeA === 978 && rate.currencyCodeB === 980
      );

      const currencyData = {
        USD: usdRate ? { buy: usdRate.rateBuy, sell: usdRate.rateSell } : null,
        EUR: eurRate ? { buy: eurRate.rateBuy, sell: eurRate.rateSell } : null,
        timestamp: currentTime,
      };

      // localStorage'a kaydet
      localStorage.setItem("currencyRates", JSON.stringify(currencyData));
      localStorage.setItem("currencyLastFetch", currentTime.toString());

      thunkAPI.dispatch(setCurrencyRates(currencyData));
      return currencyData;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch currency rates";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);




// Hata temizle
export const clearError = () => (dispatch) => {
  dispatch(setError(null));
};
