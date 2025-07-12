import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./Statistics.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Chart() {
  const { expenses } = useSelector((state) => state.statistics);

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
    <div className={styles.chart}>
      <Doughnut data={data} />
    </div>
  );
}
