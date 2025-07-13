import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';
import styles from './StatisticsTab.module.css';
import { selectExpenseTransactionsByMonth } from '../../redux/transactionsSelectors';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const StatisticsTab = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Redux selector'a parametre gönderirken state'den sonra argümanlar
  const filteredTransactions = useSelector(state =>
    selectExpenseTransactionsByMonth(state, selectedYear, selectedMonth)
  );

  const categorySums = useMemo(() => {
    const sums = {};
    filteredTransactions.forEach(tx => {
      const category = tx.category || 'Uncategorized';
      sums[category] = (sums[category] || 0) + Number(tx.amount);
    });
    return sums;
  }, [filteredTransactions]);

  const chartData = {
    labels: Object.keys(categorySums),
    datasets: [
      {
        data: Object.values(categorySums),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8BC34A',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.statisticsTab}>
      <h2>Statistics</h2>

      <div className={styles.controls}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {format(new Date(2000, i), 'MMMM')}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <p>No expenses found for the selected period.</p>
      ) : (
        <>
          <div className={styles.chartContainer}>
            <Doughnut data={chartData} />
          </div>

          <div className={styles.expenseList}>
            <h3>Expenses</h3>
            <ul>
              {filteredTransactions.map((tx) => (
                <li key={tx.id} className={styles.expenseItem}>
                  <span>{tx.category}</span>
                  <span>{Number(tx.amount).toFixed(2)} USD</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsTab;
