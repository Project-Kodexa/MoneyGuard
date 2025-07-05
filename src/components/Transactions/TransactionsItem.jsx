import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransaction } from './transactionsOperations';
import './TransactionsItem.css';

const TransactionsItem = ({ transaction }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteTransaction(transaction.id)).unwrap();
      } catch (error) {
        alert(`Failed to delete transaction: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className={`transaction-item ${transaction.type === 'expense' ? 'expense' : 'income'}`}>
      <div className="transaction-info">
        <div className="transaction-date">
          {formatDate(transaction.date)}
        </div>
        <div className="transaction-type">
          {transaction.type === 'expense' ? 'Expense' : 'Income'}
        </div>
        <div className="transaction-category">
          {transaction.category}
        </div>
        <div className="transaction-comment">
          {transaction.comment}
        </div>
        <div className="transaction-amount">
          {formatAmount(transaction.sum)}
        </div>
      </div>
      
      <div className="transaction-actions">
        <button 
          className="edit-button"
          onClick={() => {
            
            console.log('Edit transaction:', transaction.id);
          }}
        >
          Edit
        </button>
        <button 
          className="delete-button"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default TransactionsItem;