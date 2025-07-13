
import { useState } from "react";
import StatisticsChart from "./StatisticsChart";
import StatisticsTable from "./StatisticsTable";
import styles from "./StatisticsTab.module.css";

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

const years = [2020, 2021, 2022, 2023, 2024];

const StatisticsTab = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [selectedYear, setSelectedYear] = useState(2023);

  const chartData = {
    labels: [
      "Education",
      "Child care",
      "Leisure",
      "Car",
      "Other expenses",
      "Self care",
      "Household products",
    ],
    datasets: [
      {
        data: [3400, 2208.5, 1230, 1500, 610, 800, 300],
        backgroundColor: [
          "#f9dc5c",
          "#36a2eb",
          "#4bc0c0",
          "#ff6384",
          "#9966ff",
          "#c9cbcf",
          "#2f2fa2",
        ],
      },
    ],
  };

  const dataTable = [
    { name: "Car", amount: 1500, color: "#ff6384" },
    { name: "Self care", amount: 800, color: "#c9cbcf" },
    { name: "Child care", amount: 2208.5, color: "#36a2eb" },
    { name: "Household products", amount: 300, color: "#2f2fa2" },
    { name: "Education", amount: 3400, color: "#f9dc5c" },
    { name: "Leisure", amount: 1230, color: "#4bc0c0" },
    { name: "Other expenses", amount: 610, color: "#9966ff" },
  ];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Statistics</h2>

      <div className={styles.chartSection}>
        <StatisticsChart chartData={chartData} />
        <div className={styles.filters}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <StatisticsTable data={dataTable} expenses={22549.24} income={27350.0} />
    </div>
  );
};

export default StatisticsTab;
