import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  setTransactions, 
  setCategories, 
  setLoading, 
  setError,
  addTransaction,
  updateTransaction,
  deleteTransaction
} from './transactionsSlice';

// Fetch transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await new Promise(resolve => setTimeout(resolve, 800));
      dispatch(setTransactions([]));
      return [];
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch transactions'));
      throw error;
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'transactions/fetchCategories',
  async (_, { dispatch }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch(setCategories([]));
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
);

// Add transaction
export const addTransactionThunk = createAsyncThunk(
  'transactions/addTransaction',
  async (transactionData, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTransaction = {
        ...transactionData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      dispatch(addTransaction(newTransaction));
      return newTransaction;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to add transaction'));
      throw error;
    }
  }
);

// Update transaction
export const updateTransactionThunk = createAsyncThunk(
  'transactions/updateTransaction',
  async (transactionData, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(updateTransaction(transactionData));
      return transactionData;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to update transaction'));
      throw error;
    }
  }
);

// Delete transaction
export const deleteTransactionThunk = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transactionId, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch(deleteTransaction(transactionId));
      return transactionId;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to delete transaction'));
      throw error;
    }
  }
);
