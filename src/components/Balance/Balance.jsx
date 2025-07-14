import React from 'react';
import { useSelector } from 'react-redux';
import { selectBalance } from '../../features/transactions/transactionsSlice';
import styles from './Balance.module.css';

const Balance = () => {
  const balance = useSelector(selectBalance);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={styles.balanceContainer}>
      <div className={styles.balanceCard}>
        <h3 className={styles.balanceTitle}>Your Balance</h3>
        <p className={styles.balanceAmount}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
};

export default Balance; 