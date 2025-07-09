import React from 'react';
import TransactionsItem from './TransactionsItem';
import './TransactionsList.css';

const TransactionsList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="transactions-list-empty">
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h3>No transactions found</h3>
          <p>Add your first transaction to get started!</p>
          <div className="empty-actions">
            <button className="add-first-transaction-btn">
              Add Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-list-container">
      <div className="transactions-list">
        {transactions.map(transaction => (
          <TransactionsItem 
            key={transaction.id} 
            transaction={transaction} 
          />
        ))}
      </div>
      
      {/* Scroll indicator */}
      {transactions.length > 5 && (
        <div className="scroll-indicator">
          <p>Scroll to see more transactions</p>
          <div className="scroll-arrow">↓</div>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;