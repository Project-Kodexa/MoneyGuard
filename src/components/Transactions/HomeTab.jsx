import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchCategories } from '../../features/transactions/transactionsOperations';
import TransactionsList from './TransactionsList';

const HomeTab = () => {
  const dispatch = useDispatch();
  const { transactions, isLoading, error } = useSelector(state => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '40px',
        fontSize: '16px',
        color: '#666'
      }}>
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => dispatch(fetchTransactions())}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-tab">
      <h2>Transactions</h2>
      <TransactionsList transactions={transactions} />
    </div>
  );
};

export default HomeTab;