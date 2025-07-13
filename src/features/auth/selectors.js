import { createSelector } from '@reduxjs/toolkit';

export const selectIsLoggedIn = state => state.auth.isLoggedIn;

export const selectUser = state => state.auth.user;

export const selectIsRefreshing = state => state.auth.isRefreshing;

export const selectBalance = state => state.auth.user.balance;

export const selectTransactions = createSelector(
  (state) => state.transactions.items,
  (items) => items
);