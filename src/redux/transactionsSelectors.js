import { createSelector } from 'reselect';

export const selectTransactions = (state) => state.transactions.transactions;

export const selectExpenseTransactionsByMonth = createSelector(
  [selectTransactions, (_, selectedYear) => selectedYear, (_, __, selectedMonth) => selectedMonth],
  (transactions, year, month) => {
    return transactions.filter(tx => {
      const date = new Date(tx.date);
      return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        tx.type?.toLowerCase() === 'expense'
      );
    });
  }
);
export const selectAllTransactions = (state) => state.transactions.transactions;

export const selectFilteredExpenses = createSelector(
  [
    selectAllTransactions,
    (_, selectedYear) => selectedYear,
    (_, __, selectedMonth) => selectedMonth,
  ],
  (transactions, year, month) => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(tx => {
      const date = new Date(tx.date);
      return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        tx.type?.toLowerCase() === 'expense'
      );
    });
  }
);