import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import { fetchTransactions, fetchCategories } from '../../redux/transactionsOperations';
import { selectExpenseTransactionsByMonth } from '../../redux/transactionsSelectors';

import {
  Chart as ChartJS,
  ArcElement,       // Doughnut için gerekli
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


const StatisticsTab = () => {
  const dispatch = useDispatch();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const categories = useSelector((state) => state.transactions.categories || []);
  const filteredTransactions = useSelector((state) =>
    selectExpenseTransactionsByMonth(state, selectedYear, selectedMonth)
  );

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  // ID → isim map
  const categoryIdNameMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  // Debug loglar:
  useEffect(() => {
    filteredTransactions.forEach(tx => {
      console.log('Transaction id:', tx.id, 'Category id:', tx.categoryId);
    });
  }, [filteredTransactions]);

  useEffect(() => {
    Object.entries(categoryIdNameMap).forEach(([id, name]) => {
      console.log('Category id:', id, 'Category name:', name);
    });
  }, [categoryIdNameMap]);

  const categorySums = useMemo(() => {
    const sums = {};
    filteredTransactions.forEach((tx) => {
      const categoryName = categoryIdNameMap[tx.categoryId] || 'Uncategorized';
      sums[categoryName] = (sums[categoryName] || 0) + Number(tx.amount);
    });
    return sums;
  }, [filteredTransactions, categoryIdNameMap]);

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8BC34A'];
  const chartData = {
    labels: Object.keys(categorySums),
    datasets: [
      {
        data: Object.values(categorySums),
        backgroundColor: Object.keys(categorySums).map(
          (_, idx) => colors[idx % colors.length]
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Statistics</h2>

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

      {filteredTransactions.length === 0 ? (
        <p>No expenses found for the selected period.</p>
      ) : (
        <>
          <Doughnut data={chartData} />

          <ul>
            {filteredTransactions.map((tx) => {
              const categoryName = categoryIdNameMap[tx.categoryId] || 'Uncategorized';
              return (
                <li key={tx.id}>
                  {categoryName}: {Number(tx.amount).toFixed(2)} USD
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default StatisticsTab;
