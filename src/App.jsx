import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Loader from "./components/Loader/Loader.jsx";
import LoginPage from "./components/Login/LoginPage.jsx";
import RegistrationPage from "./features/auth/RegistrationPage.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import StatisticsTab from "./components/Statistics/StatisticsTab.jsx";
import Currency from "./components/Currency/Currency.jsx";
import HomeTab from "./components/Transactions/HomeTab.jsx";

import { setAuthToken, clearAuthToken } from "./services/api";
import { refreshThunk } from "./features/auth/authOperations";

// localStorage'daki bozuk date verilerini temizle
const cleanupInvalidDates = () => {
  try {
    const persistedState = localStorage.getItem('persist:root');
    if (persistedState) {
      const state = JSON.parse(persistedState);
      
      if (state.transactions) {
        const transactionsState = JSON.parse(state.transactions);
        
        if (transactionsState.transactions && Array.isArray(transactionsState.transactions)) {
          let hasInvalidDates = false;
          
          const cleanedTransactions = transactionsState.transactions.map(transaction => {
            if (transaction.date && typeof transaction.date === 'string') {
              const date = new Date(transaction.date);
              if (isNaN(date.getTime())) {
                hasInvalidDates = true;
                // Geçersiz date'i şu anki tarihle değiştir
                return {
                  ...transaction,
                  date: new Date().toISOString()
                };
              }
            }
            return transaction;
          });
          
          if (hasInvalidDates) {
            const updatedState = {
              ...state,
              transactions: JSON.stringify({
                ...transactionsState,
                transactions: cleanedTransactions
              })
            };
            localStorage.setItem('persist:root', JSON.stringify(updatedState));
          }
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up invalid dates:', error);
  }
};

function App() {
  const isLoading = useSelector((state) => state.global.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    // Uygulama başladığında bozuk date verilerini temizle
    cleanupInvalidDates();
    
    // Sayfa yüklendiğinde token'ı al
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      // Token'ı axios header'a ekle
      setAuthToken(savedToken);
      // Token'ı refresh et ve kullanıcı bilgilerini al
      dispatch(refreshThunk())
        .unwrap()
        .then((data) => {
          // Token geçerli, kullanıcı bilgileri güncellendi
        })
        .catch((error) => {
          // Token geçersiz, temizle
          console.error("Token refresh failed:", error);
          localStorage.removeItem("token");
          clearAuthToken();
        });
    }
  }, [dispatch]);

  return (
    <div className="fullscreen">
      {isLoading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardPage />}>
              <Route index element={<HomeTab />} />
              <Route path="currency" element={<Currency />} />
              <Route path="statistics" element={<StatisticsTab />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
