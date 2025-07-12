import React from 'react';
import styles from './ButtonAddTransactions.module.css';

const ButtonAddTransactions = ({ onClick, children = 'Add Transaction' }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonAddTransactions; 