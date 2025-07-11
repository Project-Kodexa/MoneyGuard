import React from 'react';
import TransactionsItem from './TransactionsItem';
import './TransactionsList.css';

const TransactionsList = ({ transactions }) => {
  console.log('TransactionsList - Received transactions:', transactions); // DEBUG
  console.log('TransactionsList - Transactions length:', transactions?.length); // DEBUG
  
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
      {/* Tablo başlıkları */}
      <div className="transactions-table-header">
        <div>Date</div>
        <div>Type</div>
        <div>Category</div>
        <div>Comment</div>
        <div>Sum</div>
        <div></div> {/* Sadece Delete butonu için boş hücre */}
      </div>
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