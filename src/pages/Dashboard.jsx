import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import Balance from "../components/Balance/Balance";
import Currency from "../components/Currency/Currency";
import HomeTab from "../components/Transactions/HomeTab";
import styles from "./Dashboard.module.css";
import { useMedia } from "../hooks/useMedia";


const Dashboard = () => {
  const { isDesktop, isTablet } = useMedia();
  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.dashboardContent}>
        <div className={styles.leftPanel}>
          <Navigation />
          <Balance />
          {(isTablet || isDesktop) && <Currency />}
        </div>

          <div className={styles.rightPanel}>
          <Outlet /> {/* Bu kısım rotaya göre HomeTab ya da Currency gösterecek */}
          
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
