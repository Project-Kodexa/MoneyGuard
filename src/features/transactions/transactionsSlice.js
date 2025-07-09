import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  categories: [],
  statistics: null,
  balance: 0,
  isLoading: false,
  error: null,
  currencyRates: null,
  filteredTransactions: [],
  currentFilter: null
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.filteredTransactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
      state.filteredTransactions.push(action.payload);
    },
    updateTransaction: (state, action) => {
      const { id, transaction } = action.payload;
      const index = state.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...transaction };
        state.filteredTransactions[index] = { ...state.filteredTransactions[index], ...transaction };
      }
    },
    deleteTransaction: (state, action) => {
      const id = action.payload;
      state.transactions = state.transactions.filter(t => t.id !== id);
      state.filteredTransactions = state.filteredTransactions.filter(t => t.id !== id);
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setStatistics: (state, action) => {
      state.statistics = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setCurrencyRates: (state, action) => {
      state.currencyRates = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    filterTransactionsByCategory: (state, action) => {
      const category = action.payload;
      state.currentFilter = category;
      if (category) {
        state.filteredTransactions = state.transactions.filter(t => t.category === category);
      } else {
        state.filteredTransactions = state.transactions;
      }
    },
    clearFilter: (state) => {
      state.currentFilter = null;
      state.filteredTransactions = state.transactions;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.filteredTransactions = [];
      state.categories = [];
      state.statistics = null;
      state.balance = 0;
      state.error = null;
    }
  },
});

export const { 
  setTransactions, 
  addTransaction, 
  updateTransaction,
  deleteTransaction,
  setCategories,
  setStatistics,
  setBalance,
  setCurrencyRates,
  setLoading, 
  setError,
  filterTransactionsByCategory,
  clearFilter,
  clearTransactions
} = transactionsSlice.actions;

export default transactionsSlice.reducer; 