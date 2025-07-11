import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Loader from "./components/Loader/Loader.jsx";
import LoginPage from "../src/components/Login/LoginPage.jsx";
import RegistrationPage from "./features/auth/RegistrationPage.jsx";
import DashboardPage from "../src/pages/Dashboard.jsx";
// import HomeTab from "./components/Transactions/HomeTab.jsx"

import { setLoading } from "./redux/globalSlice"; // doğru dosya yoluna göre ayarla
import { setAuthToken } from "./services/api"; // ✅ token'ı Axios'a tanıtmak için
import { refreshThunk } from "./features/auth/authOperations";

function App() {
  const isLoading = useSelector((state) => state.global.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ Sayfa ilk yüklendiğinde localStorage'dan token'ı al ve Axios'a ekle
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setAuthToken(savedToken);
      dispatch(refreshThunk());
    }
  }, [dispatch]);

  return (
    <div>
      {isLoading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
