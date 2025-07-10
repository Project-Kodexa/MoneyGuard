import StatisticsDashboard from "./StatisticsDashboard";
import Chart from "./Chart";
import StatisticsTable from "./StatisticsTable";
import styles from "./Statistics.module.css";

export default function StatisticsTab() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Statistics</h2>
      <StatisticsDashboard />
      <div className={styles.chartTableWrapper}>
        <Chart />
        <StatisticsTable />
      </div>
    </div>
  );
}
