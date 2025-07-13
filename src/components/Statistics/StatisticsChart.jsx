
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./Statistics.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatisticsChart() {
  const { expenses, totalIncome, totalExpenses } = useSelector((state) => state.statistics);

  const balance = ((totalIncome || 0) - (totalExpenses || 0)).toFixed(2);

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

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width, height } = chart;
      const ctx = chart.ctx;
      ctx.restore();

      const fontSize = (height / 120).toFixed(2);
      ctx.font = `bold ${fontSize}em 'Segoe UI', sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";

      const text = `$${balance}`;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#fff"
        }
      },
    },
    cutout: "70%",
  };

  return (
    <div className={styles.chart}>
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
}
