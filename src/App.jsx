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
import HomeTab from "./components/Transactions/HomeTab.jsx"

import { setLoading } from "./redux/globalSlice";
import { setAuthToken, clearAuthToken } from "./services/api";
import { refreshThunk } from "./features/auth/authOperations";

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.global.isLoading);

  useEffect(() => {
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
          localStorage.removeItem('token');
          clearAuthToken();
        });
    }
  }, [dispatch]);

  return (
    <div>
      {/* Yükleniyorsa loader göster */}
      {isLoading && <Loader />}

      <BrowserRouter>
        <Routes>
          {/* Genel erişim için sayfalar */}
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Giriş yapılması gereken sayfalar */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/statistics" element={<StatisticsTab />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
