import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Balance.module.css';

const Balance = () => {
  const balance = useSelector(state => state.auth.user?.balance || 0);
  
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
        <div className={styles.balanceAmount}>
          {formatCurrency(balance)}
        </div>
      </div>
    </div>
  );
};

export default Balance; 