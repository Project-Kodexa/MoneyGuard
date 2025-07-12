import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTransactions, 
  fetchCategories,
  fetchTransactionsByCategory 
} from '../../redux/transactionsOperations';
import TransactionsList from './TransactionsList';
import ModalAddTransaction from '../../features/transactions/ModalAddTransaction/ModalAddTransaction';
import './HomeTab.css';

const HomeTab = () => {

  
  const dispatch = useDispatch();
  const { 
    transactions, 
    categories, 
    isLoading, 
    error 
  } = useSelector(state => state.transactions);
  
  console.log('HomeTab - Current transactions:', transactions); // DEBUG
  console.log('HomeTab - Transactions length:', transactions?.length); // DEBUG
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Modal kapandıktan sonra işlemleri tekrar çek (sadece gerekirse)
    // dispatch(fetchTransactions());
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
      <TransactionsList transactions={transactions} />

      {/* Add Transaction Button */}
      <button className="add-transaction-btn" onClick={handleOpenModal}>
        <span className="plus-icon">+</span>
      </button>

      {/* Modal */}
      <ModalAddTransaction 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default HomeTab;
