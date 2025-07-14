import { createSelector } from '@reduxjs/toolkit';

// Temel selector'lar
export const selectTransactions = (state) => state.transactions.transactions || [];
export const selectCategories = (state) => state.transactions.categories || [];
export const selectStatistics = (state) => state.transactions.statistics;

// Expense transactions'ları filtrele
export const selectExpenseTransactions = createSelector(
  [selectTransactions],
  (transactions) => transactions.filter(tx => 
    tx.type?.toLowerCase() === 'expense' || tx.type === 'EXPENSE'
  )
);

// Income transactions'ları filtrele
export const selectIncomeTransactions = createSelector(
  [selectTransactions],
  (transactions) => transactions.filter(tx => 
    tx.type?.toLowerCase() === 'income' || tx.type === 'INCOME'
  )
);

// Factory: Belirli ay ve yıl için expense transactions'ları filtrele
export const makeSelectExpenseTransactionsByMonth = () =>
  createSelector(
    [selectExpenseTransactions, (_, year) => year, (_, __, month) => month],
    (expenseTransactions, year, month) => {
      return expenseTransactions.filter(tx => {
        if (!tx.date) return false;
        
        const txDate = new Date(tx.date);
        const txYear = txDate.getFullYear();
        const txMonth = txDate.getMonth() + 1;
        
        if (month === 0) {
          return txYear === year;
        }
        
        return txYear === year && txMonth === month;
      });
    }
  );

// Factory: Belirli ay ve yıl için income transactions'ları filtrele
export const makeSelectIncomeTransactionsByMonth = () =>
  createSelector(
    [selectIncomeTransactions, (_, year) => year, (_, __, month) => month],
    (incomeTransactions, year, month) => {
      return incomeTransactions.filter(tx => {
        if (!tx.date) return false;
        
        const txDate = new Date(tx.date);
        const txYear = txDate.getFullYear();
        const txMonth = txDate.getMonth() + 1;
        
        if (month === 0) {
          return txYear === year;
        }
        
        return txYear === year && txMonth === month;
      });
    }
  );

// Factory: Kategori bazında toplam hesapla
export const makeSelectCategoryTotals = () =>
  createSelector(
    [makeSelectExpenseTransactionsByMonth(), selectCategories],
    (transactions, categories) => {
      const categoryMap = {};
      const categoryIdToName = {};
      
      categories.forEach(cat => {
        categoryIdToName[cat.id] = cat.name;
      });
      
      transactions.forEach(tx => {
        const categoryName = categoryIdToName[tx.categoryId] || 'Uncategorized';
        categoryMap[categoryName] = (categoryMap[categoryName] || 0) + Math.abs(Number(tx.amount));
      });
      
      return categoryMap;
    }
  );

// Factory: Toplam gelir hesapla
export const makeSelectTotalIncome = () =>
  createSelector(
    [makeSelectIncomeTransactionsByMonth()],
    (transactions) => transactions.reduce((total, tx) => total + Math.abs(Number(tx.amount)), 0)
  );

// Factory: Toplam gider hesapla
export const makeSelectTotalExpenses = () =>
  createSelector(
    [makeSelectExpenseTransactionsByMonth()],
    (transactions) => transactions.reduce((total, tx) => total + Math.abs(Number(tx.amount)), 0)
  );
