import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import LoginPage from "./components/Login/LoginPage";

// import LoginPage from "./features/auth/LoginPage";
// import RegistrationPage from "./features/auth/RegistrationPage";
// import DashboardPage from "./pages/DashboardPage";

import Loader from "./components/Loader"; 
import RegistrationPage from "./features/auth/RegistrationPage.jsx";
import DashboardPage from "./pages/DashboardPage";

import { useSelector } from "react-redux";
function App() {
  const isLoading = useSelector((state) => state.global.isLoading);

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
