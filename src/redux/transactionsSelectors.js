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

// Belirli ay ve yıl için expense transactions'ları filtrele
export const selectExpenseTransactionsByMonth = createSelector(
  [selectExpenseTransactions, (state, year, month) => ({ year, month })],
  (expenseTransactions, { year, month }) => {
    return expenseTransactions.filter(tx => {
      if (!tx.date) return false;
      
      const txDate = new Date(tx.date);
      const txYear = txDate.getFullYear();
      const txMonth = txDate.getMonth() + 1; // 1-12 arası
      
      if (month === 0) {
        // Tüm aylar seçilmişse sadece yıla göre filtrele
        return txYear === year;
      }
      
      return txYear === year && txMonth === month;
    });
  }
);

// Belirli ay ve yıl için income transactions'ları filtrele
export const selectIncomeTransactionsByMonth = createSelector(
  [selectIncomeTransactions, (state, year, month) => ({ year, month })],
  (incomeTransactions, { year, month }) => {
    return incomeTransactions.filter(tx => {
      if (!tx.date) return false;
      
      const txDate = new Date(tx.date);
      const txYear = txDate.getFullYear();
      const txMonth = txDate.getMonth() + 1; // 1-12 arası
      
      if (month === 0) {
        // Tüm aylar seçilmişse sadece yıra göre filtrele
        return txYear === year;
      }
      
      return txYear === year && txMonth === month;
    });
  }
);

// Kategori bazında toplam hesapla
export const selectCategoryTotals = createSelector(
  [selectExpenseTransactionsByMonth, selectCategories],
  (transactions, categories) => {
    const categoryMap = {};
    
    // Kategori ID'lerini isimlere dönüştür
    const categoryIdToName = {};
    categories.forEach(cat => {
      categoryIdToName[cat.id] = cat.name;
    });
    
    // Transaction'ları kategorilere göre grupla
    transactions.forEach(tx => {
      const categoryName = categoryIdToName[tx.categoryId] || 'Uncategorized';
      categoryMap[categoryName] = (categoryMap[categoryName] || 0) + Math.abs(Number(tx.amount));
    });
    
    return categoryMap;
  }
);

// Toplam gelir hesapla
export const selectTotalIncome = createSelector(
  [selectIncomeTransactionsByMonth],
  (transactions) => transactions.reduce((total, tx) => total + Math.abs(Number(tx.amount)), 0)
);

// Toplam gider hesapla
export const selectTotalExpenses = createSelector(
  [selectExpenseTransactionsByMonth],
  (transactions) => transactions.reduce((total, tx) => total + Math.abs(Number(tx.amount)), 0)
); 