import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransactionThunk } from '../../features/transactions/transactionsOperations';
import './TransactionsItem.css';

const TransactionsItem = ({ transaction }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteTransactionThunk(transaction.id)).unwrap();
      } catch (error) {
        alert(`Failed to delete transaction: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTypeIcon = (type) => {
    return type === 'income' ? '📈' : '📉';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Salary': '💰',
      'Freelance': '💼',
      'Investment': '📊',
      'Food': '🍽️',
      'Transport': '🚗',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Healthcare': '🏥',
      'Education': '📚'
    };
    return icons[category] || '📋';
  };

  return (
    <div className={`transaction-item ${transaction.type === 'expense' ? 'expense' : 'income'}`}>
      <div className="transaction-info">
        <div className="transaction-header">
          <div className="transaction-type-icon">
            {getTypeIcon(transaction.type)}
          </div>
          <div className="transaction-date">
            {formatDate(transaction.date)}
          </div>
        </div>
        
        <div className="transaction-details">
          <div className="transaction-category">
            <span className="category-icon">{getCategoryIcon(transaction.category)}</span>
            {transaction.category}
          </div>
          <div className="transaction-description">
            {transaction.description}
          </div>
        </div>
        
        <div className="transaction-amount">
          {formatAmount(transaction.amount)}
        </div>
      </div>
      
      <div className="transaction-actions">
        <button 
          className="edit-button"
          onClick={() => {
            console.log('Edit transaction:', transaction.id);
            // TODO: Implement edit functionality
          }}
          title="Edit transaction"
        >
          ✏️ Edit
        </button>
        <button 
          className="delete-button"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete transaction"
        >
          {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete'}
        </button>
      </div>
    </div>
  );
};

export default TransactionsItem;