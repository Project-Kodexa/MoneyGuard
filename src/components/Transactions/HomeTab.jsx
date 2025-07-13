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
  
  // Debug için kategorileri kontrol et (gerekirse açabilirsiniz)
  // console.log('Categories from store:', categories);
  // console.log('Transactions with categories:', transactions);
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Kategorileri normalize et (string veya obje olabilir)
  // const categoriesNormalized = categories.map((cat, idx) =>
  //   typeof cat === "string" ? { id: idx, name: cat } : cat
  // );

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
