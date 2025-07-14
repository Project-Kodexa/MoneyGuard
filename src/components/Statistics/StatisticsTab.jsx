import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import { fetchTransactions, fetchCategories } from '../../redux/transactionsOperations';
import {
  makeSelectExpenseTransactionsByMonth,
  makeSelectCategoryTotals,
  makeSelectTotalIncome,
  makeSelectTotalExpenses
} from '../../redux/transactionsSelectors';
import styles from './StatisticsTab.module.css';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatisticsTab = () => {
  const dispatch = useDispatch();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Memoized selector instance'larını oluştur
  const selectExpenseByMonth = useMemo(makeSelectExpenseTransactionsByMonth, []);
  const categoryTotalsSelector = useMemo(makeSelectCategoryTotals, []);
  const totalIncomeSelector = useMemo(makeSelectTotalIncome, []);
  const totalExpensesSelector = useMemo(makeSelectTotalExpenses, []);

  const filteredTransactions = useSelector((state) =>
    selectExpenseByMonth(state, selectedYear, selectedMonth)
  );

  const categorySums = useSelector((state) =>
    categoryTotalsSelector(state, selectedYear, selectedMonth)
  );

  const totalIncome = useSelector((state) =>
    totalIncomeSelector(state, selectedYear, selectedMonth)
  );

  const totalExpenses = useSelector((state) =>
    totalExpensesSelector(state, selectedYear, selectedMonth)
  );

  const categories = useSelector((state) => state.transactions.categories || []);

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

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8BC34A",
  ];

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

  // Balance hesapla
  const balance = totalIncome - totalExpenses;

  // Center text plugin
  const centerTextPlugin = useMemo(() => ({
    id: "centerText",
    beforeDraw: (chart) => {
      const { width, height } = chart;
      const ctx = chart.ctx;
      ctx.restore();

      const fontSize = (height / 120).toFixed(2);
      ctx.font = `bold ${fontSize}em 'Segoe UI', sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";

      const text = `$${balance.toFixed(2)}`;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2 - 10;


      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  }), [balance]);

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#fff",
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Statistics</h2>

      <div className={styles.dateSelector}>
        <select
          className={styles.select}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          <option className={styles.option} value={0}>
            All Months
          </option>
          {Array.from({ length: 12 }, (_, i) => (
            <option className={styles.option} key={i} value={i + 1}>
              {format(new Date(2000, i), "MMMM")}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option className={styles.option} key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className={styles.noData}>
          <p>No expenses found for the selected period.</p>
        </div>
      ) : (
        <div className={styles.chartTableWrapper}>
          <div className={styles.chart}>
            <Doughnut
              data={chartData}
              options={chartOptions}
              plugins={[centerTextPlugin]}
            />
          </div>

          <div className={styles.table}>
            <ul className={styles.list}>
              {Object.entries(categorySums).map(([categoryName, amount]) => (
                <li className={styles.listItem} key={categoryName}>
                  <span>
                    <span
                      className={styles.colorBox}
                      style={{
                        backgroundColor:
                          colors[
                            Object.keys(categorySums).indexOf(categoryName) %
                              colors.length
                          ],
                      }}
                    ></span>
                    {categoryName}
                  </span>
                  <span>
                    {amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.totals}>
              <p>
                Expenses:{" "}
                <span className={styles.expense}>
                  {totalExpenses.toLocaleString()}
                </span>
              </p>
              <p>
                Income:{" "}
                <span className={styles.income}>
                  {totalIncome.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsTab;
