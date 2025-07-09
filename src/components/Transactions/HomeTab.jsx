import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTransactions, 
  fetchCategories,
  fetchTransactionsByCategory 
} from '../../features/transactions/transactionsOperations';
import { 
  filterTransactionsByCategory, 
  clearFilter 
} from '../../features/transactions/transactionsSlice';
import TransactionsList from './TransactionsList';
import './HomeTab.css';

const HomeTab = () => {
  const dispatch = useDispatch();
  const { 
    transactions, 
    filteredTransactions,
    categories, 
    isLoading, 
    error,
    currentFilter 
  } = useSelector(state => state.transactions);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category) {
      dispatch(filterTransactionsByCategory(category));
    } else {
      dispatch(clearFilter());
    }
  };

  const handleCategoryFetch = async (category) => {
    if (category) {
      await dispatch(fetchTransactionsByCategory(category));
    } else {
      await dispatch(fetchTransactions());
    }
  };

  if (isLoading) {
    return (
      <div className="home-tab-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-tab-error">
        <div className="error-container">
          <h3>Error Loading Transactions</h3>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => dispatch(fetchTransactions())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-tab">
      <div className="home-tab-header">
        <h2>Transactions</h2>
        
        {/* Category Filter */}
        <div className="category-filter">
          <label htmlFor="category-select">Filter by Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          
          {currentFilter && (
            <button
              className="clear-filter-button"
              onClick={() => handleCategoryFilter('')}
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Transaction Count */}
      <div className="transaction-count">
        <p>
          Showing {filteredTransactions.length} of {transactions.length} transactions
          {currentFilter && ` in category: ${currentFilter}`}
        </p>
      </div>

      {/* Transactions List */}
      <TransactionsList transactions={filteredTransactions} />
    </div>
  );
};

export default HomeTab;