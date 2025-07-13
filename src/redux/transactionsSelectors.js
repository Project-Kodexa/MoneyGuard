import { createSelector } from 'reselect';

export const getAllTransactions = (state) => state.transactions.transactions;



export const selectExpenseTransactionsByMonth = createSelector(
  [getAllTransactions, (_, year) => year, (_, __, month) => month],
  (transactions, year, month) => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.transactionDate);
      const matchesYear = txDate.getFullYear() === year;
      const matchesMonth = month === 0 ? true : (txDate.getMonth() + 1) === month;
      return tx.type === 'EXPENSE' && matchesYear && matchesMonth;
    });
  }
);



export const selectFilteredExpenses = createSelector(
  [
    getAllTransactions,
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