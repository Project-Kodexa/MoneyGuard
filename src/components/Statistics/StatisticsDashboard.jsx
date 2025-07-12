import { useDispatch, useSelector } from "react-redux";
import { setMonth, setYear } from "../../redux/StatisticsSlice";
import styles from "./Statistics.module.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = ["2020", "2021", "2022", "2023", "2024", "2025"];

export default function StatisticsDashboard() {
  const dispatch = useDispatch();
  const { selectedMonth, selectedYear } = useSelector(
    (state) => state.statistics
  );

  return (
    <div className={styles.dashboard}>
      <select
        value={selectedMonth}
        onChange={(e) => dispatch(setMonth(e.target.value))}
        className={styles.select}
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => dispatch(setYear(e.target.value))}
        className={styles.select}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
