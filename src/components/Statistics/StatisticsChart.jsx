
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./Statistics.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatisticsChart() {
  const { expenses } = useSelector((state) => state.statistics);

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const data = {
    labels: expenses.map((e) => e.category),
    datasets: [
      {
        data: expenses.map((e) => e.amount),
        backgroundColor: expenses.map((e) => e.color),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <Doughnut data={data} />
        <div className={styles.centerText}>₴ {totalAmount.toFixed(2)}</div>
      </div>

      <div className={styles.expenseList}>
        {expenses.map((item, index) => (
          <div key={index} className={styles.listItem}>
            <div
              className={styles.colorBox}
              style={{ backgroundColor: item.color }}
            ></div>
            <span className={styles.categoryName}>{item.category}</span>
            <span className={styles.amount}>
              ₴{" "}
              {item.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
