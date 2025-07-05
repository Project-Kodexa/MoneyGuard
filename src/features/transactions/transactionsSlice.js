import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  categories: [],
  isLoading: false,
  error: null,
  filter: {
    category: '',
    type: '',
    dateRange: null
  }
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setCategories,
  setLoading,
  setError,
  setFilter,
  clearError
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
