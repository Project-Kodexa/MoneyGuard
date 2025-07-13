import { useSelector } from "react-redux";
import styles from "./Statistics.module.css";

export default function StatisticsTable() {
  const { expenses, totalExpense, totalIncome } = useSelector(
    (state) => state.statistics
  );

  return (
    <div className={styles.table}>
      <ul>
        {expenses.map((item) => (
          <li key={item.category} className={styles.listItem}>
            <span>
              <span
                className={styles.colorBox}
                style={{ backgroundColor: item.color }}
              ></span>
              {item.category}
            </span>
            <span>
              {item.amount.toLocaleString(undefined, {
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
            {totalExpense.toLocaleString()}
          </span>
        </p>
        <p>
          Income:{" "}
          <span className={styles.income}>{totalIncome.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}
