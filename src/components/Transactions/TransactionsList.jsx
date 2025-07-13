import React, { useState } from 'react';
import TransactionsItem from './TransactionsItem';
import './TransactionsList.css';
import ModalAddTransaction from '../../features/transactions/ModalAddTransaction/ModalAddTransaction';

const TransactionsList = ({ transactions, onEditTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  if (!transactions || transactions.length === 0) {
    return (
      <div className="transactions-list-empty">
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h3>No transactions found</h3>
          <p>Add your first transaction to get started!</p>
          <div className="empty-actions">

            <button className="add-first-transaction-btn" onClick={handleOpenModal}>
              Add Transaction
            </button>

            {/* Modal */}
            {isModalOpen && (
              <ModalAddTransaction
                isOpen={isModalOpen}
                onClose={handleCloseModal}
              />
            )}

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

        <div></div>

        <div></div> {/* Sadece Delete butonu için boş hücre */}

      </div>
      <div className="transactions-list">
        {transactions.map(transaction => (
          <TransactionsItem 
            key={transaction.id} 
            transaction={transaction} 
            onEdit={onEditTransaction}
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


