import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatistics } from '../../redux/transactionsOperations';
import styles from './StatisticsTab.module.css';

const StatisticsTab = () => {
  const dispatch = useDispatch();
  const { statistics, isLoading, error } = useSelector(state => state.transactions);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    // Sadece token varsa API istekleri yap
    if (token) {
      dispatch(fetchStatistics({ month: selectedMonth, year: selectedYear }));
    }
  }, [dispatch, selectedMonth, selectedYear, token]);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h3>Error loading statistics</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.statisticsTab}>
      <h2 className={styles.title}>Statistics</h2>
      
      {/* Date Selector */}
      <div className={styles.dateSelector}>
        <select 
          value={selectedMonth} 
          onChange={handleMonthChange}
          className={styles.select}
        >
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        
        <select 
          value={selectedYear} 
          onChange={handleYearChange}
          className={styles.select}
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics Content */}
      <div className={styles.content}>
        {statistics ? (
          <div className={styles.statisticsGrid}>
            <div className={styles.summaryCard}>
              <h3>Total Income</h3>
              <div className={styles.amount}>
                ${statistics.totalIncome?.toFixed(2) || '0.00'}
              </div>
            </div>
            
            <div className={styles.summaryCard}>
              <h3>Total Expenses</h3>
              <div className={styles.amount}>
                ${statistics.totalExpenses?.toFixed(2) || '0.00'}
              </div>
            </div>
            
            <div className={styles.summaryCard}>
              <h3>Net Balance</h3>
              <div className={styles.amount}>
                ${((statistics.totalIncome || 0) - (statistics.totalExpenses || 0)).toFixed(2)}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noData}>
            <p>No statistics available for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsTab; 