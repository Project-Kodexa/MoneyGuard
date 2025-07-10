import { useSelector } from "react-redux";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Loader from "./components/Loader/Loader.jsx";
import LoginPage from "../src/components/Login/LoginPage.jsx";
import RegistrationPage from "./features/auth/RegistrationPage.jsx";
import DashboardPage from "../src/pages/Dashboard.jsx";
import { useDispatch } from "react-redux";
import { setLoading } from "./redux/globalSlice"; // doğru dosya yoluna göre ayarla


function App() {
  const isLoading = useSelector((state) => state.global.isLoading);
const dispatch = useDispatch();
  return (
    <div>
    <button onClick={() => dispatch(setLoading(true))}>Yüklemeyi Başlat</button>
      <button onClick={() => dispatch(setLoading(false))}>Yüklemeyi Durdur</button>
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
