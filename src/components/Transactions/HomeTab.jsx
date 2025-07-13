import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTransactions, 
  fetchCategories,
  fetchTransactionsByCategory 
} from '../../redux/transactionsOperations';
import { selectTransactionsWithCategories } from '../../features/transactions/transactionsSlice';
import TransactionsList from './TransactionsList';
import ModalAddTransaction from '../../features/transactions/ModalAddTransaction/ModalAddTransaction';
import './HomeTab.css';

const HomeTab = () => {

  
  const dispatch = useDispatch();
  const { 
    categories, 
    isLoading, 
    error 
  } = useSelector(state => state.transactions);
  
  // Kategorilerle eşleştirilmiş transaction'ları al
  const transactions = useSelector(selectTransactionsWithCategories);
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Debug için kategorileri kontrol et
  console.log('Categories from store:', categories);
  if (categories && categories.length > 0) {
    console.log('First category example:', categories[0]);
    // INCOME ve EXPENSE kategorilerini ayır
    const incomeCategories = categories.filter(cat => cat.type === 'INCOME');
    const expenseCategories = categories.filter(cat => cat.type === 'EXPENSE');
    console.log('Income categories:', incomeCategories);
    console.log('Expense categories:', expenseCategories);
  }

  useEffect(() => {
    // Token kontrolü yap
    const token = localStorage.getItem('token');
    if (token) {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
    }
  }, [dispatch]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);

    if (category) {
      dispatch(fetchTransactionsByCategory(category));
    } else {
      dispatch(fetchTransactions());
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (transaction) => {
    setModalMode('edit');
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Kategoriler yüklenene kadar loading göster
  if (isLoading || !categories || categories.length === 0) {
    return (
      <div className="home-tab-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading transactions and categories...</p>
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
      {/* Transactions List */}
      <TransactionsList 
        transactions={transactions} 
        onEditTransaction={handleOpenEditModal}
      />

      {/* Add Transaction Button */}
      <button className="add-transaction-btn" onClick={handleOpenAddModal}>
        <span className="plus-icon">+</span>
      </button>

      {/* Universal Transaction Modal */}
      <ModalAddTransaction 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        mode={modalMode}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default HomeTab;
