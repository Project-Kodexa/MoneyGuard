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

      const response = await API.get("/transactions");
      
      // API response formatını kontrol et ve normalize et
      let transactionsData;
      
      if (response.data && Array.isArray(response.data)) {
        // Format: { data: [...] }
        transactionsData = response.data;
      } else if (response.data && response.data.transactions && Array.isArray(response.data.transactions)) {
        // Format: { data: { transactions: [...] } }
        transactionsData = response.data.transactions;
      } else if (response.data && response.data.result && Array.isArray(response.data.result)) {
        // Format: { data: { result: [...] } }
        transactionsData = response.data.result;
      } else {
        // Bilinmeyen format, boş array döndür
        console.warn('Unknown API response format:', response.data);
        transactionsData = [];
      }

      // Transaction verilerini normalize et - categoryId ekle
      const normalizedTransactions = transactionsData.map(transaction => {
        return {
          ...transaction,
          // API'den gelen transactionDate alanını date olarak normalize et
          date: transaction.transactionDate || transaction.date || new Date().toISOString(),
          categoryId: transaction.categoryId || transaction.category || '',
          category: transaction.category || transaction.categoryId || '' // Geriye uyumluluk için
        };
      });
      
      thunkAPI.dispatch(setTransactions(normalizedTransactions));
      thunkAPI.dispatch(setError(null)); // Error state'ini temizle
      return normalizedTransactions;
    } catch (error) {
      console.error('API Error:', error);
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

      // Expense işlemleri için tutarı negatif yap
      const apiData = { ...transactionData };
      if (apiData.type === 'EXPENSE' && apiData.amount > 0) {
        apiData.amount = -Math.abs(apiData.amount);
      }

      const { data } = await API.post("/transactions", apiData);

      // API'den dönen veri formatını kontrol et ve normalize et
      let transactionToAdd = data.transaction || data;

      // Eksik alanları tamamla
      transactionToAdd = {
        id: transactionToAdd.id || Date.now().toString(),
        type: transactionToAdd.type || transactionData.type || 'expense',
        amount: parseFloat(transactionToAdd.amount || transactionData.amount || 0),
        date: transactionToAdd.transactionDate || transactionToAdd.date || transactionData.transactionDate || new Date().toISOString(),
        categoryId: transactionToAdd.categoryId || transactionData.categoryId || transactionToAdd.category || transactionData.category || '',
        category: transactionToAdd.category || transactionData.category || '', // Geriye uyumluluk için
        comment: transactionToAdd.comment || transactionData.comment || 'No comment'
      };

      // Date'i ISO string formatına dönüştür
      if (transactionToAdd.date && typeof transactionToAdd.date === 'string') {
        transactionToAdd.date = new Date(transactionToAdd.date).toISOString();
      }

      thunkAPI.dispatch(addTransaction(transactionToAdd));
      return transactionToAdd;
    } catch (error) {
      console.error('API Error:', error.response?.data || error);
      console.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // API error message array'ini detaylı göster
      if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
        console.error('API Validation Errors:', error.response.data.message);
      }
      
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

      // API update endpoint'i desteklemiyor, bu yüzden delete + create pattern kullanıyoruz
      // 1. Önce eski transaction'ı sil
      await API.delete(`/transactions/${id}`);
      
      // 2. Yeni transaction'ı oluştur
      // Expense işlemleri için tutarı negatif yap
      const apiData = { ...transactionData };
      if (apiData.type === 'EXPENSE' && apiData.amount > 0) {
        apiData.amount = -Math.abs(apiData.amount);
      }
      
      const { data } = await API.post("/transactions", apiData);

      // API'den dönen veriyi normalize et
      let newTransaction = data.transaction || data;
      
      // Eksik alanları tamamla
      newTransaction = {
        id: newTransaction.id || Date.now().toString(),
        type: newTransaction.type || transactionData.type || 'expense',
        amount: parseFloat(newTransaction.amount || transactionData.amount || 0),
        date: newTransaction.transactionDate || newTransaction.date || transactionData.transactionDate || new Date().toISOString(),
        categoryId: newTransaction.categoryId || transactionData.categoryId || newTransaction.category || transactionData.category || '',
        category: newTransaction.category || transactionData.category || '', // Geriye uyumluluk için
        comment: newTransaction.comment || transactionData.comment || 'No comment'
      };

      // Date'i ISO string formatına dönüştür
      if (newTransaction.date && typeof newTransaction.date === 'string') {
        newTransaction.date = new Date(newTransaction.date).toISOString();
      }

      // Redux store'da eski transaction'ı sil ve yenisini ekle
      thunkAPI.dispatch(deleteTransactionAction(id));
      thunkAPI.dispatch(addTransaction(newTransaction));
      
      return newTransaction;
    } catch (error) {
      console.error('Update transaction error:', error.response?.data || error);
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
      
      // Debug için API response'unu logla
      console.log('Categories API Response:', data);
      
      thunkAPI.dispatch(setCategories(data));
      return data;
    } catch (error) {
      console.error('Categories API Error:', error.response?.data || error);
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

      // Transaction verilerini normalize et - categoryId ekle
      const normalizedTransactions = data.transactions.map(transaction => ({
        ...transaction,
        // API'den gelen transactionDate alanını date olarak normalize et
        date: transaction.transactionDate || transaction.date || new Date().toISOString(),
        categoryId: transaction.categoryId || transaction.category || '',
        category: transaction.category || transaction.categoryId || '' // Geriye uyumluluk için
      }));

      thunkAPI.dispatch(setTransactions(normalizedTransactions));
      return normalizedTransactions;
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
