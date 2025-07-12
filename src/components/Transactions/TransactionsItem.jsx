import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransactionThunk } from '../../redux/transactionsOperations';
import './TransactionsItem.css';

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.013 2.013a1.375 1.375 0 0 1 1.944 1.944l-7.2 7.2-2.163.219a.5.5 0 0 1-.548-.548l.219-2.163 7.2-7.2Zm2.057-.057a2.375 2.375 0 0 0-3.357 0l-7.2 7.2A1 1 0 0 0 1.25 10.75l2.163-.219a1 1 0 0 0 .548-.274l7.2-7.2a2.375 2.375 0 0 0 0-3.357Z" fill="#BDBDBD"/>
  </svg>
);

const TransactionsItem = ({ transaction }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteTransactionThunk(transaction.id)).unwrap();
      } catch (error) {
        // Error handling - alert yerine console.error kullan
        console.error('Failed to delete transaction:', error.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Tarih formatı: 04.01.23
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB').replace(/\//g, '.');
  };

  // Sadece + veya - işareti
  const getTypeSign = (type) => {
    const normalizedType = type?.toLowerCase();
    return (normalizedType === 'income' ? '+' : '-');
  };

  // Kategori adı
  const getCategory = (category) => category || '';

  // Yorum
  const getComment = (comment) => comment || '';

  // Tutar
  const formatAmount = (amount) => {
    return Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className={`transaction-item ${transaction.type?.toLowerCase()}`}> {/* grid satır */}
      <div className="transaction-date">{formatDate(transaction.date)}</div>
      <div className={`transaction-type ${transaction.type?.toLowerCase()}`}>{getTypeSign(transaction.type)}</div>
      <div className="transaction-category">{getCategory(transaction.category)}</div>
      <div className="transaction-description">{getComment(transaction.comment)}</div>
      <div className="transaction-amount">{formatAmount(transaction.amount)}</div>
      <div className="transaction-actions">
        <button className="edit-icon-btn" title="Edit" style={{width:14, height:14, display:'flex', alignItems:'center', justifyContent:'center', marginRight:8, padding:0, background:'none', border:'none', cursor:'pointer'}}>
          <EditIcon />
        </button>
        <button 
          className="delete-button"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete transaction"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TransactionsItem;