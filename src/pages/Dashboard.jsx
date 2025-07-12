import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import Balance from "../components/Balance/Balance";
import Currency from "../components/Currency/Currency";
import HomeTab from "../components/Transactions/HomeTab";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.dashboardContent}>
        <div className={styles.leftPanel}>
          <Navigation />
          <Balance />
          <Currency />
        </div>
        <div className={styles.rightPanel}>
          <HomeTab />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
